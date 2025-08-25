import { NextResponse } from 'next/server'

// Trendyol API'ye soru yanıtı göndermek için fonksiyon
async function sendAnswerToTrendyol(supplierId, apiKey, apiSecret, questionId, answerText) {
  try {
    // Basic Auth için credentials
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    
    // Trendyol Answer API URL'si
    const url = `https://apigw.trendyol.com/integration/qna/sellers/${supplierId}/questions/${questionId}/answers`
    
    // Request payload'u
    const requestPayload = {
      text: answerText,
      hasPrivateInfo: false // Özel bilgi içermiyor
    }
    
    // Request headers
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TrendyolSupplierApp/1.0 (Ecom-SuperTool)',
      'Accept': 'application/json'
    }
    
    // 📤 GİDEN İSTEK LOGU
    console.log('\n📤 ===== TRENDYOL API YANIT İSTEĞİ =====')
    console.log('🌐 URL:', url)
    console.log('📋 Method: POST')
    console.log('🔑 Headers:', {
      ...headers,
      'Authorization': `Basic ${credentials.substring(0, 10)}...` // Güvenlik için kısalt
    })
    console.log('📦 Request Body:', JSON.stringify(requestPayload, null, 2))
    console.log('📊 Request Size:', JSON.stringify(requestPayload).length, 'bytes')
    console.log('⏱️  Request Time:', new Date().toISOString())
    console.log('=====================================\n')
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestPayload)
    })

    // 📥 GELEN YANIT LOGU
    console.log('\n📥 ===== TRENDYOL API YANITI =====')
    console.log('📊 Response Status:', response.status, response.statusText)
    console.log('🏷️  Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('⏱️  Response Time:', new Date().toISOString())
    
    if (!response.ok) {
      const errorText = await response.text()

      console.log('❌ Error Response Body:', errorText)
      console.log('================================\n')
      
      console.error('Trendyol Answer API Error:', errorText)
      throw new Error(`Trendyol API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()

    console.log('✅ Success Response Body:', JSON.stringify(data, null, 2))
    console.log('📏 Response Size:', JSON.stringify(data).length, 'bytes')
    console.log('================================\n')
    
    console.log('✅ Answer sent successfully to Trendyol')
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.log('\n💥 ===== API İSTEK HATASI =====')
    console.log('❌ Error Type:', error.constructor.name)
    console.log('📝 Error Message:', error.message)
    console.log('📍 Error Stack:', error.stack)
    console.log('⏱️  Error Time:', new Date().toISOString())
    console.log('=============================\n')
    
    console.error('Trendyol Answer API Error:', error)
    throw error
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { questionId, customAnswer, settings } = body
    
    console.log('\n🚀 ===== YANIT API ÇAĞRISI BAŞLADI =====')
    console.log('📋 Request Data:', { 
      questionId, 
      answerLength: customAnswer?.length,
      hasSettings: !!settings,
      settingsKeys: settings ? Object.keys(settings) : []
    })
    console.log('⏱️  API Call Time:', new Date().toISOString())
    console.log('=====================================\n')
    
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
      console.log('\n🚫 ===== MOCK YANIT GÖNDERİMİ =====')
      console.log('⚠️  Reason: API credentials missing')
      console.log('📋 Mock Response Data:', {
        questionId,
        answerLength: customAnswer.trim().length,
        mockMode: true
      })
      console.log('================================\n')
      
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
      console.log('📝 Template applied - Final answer length:', finalAnswer.length)
    }
    
    console.log('\n🎯 ===== TEMPLATE İŞLEMİ =====')
    console.log('📝 Original Answer:', customAnswer.trim())
    console.log('🔧 Template Used:', !!settings.answerTemplate)
    console.log('📏 Final Answer Length:', finalAnswer.length)
    console.log('=============================\n')
    
    // Trendyol API'ye yanıtı gönder
    const result = await sendAnswerToTrendyol(
      settings.supplierId,
      settings.apiKey,
      settings.apiSecret,
      questionId,
      finalAnswer
    )
    
    console.log('\n🎉 ===== API YANIT BAŞARILI =====')
    console.log('✅ Success: Answer sent to Trendyol')
    console.log('📋 Result:', {
      questionId,
      answerLength: finalAnswer.length,
      trendyolResponse: result.data
    })
    console.log('⏱️  Completion Time:', new Date().toISOString())
    console.log('===============================\n')
    
    return NextResponse.json({
      success: true,
      message: 'Yanıt başarıyla Trendyol\'a gönderildi',
      questionId,
      answerText: finalAnswer,
      trendyolResponse: result.data
    })
    
  } catch (error) {
    console.log('\n💥 ===== API YANIT HATASI =====')
    console.log('❌ Error in POST handler')
    console.log('📝 Error Message:', error.message)
    console.log('📍 Error Stack:', error.stack)
    console.log('⏱️  Error Time:', new Date().toISOString())
    console.log('============================\n')
    
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
