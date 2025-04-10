-- Add selection limits to product_modifier_groups
alter table public.product_modifier_groups
add column min_selection integer not null default 0 check (min_selection >= 0),
add column max_selection integer check (max_selection >= min_selection);

-- Update existing rows to have sensible defaults based on selection_type
update public.product_modifier_groups
set min_selection = case when is_required then 1 else 0 end,
    max_selection = case when selection_type = 'single' then 1 else null end;

-- Add is_active column to product_modifiers
alter table public.product_modifiers
add column is_active boolean not null default true; 