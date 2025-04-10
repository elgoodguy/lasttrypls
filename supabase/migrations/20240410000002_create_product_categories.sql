-- Migration: Create product categories

-- Insert test product categories
INSERT INTO public.product_categories (id, name, sort_order, is_active)
VALUES 
  ('11111111-2222-3333-4444-555555555555', 'Restaurantes', 1, true),
  ('22222222-3333-4444-5555-666666666666', 'Cafeterías', 2, true),
  ('33333333-4444-5555-6666-777777777777', 'Comida Rápida', 3, true),
  ('44444444-5555-6666-7777-888888888888', 'Postres', 4, true),
  ('55555555-6666-7777-8888-999999999999', 'Bebidas', 5, true); 