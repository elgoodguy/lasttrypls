-- Migration: Create product-related tables

-- 1. Products Table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric not null check (base_price >= 0),
  compare_at_price numeric check (compare_at_price >= base_price),
  image_urls text[],
  is_active boolean default true not null,
  product_type text not null default 'physical' check (product_type in ('physical', 'prepared')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policy: Allow all authenticated users to view active products
create policy "Allow authenticated users to view active products"
  on public.products for select
  using (auth.role() = 'authenticated' and is_active = true);

-- 2. Store Products Table (Many-to-Many relationship)
create table public.store_products (
  product_id uuid not null references public.products(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  is_available_in_store boolean default true not null,
  price_override numeric check (price_override >= 0),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  primary key (product_id, store_id)
);

-- Enable RLS
alter table public.store_products enable row level security;

-- Policy: Allow authenticated users to view available products in stores
create policy "Allow authenticated users to view store products"
  on public.store_products for select
  using (auth.role() = 'authenticated');

-- 3. Product Categories Map (Many-to-Many relationship)
create table public.product_categories_map (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.product_categories(id) on delete cascade,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  primary key (product_id, category_id)
);

-- Enable RLS
alter table public.product_categories_map enable row level security;

-- Policy: Allow authenticated users to view product categories
create policy "Allow authenticated users to view product categories map"
  on public.product_categories_map for select
  using (auth.role() = 'authenticated');

-- 4. Product Modifier Groups
create table public.product_modifier_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  selection_type text not null default 'single' check (selection_type in ('single', 'multiple')),
  is_required boolean default false not null,
  sort_order integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_modifier_groups enable row level security;

-- Policy: Allow authenticated users to view modifier groups
create policy "Allow authenticated users to view modifier groups"
  on public.product_modifier_groups for select
  using (auth.role() = 'authenticated');

-- 5. Product Modifiers
create table public.product_modifiers (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.product_modifier_groups(id) on delete cascade,
  name text not null,
  additional_price numeric not null default 0 check (additional_price >= 0),
  sort_order integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_modifiers enable row level security;

-- Policy: Allow authenticated users to view modifiers
create policy "Allow authenticated users to view modifiers"
  on public.product_modifiers for select
  using (auth.role() = 'authenticated');

-- Add triggers for updated_at timestamps
create trigger on_products_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger on_product_modifier_groups_updated
  before update on public.product_modifier_groups
  for each row execute procedure public.handle_updated_at();

create trigger on_product_modifiers_updated
  before update on public.product_modifiers
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index idx_products_is_active on public.products(is_active);
create index idx_store_products_store_id on public.store_products(store_id);
create index idx_store_products_product_id on public.store_products(product_id);
create index idx_product_categories_map_category_id on public.product_categories_map(category_id);
create index idx_product_categories_map_product_id on public.product_categories_map(product_id);
create index idx_product_modifier_groups_product_id on public.product_modifier_groups(product_id);
create index idx_product_modifier_groups_sort_order on public.product_modifier_groups(sort_order);
create index idx_product_modifiers_group_id on public.product_modifiers(group_id);
create index idx_product_modifiers_sort_order on public.product_modifiers(sort_order); 