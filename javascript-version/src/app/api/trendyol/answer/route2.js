import { NextResponse } from 'next/server'

// Trendyol API'ye soru yanıtı göndermek için fonksiyon
async function sendAnswerToTrendyol(supplierId, apiKey, apiSecret, questionId, answerText) {
  try {
    // Basic Auth için credentials
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // Trendyol Answer API URL'si
    const url = `https://apigw.trendyol.com/integration/qna/sellers/${supplierId}/questions/${questionId}/answers`
    
    console.log('Sending answer to Trendyol API:', { 
      supplierId, 
      questionId, 
      answerLength: answerText.length 
    })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrendyolSupplierApp/1.0 (Ecom-SuperTool)',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: answerText,
        hasPrivateInfo: false // Özel bilgi içermiyor
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Trendyol Answer API Error:', errorText)
      throw new Error(`Trendyol API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Answer sent successfully to Trendyol')
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Trendyol Answer API Error:', error)
    throw error
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { questionId, customAnswer, settings } = body
    
    console.log('Answer API called with:', { questionId, answerLength: customAnswer?.length })
    
    // Gerekli alanları kontrol et
    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Soru ID gerekli' },
        { status: 400 }
      )
    }
    
    if (!customAnswer || !customAnswer.trim()) {
      return NextResponse.json(
        { success: false, error: 'Yanıt metni gerekli' },
        { status: 400 }
      )
    }
    
    if (!settings?.supplierId || !settings?.apiKey || !settings?.apiSecret) {
      // API bilgileri eksikse mock response döndür
      console.log('🚫 API credentials missing - sending mock response')
      
      return NextResponse.json({
        success: true,
        message: 'Yanıt başarıyla gönderildi (Mock)',
        questionId,
        answerText: customAnswer.trim(),
        mock: true,
        warning: 'Trendyol API bilgileri eksik. Gerçek yanıt gönderilemedi.'
      })
    }

    // Yanıt template'ini uygula (eğer varsa)
    let finalAnswer = customAnswer.trim()
    if (settings.answerTemplate && settings.answerTemplate.includes('{answer}')) {
      finalAnswer = settings.answerTemplate.replace('{answer}', customAnswer.trim())
    }
    
    // Trendyol API'ye yanıtı gönder
    const result = await sendAnswerToTrendyol(
      settings.supplierId,
      settings.apiKey,
      settings.apiSecret,
      questionId,
      finalAnswer
    )
    
    return NextResponse.json({
      success: true,
      message: 'Yanıt başarıyla Trendyol\'a gönderildi',
      questionId,
      answerText: finalAnswer,
      trendyolResponse: result.data
    })
    
  } catch (error) {
    console.error('Answer API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Yanıt gönderilemedi: ${error.message}`,
        details: error.message
      }, 
      { status: 500 }
    )
  }
}
