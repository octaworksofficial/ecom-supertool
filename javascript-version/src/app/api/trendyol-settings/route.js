import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Trendyol ayarlarını getir
export async function GET() {
  try {
    // İlk kayıt varsa getir, yoksa varsayılan değerlerle oluştur
    let settings = await prisma.trendyolSettings.findFirst()
    
    if (!settings) {
      // Eğer ayar yoksa varsayılan değerlerle oluştur
      settings = await prisma.trendyolSettings.create({
        data: {
          sellerId: '',
          apiKey: '',
          secretKey: '',
          checkInterval: 30,
          openaiApiKey: '',
          openaiModel: 'gpt-4o',
          assistantId: '',
          isActive: false
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Trendyol ayarları getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ayarlar getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// Trendyol ayarlarını güncelle
export async function POST(request) {
  try {
    const data = await request.json()
    
    // İlk kayıt varsa güncelle, yoksa oluştur
    const existingSettings = await prisma.trendyolSettings.findFirst()
    
    let settings
    if (existingSettings) {
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
          updatedAt: new Date()
        }
      })
    } else {
      settings = await prisma.trendyolSettings.create({
        data: {
          sellerId: data.sellerId || '',
          apiKey: data.apiKey || '',
          secretKey: data.secretKey || '',
          checkInterval: data.checkInterval || 30,
          openaiApiKey: data.openaiApiKey || '',
          openaiModel: data.openaiModel || 'gpt-4o',
          assistantId: data.assistantId || '',
          isActive: data.isActive || false
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Trendyol ayarları başarıyla kaydedildi',
      settings
    })
  } catch (error) {
    console.error('Trendyol ayarları kaydedilirken hata:', error)
    return NextResponse.json(
      { error: 'Ayarlar kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}
