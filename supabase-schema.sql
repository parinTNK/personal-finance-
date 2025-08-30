-- Create transactions table for Personal Financial Management app
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense')),
  amount numeric(14,2) not null,
  category text,
  note text,
  occurred_at date not null,
  created_at timestamptz not null default now()
);

-- Create index for better performance on date queries
create index if not exists idx_transactions_occurred_at on public.transactions (occurred_at desc);
create index if not exists idx_transactions_created_at on public.transactions (created_at desc);

-- Since this is a single-user app with no authentication, we disable RLS
alter table public.transactions disable row level security;