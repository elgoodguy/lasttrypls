-- Seed data for products and related tables

-- 1. Insert sample product categories (if not exists)
INSERT INTO public.product_categories (name, sort_order, is_active)
VALUES
  ('Bebidas', 1, true),
  ('Hamburguesas', 2, true),
  ('Pizzas', 3, true),
  ('Postres', 4, true),
  ('Complementos', 5, true)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert sample products
INSERT INTO public.products (name, description, base_price, compare_at_price, image_urls, product_type)
VALUES
  (
    'Hamburguesa Clásica',
    'Deliciosa hamburguesa con carne de res, lechuga, tomate y queso',
    89.90,
    99.90,
    ARRAY['https://example.com/burger1.jpg'],
    'prepared'
  ),
  (
    'Pizza Margherita',
    'Pizza tradicional italiana con salsa de tomate, mozzarella y albahaca',
    149.90,
    169.90,
    ARRAY['https://example.com/pizza1.jpg'],
    'prepared'
  ),
  (
    'Refresco Cola',
    'Refresco de cola en lata 355ml',
    25.00,
    NULL,
    ARRAY['https://example.com/cola.jpg'],
    'physical'
  ),
  (
    'Papas Fritas',
    'Crujientes papas fritas con sal',
    45.00,
    55.00,
    ARRAY['https://example.com/fries.jpg'],
    'prepared'
  ),
  (
    'Helado de Vainilla',
    'Cremoso helado de vainilla',
    35.00,
    NULL,
    ARRAY['https://example.com/icecream.jpg'],
    'prepared'
  );

-- 3. Create modifier groups for hamburguesa
WITH burger AS (
  SELECT id FROM public.products WHERE name = 'Hamburguesa Clásica' LIMIT 1
)
INSERT INTO public.product_modifier_groups (product_id, name, selection_type, is_required, sort_order)
SELECT 
  burger.id,
  'Tamaño',
  'single',
  true,
  1
FROM burger
UNION ALL
SELECT 
  burger.id,
  'Extras',
  'multiple',
  false,
  2
FROM burger;

-- 4. Add modifiers for hamburguesa
WITH size_group AS (
  SELECT id FROM public.product_modifier_groups WHERE name = 'Tamaño' LIMIT 1
),
extras_group AS (
  SELECT id FROM public.product_modifier_groups WHERE name = 'Extras' LIMIT 1
)
INSERT INTO public.product_modifiers (group_id, name, additional_price, sort_order)
SELECT 
  size_group.id,
  'Regular',
  0,
  1
FROM size_group
UNION ALL
SELECT 
  size_group.id,
  'Grande',
  20,
  2
FROM size_group
UNION ALL
SELECT 
  extras_group.id,
  'Queso Extra',
  15,
  1
FROM extras_group
UNION ALL
SELECT 
  extras_group.id,
  'Tocino',
  25,
  2
FROM extras_group
UNION ALL
SELECT 
  extras_group.id,
  'Guacamole',
  20,
  3
FROM extras_group;

-- 5. Map products to categories
WITH categories AS (
  SELECT id, name FROM public.product_categories
),
products AS (
  SELECT id, name FROM public.products
)
INSERT INTO public.product_categories_map (product_id, category_id)
SELECT 
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE 
  (p.name = 'Hamburguesa Clásica' AND c.name = 'Hamburguesas') OR
  (p.name = 'Pizza Margherita' AND c.name = 'Pizzas') OR
  (p.name = 'Refresco Cola' AND c.name = 'Bebidas') OR
  (p.name = 'Papas Fritas' AND c.name = 'Complementos') OR
  (p.name = 'Helado de Vainilla' AND c.name = 'Postres');

-- 6. Make products available in stores (assuming we have at least one store)
WITH store AS (
  SELECT id FROM public.stores LIMIT 1
),
products AS (
  SELECT id FROM public.products
)
INSERT INTO public.store_products (store_id, product_id, is_available_in_store)
SELECT 
  store.id,
  products.id,
  true
FROM store
CROSS JOIN products; 