# Telegram Bot yaratish va Deploy qilish

## 1. Telegram Bot Token olish

1. Telegram'da **@BotFather** ni oching
2. Quyidagi buyruqni yuboring:
   ```
   /newbot
   ```
3. Bot nomini kiriting (masalan: "COSMO Birthday Bot")
4. Bot username kiriting (masalan: "cosmo_birthday_bot")
5. BotFather sizga **token** beradi:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
   ⚠️ **Bu tokenni saqlab qo'ying!**

## 2. GitHub'ga yuklash

```bash
# Git repository yaratish (agar bo'lmasa)
git init

# Barcha fayllarni qo'shish
git add .

# Commit qilish
git commit -m "Ready for deployment"

# GitHub'da yangi repository yaratish kerak:
# 1. GitHub.com ga kiring
# 2. "+" tugmasini bosing
# 3. "New repository" ni tanlang
# 4. Repository nomini kiriting: "cosmo"
# 5. "Create repository" tugmasini bosing

# GitHub remote qo'shish (o'zingizning username bilan almashtiring!)
git remote add origin https://github.com/SIZNING_USERNAME/cosmo.git

# Kodni yuklash
git branch -M main
git push -u origin main
```

## 3. Render.com'da deploy qilish

### A. Akkaunt yaratish
1. Ochish: https://render.com
2. "Get Started" yoki "Sign Up" ni bosing
3. **"Continue with GitHub"** ni tanlang (eng oson)
4. GitHub bilan tizimga kiring

### B. Yangi service yaratish
1. Render Dashboard'da **"New +"** tugmasini bosing
2. **"Blueprint"** ni tanlang
3. GitHub repository'ni tanlang: **"cosmo"**
4. Render.com avtomatik `render.yaml` ni topadi

### C. Environment variables sozlash

⚠️ **MUHIM!** Quyidagi o'zgaruvchilarni to'ldiring:

| Variable nomi | Qiymat | Qayerdan olish |
|--------------|---------|----------------|
| `TELEGRAM_BOT_TOKEN` | `1234567890:ABC...` | @BotFather dan olgan tokeningiz |
| `ADMIN_PASSWORD` | `kuchli_parol123` | O'zingiz o'ylab toping |

Qolgan barcha o'zgaruvchilar avtomatik sozlanadi!

### D. Deploy boshlash
1. **"Apply"** tugmasini bosing
2. 3-5 daqiqa kuting
3. Build loglarini kuzating
4. ✅ Deploy tayyor!

## 4. Tekshirish

Deploy tugagach:
- URL olasiz: `https://cosmo-birthday-app.onrender.com`
- Brauzerda oching
- Login: `admin`
- Parol: sizning `ADMIN_PASSWORD`

## 5. Telegram botni tekshirish

1. Telegram'da botingizni toping
2. `/start` yuboring
3. Ro'yxatdan o'ting
4. Tekshiring!

---

## 💰 Narxi

**100% BEPUL!**

✅ Bepul plan beradi:
- 750 soat/oyiga (1 ta app uchun yetarli)
- 1 GB database
- HTTPS (SSL) bepul
- Auto-deploy GitHub'dan

⚠️ **Eslatma:** Bepul planda server 15 daqiqa faol bo'lmasa "uxlaydi". Birinchi kelgan foydalanuvchi 30 sekund kutadi, keyin tez ishlaydi.

---

## ❓ Savollar?

Agar muammo bo'lsa, quyidagi fayllarni o'qing:
- `DEPLOYMENT.md` - to'liq ko'rsatma (rus tilida)
- Yoki menga yozing!
