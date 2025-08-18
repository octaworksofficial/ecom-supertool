'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'

// XLSX Import
import * as XLSX from 'xlsx'

const GMapsCustomerFind = () => {
  // States
  const [keywords, setKeywords] = useState([])
  const [keywordInput, setKeywordInput] = useState('')

  // Location states
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [searchRadius, setSearchRadius] = useState(5)
  const [maxResults, setMaxResults] = useState(60)

  // API states
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  // Search states
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchCompleted, setSearchCompleted] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [currentSearchStep, setCurrentSearchStep] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Import states
  const [isImporting, setIsImporting] = useState(false)
  const [importDialog, setImportDialog] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // localStorage'dan API key'i yükle
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gmaps-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // API key değiştiğinde localStorage'a kaydet
  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey)
    if (newApiKey.trim()) {
      localStorage.setItem('gmaps-api-key', newApiKey.trim())
    } else {
      localStorage.removeItem('gmaps-api-key')
    }
  }

  // API key'i temizle
  const clearApiKey = () => {
    setApiKey('')
    localStorage.removeItem('gmaps-api-key')
  }

  // Sample data - gerçek uygulamada API'den gelecek
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır',
    'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Erzurum', 'Van', 'Batman', 'Elazığ', 'İzmit', 'Manisa',
    'Samsun', 'Kahramanmaraş', 'Trabzon', 'Denizli', 'Ordu', 'Balıkesir', 'Kırıkkale', 'Hatay', 'Afyon'
  ]

  const districts = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Üsküdar', 'Beyoğlu', 'Fatih', 'Zeytinburnu'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Sincan', 'Etimesgut', 'Altındağ'],
    'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı', 'Gaziemir', 'Narlıdere']
  }

  // Helper functions
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete))
  }

  // Get Place Details function
  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch('/api/google-maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          searchType: 'details',
          params: {
            placeId: placeId
          }
        })
      })

      const data = await response.json()
      
      if (data.status === 'OK' && data.result) {
        return data.result
      }
      
      return null
    } catch (error) {
      console.error('Place details hatası:', error)
      return null
    }
  }

  // Google Places API search function - Pagination desteği ile
  const searchGooglePlaces = async (query, location) => {
    if (!apiKey) {
      throw new Error('Google Maps API key girilmemiş!')
    }

    const locationStr = `${location.city}${location.district ? ', ' + location.district : ''}${location.neighborhood ? ', ' + location.neighborhood : ''}, Turkey`
    
    console.log('🔍 Arama başlatılıyor:', { query, locationStr })
    
    // Geocoding API ile lokasyon koordinatlarını al
    const geocodeResponse = await fetch('/api/google-maps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        searchType: 'geocode',
        params: {
          address: locationStr
        }
      })
    })
    
    const geocodeData = await geocodeResponse.json()
    
    console.log('📍 Geocoding sonucu:', geocodeData)
    
    if (geocodeData.status !== 'OK' || geocodeData.results?.length === 0) {
      if (geocodeData.status === 'REQUEST_DENIED') {
        throw new Error(`API Key Hatası: ${geocodeData.error_message || 'API key geçersiz veya Geocoding API aktif değil'}`)
      }
      throw new Error(`Lokasyon bulunamadı! (${geocodeData.status})`)
    }

    const { lat, lng } = geocodeData.results[0].geometry.location
    
    console.log('📍 Koordinatlar:', { lat, lng })
    
    // Places API ile işletmeleri ara - Pagination desteği
    let allPlaces = []
    let nextPageToken = null
    let pageCount = 0
    const maxPages = Math.min(Math.ceil(maxResults / 20), 3) // Her sayfada 20 sonuç, max 3 sayfa

    do {
      const placesResponse = await fetch('/api/google-maps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          searchType: 'places',
          params: {
            lat,
            lng,
            radius: searchRadius * 1000,
            keyword: query,
            pagetoken: nextPageToken
          }
        })
      })
      
      const placesData = await placesResponse.json()
      
      console.log(`🏢 Places API sonucu (sayfa ${pageCount + 1}):`, placesData)
      
      if (placesData.status !== 'OK') {
        if (pageCount === 0) { // İlk sayfa hatası ise throw et
          if (placesData.status === 'REQUEST_DENIED') {
            throw new Error(`API Key Hatası: ${placesData.error_message || 'API key geçersiz veya Places API aktif değil'}`)
          }
          if (placesData.status === 'ZERO_RESULTS') {
            console.log('⚠️ Hiç sonuç bulunamadı')
            return []
          }
          throw new Error(`Places API Hatası: ${placesData.status}`)
        } else {
          console.log(`⚠️ Sayfa ${pageCount + 1} hatası, döngü durduruluyor:`, placesData.status)
          break // Sonraki sayfalarda hata varsa döngüyü kır
        }
      }

      const places = placesData.results || []
      console.log(`✅ ${places.length} işletme bulundu (sayfa ${pageCount + 1})`)
      
      allPlaces = [...allPlaces, ...places]
      nextPageToken = placesData.next_page_token
      pageCount++

      // API rate limiting için kısa bekleme (Google 2-3 saniye beklemek istiyor)
      if (nextPageToken && pageCount < maxPages) {
        setCurrentSearchStep(`"${query}" için sayfa ${pageCount + 1} yükleniyor...`)
        await new Promise(resolve => setTimeout(resolve, 3000)) // 3 saniye bekle
      }

    } while (nextPageToken && pageCount < maxPages)

    console.log(`🎯 Toplam ${allPlaces.length} işletme bulundu`)
    return allPlaces
  }

  // Handle search
  const handleSearch = async () => {
    if (keywords.length === 0) {
      alert('Lütfen en az bir anahtar kelime girin!')
      return
    }
    if (!selectedCity) {
      alert('Lütfen bir şehir seçin!')
      return
    }
    if (!apiKey) {
      alert('Lütfen Google Maps API key girin!')
      return
    }
    
    setIsSearching(true)
    setSearchResults([])
    setSearchCompleted(false)
    setSearchProgress(0)

    try {
      const location = {
        city: selectedCity,
        district: selectedDistrict,
        neighborhood: selectedNeighborhood
      }

      let allResults = []
      const totalKeywords = keywords.length

      // Her anahtar kelime için arama yap
      for (let i = 0; i < keywords.length; i++) {
        const keyword = keywords[i]
        setCurrentSearchStep(`"${keyword}" aranıyor...`)
        
        try {
          const results = await searchGooglePlaces(keyword, location)
          
          // Sonuçları formatla ve ekle
          const formattedResults = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address,
            rating: place.rating || 'N/A',
            userRatingsTotal: place.user_ratings_total || 0,
            types: place.types,
            keyword: keyword,
            location: place.geometry?.location,
            priceLevel: place.price_level,
            openNow: place.opening_hours?.open_now
          }))

          allResults = [...allResults, ...formattedResults]
          
          // Eğer maksimum sonuç sayısına ulaştıysak aramayı durdur
          if (allResults.length >= maxResults) {
            setCurrentSearchStep(`Maksimum ${maxResults} sonuca ulaşıldı. Arama durduruldu.`)
            break
          }
        } catch (error) {
          console.error(`"${keyword}" aramasında hata:`, error)
        }
        
        // Progress güncelle
        setSearchProgress(((i + 1) / totalKeywords) * 50) // İlk %50 basic search
      }

      // Duplicate'ları temizle (aynı place_id) ve maxResults kadar al
      const uniqueResults = allResults.filter((place, index, self) => 
        index === self.findIndex(p => p.id === place.id)
      ).slice(0, maxResults)

      setCurrentSearchStep('Detaylı bilgiler alınıyor...')
      
      // Her işletme için detaylı bilgi al
      const detailedResults = []
      for (let i = 0; i < uniqueResults.length; i++) {
        const place = uniqueResults[i]
        
        try {
          const details = await getPlaceDetails(place.id)
          
          const detailedPlace = {
            ...place,
            fullAddress: details?.formatted_address || place.address,
            phone: details?.formatted_phone_number,
            website: details?.website,
            openingHours: details?.opening_hours?.weekday_text || [],
            isOpen: details?.opening_hours?.open_now,
            email: details?.email
          }
          
          detailedResults.push(detailedPlace)
        } catch (error) {
          console.error(`Detay alınamadı ${place.name}:`, error)
          detailedResults.push(place) // Hata olsa bile basic bilgiyi ekle
        }
        
        // Progress güncelle (ikinci %50)
        const detailProgress = 50 + ((i + 1) / uniqueResults.length) * 50
        setSearchProgress(detailProgress)
        setCurrentSearchStep(`Detaylar alınıyor... ${i + 1}/${uniqueResults.length}`)
      }

      setSearchResults(detailedResults)
      setSearchCompleted(true)
      setCurrentSearchStep(`${detailedResults.length} müşteri bulundu!`)
      setSearchProgress(100)

    } catch (error) {
      console.error('Arama hatası:', error)
      alert(`Arama hatası: ${error.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  // Excel export function
  const exportToXLSX = async () => {
    if (searchResults.length === 0) {
      alert('Dışa aktarılacak sonuç bulunamadı!')
      return
    }
    
    setIsExporting(true)
    
    try {
      // Excel için veriyi hazırla
      const excelData = searchResults.map((result, index) => ({
        'Sıra': index + 1,
        'İşletme Adı': result.name,
        'Adres': result.fullAddress || result.address,
        'Telefon': result.phone || 'Bilgi yok',
        'Email': result.email || 'Bilgi yok',
        'Website': result.website || 'Bilgi yok',
        'Puan': result.rating || 'Bilgi yok',
        'Değerlendirme Sayısı': result.userRatingsTotal || 'Bilgi yok',
        'Kategoriler': result.types?.join(', ') || 'Bilgi yok',
        'Anahtar Kelime': result.keyword,
        'Şu An Açık': result.isOpen === true ? 'Evet' : result.isOpen === false ? 'Hayır' : 'Bilinmiyor',
        'Enlem': result.location?.lat || result.lat || 'N/A',
        'Boylam': result.location?.lng || result.lng || 'N/A',
        'Fiyat Seviyesi': result.priceLevel ? '$'.repeat(result.priceLevel) : 'N/A',
        'Çalışma Saatleri': result.openingHours?.join(' | ') || 'Bilgi yok'
      }))

      // Workbook oluştur
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // Kolon genişliklerini ayarla
      const colWidths = [
        { wpx: 50 },   // Sıra
        { wpx: 200 },  // İşletme Adı
        { wpx: 300 },  // Adres
        { wpx: 150 },  // Telefon
        { wpx: 200 },  // Email
        { wpx: 200 },  // Website
        { wpx: 80 },   // Puan
        { wpx: 100 },  // Değerlendirme
        { wpx: 200 },  // Kategoriler
        { wpx: 150 },  // Anahtar Kelime
        { wpx: 100 },  // Açık mı
        { wpx: 100 },  // Enlem
        { wpx: 100 },  // Boylam
        { wpx: 100 },  // Fiyat Seviyesi
        { wpx: 400 }   // Çalışma Saatleri
      ]
      
      ws['!cols'] = colWidths
      
      // Worksheet'i workbook'a ekle
      XLSX.utils.book_append_sheet(wb, ws, "Müşteriler")
      
      // Dosyayı indir
      const fileName = `gmaps-musteriler-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
    } catch (error) {
      console.error('Excel export hatası:', error)
      alert('Excel dosyası oluşturulurken bir hata oluştu.')
    } finally {
      setIsExporting(false)
    }
  }

  // Müşteri tabanına aktarma fonksiyonu
  const importToCustomerBase = async () => {
    if (searchResults.length === 0) {
      setSnackbar({
        open: true,
        message: 'İçe aktarılacak sonuç bulunamadı!',
        severity: 'error'
      })
      return
    }

    setImportDialog(true)
    setIsImporting(true)
    setImportProgress(0)
    setImportResults(null)

    try {
      let successCount = 0
      let errorCount = 0
      let duplicateCount = 0
      let skippedCount = 0
      const errors = []
      const processedEmails = new Set()
      const processedPhones = new Set()

      for (let i = 0; i < searchResults.length; i++) {
        const result = searchResults[i]
        
        // Progress güncelle
        setImportProgress((i / searchResults.length) * 100)

        try {
          // Frontend'de de duplicate kontrolü
          let shouldSkip = false
          let skipReason = ''

          if (result.email && result.email.trim()) {
            const cleanEmail = result.email.trim().toLowerCase()
            if (processedEmails.has(cleanEmail)) {
              shouldSkip = true
              skipReason = 'Bu batch\'te aynı email zaten işlendi'
            } else {
              processedEmails.add(cleanEmail)
            }
          }

          if (result.phone && result.phone.trim() && !shouldSkip) {
            const cleanPhone = result.phone.replace(/\D/g, '')
            if (cleanPhone.length >= 10) {
              const phoneKey = cleanPhone.slice(-10)
              if (processedPhones.has(phoneKey)) {
                shouldSkip = true
                skipReason = 'Bu batch\'te aynı telefon zaten işlendi'
              } else {
                processedPhones.add(phoneKey)
              }
            }
          }

          if (shouldSkip) {
            skippedCount++
            errors.push(`${result.name}: ${skipReason}`)
            continue
          }

          // Müşteri verisini formatla
          const customerData = {
            companyName: result.name || 'İsimsiz İşletme',
            contactName: '', // Google Maps'ten kişi adı gelmez genellikle
            email: result.email?.trim() || '',
            phone: result.phone?.trim() || '',
            address: result.fullAddress || result.address || '',
            city: selectedCity || '',
            country: 'Türkiye',
            source: 'GMAPS', // Prisma schema'da GMAPS olarak tanımlı
            status: 'PROSPECT', // İlk başta potansiyel müşteri
            // Ek bilgiler (JSON olarak kaydedilebilir)
            notes: JSON.stringify({
              googleMapsData: {
                placeId: result.id,
                rating: result.rating,
                userRatingsTotal: result.userRatingsTotal,
                types: result.types,
                website: result.website,
                keyword: result.keyword,
                location: result.location,
                priceLevel: result.priceLevel,
                openingHours: result.openingHours,
                isOpen: result.isOpen
              }
            })
          }

          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
          })

          const responseData = await response.json()

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            if (response.status === 409) { // Duplicate error
              duplicateCount++
              errors.push(`${result.name}: ${responseData.error}`)
            } else {
              errors.push(`${result.name}: ${responseData.error || 'Bilinmeyen hata'}`)
            }
          }
        } catch (error) {
          errorCount++
          errors.push(`${result.name}: ${error.message}`)
        }

        // Kısa bekleme (API overload'ı önlemek için)
        if (i < searchResults.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      setImportProgress(100)
      setImportResults({
        total: searchResults.length,
        success: successCount,
        error: errorCount,
        duplicate: duplicateCount,
        skipped: skippedCount,
        errors: errors.slice(0, 8) // İlk 8 hatayı göster
      })

      // Başarı mesajı
      if (errorCount === 0 && skippedCount === 0) {
        setSnackbar({
          open: true,
          message: `${successCount} müşteri başarıyla eklendi!`,
          severity: 'success'
        })
      } else {
        setSnackbar({
          open: true,
          message: `${successCount} başarılı, ${duplicateCount} duplicate, ${skippedCount} atlandı`,
          severity: 'warning'
        })
      }

    } catch (error) {
      console.error('İçe aktarma hatası:', error)
      setSnackbar({
        open: true,
        message: `İçe aktarma hatası: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Import dialog'unu kapatma
  const closeImportDialog = () => {
    if (!isImporting) {
      setImportDialog(false)
      setImportResults(null)
      setImportProgress(0)
    }
  }

  // Snackbar kapatma
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box className='flex flex-col gap-6'>
      {/* Page Header */}
      <div className='flex flex-col gap-2'>
        <Typography variant='h4' className='font-medium'>
          GMaps Müşteri Bul
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Google Maps üzerinden anahtar kelimelerle müşterilerinizi bulun
        </Typography>
      </div>

      {/* API Settings */}
      <Card>
        <Accordion>
          <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
            <Box className='flex items-center gap-2'>
              <i className='ri-settings-3-line text-xl' />
              <Typography variant='h6'>Google Maps API Ayarları</Typography>
              {!apiKey && <Chip label="Gerekli" color="error" size="small" />}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box className='flex gap-2'>
                  <TextField
                    fullWidth
                    label="Google Maps API Key"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Google Cloud Console'dan aldığınız API key'i girin"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowApiKey(!showApiKey)}
                            edge="end"
                          >
                            <i className={showApiKey ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {apiKey && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={clearApiKey}
                      className="min-w-fit"
                      title="API Key'i Temizle"
                      sx={{ 
                        minWidth: '40px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </Button>
                  )}
                </Box>
                {apiKey && (
                  <Typography variant="caption" color="success.main" className="mt-1 block">
                    ✓ API Key kaydedildi (Tarayıcıda saklanıyor)
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>API Key Nasıl Alınır:</strong>
                    <br />
                    1. <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>'a gidin
                    <br />
                    2. Yeni bir proje oluşturun veya mevcut projeyi seçin
                    <br />
                    3. "APIs & Services" → "Library" bölümünden "Places API" ve "Geocoding API"'yi aktifleştirin
                    <br />
                    4. "Credentials" bölümünden yeni API key oluşturun
                    <br />
                    5. API key'i buraya yapıştırın
                    <br />
                    <strong>📌 Not:</strong> API key'iniz tarayıcınızda güvenli şekilde saklanır ve her seferinde tekrar girmenize gerek kalmaz.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Card>

      {/* Search Form Card */}
      <Card>
        <CardContent className='p-6'>
          <Typography variant='h6' className='mb-4'>
            Arama Parametreleri
          </Typography>
          
          <Grid container spacing={4}>
            {/* Keywords Section */}
            <Grid item xs={12}>
              <Typography variant='subtitle1' className='mb-2 font-medium'>
                Anahtar Kelimeler
              </Typography>
              <Box className='flex flex-col gap-3'>
                <Box className='flex gap-2'>
                  <TextField
                    fullWidth
                    placeholder='Örn: Robotik Kodlama Kursları, Özel Okullar, Diş Kliniği...'
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddKeyword()
                      }
                    }}
                  />
                  <Button 
                    variant='contained' 
                    onClick={handleAddKeyword}
                    disabled={!keywordInput.trim()}
                  >
                    Ekle
                  </Button>
                </Box>
                
                {/* Keywords Display */}
                {keywords.length > 0 && (
                  <Box className='flex flex-wrap gap-2'>
                    {keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => handleDeleteKeyword(keyword)}
                        color='primary'
                        variant='outlined'
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Location Section */}
            <Grid item xs={12}>
              <Typography variant='subtitle1' className='mb-3 font-medium'>
                Arama Bölgesi
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Şehir</InputLabel>
                    <Select
                      value={selectedCity}
                      label="Şehir"
                      onChange={(e) => {
                        setSelectedCity(e.target.value)
                        setSelectedDistrict('')
                        setSelectedNeighborhood('')
                      }}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth disabled={!selectedCity}>
                    <InputLabel>İlçe (Opsiyonel)</InputLabel>
                    <Select
                      value={selectedDistrict}
                      label="İlçe (Opsiyonel)"
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value)
                        setSelectedNeighborhood('')
                      }}
                    >
                      {selectedCity && districts[selectedCity]?.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <TextField
                    fullWidth
                    label="Mahalle (Opsiyonel)"
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    placeholder="Mahalle adı girin"
                    disabled={!selectedCity}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Arama Yarıçapı</InputLabel>
                    <Select
                      value={searchRadius}
                      label="Arama Yarıçapı"
                      onChange={(e) => setSearchRadius(e.target.value)}
                    >
                      <MenuItem value={1}>1 km</MenuItem>
                      <MenuItem value={2}>2 km</MenuItem>
                      <MenuItem value={5}>5 km</MenuItem>
                      <MenuItem value={10}>10 km</MenuItem>
                      <MenuItem value={20}>20 km</MenuItem>
                      <MenuItem value={50}>50 km</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <FormControl fullWidth>
                    <InputLabel>Maksimum Sonuç</InputLabel>
                    <Select
                      value={maxResults}
                      label="Maksimum Sonuç"
                      onChange={(e) => setMaxResults(e.target.value)}
                    >
                      <MenuItem value={20}>20 sonuç</MenuItem>
                      <MenuItem value={40}>40 sonuç</MenuItem>
                      <MenuItem value={60}>60 sonuç (Önerilen)</MenuItem>
                      <MenuItem value={100}>100 sonuç</MenuItem>
                      <MenuItem value={200}>200 sonuç</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Search Button */}
            <Grid item xs={12}>
              <Divider className='mb-4' />
              <Box className='flex justify-center'>
                <Button 
                  variant='contained' 
                  size='large'
                  onClick={handleSearch}
                  disabled={keywords.length === 0 || !selectedCity || !apiKey || isSearching}
                  startIcon={isSearching ? <CircularProgress size={20} /> : <i className='ri-search-line' />}
                  className='px-8 py-3'
                >
                  {isSearching ? 'Aranıyor...' : 'Müşteri Ara'}
                </Button>
              </Box>
              
              {/* Progress Bar */}
              {isSearching && (
                <Box className='mt-4'>
                  <Typography variant='body2' color='text.secondary' className='mb-2 text-center'>
                    {currentSearchStep}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={searchProgress} 
                    className='h-2 rounded'
                  />
                  <Typography variant='caption' color='text.secondary' className='mt-1 text-center block'>
                    %{Math.round(searchProgress)} tamamlandı
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchCompleted && (
        <Card>
          <CardContent className='p-6'>
            <Box className='flex justify-between items-center mb-4'>
              <Typography variant='h6'>
                Arama Sonuçları
              </Typography>
              <Box className='flex items-center gap-3'>
                <Chip 
                  label={`${searchResults.length} müşteri bulundu`} 
                  color='success' 
                  variant='outlined'
                />
                {searchResults.length > 0 && (
                  <>
                    <Button
                      variant='contained'
                      color='success'
                      onClick={exportToXLSX}
                      startIcon={<i className='ri-file-excel-2-line' />}
                      disabled={isExporting}
                    >
                      {isExporting ? 'İndiriliyor...' : 'Excel İndir'}
                    </Button>
                    
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={importToCustomerBase}
                      startIcon={<i className='ri-database-2-line' />}
                      disabled={isImporting}
                    >
                      {isImporting ? 'Aktarılıyor...' : 'Müşteri Tabanına Ekle'}
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {searchResults.length === 0 ? (
              <Alert severity="warning">
                Aramanızla eşleşen işletme bulunamadı. Farklı anahtar kelimeler veya daha geniş bir bölge deneyin.
              </Alert>
            ) : (
              <Box className='space-y-3'>
                {searchResults.slice(0, 10).map((result, index) => (
                  <Card key={result.id} variant='outlined' className='transition-shadow hover:shadow-md'>
                    <CardContent className='p-4'>
                      <Grid container spacing={3} alignItems="flex-start">
                        {/* İşletme Bilgileri */}
                        <Grid item xs={12} md={6}>
                          <Box className='flex items-start justify-between mb-2'>
                            <Typography variant='h6' className='font-semibold text-primary'>
                              {result.name}
                            </Typography>
                            {result.rating && (
                              <Chip 
                                label={`⭐ ${result.rating}`} 
                                size='small' 
                                color='warning'
                                variant='outlined'
                              />
                            )}
                          </Box>
                          
                          <Box className='flex items-start mb-2'>
                            <i className='ri-map-pin-line text-gray-500 mr-2 mt-1' />
                            <Typography variant='body2' color='text.secondary' className='flex-1'>
                              {result.fullAddress || result.address}
                            </Typography>
                          </Box>
                          
                          {result.types && result.types.length > 0 && (
                            <Box className='mb-2'>
                              <Chip 
                                label={result.types[0].replace(/_/g, ' ')} 
                                size='small' 
                                color='primary'
                                variant='outlined'
                              />
                            </Box>
                          )}
                        </Grid>
                        
                        {/* İletişim Bilgileri */}
                        <Grid item xs={12} md={6}>
                          <Box className='space-y-2'>
                            {result.phone && (
                              <Box className='flex items-center'>
                                <i className='ri-phone-line text-green-600 mr-2' />
                                <Typography variant='body2' color='text.primary'>
                                  {result.phone}
                                </Typography>
                              </Box>
                            )}
                            
                            {result.website && (
                              <Box className='flex items-center'>
                                <i className='ri-global-line text-purple-600 mr-2' />
                                <a 
                                  href={result.website} 
                                  target='_blank' 
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-800 text-sm'
                                >
                                  Website Ziyaret Et
                                </a>
                              </Box>
                            )}
                            
                            {result.userRatingsTotal && (
                              <Box className='flex items-center'>
                                <i className='ri-user-line text-gray-500 mr-2' />
                                <Typography variant='body2' color='text.secondary'>
                                  {result.userRatingsTotal} değerlendirme
                                </Typography>
                              </Box>
                            )}
                            
                            {result.keyword && (
                              <Box className='flex items-center'>
                                <i className='ri-search-line text-blue-500 mr-2' />
                                <Chip 
                                  label={result.keyword} 
                                  size='small' 
                                  color='secondary' 
                                  variant='outlined'
                                />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                
                {searchResults.length > 10 && (
                  <Alert severity="info">
                    Ve {searchResults.length - 10} müşteri daha... Tüm sonuçları Excel dosyasında görebilirsiniz.
                  </Alert>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* İçe Aktarma Progress Dialog'u */}
      <Dialog 
        open={importDialog} 
        onClose={closeImportDialog}
        maxWidth="md" 
        fullWidth
        disableEscapeKeyDown={isImporting}
      >
        <DialogTitle>
          <Box className='flex items-center gap-2'>
            <i className='ri-database-2-line text-primary' />
            Müşteri Tabanına Aktarım
          </Box>
        </DialogTitle>
        <DialogContent>
          {isImporting ? (
            <Box className='py-4'>
              <Typography variant='body1' className='mb-3 text-center'>
                Müşteriler aktarılıyor...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={importProgress} 
                className='h-2 rounded mb-2'
              />
              <Typography variant='caption' color='text.secondary' className='text-center block'>
                %{Math.round(importProgress)} tamamlandı
              </Typography>
              <Typography variant='body2' color='text.secondary' className='mt-3 text-center'>
                {Math.round((importProgress / 100) * searchResults.length)} / {searchResults.length} müşteri işlendi
              </Typography>
            </Box>
          ) : importResults ? (
            <Box className='py-4'>
              <Alert severity={importResults.error === 0 ? 'success' : 'warning'} className='mb-4'>
                <Typography variant='h6' gutterBottom>
                  İçe Aktarma Tamamlandı!
                </Typography>
                <Typography variant='body2'>
                  {importResults.total} müşteriden {importResults.success} tanesi başarıyla eklendi.
                </Typography>
              </Alert>

              <Grid container spacing={2} className='mb-4'>
                <Grid item xs={6} sm={2.4}>
                  <Box className='text-center p-3 border rounded'>
                    <Typography variant='h4' color='success.main'>
                      {importResults.success}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Başarılı
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Box className='text-center p-3 border rounded'>
                    <Typography variant='h4' color='error.main'>
                      {importResults.error}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Hatalı
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Box className='text-center p-3 border rounded'>
                    <Typography variant='h4' color='warning.main'>
                      {importResults.duplicate}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Duplicate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Box className='text-center p-3 border rounded'>
                    <Typography variant='h4' color='info.main'>
                      {importResults.skipped || 0}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Atlandı
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Box className='text-center p-3 border rounded'>
                    <Typography variant='h4' color='primary.main'>
                      {importResults.total}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Toplam
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {importResults.errors.length > 0 && (
                <Box>
                  <Typography variant='subtitle2' className='mb-2'>
                    Hatalar:
                  </Typography>
                  <Box className='max-h-32 overflow-y-auto border rounded p-2'>
                    {importResults.errors.map((error, index) => (
                      <Typography key={index} variant='body2' color='error' className='mb-1'>
                        • {error}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box className='py-4 text-center'>
              <Typography variant='body1'>
                {searchResults.length} müşteri müşteri tabanınıza eklenecek.
              </Typography>
              <Typography variant='body2' color='text.secondary' className='mt-2'>
                Kaynak: <strong>Google Maps</strong>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeImportDialog}
            disabled={isImporting}
          >
            {importResults ? 'Kapat' : 'İptal'}
          </Button>
          {!isImporting && !importResults && (
            <Button 
              onClick={importToCustomerBase}
              variant="contained"
              startIcon={<i className='ri-download-line' />}
            >
              Başlat
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar Bildirimleri */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Info Alert */}
      <Alert severity="info" className='mb-4'>
        <Typography variant="body2">
          <strong>Nasıl Kullanılır:</strong> Önce Google Maps API key'inizi girin, 
          aramak istediğiniz işletme türlerini anahtar kelime olarak ekleyin, 
          arama yapılacak bölgeyi seçin ve maksimum sonuç sayısını belirleyin.
          "Müşteri Ara" butonuna tıklayın. Sonuçları Excel dosyası olarak indirebilirsiniz.
          <br />
          <strong>Not:</strong> Daha fazla sonuç için farklı anahtar kelimeler kullanın 
          ve maksimum sonuç sayısını artırın. API limitleri nedeniyle çok yüksek sayılar 
          biraz zaman alabilir.
        </Typography>
      </Alert>

      {/* Features Card */}
      <Card>
        <CardContent className='p-6'>
          <Typography variant='h6' className='mb-4'>
            Özellikler
          </Typography>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex items-start gap-3'>
              <i className='ri-search-line text-xl text-primary mt-1' />
              <div>
                <Typography variant='subtitle2'>Çoklu Anahtar Kelime</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Birden fazla işletme türü için arama yapın
                </Typography>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <i className='ri-map-2-line text-xl text-primary mt-1' />
              <div>
                <Typography variant='subtitle2'>Bölgesel Arama</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Şehir, ilçe, mahalle bazında filtreleme
                </Typography>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <i className='ri-file-excel-2-line text-xl text-primary mt-1' />
              <div>
                <Typography variant='subtitle2'>Excel Export</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Sonuçları Excel formatında indirin
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}

export default GMapsCustomerFind