import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { questionId, answer, settings } = await request.json()
    
    console.log('📤 Gerçek Trendyol API\'ye yanıt gönderiliyor:', {
      questionId,
      answer: answer.substring(0, 100) + '...',
      sellerId: settings.sellerId
    })
    
    // Gerçek Trendyol API çağrısı
    const apiUrl = `https://api.trendyol.com/sapigw/suppliers/${settings.sellerId}/questions/${questionId}/answers`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': settings.apiKey + ':' + settings.secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: answer
      })
    })
    
    if (!response.ok) {
      throw new Error(`Trendyol Answer API Error: ${response.status}`)
    }
    
    console.log('✅ Trendyol API yanıt başarılı')
    
    return NextResponse.json({
      success: true,
      message: 'Yanıt başarıyla gönderildi',
      questionId
    })
    
  } catch (error) {
    console.error('❌ Trendyol API yanıt hatası:', error)
    return NextResponse.json({ 
      success: false, 
      error: `Yanıt gönderilemedi: ${error.message}` 
    }, { status: 500 })
  }
}