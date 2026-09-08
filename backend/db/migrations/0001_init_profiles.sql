-- DSAverse 2.0 — Phase 1: profiles table
-- Run this in the Supabase SQL editor (or via the Supabase CLI) for your project.
-- Depends on Supabase's built-in `auth.users` table.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student', 'teacher')),
  xp integer not null default 0,
  streak integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Row-Level Security is a second line of defense behind the Express
-- requireAuth middleware, not a replacement for it: the backend uses the
-- service-role key (which bypasses RLS) and scopes every query by the
-- verified req.user.id itself. RLS here protects any future direct client
-- access (e.g. if the frontend ever queries Supabase directly for reads).
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profiles row whenever a new auth.users row is created, so
-- there is never a signed-up user with no matching profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
