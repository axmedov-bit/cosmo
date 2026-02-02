# 🎂 Client Birthday Management System

O'zbek tilida Telegram bot va admin panel orqali klientlarni boshqarish tizimi.

## 📋 Xususiyatlari

### Telegram Bot
- ✅ Foydalanuvchilarni ro'yxatdan o'tkazish
- ✅ Bir nechta farzandlarni qo'shish imkoniyati
- ✅ Telefon raqam orqali dublikat tekshirish
- ✅ Avtomatik tug'ilgan kun eslatmalari (3 kun oldin)
- ✅ Tug'ilgan kun tabriklari (o'sha kuni)
- ✅ Aksiyalar haqida xabarlar

### Admin Panel
- ✅ Login/parol bilan xavfsiz kirish
- ✅ Barcha klientlarni ko'rish va boshqarish
- ✅ Klientlarni tahrirlash va o'chirish
- ✅ Foydalanuvchilarni bloklash
- ✅ Yaqinlashayotgan tug'ilgan kunlar ro'yxati
- ✅ Bugungi tug'ilgan kunlar alohida ko'rsatiladi
- ✅ "Sizni kutib qolamiz" xabarini yuborish
- ✅ Aksiyalar yaratish, tahrirlash, o'chirish
- ✅ Yangi aksiya yaratilganda avtomatik xabar yuborish

## 🚀 O'rnatish

### 1. Kerakli dasturlar
- Node.js (v14 yoki yuqori)
- npm (Node.js bilan birga keladi)

### 2. Loyihani yuklab olish
```bash
cd "c:\Users\User\OneDrive\Рабочий стол\Новая папка"
```

### 3. Dependencies o'rnatish
```bash
npm install
```

### 4. Telegram Bot yaratish
1. Telegram'da @BotFather botini toping
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username kiriting
4. Bot token olasiz (masalan: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 5. Environment o'rnatish
`.env.example` faylini `.env` ga nusxalang va to'ldiring:

```bash
copy .env.example .env
```

`.env` faylini tahrirlang:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
PORT=3000
SESSION_SECRET=random_secret_string_here
DATABASE_PATH=./database/clients.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
TZ=Asia/Tashkent
```

### 6. Database yaratish
```bash
npm run init-db
```

Bu buyruq:
- Database yaratadi
- Jadvallarni yaratadi
- Default admin foydalanuvchisini yaratadi (username: `admin`, password: `admin123`)

### 7. Serverni ishga tushirish
```bash
npm start
```

Yoki development rejimida (avtomatik restart):
```bash
npm run dev
```

## 📱 Foydalanish

### Admin Panel
1. Brauzerda ochish: `http://localhost:3000`
2. Login qilish:
   - Username: `admin`
   - Password: `admin123`
3. Keyin parolni o'zgartirish tavsiya etiladi

### Telegram Bot
1. Telegram'da botingizni toping
2. `/start` buyrug'ini yuboring
3. Ko'rsatmalarga amal qiling:
   - Ismingizni kiriting
   - Familiyangizni kiriting
   - Farzandingiz ismini kiriting
   - Tug'ilgan sanasini kiriting (YYYY-MM-DD formatida)
   - "Yana qo'shish" yoki "Yakunlash" ni tanlang
   - Telefon raqamingizni yuboring

## 🎯 Asosiy Funksiyalar

### 1. Klientlarni Boshqarish
- Barcha klientlarni ko'rish
- Klient ma'lumotlarini tahrirlash
- Klientni o'chirish
- Klientni bloklash/blokdan chiqarish

### 2. Tug'ilgan Kunlar
- **Bugungi tug'ilgan kunlar**: Bugun tug'ilgan kuni bo'lgan farzandlar alohida ko'rsatiladi
- **"Sizni kutib qolamiz" xabari**: Admin bir tugma bosish bilan barcha bugungi tug'ilgan kun ota-onalariga xabar yuborishi mumkin
- **Yaqinlashayotgan tug'ilgan kunlar**: 3 kun ichida tug'ilgan kuni bo'lgan farzandlar
- **Avtomatik eslatmalar**: Har kuni soat 9:00 da avtomatik tekshiriladi va xabarlar yuboriladi

### 3. Aksiyalar
- Yangi aksiya yaratish
- Aksiya yaratilganda barcha foydalanuvchilarga avtomatik xabar yuborish
- Aksiyalarni tahrirlash
- Aksiyalarni o'chirish

## 🔔 Avtomatik Xabarlar

### Tug'ilgan Kun Eslatmasi (3 kun oldin)
```
🎂 Eslatma!

{Farzand ismi}ning tug'ilgan kuniga 3 kun qoldi!
Tug'ilgan kun: 15-May
5 yoshga to'ladi 🎉
```

### Tug'ilgan Kun Tabriknomasi (o'sha kuni)
```
🎉🎂 TUG'ILGAN KUNINGIZ MUBORAK! 🎂🎉

Hurmatli Alisher Valiyev!

Sizning farzandingiz Jasur ning tug'ilgan kuni!
Bugun u 5 yoshga to'ldi! 🎈

Unga sog'lik, baxt va omad tilaymiz! 🌟
```

### "Sizni Kutib Qolamiz" (bugungi tug'ilgan kunlar)
```
🎉 Assalomu alaykum!

Bugun sizning farzandingiz Jasurning tug'ilgan kuni! 🎂

Sizni kutib qolamiz! 🎈🎁

Hurmat bilan, bizning jamoa 💐
```

### Aksiya Xabari
```
🎁 YANGI AKSIYA! 🎁

📌 Bahor aksiyasi

📝 Barcha mahsulotlarga 20% chegirma

📅 Amal qilish muddati:
1-Mart-2024 - 31-Mart-2024
```

## 📊 Database Strukturasi

- **admins** - Admin foydalanuvchilar
- **clients** - Klientlar (ota-onalar)
- **children** - Farzandlar
- **promotions** - Aksiyalar
- **registration_sessions** - Bot ro'yxatdan o'tish sessiyalari
- **birthday_notifications** - Yuborilgan tug'ilgan kun xabarlari log
- **promotion_notifications** - Yuborilgan aksiya xabarlari log

## 🛡️ Xavfsizlik

- Admin parollari bcrypt bilan hash qilinadi
- Session-based authentication
- SQL injection himoyasi (parameterized queries)
- Telefon raqam dublikat tekshiruvi

## 🎨 Dizayn

- Modern dark theme
- Glassmorphism effektlari
- Responsive dizayn (mobil va desktop)
- Smooth animatsiyalar
- Gradient ranglar

## 📝 Muammolarni Hal Qilish

### Bot javob bermayapti
1. `TELEGRAM_BOT_TOKEN` to'g'ri kiritilganini tekshiring
2. Serverni qayta ishga tushiring
3. Bot loglarini tekshiring

### Admin panel ochilmayapti
1. Server ishlab turganini tekshiring (`npm start`)
2. Port band emasligini tekshiring (default: 3000)
3. Browser cache ni tozalang

### Xabarlar yuborilmayapti
1. Scheduler ishlab turganini tekshiring
2. Vaqt zonasi to'g'ri sozlanganini tekshiring (`.env` da `TZ=Asia/Tashkent`)
3. Klientlar bloklangan emasligini tekshiring

## 🔄 Yangilanishlar

Database strukturasini o'zgartirish kerak bo'lsa:
1. `database/schema.sql` ni tahrirlang
2. Database faylini o'chiring: `database/clients.db`
3. Qayta yarating: `npm run init-db`

## 📞 Qo'shimcha Ma'lumot

Database turi: SQLite (production uchun PostgreSQL ga o'tish mumkin)

Port: 3000 (`.env` da o'zgartirish mumkin)

Vaqt zonasi: Asia/Tashkent (GMT+5)

Scheduler: Har kuni soat 9:00 AM

## 🎁 Loyiha Strukturasi

```
.
├── bot/
│   ├── handlers/
│   │   └── registration.js    # Ro'yxatdan o'tish handleri
│   ├── index.js                # Bot asosiy fayl
│   └── notifications.js        # Xabar yuborish funksiyalari
├── config/
│   └── database.js             # Database konfiguratsiya
├── database/
│   ├── init.js                 # Database initialization
│   └── schema.sql              # Database schema
├── public/
│   ├── css/
│   │   └── styles.css          # CSS stillar
│   ├── js/
│   │   ├── auth.js             # Autentifikatsiya
│   │   ├── clients.js          # Klientlar boshqaruvi
│   │   ├── birthdays.js        # Tug'ilgan kunlar
│   │   └── promotions.js       # Aksiyalar
│   ├── dashboard.html          # Admin dashboard
│   └── index.html              # Login sahifasi
├── routes/
│   ├── auth.js                 # Auth API
│   ├── birthdays.js            # Birthdays API
│   ├── clients.js              # Clients API
│   └── promotions.js           # Promotions API
├── scheduler/
│   └── index.js                # Cron scheduler
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                   # Express server
```

---

Muallif: AI Assistant
Litsenziya: MIT
