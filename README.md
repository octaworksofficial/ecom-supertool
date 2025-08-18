# 🛒 Ecom SuperTool - E-Ticaret Müşteri Yönetim Sistemi

Ecom SuperTool, e-ticaret işletmeleri için geliştirilmiş kapsamlı bir müşteri yönetim sistemidir. Next.js, React ve Material-UI teknolojileri kullanılarak oluşturulmuş modern bir admin paneli sunar.

## ✨ Özellikler

### 🎯 Müşteri Yönetimi
- **Kapsamlı Müşteri Profilleri**: Şirket bilgileri, iletişim detayları, adres yönetimi
- **Çoklu Kaynak Desteği**: Manuel giriş, Google Maps, Excel import, Website entegrasyonu
- **Akıllı Dublicasyon Kontrolü**: Email ve telefon bazlı otomatik tekrar kontrolü
- **Gelişmiş Filtreleme**: Kaynak, şehir, durum bazlı filtreleme seçenekleri

### 📊 Etkileşim Takibi
- **Etkileşim Geçmişi**: Telefon, email, toplantı ve not kayıtları
- **Görsel İkonlar**: Her etkileşim türü için özel renkli ikonlar
- **Zaman Çizelgesi**: Kronolojik etkileşim takibi
- **Hızlı Not Ekleme**: Müşteri bazlı not yönetimi

### 🌐 Wix Entegrasyonu
- **Otomatik Müşteri Çekme**: Wix Contacts API v4 entegrasyonu
- **Gelişmiş Filtreleme**: Şehir, ülke, tarih bazlı filtreleme
- **Toplu İşlemler**: Seçili müşterileri sisteme aktarma
- **Logo Entegrasyonu**: Wix branding ile tutarlı arayüz

### 🗺️ Google Maps Desteği (Gelecek Özellik)
- Harita bazlı müşteri görüntüleme
- Konum bazlı filtreleme
- Adres doğrulama

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 18+ 
- npm, yarn veya pnpm
- Git

### 1. Projeyi İndirin
```bash
git clone https://github.com/octaworksofficial/ecom-supertool.git
cd ecom-supertool
```

### 2. Bağımlılıkları Yükleyin
```bash
# npm kullanarak
npm install

# yarn kullanarak  
yarn install

# pnpm kullanarak
pnpm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Veritabanı
DATABASE_URL="file:./dev.db"

# Wix API Ayarları (İsteğe bağlı)
WIX_API_KEY="your_wix_api_key"
WIX_SITE_ID="your_wix_site_id"

# Next.js Ayarları
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Veritabanını Hazırlayın
```bash
# Prisma client oluştur
npx prisma generate

# Veritabanını oluştur
npx prisma db push

# Örnek veri ekle (isteğe bağlı)
npx prisma db seed
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
# npm kullanarak
npm run dev

# yarn kullanarak
yarn dev

# pnpm kullanarak  
pnpm dev
```

### 6. Tarayıcıda Açın
```
http://localhost:3000
```

## 📁 Proje Yapısı

```
ecom-supertool/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # Dashboard layout grubu
│   │   │   ├── musteri-yonetimi/     # Müşteri yönetim sayfası
│   │   │   └── website-musterileri/  # Website müşterileri sayfası
│   │   ├── api/                      # API rotaları
│   │   │   ├── customers/            # Müşteri CRUD API
│   │   │   └── wix/                  # Wix entegrasyon API
│   │   └── globals.css               # Global stiller
│   ├── components/                   # Yeniden kullanılabilir bileşenler
│   ├── @core/                        # Temel sistem bileşenleri
│   ├── @layouts/                     # Layout bileşenleri
│   └── @menu/                        # Menu yapılandırması
├── prisma/                           # Veritabanı şeması ve migrations
├── public/                           # Statik dosyalar
└── package.json                      # Proje bağımlılıkları
```

## 🗄️ Veritabanı Şeması

### Customer (Müşteri)
- **Temel Bilgiler**: companyName, contactName, email, phone
- **Adres**: address, city, country
- **Meta**: website, source, status, createdAt, updatedAt
- **Maps**: rating, reviewCount, coordinates, categories
- **İlişkiler**: tags, interactions

### CustomerInteraction (Etkileşim)
- **Türler**: CALL, EMAIL, MEETING, NOTE
- **İçerik**: title, description, date
- **İlişki**: Customer'a bağlı

### CustomerTag (Etiket)
- **Etiketleme**: name, color, description
- **Many-to-Many**: Customer ilişkisi

## 🔧 API Endpoints

### Müşteri Yönetimi
```http
GET    /api/customers              # Tüm müşterileri listele
POST   /api/customers              # Yeni müşteri ekle
PUT    /api/customers              # Müşteri güncelle
DELETE /api/customers?id={id}      # Müşteri sil
```

### Etkileşim Yönetimi
```http
GET    /api/customers/{id}/interactions     # Müşteri etkileşimlerini listele
POST   /api/customers/{id}/interactions     # Yeni etkileşim ekle
```

### Wix Entegrasyonu
```http
GET    /api/wix/contacts            # Wix'ten müşterileri çek
POST   /api/wix/import              # Wix müşterilerini içe aktar
```

## 🎨 Kullanılan Teknolojiler

### Frontend
- **React 18** - Modern UI kütüphanesi
- **Next.js 14** - Full-stack React framework
- **Material-UI (MUI)** - UI component kütüphanesi
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Tip güvenli veritabanı client
- **SQLite** - Hafif veritabanı (production'da PostgreSQL önerilir)

### Entegrasyonlar
- **Wix Contacts API v4** - Müşteri verisi senkronizasyonu
- **Google Maps API** - Konum servisleri (gelecek)

## 🔐 Güvenlik Özellikleri

- **Input Validation**: Tüm kullanıcı girdileri doğrulanır
- **SQL Injection Koruması**: Prisma ORM ile güvenli sorgular
- **Rate Limiting**: API isteklerinde hız sınırlama
- **CORS Koruması**: Güvenli kaynak paylaşımı

## 📊 Performans

- **SSR/SSG**: Next.js ile sunucu tarafı renderİng
- **Lazy Loading**: Bileşen bazlı kod bölmesi
- **Caching**: API yanıtlarında akıllı önbellekleme
- **Optimized Images**: Next.js Image bileşeni

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🆘 Destek

- **Issues**: [GitHub Issues](https://github.com/octaworksofficial/ecom-supertool/issues)
- **Documentation**: [Wiki](https://github.com/octaworksofficial/ecom-supertool/wiki)
- **Email**: support@octaworks.com

## 🎯 Roadmap

### v2.0.0 (Gelecek)
- [ ] Google Maps entegrasyonu
- [ ] Bulk email gönderimi
- [ ] Rapor ve analytics
- [ ] Mobile aplikasyon
- [ ] Multi-tenant desteği

### v1.1.0 (Yakında)
- [ ] Excel export/import
- [ ] Gelişmiş filtreleme
- [ ] Otomatik backup
- [ ] Email şablonları

---

**Geliştirici**: [OctaWorks Official](https://github.com/octaworksofficial)  
**Son Güncelleme**: Ağustos 2025  
**Versiyon**: 1.0.0
