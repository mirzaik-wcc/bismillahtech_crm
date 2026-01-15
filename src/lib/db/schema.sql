-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations (Tenants)
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- User Profiles (Consultants)
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete restrict,
  full_name text,
  role text check (role in ('admin', 'consultant')),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_user_profiles_organization on user_profiles(organization_id);

-- Enums
create type crm_mode as enum ('internal_only', 'hybrid', 'external_only');

-- Businesses (Clients)
create table if not exists businesses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  timezone text not null default 'UTC',
  status text check (status in ('active', 'onboarding', 'churned')) default 'onboarding',
  crm_mode crm_mode not null default 'internal_only',
  created_at timestamptz default now()
);

create index if not exists idx_businesses_organization on businesses(organization_id);

-- Enable RLS
alter table businesses enable row level security;

-- Activities (Events)
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  type text check (type in ('call', 'email', 'lead_form')),
  direction text check (direction in ('inbound', 'outbound')),
  metadata jsonb default '{}'::jsonb,
  occurred_at timestamptz default now()
);

create index if not exists idx_activities_business on activities(business_id);
alter table activities enable row level security;

-- Leaks (Revenue Opportunities)
create table if not exists leaks (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade,
  activity_id uuid references activities(id) on delete set null,
  type text check (type in ('missed_call', 'unreplied_email')),
  status text check (status in ('detected', 'ignored', 'fixing', 'fixed')) default 'detected',
  potential_value decimal(10, 2),
  detected_at timestamptz default now()
);

create index if not exists idx_leaks_business on leaks(business_id);
alter table leaks enable row level security;
