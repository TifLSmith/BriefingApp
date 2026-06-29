
create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  industry text,
  created_at timestamptz not null default now(),
  unique(email)
);

alter table public.waitlist_signups enable row level security;

create policy "anyone can join waitlist"
on public.waitlist_signups for insert
to anon, authenticated
with check (true);

create table public.briefing_cache (
  id uuid primary key default gen_random_uuid(),
  source_url text not null unique,
  source_name text not null,
  original_title text not null,
  original_summary text,
  rewritten_title text not null,
  rewritten_summary text not null,
  what_it_means text not null,
  severity text not null default 'medium',
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.briefing_cache enable row level security;

create index briefing_cache_published_at_idx on public.briefing_cache (published_at desc);
