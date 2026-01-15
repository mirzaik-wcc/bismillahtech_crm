-- Enable RLS
alter table organizations enable row level security;
alter table user_profiles enable row level security;

-- Policies for Organizations
create policy "Users can view their own organization"
  on organizations for select
  using (
    id in (
      select organization_id from user_profiles
      where id = auth.uid()
    )
  );

-- Policies for User Profiles
create policy "Users can view their own profile"
  on user_profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on user_profiles for update
  using ( auth.uid() = id );

create policy "Users can view profiles in their organization"
  on user_profiles for select
  using (
    organization_id in (
      select organization_id from user_profiles
      where id = auth.uid()
    )
  );

-- Policies for Businesses
create policy "Users can view businesses in their organization"
  on businesses for select
  using (
    organization_id in (
      select organization_id from user_profiles
      where id = auth.uid()
    )
  );

create policy "Users can insert businesses in their organization"
  on businesses for insert
  with check (
    organization_id in (
      select organization_id from user_profiles
      where id = auth.uid()
    )
  );

-- Policies for Activities (Inherited from Business)
create policy "Users can view activities for their businesses"
  on activities for select
  using (
    business_id in (
      select id from businesses
      where organization_id in (
        select organization_id from user_profiles
        where id = auth.uid()
      )
    )
  );

create policy "Users can insert activities for their businesses"
  on activities for insert
  with check (
     business_id in (
      select id from businesses
      where organization_id in (
        select organization_id from user_profiles
        where id = auth.uid()
      )
    )
  );

-- Policies for Leaks (Inherited from Business)
create policy "Users can view leaks for their businesses"
  on leaks for select
  using (
    business_id in (
      select id from businesses
      where organization_id in (
        select organization_id from user_profiles
        where id = auth.uid()
      )
    )
  );

create policy "Users can update leaks for their businesses"
  on leaks for update
  using (
    business_id in (
      select id from businesses
      where organization_id in (
        select organization_id from user_profiles
        where id = auth.uid()
      )
    )
  );
