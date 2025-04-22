-- Migration: Fix address deletion by ensuring clean state and proper RLS policy
-- Description: This migration ensures a clean state for address deletion by removing all triggers
-- and policies, then creating a simple and correct RLS policy.

-- Step 1: Remove ALL triggers related to addresses
DROP TRIGGER IF EXISTS tr_debug_addresses_changes ON public.addresses;
DROP TRIGGER IF EXISTS debug_addresses_changes ON public.addresses;
DROP TRIGGER IF EXISTS on_addresses_updated ON public.addresses;
DROP TRIGGER IF EXISTS enforce_single_primary ON public.addresses;

-- Step 2: Remove ALL functions that might interfere with address operations
DROP FUNCTION IF EXISTS public.debug_addresses_changes();
DROP FUNCTION IF EXISTS public.ensure_single_primary_address();

-- Step 3: Remove ALL existing policies on addresses table
DROP POLICY IF EXISTS "Allow individual user delete access" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow users to delete addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow admins to manage addresses" ON public.addresses;
DROP POLICY IF EXISTS "Allow individual user read access" ON public.addresses;
DROP POLICY IF EXISTS "Allow individual user insert access" ON public.addresses;
DROP POLICY IF EXISTS "Allow individual user update access" ON public.addresses;

-- Step 4: Ensure RLS is enabled
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Step 5: Create the correct policies in the right order
-- 1. Read policy
CREATE POLICY "Allow individual user read access"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Insert policy
CREATE POLICY "Allow individual user insert access"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Update policy
CREATE POLICY "Allow individual user update access"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Delete policy (the most important one for this fix)
CREATE POLICY "Allow individual user delete access"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Step 6: Recreate the trigger for single primary address
CREATE OR REPLACE FUNCTION public.ensure_single_primary_address()
RETURNS trigger AS $$
BEGIN
  -- If the inserted/updated address is being marked as primary
  IF NEW.is_primary = true THEN
    -- Set all *other* addresses for this user to is_primary = false
    UPDATE public.addresses
    SET is_primary = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER enforce_single_primary
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_primary_address();

-- Add helpful comments
COMMENT ON POLICY "Allow individual user delete access" ON public.addresses
  IS 'Allows users to delete only their own addresses. Simple and direct policy.';
COMMENT ON FUNCTION public.ensure_single_primary_address()
  IS 'Ensures only one address per user can be marked as primary.';

-- Log that the migration was applied
DO $$
BEGIN
  RAISE NOTICE 'Migration applied: Fixed address deletion by ensuring clean state and proper RLS policy';
END $$; 