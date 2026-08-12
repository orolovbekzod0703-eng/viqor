# Viqor — Erkaklar kiyimlari onlayn do'koni

Zamonaviy, mobile-first e-commerce sayti. React + Vite + Tailwind CSS, Zustand
holat boshqaruvi va Firebase (Firestore + Storage) backend.

## Xususiyatlar

- 🇺🇿 / 🇷🇺 — UZ/RU tillar (yuqoridagi tugma orqali almashadi)
- 🛍️ Mahsulotlar grid'i, kategoriya chip'lari, filtrlar (o'lcham, rang, brend, narx)
- 🔍 Qidiruv
- 💗 Sevimlilar (♡)
- 🛒 Chetdan chiqadigan savat (drawer)
- 📦 Bosqichma-bosqich checkout (yetkazib berish / manzil / kontakt / to'lov / tasdiq)
- ✅ Buyurtma tasdiqi + buyurtma raqami
- 📱 To'liq responsiv (telefon / planshet / kompyuter)
- ✨ Yumshoq animatsiyalar, hover effektlari
- 🔥 Firebase bilan buyurtmalarni saqlash (`orders` kolleksiyasi)
- 📴 Firebase konfiguratsiyasiz ham ishlaydi (buyurtma lokal saqlanadi — dev/demo uchun)

## Boshlash

```bash
npm install
cp .env.example .env   # va o'z Firebase kalitlaringizni qo'ying
npm run dev
```

Sayt `http://localhost:5173` da ochiladi.

## Environment o'zgaruvchilari

Loyihaning ildizida `.env` fayl yarating (namunani `.env.example` dan ko'chirib oling):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> **Eslatma:** `.env` fayl `.gitignore` ga qo'shilgan — hech qachon commit qilmang.
> Agar `VITE_FIREBASE_API_KEY` bo'sh bo'lsa, sayt namuna ma'lumotlar bilan
> ishlaydi va buyurtmalar `localStorage` da saqlanadi (demo rejimi).

## Firebase sozlash

1. [console.firebase.google.com](https://console.firebase.google.com) da yangi loyiha yarating.
2. **Firestore Database** ni yoqing (production mode yoki test mode).
3. **Storage** ni yoqing (mahsulot rasmlari uchun).
4. Web app qo'shing va konfiguratsiya kalitlarini `.env` fayliga ko'chiring.
5. Firestore da quyidagi kolleksiyalarni yarating:
   - `products` — mahsulotlar (tuzilishi `src/data/products.js` dagi kabi)
   - `orders` — buyurtmalar (avtomatik yaratiladi)

**Firestore qoidalari** (misol — production'da qattiqroq qoidalar qo'llang):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{doc}   { allow read: if true; }
    match /orders/{doc}     { allow create: if true; }
  }
}
```

## Vercel'ga deploy

1. Kodni **GitHub**ga push qiling.
2. [vercel.com](https://vercel.com) da `New Project` → repositoriyani import qiling.
3. Framework Preset avtomatik `Vite` deb aniqlanadi (Build Command: `npm run build`, Output: `dist`).
4. **Environment Variables** bo'limida `.env` dagi barcha `VITE_FIREBASE_*` kalitlarini qo'shing.
5. **Deploy** tugmasini bosing.

SPA marshrutlari uchun `vercel.json` fayli bor — barcha yo'llar `index.html`ga qayta yo'naltiriladi.

## Loyiha tuzilishi

```
src/
  components/     # UI komponentlar
  data/           # Namuna mahsulotlar (Firebase o'rniga)
  hooks/          # useI18n
  i18n/           # Tarjimalar (uz/ru)
  store/          # Zustand store'lar
  firebase.js     # Firebase config va yordamchi funksiyalar
  App.jsx
  main.jsx
  index.css
```

## Skriptlar

- `npm run dev` — dev server
- `npm run build` — production build (`dist/`)
- `npm run preview` — build'ni lokal ko'rish

## Litsenziya

MIT
