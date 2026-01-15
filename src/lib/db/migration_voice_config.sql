-- Run this in Supabase SQL Editor if automation failed

alter table public.businesses 
add column if not exists voice_config jsonb default '{"prompt": "You are a helpful assistant.", "voiceId": "aura-asteria-en"}'::jsonb;

-- Safety check: ensure RLS allows update
create policy "Users can update businesses in their organization"
  on businesses for update
  using (
    organization_id in (
      select organization_id from user_profiles
      where id = auth.uid()
    )
  );
