-- Migration: Fix address deletion by removing debug trigger and ensuring correct RLS policy
-- Description: This migration removes the debug trigger that might be interfering with
-- address deletion and ensures the RLS policy is correctly set up.

-- Step 1: Remove the debug trigger and its function
DROP TRIGGER IF EXISTS tr_debug_addresses_changes ON public.addresses;
DROP TRIGGER IF EXISTS debug_addresses_changes ON public.addresses;
DROP FUNCTION IF EXISTS public.debug_addresses_changes();

-- Step 2: Remove any existing DELETE policies to start clean
DROP POLICY IF EXISTS "Allow individual user delete access" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow users to delete addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow admins to manage addresses" ON public.addresses;

-- Step 3: Remove the composite index that might not be needed
DROP INDEX IF EXISTS idx_addresses_id_user_id;

-- Step 4: Ensure RLS is enabled (should already be, but let's be explicit)
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Step 5: Create the simple and correct DELETE policy
CREATE POLICY "Allow individual user delete access"
  ON public.addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add helpful comment explaining the policy
COMMENT ON POLICY "Allow individual user delete access" ON public.addresses
  IS 'Allows users to delete only their own addresses. No additional checks or triggers needed.';

-- Log that the migration was applied
DO $$
BEGIN
  RAISE NOTICE 'Migration applied: Simplified address deletion policy and removed debug trigger';
END $$; 