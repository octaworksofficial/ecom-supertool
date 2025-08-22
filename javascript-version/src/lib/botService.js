// Global bot state ve interval yönetimi
let botState = {
  isRunning: false,
  startedAt: null,
  settings: null,
  intervalId: null,
  currentActivity: null, // Bot'un şu anki aktivitesi
  nextCheckAt: null, // Sonraki kontrol zamanı
  stats: {
    totalProcessed: 0,
    successfulAnswers: 0,
    failedAnswers: 0,
    lastProcessedAt: null
  }
}

let processingQueue = new Set() // İşlenen soru ID'lerini takip et

// Bot durumunu al
export function getBotState() {
  // intervalId'yi çıkar (circular reference nedeniyle JSON serialize edilemez)
  const { intervalId, ...cleanState } = botState
  return {
    ...cleanState,
    hasInterval: !!intervalId // Interval varlığını boolean olarak göster
  }
}

// Bot'u başlat
export function startBot(settings) {
  if (botState.isRunning) {
    clearInterval(botState.intervalId)
  }
  
  botState = {
    isRunning: true,
    startedAt: new Date().toISOString(),
    settings: settings,
    intervalId: null,
    currentActivity: "Bot başlatılıyor...",
    nextCheckAt: new Date(Date.now() + 5000).toISOString(),
    stats: {
      totalProcessed: 0,
      successfulAnswers: 0,
      failedAnswers: 0,
      lastProcessedAt: null
    }
  }
  
  // Interval her zaman başlat (soru kontrolü için)
  const intervalMs = (settings.checkInterval || 180) * 1000 // Varsayılan 3 dakika
  
  if (settings.autoAnswer) {
    console.log(`🤖 Bot automation started - auto-answering every ${settings.checkInterval || 180} seconds`)
  } else {
    console.log(`👁️ Bot monitoring started - checking questions every ${settings.checkInterval || 180} seconds (no auto-answer)`)
  }
  
  botState.intervalId = setInterval(async () => {
    await processNextQuestion()
  }, intervalMs)
  
  // İlk kontrolü hemen yap
  setTimeout(() => processNextQuestion(), 5000) // 5 saniye sonra başla
  
  return getBotState() // Clean state return et (intervalId hariç)
}

// Bot'u durdur
export function stopBot() {
  if (botState.intervalId) {
    clearInterval(botState.intervalId)
  }
  
  console.log(`🛑 Bot stopped - Processed ${botState.stats.totalProcessed} questions`)
  
  botState = {
    isRunning: false,
    startedAt: null,
    settings: null,
    intervalId: null,
    currentActivity: null,
    nextCheckAt: null,
    stats: {
      totalProcessed: 0,
      successfulAnswers: 0,
      failedAnswers: 0,
      lastProcessedAt: null
    }
  }
  
  return getBotState() // Clean state return et
}

// Bir sonraki soruyu işle
async function processNextQuestion() {
  if (!botState.isRunning) {
    return
  }
  
  try {
    // Activity güncelle
    botState.currentActivity = "Bot soruları çekiyor..."
    
    console.log('\n🔍 ===== OTOMATIK SORU KONTROLÜ =====')
    console.log('⏱️  Check Time:', new Date().toISOString())
    console.log('📊 Bot Stats:', botState.stats)
    console.log('🤖 Auto Answer:', botState.settings?.autoAnswer ? 'ENABLED' : 'DISABLED')
    console.log('==================================\n')
    
    // Soruları al
    const questions = await fetchPendingQuestions()
    
    // Sonraki kontrol zamanını güncelle
    const intervalMs = (botState.settings?.checkInterval || 180) * 1000
    botState.nextCheckAt = new Date(Date.now() + intervalMs).toISOString()
    
    if (!questions || questions.length === 0) {
      console.log('📝 No pending questions found')
      const nextMinutes = Math.round(intervalMs / 60000)
      botState.currentActivity = `Soru bulunamadı - ${nextMinutes} dakika içinde tekrar kontrol edecek`
      return
    }
    
    // İşlenmemiş en eski soruyu bul
    const unprocessedQuestions = questions
      .filter(q => q.status === 'pending' || q.status === 'WAITING_FOR_ANSWER')
      .filter(q => !processingQueue.has(q.id))
      .sort((a, b) => new Date(a.createdAt || a.creationDate) - new Date(b.createdAt || b.creationDate))
    
    if (unprocessedQuestions.length === 0) {
      console.log('📝 No unprocessed questions found')
      const nextMinutes = Math.round(intervalMs / 60000)
      botState.currentActivity = `${questions.length} soru mevcut ama tümü işlenmiş - ${nextMinutes} dakika içinde tekrar kontrol edecek`
      return
    }
    
    const questionToProcess = unprocessedQuestions[0]
    
    console.log(`🎯 Found question: ${questionToProcess.id}`)
    console.log(`📅 Question date: ${questionToProcess.createdAt || questionToProcess.creationDate}`)
    
    // Otomatik yanıtlama kapalıysa sadece loglama yap
    if (!botState.settings?.autoAnswer) {
      console.log(`👁️ Auto-answer disabled - Only monitoring (${unprocessedQuestions.length} pending questions)`)
      const nextMinutes = Math.round(intervalMs / 60000)
      botState.currentActivity = `${unprocessedQuestions.length} bekleyen soru bulundu (sadece izleme modu) - ${nextMinutes} dakika içinde tekrar kontrol edecek`
      return
    }
    
    // Otomatik yanıtlama açıksa işle
    console.log(`🤖 Auto-answer enabled - Processing question`)
    botState.currentActivity = `Soru ${questionToProcess.id} için AI yanıt hazırlanıyor...`
    
    // İşleme kur
    processingQueue.add(questionToProcess.id)
    
    // AI yanıt üret ve gönder
    await processQuestionWithAI(questionToProcess)
    
  } catch (error) {
    console.error('❌ Auto-process error:', error)
    botState.stats.failedAnswers++
  }
}

// Bekleyen soruları al
async function fetchPendingQuestions() {
  try {
    const settings = botState.settings
    if (!settings?.supplierId || !settings?.apiKey || !settings?.apiSecret) {
      console.log('⚠️  No API credentials for fetching questions')
      return []
    }
    
    // Direkt Trendyol API'sine çağrı
    const credentials = Buffer.from(`${settings.apiKey}:${settings.apiSecret}`).toString('base64')
    const url = `https://apigw.trendyol.com/integration/qna/sellers/${settings.supplierId}/questions?page=0&size=50&orderByField=CreatedDate`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrendyolSupplierApp/1.0 (Ecom-SuperTool)',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('❌ Trendyol Questions API Error:', response.statusText)
      return []
    }
    
    const data = await response.json()
    
    // Trendyol API yanıt formatını kontrol et
    const questions = data.content || data.questions || []
    
    console.log(`📋 Fetched ${questions.length} questions from Trendyol API`)
    
    return questions.map(q => ({
      id: q.id,
      questionText: q.questionText || q.text,
      productName: q.productName,
      customerName: q.customerName,
      createdAt: q.createdAt || q.creationDate,
      status: q.status || (q.answer ? 'answered' : 'pending')
    }))
    
  } catch (error) {
    console.error('❌ Error fetching questions:', error)
    return []
  }
}

// AI ile soruyu işle
async function processQuestionWithAI(question) {
  try {
    console.log(`\n🤖 ===== AI PROCESSING: ${question.id} =====`)
    
    botState.stats.totalProcessed++
    
    // 1. AI yanıt üret
    console.log('🧠 Generating AI answer...')
    botState.currentActivity = `Soru ${question.id} için AI yanıt üretiliyor...`
    
    // OpenAI API'sine direkt çağrı yap
    const aiAnswer = await generateAIAnswer(question, botState.settings)
    
    if (!aiAnswer) {
      throw new Error('AI answer generation failed')
    }
    
    console.log(`✅ AI answer generated (${aiAnswer.length} chars)`)
    
    // 2. Yanıtı Trendyol'a gönder
    console.log('📤 Sending answer to Trendyol...')
    botState.currentActivity = `Soru ${question.id} için yanıt Trendyol'a gönderiliyor...`
    
    const success = await sendAnswerToTrendyol(
      botState.settings.supplierId,
      botState.settings.apiKey,
      botState.settings.apiSecret,
      question.id,
      aiAnswer,
      botState.settings.answerTemplate
    )
    
    if (!success) {
      throw new Error('Answer sending failed')
    }
    
    console.log(`✅ Answer sent successfully`)
    
    // Başarılı tamamlama
    botState.stats.successfulAnswers++
    botState.stats.lastProcessedAt = new Date().toISOString()
    const nextMinutes = Math.round(((botState.settings?.checkInterval || 180) * 1000) / 60000)
    botState.currentActivity = `Soru ${question.id} başarıyla yanıtlandı - ${nextMinutes} dakika içinde tekrar kontrol edecek`
    
    // İstatistikleri güncelle
    botState.stats.successfulAnswers++
    botState.stats.lastProcessedAt = new Date().toISOString()
    
    console.log(`📊 Updated stats: ${botState.stats.successfulAnswers}/${botState.stats.totalProcessed} successful`)
    console.log('==========================================\n')
    
    // İşlem tamamlandı, queue'dan çıkar
    setTimeout(() => {
      processingQueue.delete(question.id)
    }, 60000) // 1 dakika sonra queue'dan çıkar
    
  } catch (error) {
    console.error(`❌ Failed to process question ${question.id}:`, error)
    botState.stats.failedAnswers++
    botState.currentActivity = `Soru ${question.id} işlenirken hata oluştu: ${error.message}`
    
    // Başarısız işlem sonrası queue'dan çıkar
    setTimeout(() => {
      processingQueue.delete(question.id)
    }, 30000) // 30 saniye sonra tekrar deneyebilsin
    
    throw error
  }
}

// OpenAI API'sine direkt çağrı
async function generateAIAnswer(question, settings) {
  try {
    if (!settings.openaiApiKey) {
      throw new Error('OpenAI API key missing')
    }
    
    const prompt = `Sen bir e-ticaret müşteri hizmetleri asistanısın. Aşağıdaki müşteri sorusuna profesyonel, yardımcı ve samimi bir şekilde yanıt ver.

Müşteri Sorusu: ${question.questionText}

Ürün: ${question.productName || 'Belirtilmemiş'}
Müşteri: ${question.customerName || 'Anonim'}

Yanıtın:
- Kısa ve öz olsun
- Müşteriye yardımcı olsun
- Profesyonel ama samimi bir ton kullan
- Gerekirse ek bilgi iste
- Trendyol'da satış yapan bir mağaza perspektifinden yanıtla`

    if (settings.openaiAssistantId) {
      // Assistant kullan
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      })
      
      if (!response.ok) {
        throw new Error(`Thread creation failed: ${response.statusText}`)
      }
      
      const thread = await response.json()
      
      // Run oluştur
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: settings.openaiAssistantId
        })
      })
      
      if (!runResponse.ok) {
        throw new Error(`Run creation failed: ${runResponse.statusText}`)
      }
      
      const run = await runResponse.json()
      
      // Run tamamlanmasını bekle
      let runStatus = run
      let attempts = 0
      while ((runStatus.status === 'queued' || runStatus.status === 'in_progress') && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${settings.openaiApiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        })
        
        runStatus = await statusResponse.json()
      }
      
      if (runStatus.status !== 'completed') {
        throw new Error(`Run failed with status: ${runStatus.status}`)
      }
      
      // Mesajları al
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${settings.openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      
      const messages = await messagesResponse.json()
      const assistantMessage = messages.data.find(msg => msg.role === 'assistant')
      
      if (!assistantMessage) {
        throw new Error('No assistant response found')
      }
      
      return assistantMessage.content[0].text.value
      
    } else {
      // Normal Chat Completion kullan
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: settings.openaiModel || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Sen bir e-ticaret müşteri hizmetleri uzmanısın. Müşteri sorularına profesyonel, yardımcı ve samimi bir şekilde yanıt veriyorsun.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: settings.openaiMaxTokens || 1000,
          temperature: settings.openaiTemperature || 0.7
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      return data.choices[0].message.content
    }
    
  } catch (error) {
    console.error('❌ AI Answer generation error:', error)
    return null
  }
}

// Trendyol API'ye yanıt gönder
async function sendAnswerToTrendyol(supplierId, apiKey, apiSecret, questionId, answerText, template) {
  try {
    // Template uygula
    let finalAnswer = answerText
    if (template && template.includes('{answer}')) {
      finalAnswer = template.replace('{answer}', answerText)
    }
    
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const url = `https://apigw.trendyol.com/integration/qna/sellers/${supplierId}/questions/${questionId}/answers`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrendyolSupplierApp/1.0 (Ecom-SuperTool)',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: finalAnswer,
        hasPrivateInfo: false
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Trendyol Answer API Error:', errorText)
      return false
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Trendyol Answer error:', error)
    return false
  }
}

// İstatistikleri al
export function getBotStats() {
  return {
    ...botState.stats,
    isRunning: botState.isRunning,
    uptime: botState.startedAt ? Date.now() - new Date(botState.startedAt).getTime() : 0,
    queueSize: processingQueue.size
  }
}
