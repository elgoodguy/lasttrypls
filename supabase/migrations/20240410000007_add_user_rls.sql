-- Migration: Add RLS policies for auth.users table

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own data
CREATE POLICY "Allow users to view their own data"
    ON auth.users FOR SELECT
    USING (auth.uid() = id);

-- Policy: Allow users to update their own data
CREATE POLICY "Allow users to update their own data"
    ON auth.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Add comment
COMMENT ON TABLE auth.users IS 'Stores user authentication data with RLS policies'; 