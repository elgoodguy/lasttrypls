-- First, clean up existing data
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.groups CASCADE;
TRUNCATE TABLE public.stores CASCADE;
TRUNCATE TABLE public.product_categories CASCADE;
TRUNCATE TABLE public.cashback_rules CASCADE;

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
  ('77777777-7777-7777-7777-777777777777', 'Carnes', 1, true),
  ('88888888-8888-8888-8888-888888888888', 'Postres', 2, true),
  ('99999999-9999-9999-9999-999999999999', 'Bebidas', 3, true);

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