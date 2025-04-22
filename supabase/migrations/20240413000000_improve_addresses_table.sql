-- Migration: Improve addresses table with better error handling and debugging

-- Add composite index for id + user_id lookups
CREATE INDEX IF NOT EXISTS idx_addresses_id_user_id ON public.addresses(id, user_id);

-- Create a debug trigger function for addresses
CREATE OR REPLACE FUNCTION public.debug_addresses_changes()
RETURNS trigger AS $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Get the current user ID
  auth_user_id := auth.uid();
  
  -- Log the operation details
  RAISE LOG 'Address Operation [%]: ID=%, UserID=%, AuthUserID=%, Data=%',
    TG_OP,
    COALESCE(NEW.id::text, OLD.id::text, 'NULL'),
    COALESCE(NEW.user_id::text, OLD.user_id::text, 'NULL'),
    COALESCE(auth_user_id::text, 'NULL'),
    row_to_json(COALESCE(NEW, OLD));

  -- For DELETE operations
  IF (TG_OP = 'DELETE') THEN
    -- Check if the user is trying to delete someone else's address
    IF auth_user_id IS NULL THEN
      RAISE EXCEPTION 'Authentication required to delete addresses'
        USING HINT = 'Please ensure you are logged in',
              ERRCODE = 'invalid_authorization_specification';
    END IF;
    
    IF OLD.user_id <> auth_user_id THEN
      RAISE EXCEPTION 'Cannot delete address belonging to another user'
        USING HINT = 'You can only delete your own addresses',
              ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS tr_debug_addresses_changes ON public.addresses;
CREATE TRIGGER tr_debug_addresses_changes
  BEFORE INSERT OR UPDATE OR DELETE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.debug_addresses_changes();

-- Add helpful comments
COMMENT ON TABLE public.addresses IS 'Stores delivery addresses for users';
COMMENT ON COLUMN public.addresses.user_id IS 'References auth.users(id). Each address must belong to a user';
COMMENT ON COLUMN public.addresses.is_primary IS 'Only one address per user can be primary';
COMMENT ON TRIGGER tr_debug_addresses_changes ON public.addresses IS 'Logs address operations and enforces additional security checks';

-- Update existing RLS policies with better error messages
DROP POLICY IF EXISTS "Allow individual user delete access" ON public.addresses;
CREATE POLICY "Allow individual user delete access"
  ON public.addresses FOR DELETE
  USING (
    CASE
      WHEN auth.uid() IS NULL 
        THEN false
      WHEN auth.uid() <> user_id 
        THEN false
      ELSE true
    END
  );

-- Add helpful comment to the policy
COMMENT ON POLICY "Allow individual user delete access" ON public.addresses
  IS 'Users can only delete their own addresses. Requires authentication.'; 