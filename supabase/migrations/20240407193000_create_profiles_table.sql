-- Migration: Create the profiles table
-- This table stores public profile data linked to auth.users

create table public.profiles (
  -- Link to the authenticated user
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text, -- URL to the user's avatar image in Supabase Storage
  preferred_language text default 'en' check (preferred_language in ('en', 'es')),
  preferred_theme text default 'dark' check (preferred_theme in ('dark', 'light')),

  -- Timestamps
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,

  -- Constraints
  primary key (user_id)
);

-- Enable Row Level Security (RLS) for the table
alter table public.profiles enable row level security;

-- Policies for profiles:
-- 1. Users can view their own profile.
create policy "Allow individual user read access"
  on public.profiles for select
  using (auth.uid() = user_id);

-- 2. Users can insert their own profile.
create policy "Allow individual user insert access"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- 3. Users can update their own profile.
create policy "Allow individual user update access"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: Function and Trigger to update updated_at timestamp automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Optional: Function and Trigger to create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert a new profile row, linking it to the new user in auth.users
  -- Use coalesce to provide default values if metadata is missing
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', null),
      coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function after a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 