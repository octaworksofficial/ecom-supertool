import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { apiKey, siteId, action, options } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'API Key gerekli' 
      }, { status: 400 })
    }

    // Wix API base URL
    const baseUrl = siteId 
      ? `https://www.wixapis.com/members/v1/members` 
      : `https://www.wixapis.com/members/v1/members`

    let url = baseUrl
    let requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }

    // Handle different actions
    if (action === 'queryMembers') {
      // Use Wix queryMembers with query parameters
      const queryParams = new URLSearchParams()
      
      if (options?.limit) {
        queryParams.append('limit', Math.min(options.limit, 100).toString()) // Max 100
      }
      
      if (options?.skip) {
        queryParams.append('skip', options.skip.toString())
      }
      
      if (options?.sort && options.sort.length > 0) {
        // Convert sort array to Wix format
        const sortStr = options.sort.map(s => `${s.fieldName}:${s.order}`).join(',')
        queryParams.append('sort', sortStr)
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }

      console.log('Wix API URL:', url)
    } else if (action === 'findSites') {
      // Get sites endpoint (if available)
      url = 'https://www.wixapis.com/site-list/v1/sites'
    }

    const response = await fetch(url, requestOptions)
    
    console.log('Wix API Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Wix API Error:', errorText)
      
      // Handle specific Wix error codes
      if (response.status === 401) {
        return NextResponse.json({ 
          success: false, 
          error: 'API Key geçersiz veya yetkisiz' 
        }, { status: 401 })
      } else if (response.status === 403) {
        return NextResponse.json({ 
          success: false, 
          error: 'Bu API için yetkiniz yok. Members API iznini kontrol edin.' 
        }, { status: 403 })
      } else if (response.status === 404) {
        return NextResponse.json({ 
          success: false, 
          error: 'Site bulunamadı veya API endpoint mevcut değil' 
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `Wix API Hatası (${response.status}): ${errorText}` 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('Wix API Data:', JSON.stringify(data, null, 2))

    // Handle different response structures
    if (action === 'findSites') {
      return NextResponse.json({
        success: true,
        action: 'findSites',
        sites: data.sites || []
      })
    }

    // Handle queryMembers response
    const members = data.members || []
    
    // Get site info if available
    let siteInfo = null
    if (siteId) {
      try {
        const siteResponse = await fetch(`https://www.wixapis.com/site-properties/v4/properties`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (siteResponse.ok) {
          const siteData = await siteResponse.json()
          siteInfo = {
            displayName: siteData.displayName || 'Wix Site',
            url: siteData.url || 'wix.com'
          }
        }
      } catch (err) {
        console.warn('Site info alınamadı:', err.message)
      }
    }

    return NextResponse.json({
      success: true,
      members,
      siteInfo,
      totalCount: data.totalCount || members.length
    })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
