-- Trigger Function: handle_new_user
-- Automatically creates a user_profile and organization for every new signup.

create or replace function public.handle_new_user() 
returns trigger as $$
declare
  new_org_id uuid;
begin
  -- 1. Create a default Organization for the user
  insert into public.organizations (name, slug)
  values (
    split_part(new.email, '@', 1) || '''s Org', 
    lower(split_part(new.email, '@', 1)) || '-' || floor(random() * 1000)::text
  )
  returning id into new_org_id;

  -- 2. Create the User Profile
  insert into public.user_profiles (id, organization_id, full_name, role)
  values (
    new.id,
    new_org_id,
    split_part(new.email, '@', 1), -- Default name from email
    'admin'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Trigger Definition
-- Checks if trigger exists to avoid errors on repeated runs (if feasible), or just replaces.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
