-- Migration: Add is_active column to product_categories table

-- Add is_active column with default value true
alter table public.product_categories
add column is_active boolean default true not null;

-- Create index for better performance
create index idx_product_categories_is_active on public.product_categories(is_active); 