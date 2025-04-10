-- Migration: Add role system and update RLS policies

-- 1. Create user_role enum
CREATE TYPE public.user_role AS ENUM (
    'customer',
    'admin'
);

-- 2. Add role to auth.users metadata
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'customer';

-- 3. Create staff assignments table
CREATE TABLE public.staff_assignments (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

-- 4. Create role checking functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.staff_assignments 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.staff_assignments 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update store policies
DROP POLICY IF EXISTS "Allow authenticated users to view active stores" ON public.stores;

CREATE POLICY "Allow authenticated users to view active stores"
    ON public.stores FOR SELECT
    USING (
        (auth.role() = 'authenticated' AND is_active = true) OR
        public.is_staff()
    );

CREATE POLICY "Allow admins to manage stores"
    ON public.stores FOR ALL
    USING (public.is_admin());

-- 6. Update product policies
DROP POLICY IF EXISTS "Allow authenticated users to view active products" ON public.products;

CREATE POLICY "Allow authenticated users to view active products"
    ON public.products FOR SELECT
    USING (
        (auth.role() = 'authenticated' AND is_active = true) OR
        public.is_staff()
    );

CREATE POLICY "Allow admins to manage products"
    ON public.products FOR ALL
    USING (public.is_admin());

-- 7. Update order policies
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow staff to update orders" ON public.orders;

CREATE POLICY "Allow users to view their own orders"
    ON public.orders FOR SELECT
    USING (user_id = auth.uid() OR public.is_staff());

CREATE POLICY "Allow users to create orders"
    ON public.orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow staff to update orders"
    ON public.orders FOR UPDATE
    USING (public.is_staff());

-- 8. Add trigger for updated_at on staff_assignments
CREATE TRIGGER on_staff_assignments_updated
    BEFORE UPDATE ON public.staff_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 9. Create index for faster role lookups
CREATE INDEX idx_staff_assignments_user_id ON public.staff_assignments(user_id);

-- 10. Add comment to explain the role system
COMMENT ON TYPE public.user_role IS 'Defines the possible roles for users in the system';
COMMENT ON TABLE public.staff_assignments IS 'Stores staff role assignments for users';
COMMENT ON FUNCTION public.is_admin() IS 'Returns true if the current user has admin role';
COMMENT ON FUNCTION public.is_staff() IS 'Returns true if the current user has any staff role'; 