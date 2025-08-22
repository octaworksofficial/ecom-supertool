import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { questionText, settings, productName, customerName } = body
    
    console.log('\n🤖 ===== OPENAI YANIT ÜRETME =====')
    console.log('📋 Request Data:', { 
      questionLength: questionText?.length,
      hasSettings: !!settings,
      assistantId: settings?.openaiAssistantId || 'none',
      model: settings?.openaiModel || 'default'
    })
    console.log('⏱️  API Call Time:', new Date().toISOString())
    console.log('==================================\n')
    
    // Gerekli alanları kontrol et
    if (!questionText?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Soru metni gerekli' },
        { status: 400 }
      )
    }
    
    if (!settings?.openaiApiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API anahtarı gerekli' },
        { status: 400 }
      )
    }
    
    // OpenAI API isteği hazırla
    const openaiHeaders = {
      'Authorization': `Bearer ${settings.openaiApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    }
    
    let response, aiAnswer
    
    if (settings.openaiAssistantId) {
      // Assistant kullan
      console.log('🤖 Using OpenAI Assistant:', settings.openaiAssistantId)
      
      // Thread oluştur
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: openaiHeaders,
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Müşteri Sorusu: ${questionText}\n\nÜrün: ${productName || 'Belirtilmemiş'}\nMüşteri: ${customerName || 'Anonim'}\n\nLütfen bu soruya profesyonel ve yardımcı bir şekilde yanıt verin.`
          }]
        })
      })
      
      if (!threadResponse.ok) {
        throw new Error(`Thread creation failed: ${threadResponse.statusText}`)
      }
      
      const thread = await threadResponse.json()
      console.log('📝 Thread created:', thread.id)
      
      // Run oluştur
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: openaiHeaders,
        body: JSON.stringify({
          assistant_id: settings.openaiAssistantId
        })
      })
      
      if (!runResponse.ok) {
        throw new Error(`Run creation failed: ${runResponse.statusText}`)
      }
      
      const run = await runResponse.json()
      console.log('🏃 Run created:', run.id)
      
      // Run tamamlanmasını bekle
      let runStatus = run
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: openaiHeaders
        })
        
        runStatus = await statusResponse.json()
        console.log('📊 Run status:', runStatus.status)
      }
      
      if (runStatus.status !== 'completed') {
        throw new Error(`Run failed with status: ${runStatus.status}`)
      }
      
      // Mesajları al
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: openaiHeaders
      })
      
      const messages = await messagesResponse.json()
      const assistantMessage = messages.data.find(msg => msg.role === 'assistant')
      
      if (!assistantMessage) {
        throw new Error('No assistant response found')
      }
      
      aiAnswer = assistantMessage.content[0].text.value
      
    } else {
      // Normal Chat Completion kullan
      console.log('💬 Using Chat Completion with model:', settings.openaiModel)
      
      const prompt = `Sen bir e-ticaret müşteri hizmetleri asistanısın. Aşağıdaki müşteri sorusuna profesyonel, yardımcı ve samimi bir şekilde yanıt ver.

Müşteri Sorusu: ${questionText}

Ürün: ${productName || 'Belirtilmemiş'}
Müşteri: ${customerName || 'Anonim'}

Yanıtın:
- Kısa ve öz olsun
- Müşteriye yardımcı olsun
- Profesyonel ama samimi bir ton kullan
- Gerekirse ek bilgi iste
- Trendyol'da satış yapan bir mağaza perspektifinden yanıtla`

      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        console.error('OpenAI API Error:', errorText)
        throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ Chat Completion successful')
      
      aiAnswer = data.choices[0].message.content
    }
    
    console.log('\n🎉 ===== AI YANIT BAŞARILI =====')
    console.log('📏 Answer Length:', aiAnswer.length)
    console.log('⏱️  Completion Time:', new Date().toISOString())
    console.log('=============================\n')
    
    return NextResponse.json({
      success: true,
      answer: aiAnswer,
      model: settings.openaiModel,
      assistantUsed: !!settings.openaiAssistantId
    })
    
  } catch (error) {
    console.log('\n💥 ===== AI YANIT HATASI =====')
    console.log('❌ Error Type:', error.constructor.name)
    console.log('📝 Error Message:', error.message)
    console.log('📍 Error Stack:', error.stack)
    console.log('⏱️  Error Time:', new Date().toISOString())
    console.log('============================\n')
    
    console.error('OpenAI Generate Answer Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: `AI yanıt üretilemedi: ${error.message}`
      }, 
      { status: 500 }
    )
  }
}
