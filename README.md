# 🎯 COSMO - Mijozlar Tug'ilgan Kun Boshqaruv Tizimi

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 📋 Loyiha Haqida

COSMO - bu mijozlar va ularning bolalarining tug'ilgan kunlarini boshqarish, avtomatik bildirishnomalar yuborish va aksiyalarni e'lon qilish uchun to'liq tizim.

### ✨ Asosiy Xususiyatlar

- 👥 **Mijozlar Boshqaruvi**: Mijozlar va ularning bolalarini ro'yxatdan o'tkazish
- 🎂 **Tug'ilgan Kun Eslatmalari**: Avtomatik Telegram orqali eslatmalar (3 kun oldin va kun)
- 📢 **Aksiyalar**: Aksiyalar yaratish va barcha mijozlarga bildirishnoma yuborish
- 🤖 **Telegram Bot**: Mijozlarning avtomatik ro'yxatdan o'tishi
- 📊 **Admin Panel**: Barcha ma'lumotlarni boshqarish uchun web interfeys
- ⏰ **Avtomatik Scheduler**: Har kuni soat 9:00 da tekshirish

## 🚀 Deployment

### Render.com'da Deploy (TO'LIQ FUNKSIYALAR)

**Boshlash uchun to'liq qo'llanma:** [VERCEL_DEPLOY.md yoki DEPLOYMENT.md fayllarini ko'ring]

1. **GitHub'ga yuklang**:
   ```bash
   git push origin main
   ```

2. **Render.com'da**:
   - [render.com](https://render.com) - GitHub bilan kiring
   - "New +" → "Blueprint" tanlang
   - Repository'ni ulang
   - Environment variables qo'shing:
     - `TELEGRAM_BOT_TOKEN` - [@BotFather](https://t.me/BotFather) dan
     - `ADMIN_PASSWORD` - o'zingiz o'ylang
   - "Apply" bosing

3. **✅ Tayyor!** - Bot va barcha funksiyalar ishlaydi

### Vercel'da Deploy (FAQAT ADMIN PANEL)

⚠️ **Cheklangan**: Bot va bildirishnomalar ishlamaydi

```bash
npm install -g vercel
vercel
```

Environment variables:
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=<parol>`
- `SESSION_SECRET=<random>`

## 💻 Mahalliy Ishga Tushirish

### 1. Talablar
- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. O'rnatish

```bash
# Repositoriyani klonlash
git clone https://github.com/your-username/cosmo.git
cd cosmo

# Bog'liqliklarni o'rnatish
npm install

# Environment o'rnatish
cp .env.example .env
# .env faylini tahrirlang
```

### 3. .env Konfiguratsiyasi

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Session
SESSION_SECRET=your_random_secret_key

# Database
DATABASE_PATH=./database/clients.db

# Server
PORT=3000
NODE_ENV=development
TZ=Asia/Tashkent
```

### 4. Databaseni Yaratish

```bash
npm run init-db
```

### 5. Serverni Ishga Tushirish

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Admin panel: http://localhost:3000

## 📱 Telegram Bot

### Bot Yaratish

1. [@BotFather](https://t.me/BotFather) ni oching
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting
4. Username kiriting
5. Tokenni `.env` fayliga joylashtiring

### Foydalanuvchi Tajribasi

1. `/start` - Ro'yxatdan o'tishni boshlash
2. Ism kiriting
3. Telefon raqamini ulashing
4. Bola ismi
5. Tug'ilgan kun (format: DD.MM.YYYY)

## 🔧 Texnologiyalar

### Backend
- **Node.js** - Server muhiti
- **Express.js** - Web framework
- **SQLite3** - Database
- **node-telegram-bot-api** - Telegram bot

### Frontend
- **HTML/CSS/JavaScript** - Admin panel
- **Responsive Design** - Mobil moslashtirish

### DevOps
- **Render.com** - Hosting (to'liq funksiyalar)
- **Vercel** - Hosting (admin panel)
- **GitHub** - Version control

## 📊 Database Strukturasi

- **admins** - Admin foydalanuvchilar
- **clients** - Mijozlar
- **children** - Bolalar ma'lumotlari
- **promotions** - Aksiyalar
- **birthday_notifications** - Yuborilgan bildirishnomalar tarixi

## 🛠️ NPM Skriptlar

```bash
npm start          # Serverni ishga tushirish
npm run dev        # Development mode (nodemon bilan)
npm run init-db    # Databaseni yaratish
```

## 📁 Loyiha Strukturasi

```
cosmo/
├── api/              # Vercel serverless functions
├── bot/              # Telegram bot logic
│   ├── handlers/     # Bot handlers
│   └── notifications/# Bildirishnomalar
├── config/           # Konfiguratsiya
├── database/         # Database va schema
├── public/           # Frontend files
│   ├── css/
│   ├── js/
│   └── index.html
├── routes/           # API routes
├── scheduler/        # Cron jobs
├── server.js         # Entry point
├── render.yaml       # Render config
└── vercel.json       # Vercel config
```

## 🔐 Xavfsizlik

- ✅ Parollar bcrypt bilan hash qilinadi
- ✅ Session secret ishlatiladi
- ✅ Environment variables `.env` da
- ✅ `.gitignore` da maxfiy ma'lumotlar
- ✅ SQL injection himoyasi

## 📝 License

MIT License - [LICENSE](LICENSE) faylini ko'ring

## 👨‍💻 Muallif

COSMO Birthday Management System

## 🙏 Minnatdorchilik

- Telegram Bot API
- Render.com hosting
- Node.js community

## 📞 Yordam

Muammolar yoki savollar bo'lsa, GitHub Issues'da murojaat qiling.

---

**To'liq qo'llanma:** [DEPLOYMENT.md](DEPLOYMENT.md) va [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)
