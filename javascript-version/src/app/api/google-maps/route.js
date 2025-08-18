import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { apiKey, searchType, params } = await request.json()
    
    console.log('🔍 Google Maps API çağrısı:', { searchType, params })

    if (!apiKey) {
      console.log('❌ API key eksik')
      return NextResponse.json({ error: 'API key gerekli' }, { status: 400 })
    }

    let url = ''
    
    if (searchType === 'geocode') {
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.address)}&key=${apiKey}`
    } else if (searchType === 'places') {
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${params.lat},${params.lng}&radius=${params.radius}&keyword=${encodeURIComponent(params.keyword)}&key=${apiKey}`
      
      // Pagination desteği - eğer pagetoken varsa ekle
      if (params.pagetoken) {
        url += `&pagetoken=${params.pagetoken}`
      }
    } else if (searchType === 'details') {
      // Place Details API - telefon, email, website vb. bilgiler için
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours,price_level,reviews&key=${apiKey}`
    } else {
      console.log('❌ Geçersiz arama tipi:', searchType)
      return NextResponse.json({ error: 'Geçersiz arama tipi' }, { status: 400 })
    }

    console.log('🌐 API URL:', url.replace(apiKey, 'API_KEY_HIDDEN'))

    const response = await fetch(url)
    const data = await response.json()
    
    console.log('📊 API Response Status:', data.status)
    console.log('📊 API Response:', { 
      status: data.status, 
      resultsCount: data.results?.length || 0,
      error: data.error_message 
    })

    // API hatalarını kontrol et
    if (data.status === 'REQUEST_DENIED') {
      console.log('❌ REQUEST_DENIED:', data.error_message)
      return NextResponse.json({ 
        error: `API Key sorunu: ${data.error_message}`, 
        status: data.status 
      }, { status: 403 })
    }
    
    if (data.status === 'OVER_QUERY_LIMIT') {
      console.log('❌ OVER_QUERY_LIMIT')
      return NextResponse.json({ 
        error: 'API quota aşıldı. Daha sonra tekrar deneyin.', 
        status: data.status 
      }, { status: 429 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Google Maps API hatası:', error)
    return NextResponse.json({ error: 'API çağrısında hata oluştu' }, { status: 500 })
  }
}
