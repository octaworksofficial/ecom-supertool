# Railway Deployment Guide - SQLite Database

## 🚀 Railway'de SQLite ile Deploy Etme Adımları

### 1. Railway Dashboard Ayarları

1. Railway dashboard'a git
2. Projenin **Settings** bölümüne git
3. **Environment Variables** kısmına şunları ekle:

```
DATABASE_URL=file:./dev.db
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-app-name.railway.app
```

### 2. Volume Mount (Önemli!)

Railway'de SQLite dosyasının persist edilmesi için:

1. **Settings** > **Volumes** kısmına git
2. Yeni volume oluştur:
   - **Mount Point**: `/app/prisma`
   - **Size**: 1GB (yeterli)

### 3. Build Command Kontrolü

Railway otomatik olarak `railway.json` dosyasındaki build command'ı kullanacak:

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm install && prisma generate && prisma migrate deploy && npm run build"
  }
}
```

### 4. Deploy Süreci

1. Kodu GitHub'a push et
2. Railway otomatik olarak deploy edecek
3. İlk deploy'da database migrations otomatik çalışacak
4. `dev.db` dosyası `/app/prisma/` klasörüne oluşturulacak

### 5. Database Seed (Opsiyonel)

Eğer başlangıç verisi eklemek istersen:
- Environment variables'a `SEED_DATABASE=true` ekle
- Railway deployment sırasında seed script çalışacak

### 6. Troubleshooting

**Sorun**: Database dosyası bulunamıyor
**Çözüm**: Volume mount point'in doğru ayarlandığından emin ol

**Sorun**: Migration hataları
**Çözüm**: Local'de `npx prisma migrate reset` çalıştırıp yeniden dene

**Sorun**: Permission denied
**Çözüm**: Railway console'dan `chmod 777 /app/prisma` çalıştır

### 7. Production Kontrolü

Deploy sonrası kontrol et:
- `/api/test-db` endpoint'ine git
- Database connection test'i geçmeli
- Customer count 0 göstermeli (ilk deploy'da)

## 📝 Notlar

- SQLite dosyası `/app/prisma/dev.db` konumunda olacak
- Railway'de automatic backups için volume snapshot özelliğini kullan
- Production'da database size'ı izle (Railway volume limits)
