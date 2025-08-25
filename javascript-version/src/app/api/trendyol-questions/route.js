import { NextResponse } from 'next/server'

// Global state - Frontend'deki questions state'ini taklit eder
let currentQuestions = []

export async function GET() {
  try {
    console.log('📋 Mevcut tablodaki sorular isteniyor...')
    
    // Frontend'den mevcut soruları döndür
    console.log('📦 Tablodaki sorular:', {
      total: currentQuestions.length,
      unanswered: currentQuestions.filter(q => !q.hasAnswer).length
    })
    
    return NextResponse.json(currentQuestions)
    
  } catch (error) {
    console.error('❌ Mevcut sorular alınamadı:', error)
    return NextResponse.json([])
  }
}

// Frontend'den soruları güncelleme için POST endpoint
export async function POST(request) {
  try {
    const { questions } = await request.json()
    
    console.log('🔄 Tablodaki sorular güncelleniyor:', {
      newTotal: questions.length,
      unanswered: questions.filter(q => !q.hasAnswer).length
    })
    
    currentQuestions = questions
    
    return NextResponse.json({ success: true, updated: questions.length })
    
  } catch (error) {
    console.error('❌ Sorular güncellenemedi:', error)
    return NextResponse.json({ error: 'Sorular güncellenemedi' }, { status: 500 })
  }
}