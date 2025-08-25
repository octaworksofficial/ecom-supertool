import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Veritabanından bot durumunu al
    const botStatus = await prisma.botStatus.findFirst()
    
    // Son 5 aktiviteyi al
    const recentActivities = await prisma.botActivity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    console.log('📊 Status API - Bot Status:', {
      isRunning: botStatus?.isRunning || false,
      currentMessage: botStatus?.currentMessage || 'Bot durdu',
      currentStatus: botStatus?.currentStatus || 'idle'
    })
    
    return NextResponse.json({
      isRunning: botStatus?.isRunning || false,
      currentStatus: botStatus?.currentStatus || 'idle',
      currentMessage: botStatus?.currentMessage || 'Bot durdu',
      lastCheck: botStatus?.lastCheck?.toISOString() || null,
      startedAt: botStatus?.startedAt?.toISOString() || null,
      totalQuestions: 0,
      answeredQuestions: 0,
      recentActivities: recentActivities.map(activity => ({
        status: activity.status,
        message: activity.message,
        success: activity.success,
        createdAt: activity.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('❌ Status kontrol hatası:', error)
    return NextResponse.json(
      { error: 'Status kontrol edilirken hata oluştu' },
      { status: 500 }
    )
  }
}
