import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Trendyol ayarlarını getir
export async function GET() {
  try {
    let settings = await prisma.trendyolSettings.findFirst()
    
    console.log('🔍 DB\'den çekilen RAW settings:', settings)
    console.log('🔍 answerTemplate field:', settings?.answerTemplate)
    
    if (!settings) {
      settings = await prisma.trendyolSettings.create({
        data: {
          sellerId: '',
          apiKey: '',
          secretKey: '',
          checkInterval: 30,
          openaiApiKey: '',
          openaiModel: 'gpt-4o',
          assistantId: '',
          isActive: false,
          openaiMaxTokens: 1000,
          openaiTemperature: 0.7,
          answerTemplate: "Merhaba,\n\nSorunuz için teşekkür ederiz. \n\n{answer}\n\nBaşka sorularınız için her zaman buradayız.\n\nİyi günler dileriz."
        }
      })
      console.log('🆕 Yeni settings oluşturuldu:', settings)
    }

    console.log('📤 Frontend\'e gönderilen data:', {
      ...settings,
      answerTemplate: settings.answerTemplate?.substring(0, 100) + '...'
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('❌ GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Trendyol ayarlarını güncelle
export async function POST(request) {
  try {
    const data = await request.json()
    
    console.log('🔧 Trendyol Settings API çağrıldı')
    console.log('📥 Gelen data:', {
      sellerId: data.sellerId ? `${data.sellerId.substring(0, 8)}...` : 'boş',
      apiKey: data.apiKey ? `${data.apiKey.substring(0, 8)}...` : 'boş',
      secretKey: data.secretKey ? `${data.secretKey.substring(0, 8)}...` : 'boş',
      checkInterval: data.checkInterval,
      openaiApiKey: data.openaiApiKey ? `${data.openaiApiKey.substring(0, 8)}...` : 'boş',
      openaiModel: data.openaiModel,
      assistantId: data.assistantId ? `${data.assistantId.substring(0, 8)}...` : 'boş',
      isActive: data.isActive,
      modelTemp: data.open,
      openaiMaxTokens : data.openaiMaxTokens || 1000,
      openaiTemperature : data.openaiTemperature || 0.7,
      answerTemplate: data.answerTemplate || `{answer}`
    })
    
    // İlk kayıt varsa güncelle, yoksa oluştur
    const existingSettings = await prisma.trendyolSettings.findFirst()
    
    if (existingSettings) {
      console.log('🔄 Mevcut ayarlar bulundu, güncelleniyor...', {
        existingId: existingSettings.id,
        currentIsActive: existingSettings.isActive
      })
    } else {
      console.log('📝 Yeni ayar kaydı oluşturuluyor...')
    }
    
    let settings

    if (existingSettings) {
      try {
        console.log('💾 Database update işlemi başlatılıyor...')
        settings = await prisma.trendyolSettings.update({
          where: { id: existingSettings.id },
          data: {
            sellerId: data.sellerId || '',
            apiKey: data.apiKey || '',
            secretKey: data.secretKey || '',
            checkInterval: data.checkInterval || 30,
            openaiApiKey: data.openaiApiKey || '',
            openaiModel: data.openaiModel || 'gpt-4o',
            assistantId: data.assistantId || '',
            isActive: data.isActive || false,
            updatedAt: new Date(),
            openaiMaxTokens: data.openaiMaxTokens || 1000,
            openaiTemperature: data.openaiTemperature || 0.7,
            answerTemplate: data.answerTemplate || `{answer}`
          }
        })
        console.log('✅ Trendyol ayarları başarıyla güncellendi:', {
          id: settings.id,
          isActive: settings.isActive,
          checkInterval: settings.checkInterval,
          updatedAt: settings.updatedAt
        })
      } catch (updateError) {
        console.error('❌ Database update hatası:', updateError)
        throw updateError
      }
    } else {
      try {
        console.log('💾 Database create işlemi başlatılıyor...')
        settings = await prisma.trendyolSettings.create({
          data: {
            sellerId: data.sellerId || '',
            apiKey: data.apiKey || '',
            secretKey: data.secretKey || '',
            checkInterval: data.checkInterval || 30,
            openaiApiKey: data.openaiApiKey || '',
            openaiModel: data.openaiModel || 'gpt-4o',
            assistantId: data.assistantId || '',
            isActive: data.isActive || false,
            openaiMaxTokens: data.openaiMaxTokens || 1000,
            openaiTemperature: data.openaiTemperature || 0.7,
            answerTemplate: data.answerTemplate || `{answer}`
          }
        })
        console.log('✅ Yeni Trendyol ayarları başarıyla oluşturuldu:', {
          id: settings.id,
          isActive: settings.isActive,
          checkInterval: settings.checkInterval,
          createdAt: settings.createdAt
        })
      } catch (createError) {
        console.error('❌ Database create hatası:', createError)
        throw createError
      }
    }

    console.log('🎉 Trendyol ayarları işlemi tamamlandı!')

    return NextResponse.json({
      success: true,
      message: 'Trendyol ayarları başarıyla kaydedildi',
      settings
    })
  } catch (error) {
    console.error('💥 Trendyol ayarları kaydedilirken genel hata:', error)
    console.error('📊 Hata detayları:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 200) + '...'
    })
    
return NextResponse.json(
      { error: 'Ayarlar kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}
