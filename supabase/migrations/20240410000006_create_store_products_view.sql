-- Create a materialized view for store products
create materialized view public.store_products_view as
select 
  sp.store_id,
  p.id as product_id,
  p.name,
  p.description,
  p.base_price,
  p.compare_at_price,
  p.image_urls,
  p.is_active,
  p.product_type,
  sp.is_available_in_store,
  p.created_at,
  p.updated_at
from public.store_products sp
join public.products p on p.id = sp.product_id
where p.is_active = true;

-- Create an index on the materialized view
create index idx_store_products_view_store_id on public.store_products_view(store_id);
create index idx_store_products_view_name on public.store_products_view(name);

-- Create a function to refresh the materialized view
create or replace function refresh_store_products_view()
returns trigger as $$
begin
  refresh materialized view public.store_products_view;
  return null;
end;
$$ language plpgsql;

-- Create triggers to refresh the view when products or store_products change
create trigger refresh_store_products_view_on_products
after insert or update or delete on public.products
for each statement execute function refresh_store_products_view();

create trigger refresh_store_products_view_on_store_products
after insert or update or delete on public.store_products
for each statement execute function refresh_store_products_view();

-- Grant access to authenticated and anonymous users
grant select on public.store_products_view to authenticated, anon; 