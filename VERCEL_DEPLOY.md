# 🚀 Vercel Deploy Qo'llanmasi (O'zbek)

## ⚠️ Muhim Ogohlantirish

Vercel deployment **cheklangan**: 
- ✅ **Admin Panel** - to'liq ishlaydi
- ❌ **Telegram Bot** - ishlamaydi (serverless cheklov)
- ❌ **Tug'ilgan kun bildirish** - ishlamaydi
- ❌ **Aksiya bildirish** - ishlamaydi

> **To'liq funksiyalar uchun Render.com'dan foydalaning!** → [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 1️⃣ Tayyorgarlik

### GitHub'ga yuklash

```bash
# Barcha o'zgarishlarni qo'shish
git add .

# Commit yaratish
git commit -m "feat: add Vercel support (admin panel only)"

# GitHub'ga yuklash
git push origin main
```

---

## 2️⃣ Vercel'da Deploy

### Birinchi Deploy

1. **Vercel saytiga kiring**: [vercel.com](https://vercel.com)
2. **GitHub bilan tizimga kiring**
3. **"New Project"** tugmasini bosing
4. **Repository'ni tanlang**: `cosmo` yoki sizning repo nomingiz
5. **"Import"** tugmasini bosing

### Environment Variables (Muhim!)

**"Environment Variables"** bo'limida quyidagilarni qo'shing:

| Variable | Value |
|----------|-------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `sizning_parolingiz` |
| `SESSION_SECRET` | `tasodifiy_uzun_qator_12345xyz` |
| `NODE_ENV` | `production` |

> **Eslatma**: `TELEGRAM_BOT_TOKEN` kerak emas chunki bot ishlamaydi

6. **"Deploy"** tugmasini bosing
7. **3-5 daqiqa kuting**

---

## 3️⃣ Tekshirish

Deployment tugagandan keyin:

1. **URL ochiladi**: `https://your-project.vercel.app`
2. **Login qiling**:
   - Username: `admin`
   - Password: yuqorida belgilagan parol
3. **Funksiyalarni sinab ko'ring**:
   - ✅ Mijoz qo'shish
   - ✅ Mijozlar ro'yxati
   - ✅ Aksiya yaratish
   - ✅ Dashboard ko'rish

---

## 4️⃣ Muammolarni Bartaraf Etish

### ❌ "500 Internal Error"

**Yechim**: Vercel Dashboard → Logs → so'nggi xatolarni tekshiring
- Environment variables to'g'ri kiritilganini tasdiqlang
- DATABASE_PATH o'chirilganiga ishonch hosil qiling

### ❌ "Cannot login"

**Yechim**: 
1. Vercel Dashboard → Settings → Environment Variables
2. `ADMIN_PASSWORD` qo'shilganini tekshiring
3. "Redeploy" bosing

### ⚠️ Database yo'qoladi

Bu **normal**! Vercel'da har deploymentda database yangilanadi.

**Yechim**: To'liq funksional ilovani Render.com'ga deploy qiling → [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 5️⃣ Keyingi Deploymentlar

Har safar GitHub'ga push qilganingizda, Vercel avtomatik yangi deploy qiladi:

```bash
git add .
git commit -m "yangilash tavsifi"
git push
```

Vercel 1-2 daqiqada yangilanadi! ✨

---

## 🎯 Xulosa

### Vercel
- ✅ Tez deployment
- ✅ Admin panel ishlaydi
- ❌ Bot ishlamaydi
- ❌ Bildirishnomalar yo'q
- ❌ Database vaqtinchalik

### Render.com (Tavsiya)
- ✅ To'liq funksional
- ✅ Telegram bot
- ✅ Bildirishnomalar
- ✅ Doimiy database
- ⏱️ Bir oz sekinroq deploy

---

## 📞 Yordam

Muammo bo'lsa, Vercel Dashboard → **Logs** bo'limini tekshiring.
