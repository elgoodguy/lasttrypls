-- First, clean up existing data
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.groups CASCADE;
TRUNCATE TABLE public.stores CASCADE;
TRUNCATE TABLE public.product_categories CASCADE;
TRUNCATE TABLE public.cashback_rules CASCADE;
TRUNCATE TABLE public.store_categories CASCADE;

-- First, enable the auth schema extensions if not already enabled
create extension if not exists "uuid-ossp";

-- Insert test groups
INSERT INTO public.groups (id, name, logo_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Restaurantes', 'https://picsum.photos/200'),
  ('22222222-2222-2222-2222-222222222222', 'Cafeterías', 'https://picsum.photos/200');

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
VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'La Parrilla Feliz',
    true,
    'Calle Principal 123',
    'Local 4',
    'Centro',
    '28001',
    'Madrid',
    'ES',
    40.4168,
    -3.7038,
    '+34911234567',
    'https://picsum.photos/200',
    'https://picsum.photos/800/400',
    '{"monday":{"open":"12:00","close":"23:00"},"tuesday":{"open":"12:00","close":"23:00"},"wednesday":{"open":"12:00","close":"23:00"},"thursday":{"open":"12:00","close":"23:00"},"friday":{"open":"12:00","close":"00:00"},"saturday":{"open":"12:00","close":"00:00"},"sunday":{"open":"12:00","close":"23:00"}}',
    null,
    5.00,
    20.00,
    30,
    ARRAY['28001', '28002', '28003']
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'El Rincón del Sabor',
    true,
    'Avenida Central 456',
    null,
    'Salamanca',
    '28002',
    'Madrid',
    'ES',
    40.4261,
    -3.6753,
    '+34912345678',
    'https://picsum.photos/200',
    'https://picsum.photos/800/400',
    '{"monday":{"open":"13:00","close":"23:30"},"tuesday":{"open":"13:00","close":"23:30"},"wednesday":{"open":"13:00","close":"23:30"},"thursday":{"open":"13:00","close":"23:30"},"friday":{"open":"13:00","close":"00:30"},"saturday":{"open":"13:00","close":"00:30"},"sunday":{"open":"13:00","close":"23:30"}}',
    null,
    4.50,
    15.00,
    25,
    ARRAY['28001', '28002']
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'Café del Arte',
    true,
    'Plaza Mayor 789',
    'Local 12',
    'Sol',
    '28003',
    'Madrid',
    'ES',
    40.4169,
    -3.7033,
    '+34913456789',
    'https://picsum.photos/200',
    'https://picsum.photos/800/400',
    '{"monday":{"open":"08:00","close":"20:00"},"tuesday":{"open":"08:00","close":"20:00"},"wednesday":{"open":"08:00","close":"20:00"},"thursday":{"open":"08:00","close":"20:00"},"friday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"22:00"},"sunday":{"open":"09:00","close":"20:00"}}',
    null,
    3.00,
    10.00,
    20,
    ARRAY['28003']
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Sweet Corner',
    true,
    'Calle Dulce 321',
    'Local 7',
    'Chamberí',
    '28004',
    'Madrid',
    'ES',
    40.4321,
    -3.7010,
    '+34914567890',
    'https://picsum.photos/200',
    'https://picsum.photos/800/400',
    '{"monday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"09:00","close":"21:00"},"wednesday":{"open":"09:00","close":"21:00"},"thursday":{"open":"09:00","close":"21:00"},"friday":{"open":"09:00","close":"22:00"},"saturday":{"open":"10:00","close":"22:00"},"sunday":{"open":"10:00","close":"21:00"}}',
    null,
    3.50,
    12.00,
    15,
    ARRAY['28004', '28003']
  );

-- Insert test product categories
INSERT INTO public.product_categories (id, name, sort_order, is_active)
VALUES 
  ('11111111-2222-3333-4444-555555555555', 'Restaurantes', 1, true),
  ('22222222-3333-4444-5555-666666666666', 'Cafeterías', 2, true),
  ('33333333-4444-5555-6666-777777777777', 'Comida Rápida', 3, true),
  ('44444444-5555-6666-7777-888888888888', 'Postres', 4, true),
  ('55555555-6666-7777-8888-999999999999', 'Bebidas', 5, true);

-- Insert test cashback rules
INSERT INTO public.cashback_rules (
  id,
  store_id,
  percentage,
  minimum_order_amount,
  maximum_cashback_amount,
  is_active
)
VALUES 
  (uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 5, 20.00, 50.00, true),
  (uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 3, 15.00, 30.00, true),
  (uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 4, 10.00, 20.00, true),
  (uuid_generate_v4(), '66666666-6666-6666-6666-666666666666', 2, 12.00, 25.00, true);

-- Insert test stores with postal codes
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
) VALUES 
(
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'Tienda San Pedro',
  true,
  'Av. Principal 123',
  'Local 5',
  'Valle',
  '66250',
  'San Pedro',
  'MX',
  25.6667,
  -100.4000,
  '+528112345678',
  'https://picsum.photos/200',
  'https://picsum.photos/800/400',
  '{"monday":{"open":"09:00","close":"22:00"},"tuesday":{"open":"09:00","close":"22:00"},"wednesday":{"open":"09:00","close":"22:00"},"thursday":{"open":"09:00","close":"22:00"},"friday":{"open":"09:00","close":"23:00"},"saturday":{"open":"09:00","close":"23:00"},"sunday":{"open":"10:00","close":"21:00"}}',
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
  'Av. Secundaria 456',
  'Local 12',
  'Del Valle',
  '66220',
  'San Pedro',
  'MX',
  25.6500,
  -100.3833,
  '+528123456789',
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
  'Av. Terciaria 789',
  'PB',
  'Obispado',
  '64000',
  'Monterrey',
  'MX',
  25.6747,
  -100.3506,
  '+528134567890',
  'https://picsum.photos/200',
  'https://picsum.photos/800/400',
  '{"monday":{"open":"10:00","close":"21:00"},"tuesday":{"open":"10:00","close":"21:00"},"wednesday":{"open":"10:00","close":"21:00"},"thursday":{"open":"10:00","close":"21:00"},"friday":{"open":"10:00","close":"22:00"},"saturday":{"open":"10:00","close":"22:00"},"sunday":{"open":"11:00","close":"20:00"}}',
  null,
  60.00,
  180.00,
  35,
  ARRAY['64000', '64010']
);

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
  (uuid_generate_v4(), '77777777-7777-7777-7777-777777777777', 6, 200.00, 60.00, true),
  (uuid_generate_v4(), '88888888-8888-8888-8888-888888888888', 5, 150.00, 45.00, true),
  (uuid_generate_v4(), '99999999-9999-9999-9999-999999999999', 4, 180.00, 50.00, true);

-- Insert store-category relationships
INSERT INTO public.store_categories (store_id, category_id)
VALUES
  -- Tienda San Pedro (Restaurantes, Comida Rápida)
  ('77777777-7777-7777-7777-777777777777', '11111111-2222-3333-4444-555555555555'),
  ('77777777-7777-7777-7777-777777777777', '33333333-4444-5555-6666-777777777777'),
  
  -- Tienda Valle (Cafeterías, Postres)
  ('88888888-8888-8888-8888-888888888888', '22222222-3333-4444-5555-666666666666'),
  ('88888888-8888-8888-8888-888888888888', '44444444-5555-6666-7777-888888888888'),
  
  -- Tienda Obispado (Restaurantes, Bebidas)
  ('99999999-9999-9999-9999-999999999999', '11111111-2222-3333-4444-555555555555'),
  ('99999999-9999-9999-9999-999999999999', '55555555-6666-7777-8888-999999999999');

-- Insert products
INSERT INTO products (name, description, base_price, compare_at_price, image_urls, product_type) VALUES
('Coca-Cola', 'Refresco de cola 500ml', 25.00, 30.00, ARRAY['https://picsum.photos/200'], 'physical'),
('Hamburguesa Clásica', 'Hamburguesa con carne, lechuga, tomate y mayonesa', 75.00, 85.00, ARRAY['https://picsum.photos/200'], 'prepared'),
('Papas Fritas', 'Porción de papas fritas crujientes', 35.00, 40.00, ARRAY['https://picsum.photos/200'], 'prepared'),
('Helado de Vainilla', 'Helado suave de vainilla', 45.00, 50.00, ARRAY['https://picsum.photos/200'], 'prepared'),
('Nuggets de Pollo', '6 piezas de nuggets de pollo', 55.00, 60.00, ARRAY['https://picsum.photos/200'], 'prepared');

-- Insert store_products for all stores
INSERT INTO store_products (product_id, store_id, is_available_in_store)
SELECT p.id, s.id, true
FROM products p
CROSS JOIN stores s
WHERE s.is_active = true;

-- Insert modifier groups for Hamburguesa Clásica
INSERT INTO product_modifier_groups (product_id, name, selection_type, is_required, sort_order)
SELECT id, 'Tamaño', 'single', true, 1
FROM products
WHERE name = 'Hamburguesa Clásica';

INSERT INTO product_modifier_groups (product_id, name, selection_type, is_required, sort_order)
SELECT id, 'Extras', 'multiple', false, 2
FROM products
WHERE name = 'Hamburguesa Clásica';

-- Insert modifier options for Hamburguesa Clásica
INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Individual', 0, 1
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Hamburguesa Clásica' AND g.name = 'Tamaño';

INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Doble', 30.00, 2
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Hamburguesa Clásica' AND g.name = 'Tamaño';

INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Queso Extra', 10.00, 1
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Hamburguesa Clásica' AND g.name = 'Extras';

INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Tocino', 15.00, 2
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Hamburguesa Clásica' AND g.name = 'Extras';

-- Insert modifier groups for Papas Fritas
INSERT INTO product_modifier_groups (product_id, name, selection_type, is_required, sort_order)
SELECT id, 'Tamaño', 'single', true, 1
FROM products
WHERE name = 'Papas Fritas';

-- Insert modifier options for Papas Fritas
INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Chica', 0, 1
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Papas Fritas' AND g.name = 'Tamaño';

INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Mediana', 10.00, 2
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Papas Fritas' AND g.name = 'Tamaño';

INSERT INTO product_modifiers (group_id, name, additional_price, sort_order)
SELECT g.id, 'Grande', 20.00, 3
FROM product_modifier_groups g
JOIN products p ON g.product_id = p.id
WHERE p.name = 'Papas Fritas' AND g.name = 'Tamaño'; 