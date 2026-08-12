# Viqor — Erkaklar kiyimlari onlayn do'koni

Zamonaviy, mobile-first e-commerce sayti. React + Vite + Tailwind + Zustand,
backend **Supabase** (Postgres + Auth + Storage). Admin panel bilan.

## Xususiyatlar

- 🇺🇿 / 🇷🇺 UZ/RU tillar
- 🛍️ Mahsulotlar, kategoriya chip'lari, filtrlar (o'lcham/rang/brend/narx), qidiruv (autocomplete)
- 🏷️ **Yorliqlar** (Yangi, Bestseller, Cheklangan, Aksiya) badges
- ⭐ **Sharhlar va reyting** (5 yulduz) — login talab
- 💗 Sevimlilar · 🛒 Chetdan chiqadigan savat
- 👤 **Mijoz akkaunti** — ro'yxatdan o'tish, kirish, buyurtmalar tarixi, sevimlilar
- 📦 5-bosqichli checkout (Payme/Click/Uzum/naqd)
- 🗺️ **Xarita** (OpenStreetMap + Leaflet) — manzilni xaritada tanlash
- 🔥 **Aksiya banneri hisoblagich bilan** — sozlanuvchi tugash sanasi
- 🔐 **Admin panel** (`/admin`) — Supabase Auth
  - **Dashboard** — statistika (kunlik/haftalik sotuv, 30 kun grafigi, top mahsulotlar, statuslar)
  - **Buyurtmalar** — ro'yxat, status filtri, status o'zgartirish, tafsilotlar
  - **Mahsulotlar** — CRUD, rasm upload, yorliqlar tanlash
- 📱 To'liq responsiv, animatsiyalar

## 1. Boshlash (lokal)

```bash
npm install
copy .env.example .env
npm run dev
```

`.env` da Supabase kalitlarini to'ldirmasangiz ham sayt namuna mahsulotlar bilan
ishlaydi (buyurtmalar `localStorage` da saqlanadi, admin panelga kirish
bo'lmaydi — demo rejimi).

## 2. Supabase sozlash

1. [supabase.com](https://supabase.com) da yangi loyiha yarating.
2. **Project Settings → API** dan `URL` va `anon public` kalitni oling.
3. `.env` ga qo'ying:

   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

4. **SQL Editor** ga o'ting va [`supabase/schema.sql`](supabase/schema.sql)
   faylining ichidagi hamma narsani ko'chirib qo'yib, **Run** bosing. Bu:
   - `products`, `orders`, `admins` jadvallarini yaratadi
   - RLS (Row Level Security) qoidalarini yoqadi
   - `viqor` nomli public storage bucket yaratadi
5. **Yangi:** So'ng [`supabase/migrations/001_features.sql`](supabase/migrations/001_features.sql)
   faylini ham ishga tushiring — bu:
   - `products.labels` ustunini qo'shadi
   - `orders.user_id` ni qo'shadi (mijoz akkauntlari uchun)
   - `profiles` jadvalini yaratadi (mijoz nomi/telefon saqlash)
   - `reviews` jadvalini va `product_ratings` view yaratadi (sharhlar/reyting)
6. (Ixtiyoriy) Namuna 3 ta mahsulot qo'shish uchun
   [`supabase/seed.sql`](supabase/seed.sql) ni ham ishga tushiring.

## 3. Admin foydalanuvchi yaratish

1. Supabase Dashboard → **Authentication → Users → Add user → Create new user**.
   Email va parol kiriting.
2. Yaratilgan user'ning **UID** ni ko'chirib oling.
3. **SQL Editor** ga o'ting:

   ```sql
   insert into public.admins (user_id) values ('SIZNING-USER-UID');
   ```

4. `/admin/login` ga o'ting va o'sha email/parol bilan kiring.

> Adminni olib tashlash: `delete from public.admins where user_id = '...'`

## 4. Vercel'ga deploy

1. Kodni **GitHub**ga push qiling (allaqachon qilingan bo'lsa `git push`).
2. [vercel.com](https://vercel.com/new) → repositoriyani import qiling.
3. Framework `Vite` avtomatik aniqlanadi (build: `npm run build`, output: `dist`).
4. **Environment Variables** da ikkita kalitni qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**.

SPA marshrutlari (`/admin`, `/admin/login`) uchun `vercel.json` da rewrites
sozlangan — barcha yo'llar `index.html`ga yo'naltiriladi.

> **Vercel Preview URL** yoki custom domain qo'shsangiz, uni Supabase
> **Authentication → URL Configuration → Site URL / Additional Redirect URLs**
> ga ham qo'shishni unutmang.

## Loyiha tuzilishi

```
src/
  components/        # Umumiy UI komponentlar
    AddressMap.jsx   # Leaflet xarita
    PromoBanner.jsx  # Yuqoridagi countdown banner
    Reviews.jsx      # Sharhlar bo'limi (modal ichida)
    SearchAutocomplete.jsx
    ...
  pages/
    Store.jsx        # Mijoz sahifasi (do'kon)
    Login.jsx        # Mijoz login
    Register.jsx     # Ro'yxatdan o'tish
    Account.jsx      # Akkaunt (buyurtmalar, sevimlilar, profil)
    admin/           # Admin panel sahifalari
      AdminApp.jsx      # Layout + guard + routing
      AdminLogin.jsx
      AdminDashboard.jsx  # Statistika
      AdminOrders.jsx
      AdminProducts.jsx
      ProductForm.jsx
  data/
    products.js      # Namuna mahsulotlar (Supabase yo'q bo'lsa fallback)
    labels.js        # Yorliq metadata (yangi/bestseller/...)
  hooks/
    useI18n.js
    useAuth.js       # Supabase auth + admin tekshiruv
  i18n/              # Tarjimalar (uz/ru)
  store/             # Zustand: cart, favorites, ui, products, ratings
  supabase.js        # Supabase client + CRUD helpers
  App.jsx            # Router
  main.jsx
supabase/
  schema.sql               # Asosiy jadval, RLS, storage
  migrations/001_features.sql  # Labels, profiles, reviews, user_id
  seed.sql                 # Namuna ma'lumotlar (ixtiyoriy)
```

## Aksiya bannerining tugash sanasini o'zgartirish

`src/components/PromoBanner.jsx` faylida `PROMO_END` konstantasini o'zgartiring:

```js
const PROMO_END = new Date('2026-08-31T23:59:00+05:00').getTime()
```

Sana o'tib ketsa banner avtomatik yashiriladi.

## Ma'lumotlar modeli (qisqacha)

- `products` — mahsulotlar, `name_uz/name_ru`, `sizes[]`, `colors[]`,
  `images[]` (URL'lar), `available_sizes[]` (sotuvda bor bo'lganlari)
- `orders` — buyurtmalar, `items` (jsonb), `customer`, `delivery`, `status`
  (`new`|`processing`|`shipped`|`delivered`|`cancelled`)
- `admins` — admin bo'lgan `auth.users` ro'yxati
- Storage: `viqor` bucket (public read, admin write)

## Skriptlar

- `npm run dev` — dev server
- `npm run build` — production build (`dist/`)
- `npm run preview` — build'ni lokal ko'rish

## Litsenziya

MIT
