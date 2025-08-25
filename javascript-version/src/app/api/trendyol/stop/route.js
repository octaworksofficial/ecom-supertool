import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Veritabanında bot durumunu durdur
    const botStatus = await prisma.botStatus.findFirst()
    if (botStatus) {
      await prisma.botStatus.update({
        where: { id: botStatus.id },
        data: { 
          isRunning: false,
          currentStatus: 'stopped',
          currentMessage: 'Bot manuel olarak durduruldu'
        }
      })
    }
    
    console.log('⏹️ Trendyol bot durduruldu')
    
    return NextResponse.json({
      success: true,
      message: 'Trendyol bot başarıyla durduruldu',
      status: 'stopped'
    })
  } catch (error) {
    console.error('❌ Bot durdurulurken hata:', error)
    return NextResponse.json(
      { error: 'Bot durdurulurken hata oluştu' },
      { status: 500 }
    )
  }
}