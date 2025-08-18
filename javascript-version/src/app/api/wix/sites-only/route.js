export async function POST(request) {
  try {
    const { apiKey } = await request.json()
    
    if (!apiKey) {
      return Response.json(
        { success: false, error: 'API Key gerekli' }, 
        { status: 400 }
      )
    }

    console.log('🔍 Sadece siteleri çekiliyor...')
    
    // API Key tipini algıla
    let authHeaders = {}
    
    if (apiKey.startsWith('SECRET_')) {
      console.log('📡 Server-to-Server API Key detected')
      authHeaders = {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    } else if (apiKey.startsWith('IST.')) {
      console.log('🏢 Instance Token detected')
      authHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    } else {
      console.log('🔐 OAuth Token detected')
      authHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }

    // Site listesi için farklı endpoint'leri dene
    const siteEndpoints = [
      'https://www.wixapis.com/site-list/v1/sites',
      'https://www.wixapis.com/sites/v2/sites', 
      'https://www.wixapis.com/account/v1/sites',
      'https://www.wixapis.com/business-info/v1/account/sites'
    ]
    
    for (const endpoint of siteEndpoints) {
      console.log(`🌐 Trying endpoint: ${endpoint}`)
      
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: authHeaders
        })
        
        console.log(`📡 Endpoint ${endpoint} status: ${response.status}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Sites endpoint success:', endpoint)
          console.log('📊 Response structure:', Object.keys(data))
          
          // Farklı response formatlarını handle et
          let sites = []
          
          if (data.sites) {
            sites = data.sites
          } else if (data.data) {
            sites = Array.isArray(data.data) ? data.data : [data.data]
          } else if (Array.isArray(data)) {
            sites = data
          } else if (data.site) {
            sites = [data.site]
          } else {
            sites = [data] // Tek site objesi
          }
          
          // Site formatını standardize et
          const formattedSites = sites.map(site => ({
            id: site.id || site.siteId || site._id,
            displayName: site.displayName || site.name || site.siteName || 'Unnamed Site',
            url: site.url || site.baseUrl || site.domain || '',
            status: site.status || site.state || 'UNKNOWN'
          }))
          
          console.log(`📋 Found ${formattedSites.length} sites:`, formattedSites)
          
          return Response.json({
            success: true,
            sites: formattedSites,
            total: formattedSites.length,
            source: endpoint
          })
        } else {
          const errorText = await response.text()
          console.log(`❌ Endpoint ${endpoint} failed (${response.status}):`, errorText)
        }
      } catch (endpointError) {
        console.log(`❌ Endpoint ${endpoint} error:`, endpointError.message)
      }
    }
    
    // Hiçbir endpoint çalışmadı, API key'den bilgi çıkarmaya çalış
    console.log('🔍 No endpoints worked, trying to extract from API key...')
    
    if (apiKey.startsWith('IST.')) {
      try {
        const parts = apiKey.split('.')
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]))
          const accountData = JSON.parse(payload.data)
          
          console.log('📋 Extracted from IST token:', accountData)
          
          const extractedSiteId = accountData.tenant?.id || accountData.id
          
          if (extractedSiteId) {
            return Response.json({
              success: true,
              sites: [{
                id: extractedSiteId,
                displayName: 'Auto-detected Site (from token)',
                url: '',
                status: 'EXTRACTED'
              }],
              total: 1,
              source: 'ist-token-extraction'
            })
          }
        }
      } catch (decodeError) {
        console.error('IST token decode error:', decodeError)
      }
    }
    
    // Hiçbir şey çalışmadı
    return Response.json(
      { 
        success: false, 
        error: 'Hiçbir site endpoint\'i çalışmadı', 
        details: 'API key permissions kontrol edin',
        suggestion: 'Wix Developer Console\'da Sites/Account izinlerini kontrol edin'
      }, 
      { status: 403 }
    )
    
  } catch (error) {
    console.error('🚨 Sites API error:', error)
    return Response.json(
      { success: false, error: 'Sunucu hatası', details: error.message }, 
      { status: 500 }
    )
  }
}

<Grid item xs={12} md={6}>
  <Box className='flex gap-2'>
    {/* Mevcut site input/select */}
    
    <Button
      variant="outlined"
      onClick={fetchWixSitesOnly}
      disabled={!wixApiKey || isLoadingSites}
      className="min-w-fit"
      title="Sadece Siteleri Çek"
    >
      {isLoadingSites ? <CircularProgress size={20} /> : <i className='ri-global-line' />}
    </Button>
  </Box>
</Grid>