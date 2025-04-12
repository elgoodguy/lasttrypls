-- Migration: Create store-related tables

-- 1. Groups Table
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.groups enable row level security;

-- Policy: Allow all authenticated users to view groups
DROP POLICY IF EXISTS "Allow authenticated users to view groups" ON public.groups;
CREATE POLICY "Allow public read access to groups"
  on public.groups for select
  using (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 2. Stores Table
create table public.stores (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete set null,
  name text not null,
  is_active boolean default true not null,
  
  -- Address fields
  address_street text not null,
  address_internal text,
  address_neighborhood text,
  address_postal_code text not null,
  address_city text not null,
  address_country text not null default 'MX',
  latitude double precision not null,
  longitude double precision not null,
  
  -- Contact and media
  contact_phone text,
  logo_url text,
  banner_url text,
  
  -- Operating details
  operating_hours jsonb not null default '{}'::jsonb,
  special_hours jsonb,
  delivery_fee numeric not null default 0,
  minimum_order_amount numeric,
  estimated_delivery_time_minutes integer,
  accepted_postal_codes text[],
  
  -- Timestamps
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.stores enable row level security;

-- Policy: Allow all authenticated users to view active stores
DROP POLICY IF EXISTS "Allow authenticated users to view active stores" ON public.stores;
CREATE POLICY "Allow public read access to active stores"
  on public.stores for select
  using ((auth.role() = 'authenticated' OR auth.role() = 'anon') AND is_active = true);

-- 3. Product Categories Table
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.product_categories enable row level security;

-- Policy: Allow all authenticated users to view categories
DROP POLICY IF EXISTS "Allow authenticated users to view categories" ON public.product_categories;
CREATE POLICY "Allow public read access to categories"
  on public.product_categories for select
  using (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 4. Cashback Rules Table
create table public.cashback_rules (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade,
  store_id uuid references public.stores(id) on delete cascade,
  percentage numeric not null check (percentage >= 0 and percentage <= 100),
  minimum_order_amount numeric,
  maximum_cashback_amount numeric,
  start_date timestamptz not null default timezone('utc'::text, now()),
  end_date timestamptz,
  is_active boolean default true not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  
  -- Ensure either group_id or store_id is set, but not both
  constraint cashback_rules_target_check check (
    (group_id is not null and store_id is null) or
    (group_id is null and store_id is not null)
  )
);

-- Enable RLS
alter table public.cashback_rules enable row level security;

-- Policy: Allow all authenticated users to view active cashback rules
DROP POLICY IF EXISTS "Allow authenticated users to view active cashback rules" ON public.cashback_rules;
CREATE POLICY "Allow public read access to active cashback rules"
  on public.cashback_rules for select
  using ((auth.role() = 'authenticated' OR auth.role() = 'anon') AND is_active = true);

-- Add triggers for updated_at
create trigger on_groups_updated
  before update on public.groups
  for each row execute procedure public.handle_updated_at();

create trigger on_stores_updated
  before update on public.stores
  for each row execute procedure public.handle_updated_at();

create trigger on_product_categories_updated
  before update on public.product_categories
  for each row execute procedure public.handle_updated_at();

create trigger on_cashback_rules_updated
  before update on public.cashback_rules
  for each row execute procedure public.handle_updated_at();

-- Create indexes for better performance
create index idx_stores_group_id on public.stores(group_id);
create index idx_stores_is_active on public.stores(is_active);
create index idx_product_categories_sort_order on public.product_categories(sort_order);
create index idx_cashback_rules_group_id on public.cashback_rules(group_id);
create index idx_cashback_rules_store_id on public.cashback_rules(store_id);
create index idx_cashback_rules_is_active on public.cashback_rules(is_active); 