# SkladBor - Ombor Ijara Marketplace

O'zbekistonda bo'sh turgan ombor, sklad va saqlash joylarini ijaraga beruvchi (landlord) va kerak bo'lgan biznes egalari (tenant)ni bog'laydigan B2B marketplace platforma.

## Arxitektura

**Frontend-only** arxitektura - alohida Express/Node backend yo'q. Buning o'rniga **Firebase** (Backend-as-a-Service) ishlatiladi:
- **Firebase Auth** - ro'yxatdan o'tish/kirish
- **Firestore** - ma'lumotlar bazasi (omborlar, so'rovlar, foydalanuvchilar)
- **Firebase Storage** - rasm yuklash
- **Firebase Cloud Functions** - to'lov webhook va AI proxy (xavfsizlik uchun)

## Texnologiyalar

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Zustand (state management)
- Firebase SDK
- Leaflet + React-Leaflet (xarita)
- i18next (xalqarolashtirish: Uzbek/Russian)
- React Hook Form
- React Icons

### Backend (Firebase)
- Firebase Auth
- Firestore Database
- Firebase Storage
- Cloud Functions (Node.js 18)
- Anthropic Claude API (AI funksiyalari)

## O'rnatish

### 1. Frontend dependencies

```bash
cd frontend
npm install
```

### 2. Firebase konfiguratsiya

`.env` faylini yarating va quyidagilarni to'ldiring:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Firebase loyihasini [Firebase Console](https://console.firebase.google.com/) da yarating va konfiguratsiyani oling.

### 3. Firebase setup

```bash
npm install -g firebase-tools
firebase login
firebase init
# Tanlang: Firestore, Functions, Hosting, Storage
```

### 4. Cloud Functions setup

```bash
cd functions
npm install
```

### 5. Environment secrets (Cloud Functions uchun)

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```

## Loyiha strukturası

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── WarehouseCard.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── MapView.jsx
│   │   ├── BookingModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Loaders/
│   │       ├── Skeleton.jsx
│   │       ├── Spinner.jsx
│   │       ├── ProgressBar.jsx
│   │       └── AILoader.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Listings.jsx
│   │   ├── WarehouseDetail.jsx
│   │   ├── Pricing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard/
│   │       ├── LandlordDashboard.jsx
│   │       ├── TenantDashboard.jsx
│   │       └── AddWarehouse.jsx
│   ├── store/
│   │   ├── authStore.js
│   │   └── filterStore.js
│   ├── locales/
│   │   ├── uz.json
│   │   └── ru.json
│   ├── firebase.js
│   ├── i18n.js
│   ├── App.jsx
│   └── main.jsx
├── functions/
│   ├── index.js
│   └── package.json
├── firebase.json
├── firestore.rules
├── storage.rules
└── package.json
```

## Ishga tushirish

### Lokal development

```bash
# Frontend
cd frontend
npm run dev

# Cloud Functions (alohida terminalda)
cd functions
npm run serve
```

### Production deploy

```bash
# Build
npm run build

# Firebase deploy
firebase deploy
```

## Asosiy funksiyalar

### MVP funksiyalari
1. ✅ Ro'yxatdan o'tish/kirish (Firebase Auth, rol asosida)
2. ✅ Ombor e'lon joylash (rasm yuklash - Firebase Storage, xarita pin - Leaflet)
3. ✅ Qidiruv va filter (hudud, narx, maydon, kategoriya)
4. ✅ Xarita ko'rinishi (Leaflet.js)
5. ✅ Ombor detali sahifasi
6. ✅ So'rov yuborish tizimi (tenant → landlord)
7. ✅ Dashboard (landlord: e'lonlar+so'rovlar; tenant: so'rovlar tarixi)
8. ✅ Admin panel - moderatsiya

### Premium funksiyalar
1. ✅ Pullik obuna tizimi (Bepul/Standart/Biznes)
2. ✅ Premium e'lon (TOP belgisi, qidiruvda tepada)
3. ✅ To'lov integratsiyasi (Click.uz, Payme)
4. ✅ AI funksiyalari (faqat premium foydalanuvchilar uchun)
   - AI qidiruv yordamchisi
   - AI tavsiya tizimi
   - AI yordamida e'lon yozish

### Loading holatlari
1. ✅ Skeleton loader (omborlar ro'yxati)
2. ✅ AI so'rovlari uchun maxsus loading
3. ✅ Rasm yuklash progress bar
4. ✅ To'lov jarayoni loading
5. ✅ Global loading (sahifalar o'tganda)

## Firestore ma'lumotlar modeli

### users
```javascript
{
  name: string,
  phone: string,
  email: string,
  role: 'landlord' | 'tenant' | 'admin',
  subscriptionTier: 'free' | 'standard' | 'business',
  subscriptionExpiresAt: timestamp,
  companyName: string (ixtiyoriy),
  createdAt: timestamp
}
```

### warehouses
```javascript
{
  title: string,
  description: string,
  location: {
    lat: number,
    lng: number,
    address: string,
    region: string
  },
  sizeSqm: number,
  pricePerSqm: number,
  category: 'sovutgichli' | 'quruq' | 'ochiq_maydon' | 'konteyner' | 'boshqa',
  amenities: string[],
  images: string[],
  ownerId: string,
  status: 'available' | 'rented' | 'pending',
  minRentPeriod: number,
  isPremium: boolean,
  premiumExpiresAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### bookingRequests
```javascript
{
  warehouseId: string,
  tenantId: string,
  landlordId: string,
  requestedPeriod: number,
  message: string,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Tariflar

### Obuna tarifi (landlord uchun)
- **Bepul**: 1 ta ombor e'loni, AI funksiyalari yopiq
- **Standart (99,000 so'm/oy)**: 5 tagacha e'lon, AI funksiyalari ochiq
- **Biznes (249,000 so'm/oy)**: cheksiz e'lon + statistika paneli + AI funksiyalari

### Premium e'lon
- **50,000 so'm/oy**: qidiruvda tepada, "TOP" belgisi, 3x ko'proq rasm

## Xavfsizlik

### Firestore Security Rules
- Foydalanuvchilar faqat o'z ma'lumotlarini o'zgartira oladi
- Warehouse'ni faqat egasi tahrirlay oladi
- Booking so'rovlari faqat tegishli tenant va landlord ko'ra oladi

### Cloud Functions Security
- AI funksiyalari faqat premium foydalanuvchilar uchun
- API kalitlari secrets orqali saqlanadi
- To'lov webhook'lar autentifikatsiya talab qiladi

## Internetga chiqarish

### Firebase Hosting
```bash
npm run build
firebase deploy
```

Natijada tayyor domen:
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`

### O'z domeningizni ulash
1. Firebase Console > Hosting > "Add custom domain"
2. DNS provayderingizda A-record va TXT-record qo'shing

## Muhim eslatmalar

1. **Blaze reja**: Cloud Functions ishlashi uchun Firebase loyihasi "Blaze" (pay-as-you-go) rejasida bo'lishi shart
2. **Secrets**: Production muhitida barcha secretlarni to'g'ri o'rnatish kerak
3. **.env**: `.env` faylni `.gitignore`ga qo'shganingizni tekshiring
4. **Payment**: Click.uz va Payme API integratsiyasini to'liq amalga oshirish kerak

## Keyingi bosqichlar

- [ ] Click.uz va Payme API integratsiyasini to'liq amalga oshirish
- [ ] AI promptlarni optimallashtirish
- [ ] Admin panelni rivojlantirish
- [ ] Statistika panelini rivojlantirish
- [ ] Push notifications qo'shish
- [ ] Mobile app (React Native)

## License

ISC
