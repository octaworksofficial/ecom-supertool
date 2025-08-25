# Railway Deployment Talimatları

## Environment Variables Kurulumu

Railway'e deploy etmeden önce aşağıdaki environment variable'ları Railway Dashboard'da ayarlayın:

### 1. Domain ve URL Ayarları
```bash
# Ana domain URL'i (önemli: email linklerinde kullanılıyor)
NEXT_PUBLIC_APP_URL=https://manage.octaworks.co

# Auth URL'i (OAuth redirect için)
NEXTAUTH_URL=https://manage.octaworks.co

# Google OAuth redirect URL'i
GOOGLE_REDIRECT_URI=https://manage.octaworks.co/api/auth/callback
```

### 2. Database Ayarları
```bash
# Railway PostgreSQL kullanılıyor
DATABASE_URL=${{DATABASE_URL}}
```

### 3. Auth ve Security
```bash
NEXTAUTH_SECRET=super-secret-key-change-this-in-production
```

### 4. Google OAuth (Opsiyonel)
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. App Konfigürasyonu
```bash
NEXT_PUBLIC_DOCS_URL=https://demos.themeselection.com/materio-mui-nextjs-admin-template/documentation
NEXT_PUBLIC_PRO_URL=https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1
NEXT_PUBLIC_REPO_NAME=materio-mui-nextjs-admin-template-free
BASEPATH=
```

## Önemli Notlar

### Email Link Tracking
- `NEXT_PUBLIC_APP_URL` değişkeni email'lerdeki tracking linkleri için kullanılıyor
- Bu değer mutlaka canlı domain olmalı (https://manage.octaworks.co)
- Localhost URL'leri production'da çalışmaz

### Google OAuth
- Google Cloud Console'da redirect URL'ini güncellemeyi unutmayın
- `https://manage.octaworks.co/api/auth/callback` olarak ayarlayın

### Database
- Yerel geliştirmede SQLite kullanılıyor
- Railway'de otomatik PostgreSQL kullanılıyor
- DB dosyaları (.db, .sql) Git'e gönderilmiyor

## Deployment Komutu
```bash
# Git'e push et
git add .
git commit -m "Production deployment"
git push origin production

# Railway otomatik deploy edecek
```

## URL Değişiklikleri Sonrası
Eğer domain değişirse:
1. Railway Dashboard'da environment variable'ları güncelle
2. Google Cloud Console'da OAuth redirect URL'ini güncelle
3. Yeniden deploy et
