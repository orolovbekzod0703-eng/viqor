-- ============================================================
-- Viqor — Supabase schema
-- Bu faylni Supabase Dashboard → SQL Editor da bir marta ishga tushiring.
-- ============================================================

-- 1) PRODUCTS ------------------------------------------------------------
create table if not exists public.products (
  id              text primary key,
  category        text not null,
  brand           text not null,
  name_uz         text not null,
  name_ru         text not null,
  price           integer not null,
  old_price       integer,
  sizes           text[] not null default '{}',
  available_sizes text[] not null default '{}',
  colors          text[] not null default '{}',
  composition_uz  text default '',
  composition_ru  text default '',
  description_uz  text default '',
  description_ru  text default '',
  images          text[] not null default '{}',
  created_at      timestamptz default now()
);

-- 2) ORDERS --------------------------------------------------------------
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  status      text not null default 'new'
              check (status in ('new','processing','shipped','delivered','cancelled')),
  items       jsonb not null,
  total       integer not null,
  currency    text default 'UZS',
  customer    jsonb not null,
  delivery    jsonb not null,
  payment     text not null,
  note        text,
  lang        text default 'uz',
  created_at  timestamptz default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);

-- 3) ADMINS --------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Helper: hozirgi foydalanuvchi adminmi?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.admins   enable row level security;

-- PRODUCTS: hamma o'qiy oladi, faqat admin yoza oladi
drop policy if exists products_read     on public.products;
drop policy if exists products_admin_rw on public.products;
create policy products_read     on public.products for select using (true);
create policy products_admin_rw on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- ORDERS: hamma yarata oladi (checkout uchun), o'qish/yangilash faqat admin
drop policy if exists orders_create      on public.orders;
drop policy if exists orders_admin_read  on public.orders;
drop policy if exists orders_admin_write on public.orders;
create policy orders_create      on public.orders for insert with check (true);
create policy orders_admin_read  on public.orders for select using (public.is_admin());
create policy orders_admin_write on public.orders for update using (public.is_admin()) with check (public.is_admin());

-- ADMINS: foydalanuvchi faqat o'z yozuvini ko'radi (isAdmin uchun)
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins for select using (user_id = auth.uid());

-- ============================================================
-- STORAGE
-- ============================================================
-- Public bucket "viqor" — rasmlar uchun
insert into storage.buckets (id, name, public)
values ('viqor', 'viqor', true)
on conflict (id) do nothing;

drop policy if exists "public read viqor"  on storage.objects;
drop policy if exists "admin write viqor"  on storage.objects;
drop policy if exists "admin update viqor" on storage.objects;
drop policy if exists "admin delete viqor" on storage.objects;

create policy "public read viqor"  on storage.objects for select
  using (bucket_id = 'viqor');
create policy "admin write viqor"  on storage.objects for insert
  with check (bucket_id = 'viqor' and public.is_admin());
create policy "admin update viqor" on storage.objects for update
  using (bucket_id = 'viqor' and public.is_admin());
create policy "admin delete viqor" on storage.objects for delete
  using (bucket_id = 'viqor' and public.is_admin());

-- ============================================================
-- ADMIN QO'SHISH
-- Supabase Dashboard → Authentication → Users da yangi user yarating,
-- so'ng shu yerda user_id ni qo'ying:
--
--   insert into public.admins (user_id) values ('AUTH-USER-UUID-HERE');
-- ============================================================
