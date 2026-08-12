-- ============================================================
-- Viqor — Migration 001
-- Yangi xususiyatlar: labels, foydalanuvchi akkauntlari, sharhlar
-- schema.sql ishga tushirilgan bo'lishi kerak. Buni keyin RUN qiling.
-- ============================================================

-- 1) PRODUCTS: labels ustuni ------------------------------------------
alter table public.products
  add column if not exists labels text[] not null default '{}';

-- 2) ORDERS: user_id (ixtiyoriy — mehmon ham buyurtma bera oladi) -------
alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists orders_user_id_idx on public.orders(user_id);

-- Foydalanuvchi o'z buyurtmalarini ko'ra oladi
drop policy if exists orders_self_read on public.orders;
create policy orders_self_read on public.orders for select
  using (user_id is not null and user_id = auth.uid());

-- 3) PROFILES: mijoz ma'lumotlari ---------------------------------------
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_self_all on public.profiles;
create policy profiles_self_all on public.profiles for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 4) REVIEWS: sharhlar --------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  text       text,
  created_at timestamptz default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_idx on public.reviews(product_id);

alter table public.reviews enable row level security;

drop policy if exists reviews_public_read   on public.reviews;
drop policy if exists reviews_self_insert   on public.reviews;
drop policy if exists reviews_self_update   on public.reviews;
drop policy if exists reviews_self_or_admin_delete on public.reviews;

create policy reviews_public_read on public.reviews for select using (true);
create policy reviews_self_insert on public.reviews for insert with check (user_id = auth.uid());
create policy reviews_self_update on public.reviews for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reviews_self_or_admin_delete on public.reviews for delete
  using (user_id = auth.uid() or public.is_admin());

-- 5) Yordamchi view: reyting o'rtachasi va soni -------------------------
create or replace view public.product_ratings as
  select product_id,
         round(avg(rating)::numeric, 1) as avg_rating,
         count(*)::int as reviews_count
  from public.reviews
  group by product_id;
