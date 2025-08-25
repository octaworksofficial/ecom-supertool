import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Global bot durumu
let botInterval = null
let botStatusId = null

export async function POST() {
  try {
    let botStatus = await prisma.botStatus.findFirst()
    
    if (!botStatus) {
      botStatus = await prisma.botStatus.create({
        data: {
          isRunning: false,
          currentStatus: 'idle',
          currentMessage: 'Bot durdu'
        }
      })
    }
    
    if (botStatus.isRunning) {
      return NextResponse.json({
        success: false,
        message: 'Bot zaten çalışıyor',
        status: 'already_running'
      })
    }

    // Ayarları getir
    const settings = await prisma.trendyolSettings.findFirst()
    if (!settings || !settings.isActive) {
      await updateBotStatus(botStatus.id, 'error', 'Bot ayarları aktif değil')
      return NextResponse.json({
        success: false,
        message: 'Bot ayarları aktif değil',
        status: 'inactive'
      })
    }

    // Bot durumunu güncelle
    await prisma.botStatus.update({
      where: { id: botStatus.id },
      data: {
        isRunning: true,
        currentStatus: 'starting',
        currentMessage: 'Bot başlatılıyor...',
        startedAt: new Date(),
        lastCheck: new Date()
      }
    })

    botStatusId = botStatus.id

    // Bot'u başlat
    await startBot(settings, botStatus.id)
    
    return NextResponse.json({
      success: true,
      message: `Bot başlatıldı. ${settings.checkInterval} saniye aralıklarla çalışacak.`,
      status: 'running',
      checkInterval: settings.checkInterval
    })
  } catch (error) {
    console.error('❌ Bot başlatma hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function updateBotStatus(statusId, status, message) {
  try {
    await prisma.botStatus.update({
      where: { id: statusId },
      data: {
        currentStatus: status,
        currentMessage: message,
        lastCheck: new Date()
      }
    })
    
    await prisma.botActivity.create({
      data: {
        status,
        message,
        success: !status.includes('error')
      }
    })
    
    console.log(`📊 Bot Status: ${status} - ${message}`)
  } catch (error) {
    console.error('❌ Bot status güncellenemedi:', error)
  }
}

async function startBot(settings, botStatusId) {
  console.log(`⏱️ Bot ${settings.checkInterval} saniye aralıklarla başlatıldı`)
  
  await updateBotStatus(botStatusId, 'waiting', 'Bot çalışmaya başladı')
  
  // İlk çalıştırmayı hemen yap
  await processNextQuestion(settings, botStatusId)
  
  // Belirli aralıklarla tekrarla
  botInterval = setInterval(async () => {
    try {
      // Bot durumunu kontrol et
      const botStatus = await prisma.botStatus.findUnique({
        where: { id: botStatusId }
      })
      
      if (!botStatus || !botStatus.isRunning) {
        console.log('🛑 Bot durdurulmuş')
        clearInterval(botInterval)
        botInterval = null
        return
      }
      
      await processNextQuestion(settings, botStatusId)
      
    } catch (error) {
      console.error('❌ Bot döngü hatası:', error)
      await updateBotStatus(botStatusId, 'error', `Hata: ${error.message}`)
    }
  }, settings.checkInterval * 1000)
}

// ANA FONKSİYON: Tablodaki soruları al ve quickAnswerQuestion çağır
async function processNextQuestion(settings, botStatusId) {
  try {
    await updateBotStatus(botStatusId, 'checking', 'Tablodaki sorular kontrol ediliyor...')
    
    // Frontend'deki mevcut soruları çek
    const questionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trendyol-questions`)
    
    if (!questionsResponse.ok) {
      await updateBotStatus(botStatusId, 'error', 'Tablodaki sorular alınamadı')
      return
    }
    
    const allQuestions = await questionsResponse.json()
    
    // Yanıtsız soruları filtrele (status: pending olan)
    const unansweredQuestions = allQuestions.filter(q => 
      q.status === 'pending' && 
      !q.hasAnswer && 
      !q.answered
    )
    
    console.log('📋 Soru durumu:', {
      total: allQuestions.length,
      unanswered: unansweredQuestions.length
    })
    
    if (unansweredQuestions.length === 0) {
      await updateBotStatus(botStatusId, 'no_questions', 'Yanıtsız soru bulunamadı')
      
      setTimeout(async () => {
        const nextCheck = new Date(Date.now() + (settings.checkInterval * 1000))
        await updateBotStatus(botStatusId, 'waiting', `Sonraki kontrol: ${nextCheck.toLocaleTimeString('tr-TR')}`)
      }, 2000)
      
      return
    }
    
    // İlk yanıtsız soruyu al
    const question = unansweredQuestions[0]
    
    await updateBotStatus(botStatusId, 'processing', `Soru işleniyor: "${question.questionText?.substring(0, 40)}..."`)
    
    console.log('🎯 İşlenecek soru:', {
      id: question.id,
      text: question.questionText?.substring(0, 100)
    })
    
    // Frontend'deki quickAnswerQuestion fonksiyonunu çağır
    await callQuickAnswerQuestion(question, settings, botStatusId)
    
  } catch (error) {
    console.error('❌ Soru işleme hatası:', error)
    await updateBotStatus(botStatusId, 'error', `İşlem hatası: ${error.message}`)
  }
}

// Frontend'deki quickAnswerQuestion fonksiyonunun aynısı
async function callQuickAnswerQuestion(question, settings, botStatusId) {
  try {
    await updateBotStatus(botStatusId, 'ai_generating', 'AI yanıt üretiliyor...')
    
    // 1. AI'dan yanıt al
    const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/openai/generate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: question.questionText,
        productName: question.productName,
        customerName: question.customerName,
        settings: settings
      })
    })
    
    const aiData = await aiResponse.json()
    
    if (!aiData.success) {
      throw new Error(aiData.error || 'AI yanıt üretilemedi')
    }
    
    await updateBotStatus(botStatusId, 'sending_answer', 'Yanıt Trendyol\'a gönderiliyor...')
    
    // 2. Yanıtı Trendyol'a gönder
    const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trendyol/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questionId: question.id, 
        customAnswer: aiData.answer,
        template: settings.answerTemplate,
        settings: settings
      })
    })
    
    const sendData = await sendResponse.json()
    
    if (!sendData.success) {
      throw new Error(sendData.error || 'Yanıt gönderilemedi')
    }
    
    await updateBotStatus(botStatusId, 'success', `✅ Yanıt gönderildi! "${question.questionText?.substring(0, 30)}..."`)
    
    console.log('✅ Bot başarıyla yanıtladı:', {
      questionId: question.id,
      answerLength: aiData.answer.length
    })
    
    // Başarılı işlem sonrası bekleme
    setTimeout(async () => {
      const nextCheck = new Date(Date.now() + (settings.checkInterval * 1000))
      await updateBotStatus(botStatusId, 'waiting', `Sonraki kontrol: ${nextCheck.toLocaleTimeString('tr-TR')}`)
    }, 3000)
    
  } catch (error) {
    console.error('❌ QuickAnswer hatası:', error)
    await updateBotStatus(botStatusId, 'error', `Yanıt hatası: ${error.message}`)
  }
}

// Bot durdurma
export async function stopBot() {
  try {
    if (botInterval) {
      clearInterval(botInterval)
      botInterval = null
    }
    
    const botStatus = await prisma.botStatus.findFirst()
    if (botStatus) {
      await prisma.botStatus.update({
        where: { id: botStatus.id },
        data: { 
          isRunning: false,
          currentStatus: 'stopped',
          currentMessage: 'Bot durduruldu'
        }
      })
    }
    
    console.log('⏹️ Bot durduruldu')
    return { success: true }
  } catch (error) {
    console.error('❌ Bot durdurulamadı:', error)
    return { success: false, error: error.message }
  }
}

// Bot durumu kontrol
export async function getBotStatus() {
  try {
    const botStatus = await prisma.botStatus.findFirst()
    return {
      isRunning: botStatus?.isRunning || false,
      currentStatus: botStatus?.currentStatus || 'idle',
      currentMessage: botStatus?.currentMessage || 'Bot durdu',
      hasInterval: !!botInterval,
      lastCheck: botStatus?.lastCheck,
      startedAt: botStatus?.startedAt
    }
  } catch (error) {
    console.error('❌ Bot status alınamadı:', error)
    return {
      isRunning: false,
      currentStatus: 'error',
      currentMessage: 'Status alınamadı',
      hasInterval: false
    }
  }
}

// Frontend'de fetchQuestions fonksiyonunun sonuna ekleyin:
const fetchQuestions = async () => {
  try {
    // ... mevcut kod ...
    
    if (data.success) {
      const questions = data.questions || []
      setQuestions(questions)
      
      // Bot'a mevcut soruları bildir
      await fetch('/api/trendyol-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questions: questions
        })
      })
      
      // ... geri kalan kod ...
    }
  } catch (error) {
    // ... error handling ...
  }
}