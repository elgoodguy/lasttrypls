-- Migration: Create the addresses table

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  is_primary boolean not null default false,

  -- Address Fields
  street_address text not null,
  internal_number text,
  neighborhood text,
  postal_code text not null,
  city text not null,
  country text not null default 'MX',
  delivery_instructions text,

  -- Geo Fields
  latitude double precision,
  longitude double precision,
  google_place_id text,

  -- Timestamps
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Index for faster lookups by user
create index idx_addresses_user_id on public.addresses(user_id);

-- Enable RLS
alter table public.addresses enable row level security;

-- Policies for addresses:
-- 1. Users can view their own addresses
create policy "Allow individual user read access"
  on public.addresses for select
  using (auth.uid() = user_id);

-- 2. Users can insert their own addresses
create policy "Allow individual user insert access"
  on public.addresses for insert
  with check (auth.uid() = user_id);

-- 3. Users can update their own addresses
create policy "Allow individual user update access"
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Users can delete their own addresses
create policy "Allow individual user delete access"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
create trigger on_addresses_updated
  before update on public.addresses
  for each row execute procedure public.handle_updated_at();

-- Function to ensure only one primary address per user
create or replace function public.ensure_single_primary_address()
returns trigger as $$
begin
  -- If the inserted/updated address is being marked as primary
  if new.is_primary = true then
    -- Set all *other* addresses for this user to is_primary = false
    update public.addresses
    set is_primary = false
    where user_id = new.user_id and id <> new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function before insert or update on addresses table
create trigger enforce_single_primary
  before insert or update on public.addresses
  for each row execute procedure public.ensure_single_primary_address(); 