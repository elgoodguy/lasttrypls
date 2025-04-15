-- Create a temporary function to log auth.uid() during address insertion
create or replace function public.debug_address_insert()
returns trigger as $$
begin
  raise log 'Debug: Attempting to insert address. auth.uid() = %, user_id = %', auth.uid(), new.user_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create a temporary trigger
create trigger debug_address_insert_trigger
  before insert on public.addresses
  for each row execute procedure public.debug_address_insert();

-- Add comment
comment on function public.debug_address_insert() is 'Temporary debug function to log auth.uid() during address insertion'; 