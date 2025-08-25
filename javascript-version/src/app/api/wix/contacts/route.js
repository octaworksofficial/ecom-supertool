export async function POST(request) {
  try {
    const body = await request.json()

    console.log('🔗 Wix Contacts API v4 Request:', body)
    
    const { apiKey, siteId, action, options } = body
    
    if (!apiKey) {
      return Response.json(
        { success: false, error: 'API Key gerekli' }, 
        { status: 400 }
      )
    }

    console.log('🚀 Wix Contacts API v4 integration')
    
    // API Key headers
    let authHeaders = {}
    
    if (apiKey.startsWith('SECRET_')) {
      console.log('📡 Server-to-Server API Key')
      authHeaders = {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    } else if (apiKey.startsWith('IST.')) {
      console.log('🏢 Instance Token')
      authHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }

      if (siteId) {
        authHeaders['wix-site-id'] = siteId
      }
    } else {
      console.log('🔐 OAuth Token')
      authHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }

    // Site bulma modu
    if (!siteId || action === 'findSites') {
      console.log('🔍 Finding sites...')
      
      try {
        const siteEndpoints = [
          'https://www.wixapis.com/site-list/v1/sites',
          'https://www.wixapis.com/sites/v2/sites'
        ]
        
        for (const endpoint of siteEndpoints) {
          const siteResponse = await fetch(endpoint, {
            method: 'GET',
            headers: authHeaders
          })
          
          if (siteResponse.ok) {
            const siteData = await siteResponse.json()

            const sites = (siteData.sites || [siteData]).map(site => ({
              id: site.id || site.siteId,
              displayName: site.displayName || site.name || 'Unnamed Site',
              url: site.url || site.baseUrl || '',
              status: site.status || 'ACTIVE'
            }))
            
            return Response.json({
              success: true,
              action: 'findSites',
              sites: sites,
              total: sites.length
            })
          }
        }
        
        return Response.json({
          success: false,
          error: 'Site bulunamadı.'
        }, { status: 403 })
        
      } catch (error) {
        return Response.json({
          success: false,
          error: 'Site bulma hatası'
        }, { status: 500 })
      }
    }

    // ✅ Contacts çekme - SIMPLE GET ile
    console.log('📞 Fetching contacts for Site ID:', siteId)

    try {
      // ✅ URL parameters ile basit çağrı
      const queryBody = options?.queryBody || {}
      const limit = queryBody.paging?.limit || 50
      const offset = queryBody.paging?.offset || 0
      const sortField = queryBody.sort?.[0]?.fieldName || 'createdDate'
      const sortOrder = queryBody.sort?.[0]?.order || 'DESC'
      
      // ✅ GET URL parametreleri - SORTING DÜZELTME
      const params = new URLSearchParams({
        'paging.limit': Math.min(limit, 1000).toString(),
        'paging.offset': offset.toString(),
        'sort.fieldName': sortField,
        'sort.order': sortOrder
      })
      
      // ✅ Fields parametrelerini ekle
      if (queryBody.fields) {
        queryBody.fields.forEach(field => {
          params.append('fields', field)
        })
      } else {
        // Default fields
        [
          'source',
          'createdDate',
          'updatedDate',
          'lastActivity',
          'primaryInfo',
          'info.name',
          'info.emails',
          'info.phones',
          'info.addresses',
          'info.company',
          'info.jobTitle',
          'info.birthdate',
          'info.locale'
        ].forEach(field => {
          params.append('fields', field)
        })
      }
      
      // ✅ Fieldsets ekle
      if (queryBody.fieldsets) {
        queryBody.fieldsets.forEach(fieldset => {
          params.append('fieldsets', fieldset)
        })
      }
      
      // ❌ Filter parametreleri tamamen kaldırıldı - Sadece client-side filtering
      
      const contactsUrl = `https://www.wixapis.com/contacts/v4/contacts?${params.toString()}`
      
      console.log('📋 Wix API v4 GET URL:', contactsUrl)
      console.log('🔄 Sorting applied:', `${sortField} ${sortOrder}`)
      
      const contactsResponse = await fetch(contactsUrl, {
        method: 'GET',
        headers: authHeaders
      })
      
      console.log(`📞 Contacts API v4 status: ${contactsResponse.status}`)
      
      if (!contactsResponse.ok) {
        const errorText = await contactsResponse.text()

        console.error('❌ Contacts API v4 error:', errorText)
        
        return Response.json({
          success: false,
          error: `Contacts API v4 Error (${contactsResponse.status}): ${errorText}`
        }, { status: contactsResponse.status })
      }
      
      const contactsData = await contactsResponse.json()

      console.log('✅ Contacts API v4 SUCCESS!')
      console.log('📊 Response summary:', {
        contactsCount: contactsData.contacts?.length || 0,
        totalCount: contactsData.totalCount || 0,
        hasMore: contactsData.pagingMetadata?.hasNext || false,
        sortVerification: contactsData.contacts?.length > 1 ? {
          first: contactsData.contacts[0]?.info?.name?.first || contactsData.contacts[0]?.createdDate,
          last: contactsData.contacts[contactsData.contacts.length - 1]?.info?.name?.first || contactsData.contacts[contactsData.contacts.length - 1]?.createdDate
        } : null
      })
      
      const contacts = contactsData.contacts || []
      const totalCount = contactsData.totalCount || contacts.length
      
      if (contacts.length > 0) {
        console.log('🔍 First contact sample:', {
          id: contacts[0].id,
          primaryEmail: contacts[0].primaryInfo?.email,
          name: contacts[0].info?.name,
          company: contacts[0].info?.company,
          source: contacts[0].source,
          createdDate: contacts[0].createdDate
        })
        
        if (contacts.length > 1) {
          console.log('🔍 Last contact sample:', {
            id: contacts[contacts.length - 1].id,
            name: contacts[contacts.length - 1].info?.name,
            createdDate: contacts[contacts.length - 1].createdDate
          })
        }
      }
      
      // ✅ Contacts'ları API v4 yapısına uygun işle
      const processedContacts = contacts.map(contact => {
        return {
          id: contact.id,
          primaryInfo: contact.primaryInfo || {},
          info: {
            name: contact.info?.name || {},
            emails: contact.info?.emails?.items || [], // ✅ items array
            phones: contact.info?.phones?.items || [], // ✅ items array
            addresses: contact.info?.addresses?.items || [], // ✅ items array
            company: contact.info?.company || '',
            jobTitle: contact.info?.jobTitle || '',
            birthdate: contact.info?.birthdate || ''
          },
          source: contact.source || {},
          createdDate: contact.createdDate || null,
          updatedDate: contact.updatedDate || null,
          lastActivity: contact.lastActivity || {}
        }
      })
      
      // Site bilgisi
      let siteInfo = {
        id: siteId,
        displayName: 'Wix Site',
        url: '',
        status: 'ACTIVE'
      }
      
      // Site bilgisini çekmeye çalış
      try {
        console.log('🏢 Fetching site info for:', siteId)
        
        const siteInfoEndpoints = [
          'https://www.wixapis.com/site-properties/v4/properties',
          'https://www.wixapis.com/sites/v2/sites',
          `https://www.wixapis.com/sites/v2/sites/${siteId}`
        ]
        
        for (const endpoint of siteInfoEndpoints) {
          try {
            const siteInfoResponse = await fetch(endpoint, {
              headers: authHeaders
            })
            
            if (siteInfoResponse.ok) {
              const siteData = await siteInfoResponse.json()

              console.log('✅ Site info response:', siteData)
              
              // Farklı endpoint'ler farklı format döndürebilir
              if (siteData.displayName || siteData.baseUrl) {
                siteInfo = {
                  id: siteId,
                  displayName: siteData.displayName || siteData.siteName || 'Wix Site',
                  url: siteData.baseUrl || siteData.url || siteData.siteUrl || '',
                  status: siteData.status || 'ACTIVE'
                }
                console.log('✅ Site info parsed:', siteInfo)
                break
              }
              
              // Sites array response
              if (siteData.sites && siteData.sites.length > 0) {
                const targetSite = siteData.sites.find(s => s.id === siteId) || siteData.sites[0]

                siteInfo = {
                  id: siteId,
                  displayName: targetSite.displayName || targetSite.siteName || 'Wix Site',
                  url: targetSite.baseUrl || targetSite.url || targetSite.siteUrl || '',
                  status: targetSite.status || 'ACTIVE'
                }
                console.log('✅ Site info from array:', siteInfo)
                break
              }
            } else {
              console.warn(`❌ Site info endpoint failed: ${endpoint} - ${siteInfoResponse.status}`)
            }
          } catch (endpointError) {
            console.warn(`❌ Site info endpoint error: ${endpoint}`, endpointError.message)
          }
        }
      } catch (siteError) {
        console.warn('⚠️ Site info genel hatası:', siteError.message)
      }
      
      console.log('🏢 Final site info:', siteInfo)
      
      // İstatistikler
      const stats = {
        total: processedContacts.length,
        totalCount: totalCount,
        withEmail: processedContacts.filter(c => 
          c.primaryInfo?.email || 
          (c.info?.emails?.length > 0 && c.info.emails.some(e => e.email))
        ).length,
        withPhone: processedContacts.filter(c => 
          c.primaryInfo?.phone ||
          (c.info?.phones?.length > 0 && c.info.phones.some(p => p.phone))
        ).length,
        withCompany: processedContacts.filter(c => c.info?.company).length
      }
      
      console.log('📊 Contacts v4 stats:', stats)
      console.log('🎯 Final verification:', {
        requestedLimit: limit,
        actualReturned: processedContacts.length,
        sortApplied: `sort.fieldName=${sortField}&sort.order=${sortOrder}`,
        urlGenerated: contactsUrl
      })
      
      return Response.json({
        success: true,
        action: 'getContacts',
        contacts: processedContacts,
        total: processedContacts.length,
        totalCount: totalCount,
        siteInfo: siteInfo,
        stats: stats,
        pagination: {
          hasMore: contactsData.pagingMetadata?.hasNext || false,
          cursors: contactsData.pagingMetadata?.cursors || null,
          currentLimit: limit,
          currentOffset: offset
        },
        debug: {
          requestedLimit: limit,
          actualReturned: processedContacts.length,
          urlUsed: contactsUrl,
          apiVersion: 'v4'
        }
      })
      
    } catch (error) {
      console.error('🚨 Contacts v4 fetch error:', error)
      
return Response.json({
        success: false,
        error: 'Contacts çekme hatası',
        details: error.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('🚨 General Contacts API v4 error:', error)
    
return Response.json({
      success: false,
      error: 'Sunucu hatası',
      details: error.message
    }, { status: 500 })
  }
}