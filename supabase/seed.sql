-- Truncate existing data (excluding auth schema)
TRUNCATE TABLE 
  public.store_products,
  public.product_modifiers,
  public.product_modifier_groups,
  public.product_categories_map,
  public.products,
  public.store_categories,
  public.cashback_rules,
  public.product_categories,
  public.stores,
  public.groups
CASCADE;

-- Enable auth schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert test groups
INSERT INTO public.groups (id, name, logo_url)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Grupo Monterrey',
  'https://picsum.photos/200'
);

-- Insert test stores
INSERT INTO public.stores (
  id,
  group_id,
  name,
  is_active,
  address_street,
  address_internal,
  address_neighborhood,
  address_postal_code,
  address_city,
  address_country,
  latitude,
  longitude,
  contact_phone,
  logo_url,
  banner_url,
  operating_hours,
  special_hours,
  delivery_fee,
  minimum_order_amount,
  estimated_delivery_time_minutes,
  accepted_postal_codes
)
VALUES (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'Tienda San Pedro',
  true,
  'Av. Vasconcelos 1000',
  'Local 4',
  'Valle',
  '66250',
  'San Pedro Garza García',
  'MX',
  25.6514,
  -100.4062,
  '+528181234567',
  'https://picsum.photos/200',
  'https://picsum.photos/800/400',
  '{"monday":{"open":"08:00","close":"22:00"},"tuesday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"},"thursday":{"open":"08:00","close":"22:00"},"friday":{"open":"08:00","close":"23:00"},"saturday":{"open":"09:00","close":"23:00"},"sunday":{"open":"10:00","close":"21:00"}}',
  null,
  50.00,
  200.00,
  30,
  ARRAY['66250', '66220', '66230']
),
(
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  'Tienda Valle',
  true,
  'Av. Gómez Morín 900',
  'Local 12',
  'Del Valle',
  '66220',
  'San Pedro Garza García',
  'MX',
  25.6500,
  -100.3833,
  '+528181234568',
  'https://picsum.photos/200',
  'https://picsum.photos/800/400',
  '{"monday":{"open":"08:00","close":"21:00"},"tuesday":{"open":"08:00","close":"21:00"},"wednesday":{"open":"08:00","close":"21:00"},"thursday":{"open":"08:00","close":"21:00"},"friday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"22:00"},"sunday":{"open":"10:00","close":"20:00"}}',
  null,
  45.00,
  150.00,
  25,
  ARRAY['66220', '66250']
),
(
  '99999999-9999-9999-9999-999999999999',
  '11111111-1111-1111-1111-111111111111',
  'Tienda Obispado',
  true,
  'Av. Constitución 1500',
  'PB',
  'Obispado',
  '64000',
  'Monterrey',
  'MX',
  25.6747,
  -100.3506,
  '+528181234569',
  'https://picsum.photos/200',
  'https://picsum.photos/800/400',
  '{"monday":{"open":"10:00","close":"21:00"},"tuesday":{"open":"10:00","close":"21:00"},"wednesday":{"open":"10:00","close":"21:00"},"thursday":{"open":"10:00","close":"21:00"},"friday":{"open":"10:00","close":"22:00"},"saturday":{"open":"10:00","close":"22:00"},"sunday":{"open":"11:00","close":"20:00"}}',
  null,
  60.00,
  180.00,
  35,
  ARRAY['64000', '64010']
);

-- Insert test product categories
INSERT INTO public.product_categories (id, name, sort_order, is_active)
VALUES 
  ('11111111-2222-3333-4444-555555555555', 'Restaurantes', 1, true),
  ('22222222-3333-4444-5555-666666666666', 'Cafeterías', 2, true),
  ('33333333-4444-5555-6666-777777777777', 'Comida Rápida', 3, true),
  ('44444444-5555-6666-7777-888888888888', 'Postres', 4, true),
  ('55555555-6666-7777-8888-999999999999', 'Bebidas', 5, true);

-- Insert cashback rules for new stores
INSERT INTO public.cashback_rules (
  id,
  store_id,
  percentage,
  minimum_order_amount,
  maximum_cashback_amount,
  is_active
)
VALUES
  (
    uuid_generate_v4(),
    '77777777-7777-7777-7777-777777777777',
    5.0,
    200.00,
    50.00,
    true
  ),
  (
    uuid_generate_v4(),
    '88888888-8888-8888-8888-888888888888',
    3.0,
    150.00,
    30.00,
    true
  ),
  (
    uuid_generate_v4(),
    '99999999-9999-9999-9999-999999999999',
    4.0,
    180.00,
    40.00,
    true
  );

-- Map stores to categories
INSERT INTO public.store_categories (store_id, category_id)
VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-2222-3333-4444-555555555555'),
  ('88888888-8888-8888-8888-888888888888', '22222222-3333-4444-5555-666666666666'),
  ('99999999-9999-9999-9999-999999999999', '33333333-4444-5555-6666-777777777777');

-- Insert sample products
INSERT INTO public.products (
  id,
  name,
  description,
  image_urls,
  base_price,
  is_active,
  product_type
)
VALUES
  (
    '11111111-aaaa-bbbb-cccc-dddddddddddd',
    'Hamburguesa Clásica',
    'Deliciosa hamburguesa con carne de res, lechuga, tomate y queso',
    ARRAY['https://picsum.photos/200'],
    120.00,
    true,
    'prepared'
  ),
  (
    '22222222-aaaa-bbbb-cccc-dddddddddddd',
    'Papas Fritas',
    'Crujientes papas fritas con sal',
    ARRAY['https://picsum.photos/200'],
    45.00,
    true,
    'prepared'
  ),
  (
    '33333333-aaaa-bbbb-cccc-dddddddddddd',
    'Refresco',
    'Refresco de cola',
    ARRAY['https://picsum.photos/200'],
    25.00,
    true,
    'physical'
  );

-- Map products to categories
INSERT INTO public.product_categories_map (product_id, category_id)
VALUES
  ('11111111-aaaa-bbbb-cccc-dddddddddddd', '33333333-4444-5555-6666-777777777777'),
  ('22222222-aaaa-bbbb-cccc-dddddddddddd', '33333333-4444-5555-6666-777777777777'),
  ('33333333-aaaa-bbbb-cccc-dddddddddddd', '55555555-6666-7777-8888-999999999999');

-- Map products to stores with prices
INSERT INTO public.store_products (
  store_id,
  product_id,
  price_override,
  is_available_in_store
)
VALUES
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-aaaa-bbbb-cccc-dddddddddddd',
    120.00,
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '22222222-aaaa-bbbb-cccc-dddddddddddd',
    45.00,
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '33333333-aaaa-bbbb-cccc-dddddddddddd',
    25.00,
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '11111111-aaaa-bbbb-cccc-dddddddddddd',
    125.00,
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '22222222-aaaa-bbbb-cccc-dddddddddddd',
    48.00,
    true
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-aaaa-bbbb-cccc-dddddddddddd',
    115.00,
    true
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '33333333-aaaa-bbbb-cccc-dddddddddddd',
    23.00,
    true
  );

-- Insert modifier groups
INSERT INTO public.product_modifier_groups (
  id,
  product_id,
  name,
  selection_type,
  min_selection,
  max_selection,
  is_required,
  sort_order
)
VALUES
  (
    uuid_generate_v4(),
    '11111111-aaaa-bbbb-cccc-dddddddddddd',
    'Extras',
    'multiple',
    0,
    3,
    false,
    1
  ),
  (
    uuid_generate_v4(),
    '22222222-aaaa-bbbb-cccc-dddddddddddd',
    'Tamaño',
    'single',
    1,
    1,
    true,
    1
  );

-- Insert modifier options
INSERT INTO public.product_modifiers (
  id,
  group_id,
  name,
  additional_price,
  sort_order,
  is_active
)
SELECT
  uuid_generate_v4(),
  g.id,
  'Queso Extra',
  15.00,
  1,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '11111111-aaaa-bbbb-cccc-dddddddddddd'
UNION ALL
SELECT
  uuid_generate_v4(),
  g.id,
  'Tocino',
  20.00,
  2,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '11111111-aaaa-bbbb-cccc-dddddddddddd'
UNION ALL
SELECT
  uuid_generate_v4(),
  g.id,
  'Jalapeños',
  10.00,
  3,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '11111111-aaaa-bbbb-cccc-dddddddddddd'
UNION ALL
SELECT
  uuid_generate_v4(),
  g.id,
  'Chico',
  0.00,
  1,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '22222222-aaaa-bbbb-cccc-dddddddddddd'
UNION ALL
SELECT
  uuid_generate_v4(),
  g.id,
  'Mediano',
  15.00,
  2,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '22222222-aaaa-bbbb-cccc-dddddddddddd'
UNION ALL
SELECT
  uuid_generate_v4(),
  g.id,
  'Grande',
  25.00,
  3,
  true
FROM public.product_modifier_groups g
WHERE g.product_id = '22222222-aaaa-bbbb-cccc-dddddddddddd';

REFRESH MATERIALIZED VIEW public.store_products_view;