import { NextResponse } from 'next/server'
import { getBotState, getBotStats } from '@/lib/botService'

export async function GET() {
  try {
    const botState = getBotState()
    const botStats = getBotStats()
    
    return NextResponse.json({
      success: true,
      isRunning: botState.isRunning,
      startedAt: botState.startedAt,
      currentActivity: botState.currentActivity,
      nextCheckAt: botState.nextCheckAt,
      settings: botState.settings ? {
        supplierId: botState.settings.supplierId,
        autoAnswer: botState.settings.autoAnswer,
        checkInterval: botState.settings.checkInterval,
        hasOpenAI: !!botState.settings.openaiApiKey,
        hasAssistant: !!botState.settings.openaiAssistantId
      } : null,
      stats: botStats,
      lastCheck: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        isRunning: false,
        lastCheck: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
