-- Migration: Update RLS policies to allow anonymous access to public data

-- 1. Update store_categories policy
DROP POLICY IF EXISTS "Allow authenticated users to view store categories" ON public.store_categories;
DROP POLICY IF EXISTS "Allow public read access to store categories" ON public.store_categories;
CREATE POLICY "Allow public read access to store categories"
    ON public.store_categories
    FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 2. Update stores policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow authenticated users to view active stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public read access to active stores" ON public.stores;
CREATE POLICY "Allow public read access to active stores"
    ON public.stores FOR SELECT
    USING (
        ((auth.role() = 'authenticated' OR auth.role() = 'anon') AND is_active = true) OR
        public.is_staff()
    );

-- 3. Update products policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow authenticated users to view active products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to active products" ON public.products;
CREATE POLICY "Allow public read access to active products"
    ON public.products FOR SELECT
    USING (
        ((auth.role() = 'authenticated' OR auth.role() = 'anon') AND is_active = true) OR
        public.is_staff()
    );

-- 4. Update store_products policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to store products" ON public.store_products;
CREATE POLICY "Allow public read access to store products"
    ON public.store_products FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 5. Update product_categories_map policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to product categories map" ON public.product_categories_map;
CREATE POLICY "Allow public read access to product categories map"
    ON public.product_categories_map FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 6. Update product_modifier_groups policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to modifier groups" ON public.product_modifier_groups;
CREATE POLICY "Allow public read access to modifier groups"
    ON public.product_modifier_groups FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 7. Update product_modifiers policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to modifiers" ON public.product_modifiers;
CREATE POLICY "Allow public read access to modifiers"
    ON public.product_modifiers FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 8. Update cashback_rules policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to active cashback rules" ON public.cashback_rules;
CREATE POLICY "Allow public read access to active cashback rules"
    ON public.cashback_rules FOR SELECT
    USING ((auth.role() = 'authenticated' OR auth.role() = 'anon') AND is_active = true);

-- 9. Update product_categories policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.product_categories;
CREATE POLICY "Allow public read access to categories"
    ON public.product_categories FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 10. Update groups policy (ensure it allows anon access)
DROP POLICY IF EXISTS "Allow public read access to groups" ON public.groups;
CREATE POLICY "Allow public read access to groups"
    ON public.groups FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Add comments to explain the changes
COMMENT ON POLICY "Allow public read access to store categories" ON public.store_categories IS 'Allows both authenticated and anonymous users to view store categories';
COMMENT ON POLICY "Allow public read access to active stores" ON public.stores IS 'Allows both authenticated and anonymous users to view active stores';
COMMENT ON POLICY "Allow public read access to active products" ON public.products IS 'Allows both authenticated and anonymous users to view active products';
COMMENT ON POLICY "Allow public read access to store products" ON public.store_products IS 'Allows both authenticated and anonymous users to view store products';
COMMENT ON POLICY "Allow public read access to product categories map" ON public.product_categories_map IS 'Allows both authenticated and anonymous users to view product categories map';
COMMENT ON POLICY "Allow public read access to modifier groups" ON public.product_modifier_groups IS 'Allows both authenticated and anonymous users to view modifier groups';
COMMENT ON POLICY "Allow public read access to modifiers" ON public.product_modifiers IS 'Allows both authenticated and anonymous users to view modifiers';
COMMENT ON POLICY "Allow public read access to active cashback rules" ON public.cashback_rules IS 'Allows both authenticated and anonymous users to view active cashback rules';
COMMENT ON POLICY "Allow public read access to categories" ON public.product_categories IS 'Allows both authenticated and anonymous users to view categories';
COMMENT ON POLICY "Allow public read access to groups" ON public.groups IS 'Allows both authenticated and anonymous users to view groups'; 