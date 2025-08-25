import { NextResponse } from 'next/server'

import prisma from '@/libs/prisma'

const defaultTemplates = [
  {
    name: 'Hoş Geldin Mesajı',
    subject: 'Hoş Geldiniz! - {company}',
    content: `<h2>Merhaba {contactName},</h2>
    <p><strong>{company}</strong> firmasına hoş geldiniz!</p>
    <p>Size en iyi hizmeti sunmak için buradayız. Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin.</p>
    <p>Saygılarımızla,<br>Ecom SuperTool Ekibi</p>`,
    isHtml: true,
    category: 'Karşılama'
  },
  {
    name: 'Ürün Tanıtımı',
    subject: 'Yeni Ürünlerimiz - Özel Fırsat!',
    content: `<h2>Değerli {contactName},</h2>
    <p>Yeni ürün gamımızı tanıtmaktan mutluluk duyuyoruz!</p>
    <ul>
      <li>✨ Yeni özellikler</li>
      <li>💰 Özel indirimler</li>
      <li>🚀 Hızlı teslimat</li>
    </ul>
    <p>Detaylar için hemen iletişime geçin!</p>
    <p>İyi günler dileriz.</p>`,
    isHtml: true,
    category: 'Pazarlama'
  },
  {
    name: 'Takip Mesajı',
    subject: 'Görüşmemizin Takibi',
    content: `Merhaba {contactName},

Geçen hafta {company} ile yaptığımız görüşme için teşekkür ederiz.

Konuştuğumuz konular:
- Ürün detayları
- Fiyat bilgisi
- Teslimat süreci

Başka sorularınız varsa lütfen bizimle iletişime geçin.

Saygılarımızla,
Ecom SuperTool`,
    isHtml: false,
    category: 'Takip'
  }
]

// POST - Default template'leri veritabanına ekle
export async function POST() {
  try {
    // Önce mevcut template sayısını kontrol et
    const existingCount = await prisma.emailTemplate.count()
    
    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Template\'ler zaten mevcut' },
        { status: 200 }
      )
    }

    // Default template'leri ekle
    const createdTemplates = await prisma.emailTemplate.createMany({
      data: defaultTemplates
    })

    return NextResponse.json({
      message: `${createdTemplates.count} default template eklendi`,
      count: createdTemplates.count
    })
  } catch (error) {
    console.error('Default template ekleme hatası:', error)
    
return NextResponse.json(
      { error: 'Default template\'ler eklenemedi' },
      { status: 500 }
    )
  }
}
