'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Divider,
  Slider,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Collapse
} from '@mui/material'

const WebsiteMusterileri = () => {
  // States
  const [selectedPlatform, setSelectedPlatform] = useState('wix')
  const [wixApiKey, setWixApiKey] = useState('')
  const [wixSiteId, setWixSiteId] = useState('')
  const [availableSites, setAvailableSites] = useState([])
  const [showApiKey, setShowApiKey] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [members, setMembers] = useState([])
  const [importResults, setImportResults] = useState(null)
  const [importDialog, setImportDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [siteInfo, setSiteInfo] = useState(null)
  const [contactsStats, setContactsStats] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Frontend pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  // ✨ En sadeleştirilmiş Filter States - Tarih filtreleri de kaldırıldı
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    // Limit ayarları - Wix API: max 1000, default 50
    limit: 100,
    
    // Sıralama - Wix API desteklenen fieldlar
    sortField: 'createdDate',
    sortOrder: 'DESC',
    
    // Veri filtreleri - Frontend filtreleme
    onlyWithEmail: false,
    onlyWithPhone: false,
    onlyWithCompany: false,
    
    // Fieldsets - hangi veriler çekilecek
    fieldsets: ['FULL'] // FULL, BASIC, PUBLIC
  })

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      limit: 100,
      sortField: 'createdDate',
      sortOrder: 'DESC',
      onlyWithEmail: false,
      onlyWithPhone: false,
      onlyWithCompany: false,
      fieldsets: ['FULL']
    })
  }

  // localStorage'dan API key'leri yükle - sadece client-side'da
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      const savedWixApiKey = localStorage.getItem('wix_api_key')
      const savedWixSiteId = localStorage.getItem('wix_site_id')
      if (savedWixApiKey) setWixApiKey(savedWixApiKey)
      if (savedWixSiteId) setWixSiteId(savedWixSiteId)
    }
  }, [])

  // API Key kaydetme
  const handleWixApiKeyChange = (value) => {
    setWixApiKey(value)
    if (typeof window !== 'undefined') {
      if (value.trim()) {
        localStorage.setItem('wix_api_key', value.trim())
      } else {
        localStorage.removeItem('wix_api_key')
      }
    }
    setAvailableSites([])
    setWixSiteId('')
    setMembers([])
    setContactsStats(null)
    setSiteInfo(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wix_site_id')
    }
  }

  const handleWixSiteIdChange = (value) => {
    setWixSiteId(value)
    if (typeof window !== 'undefined') {
      if (value.trim()) {
        localStorage.setItem('wix_site_id', value.trim())
      } else {
        localStorage.removeItem('wix_site_id')
      }
    }
  }

  // API Key temizleme
  const clearWixCredentials = () => {
    setWixApiKey('')
    setWixSiteId('')
    setAvailableSites([])
    setSiteInfo(null)
    setMembers([])
    setContactsStats(null)
    setPage(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wix_api_key')
      localStorage.removeItem('wix_site_id')
    }
  }

  // ✨ En sadeleştirilmiş fetchWixContacts - Tarih filtreleri kaldırıldı
  const fetchWixContacts = async () => {
    if (!wixApiKey) {
      setSnackbar({
        open: true,
        message: 'Wix API Key gerekli!',
        severity: 'error'
      })
      return
    }

    setIsConnecting(true)
    setMembers([])
    setPage(0)
    
    try {
      console.log('🔗 Fetching Wix Contacts with filters:', filters)
      
      // ✅ Wix API'ye uygun query body oluştur - Sadece limit ve sort
      const queryBody = {
        // ✅ Paging - Wix API format
        paging: {
          limit: Math.min(Math.max(filters.limit, 1), 1000), // min: 1, max: 1000
          offset: 0
        },
        
        // ✅ Sort - Wix API desteklenen fieldlar
        sort: [
          {
            fieldName: filters.sortField,
            order: filters.sortOrder
          }
        ],
        
        // ✅ Fieldsets - hangi veriler dönsün
        fieldsets: filters.fieldsets,
        
        // ✅ Fields - spesifik alanlar (fieldsets ile birlikte union)
        fields: [
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
        ]
      }

      const requestBody = {
        apiKey: wixApiKey,
        action: 'getContacts',
        options: {
          queryBody: queryBody // Tüm query body'yi gönder
        }
      }

      if (wixSiteId) {
        requestBody.siteId = wixSiteId
      }
      
      console.log('📤 Wix API Query Body:', JSON.stringify(queryBody, null, 2))
      
      const response = await fetch('/api/wix/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Contacts API Error (${response.status}): ${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        // Site bulma
        if (data.action === 'findSites') {
          setAvailableSites(data.sites || [])
          
          if (data.sites && data.sites.length === 1) {
            const autoSiteId = data.sites[0].id
            setWixSiteId(autoSiteId)
            if (typeof window !== 'undefined') {
              localStorage.setItem('wix_site_id', autoSiteId)
            }
            
            setTimeout(() => fetchWixContacts(), 500)
            return
          } else {
            setSnackbar({
              open: true,
              message: `${data.sites?.length || 0} site bulundu. Lütfen bir site seçin.`,
              severity: 'info'
            })
            return
          }
        }

        let contacts = data.contacts || []
        
        console.log('📊 API response contact count:', contacts.length)
        
        // ✅ Frontend filtreleme - SADECE veri varlığı kontrolleri
        if (filters.onlyWithEmail) {
          contacts = contacts.filter(contact => 
            contact.primaryInfo?.email || 
            (contact.info?.emails?.length > 0 && contact.info.emails.some(e => e.email))
          )
        }
        
        if (filters.onlyWithPhone) {
          contacts = contacts.filter(contact => 
            contact.primaryInfo?.phone ||
            (contact.info?.phones?.length > 0 && contact.info.phones.some(p => p.phone))
          )
        }
        
        if (filters.onlyWithCompany) {
          contacts = contacts.filter(contact => 
            contact.info?.company && contact.info.company.trim()
          )
        }
        
        console.log('📊 After frontend filters:', contacts.length)
        
        setMembers(contacts)
        setSiteInfo(data.siteInfo)
        setContactsStats(data.stats)
        
        // Filtre durumu mesajı
        const hasDataFilters = filters.onlyWithEmail || filters.onlyWithPhone || filters.onlyWithCompany
        const appliedFiltersText = hasDataFilters ? ' (Frontend filtrelenmiş)' : ''
        const siteInfoText = data.siteInfo ? ` (${data.siteInfo.displayName})` : ''
        
        setSnackbar({
          open: true,
          message: `${contacts.length} contact yüklendi${siteInfoText}${appliedFiltersText}`,
          severity: 'success'
        })
      } else {
        throw new Error(data.error || 'Wix Contacts API hatası')
      }
    } catch (error) {
      console.error('Wix contact çekme hatası:', error)
      setSnackbar({
        open: true,
        message: `Contacts hatası: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Müşteri tabanına aktarma
  const importToCustomerBase = async () => {
    if (members.length === 0) {
      setSnackbar({
        open: true,
        message: 'İçe aktarılacak contact bulunamadı!',
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
      const errors = []

      for (let i = 0; i < members.length; i++) {
        const contact = members[i]
        setImportProgress((i / members.length) * 100)

        try {
          // ✅ Revize edilmiş contact mapping - Wix API v4 yapısına uygun
          const customerData = {
            companyName: contact.info?.company || 
                        contact.primaryInfo?.email || 
                        `${contact.info?.name?.first || ''} ${contact.info?.name?.last || ''}`.trim() ||
                        'Wix Contact',
            contactName: `${contact.info?.name?.first || ''} ${contact.info?.name?.last || ''}`.trim(),
            email: contact.primaryInfo?.email || contact.info?.emails?.items?.[0]?.email || '',
            phone: contact.primaryInfo?.phone || contact.info?.phones?.items?.[0]?.phone || '',
            address: contact.info?.addresses?.items?.[0]?.address?.addressLine || 
                    `${contact.info?.addresses?.items?.[0]?.address?.streetAddress?.number || ''} ${contact.info?.addresses?.items?.[0]?.address?.streetAddress?.name || ''}`.trim() ||
                    '',
            city: contact.info?.addresses?.items?.[0]?.address?.city || '',
            country: contact.info?.addresses?.items?.[0]?.address?.country || '',
            source: 'WEBSITE', // ✅ Yeni enum değeri
            status: contact.source?.sourceType === 'WIX_MEMBERS' ? 'ACTIVE' : 'PROSPECT',
            notes: siteInfo ? 
              `Wix Contacts'tan aktarıldı: ${siteInfo.displayName} (${siteInfo.url}) - Kaynak: ${contact.source?.sourceType || 'UNKNOWN'}` : 
              `Wix Contacts'tan aktarıldı - Kaynak: ${contact.source?.sourceType || 'UNKNOWN'}`
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
            if (response.status === 409) {
              duplicateCount++
              errors.push(`${customerData.companyName}: Zaten kayıtlı`)
            } else {
              errors.push(`${customerData.companyName}: ${responseData.error}`)
            }
          }
        } catch (error) {
          errorCount++
          errors.push(`${contact.info?.name?.first || 'Bilinmeyen'}: ${error.message}`)
        }

        if (i < members.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      setImportProgress(100)
      setImportResults({
        total: members.length,
        success: successCount,
        error: errorCount,
        duplicate: duplicateCount,
        errors: errors.slice(0, 5)
      })

      if (errorCount === 0) {
        setSnackbar({
          open: true,
          message: `${successCount} contact başarıyla eklendi!`,
          severity: 'success'
        })
      } else {
        setSnackbar({
          open: true,
          message: `${successCount} başarılı, ${errorCount} hatalı`,
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

  const closeImportDialog = () => {
    if (!isImporting) {
      setImportDialog(false)
      setImportResults(null)
      setImportProgress(0)
    }
  }

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box className='flex flex-col gap-6'>
      {/* Client-side render guard */}
      {!isClient ? (
        <Box className='flex justify-center items-center p-8'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header */}
          <div className='flex flex-col gap-2'>
            <Typography variant='h4' className='font-medium'>
              Web Site Müşterileri
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Web sitenizden contact bilgilerini çekerek müşteri tabanınıza ekleyin
            </Typography>
          </div>

      {/* Platform Seçimi */}
      <Card>
        <CardContent className='p-6'>
          <Typography variant='h6' className='mb-4'>
            Platform Seçimi
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlatform === 'wix' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlatform('wix')}
              >
                <CardContent className='p-4 text-center'>
                  <Box className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border'>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Wix.com_website_logo.svg/2560px-Wix.com_website_logo.svg.png"
                        alt="Wix Logo"
                        className="w-12 h-8 object-contain"
                      />
                    </div>
                    <Typography variant='h6' className='font-medium'>
                      Wix
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='text-center'>
                      Wix sitelerinizden contact bilgilerini çekin
                    </Typography>
                    <Chip 
                      label="Aktif" 
                      color="success" 
                      size="small" 
                      variant="filled"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Diğer platformlar... */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card className='cursor-not-allowed opacity-60'>
                <CardContent className='p-4 text-center'>
                  <Box className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                      <i className='ri-shopping-bag-line text-green-600 text-2xl' />
                    </div>
                    <Typography variant='h6' className='font-medium text-gray-500'>
                      Shopify
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='text-center'>
                      Shopify mağazanızdan müşteri bilgilerini çekin
                    </Typography>
                    <Chip 
                      label="Yakında" 
                      color="warning" 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Card className='cursor-not-allowed opacity-60'>
                <CardContent className='p-4 text-center'>
                  <Box className='flex flex-col items-center gap-3'>
                    <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center'>
                      <i className='ri-wordpress-line text-purple-600 text-2xl' />
                    </div>
                    <Typography variant='h6' className='font-medium text-gray-500'>
                      WordPress
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='text-center'>
                      WordPress sitelerinizden kullanıcı bilgilerini çekin
                    </Typography>
                    <Chip 
                      label="Yakında" 
                      color="warning" 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {selectedPlatform && (
            <Alert severity="info" className="mt-4">
              <Typography variant="body2">
                <strong>Seçili Platform:</strong> Wix - Contacts API v4 entegrasyonu aktif
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Wix API Ayarları */}
      {selectedPlatform === 'wix' && (
        <Card>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
              <Box className='flex items-center gap-2'>
                <i className='ri-contacts-line text-blue-600 text-xl' />
                <Typography variant='h6'>Wix Contacts API v4 Bağlantısı</Typography>
                {!wixApiKey && <Chip label="API Key Gerekli" color="error" size="small" />}
                {wixApiKey && !wixSiteId && <Chip label="Site Seçin" color="warning" size="small" />}
                {siteInfo && <Chip label={siteInfo.displayName} color="success" size="small" />}
                {contactsStats && (
                  <Chip 
                    label={`${contactsStats.total} contacts`} 
                    color="info" 
                    size="small" 
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={6}>
                {/* API Key Section - Sol genişlik */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 h-full'>
                    <Typography variant='subtitle1' className='mb-4 font-semibold text-blue-800 flex items-center gap-2'>
                      <i className='ri-key-line text-blue-600' />
                      API Kimlik Bilgileri
                    </Typography>
                    
                    <Box className='space-y-4'>
                      <Box className='flex gap-2'>
                        <TextField
                          fullWidth
                          label="Wix API Key"
                          type={showApiKey ? 'text' : 'password'}
                          value={wixApiKey}
                          onChange={(e) => handleWixApiKeyChange(e.target.value)}
                          placeholder="Wix Developer Console'dan aldığınız API key"
                          variant="outlined"
                          size="medium"
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
                        {wixApiKey && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={clearWixCredentials}
                            className="min-w-fit px-3"
                            title="Bilgileri Temizle"
                            size="large"
                          >
                            ❌
                          </Button>
                        )}
                      </Box>
                      
                      {wixApiKey && (
                        <Alert severity="success" variant="outlined">
                          <Typography variant="caption" className="flex items-center gap-1">
                          
                            Wix API Key başarıyla kaydedildi
                            {availableSites.length > 0 && ` (${availableSites.length} site bulundu)`}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* Site Selection Section - Sağ genişlik */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box className='p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 h-full'>
                    <Typography variant='subtitle1' className='mb-4 font-semibold text-purple-800 flex items-center gap-2'>
                      <i className='ri-global-line text-purple-600' />
                      Site Seçimi
                    </Typography>
                    
                    <Box className='space-y-4'>
                      {availableSites.length > 0 ? (
                        <FormControl fullWidth variant="outlined" size="medium">
                          <InputLabel>Site Seçin</InputLabel>
                          <Select
                            value={wixSiteId}
                            label="Site Seçin"
                            onChange={(e) => handleWixSiteIdChange(e.target.value)}
                          >
                            {availableSites.map((site) => (
                              <MenuItem key={site.id} value={site.id}>
                                <Box className='flex items-center justify-between w-full'>
                                  <span>{site.displayName}</span>
                                  <Chip 
                                    label={site.status} 
                                    size="small" 
                                    color={site.status === 'PUBLISHED' ? 'success' : 'default'}
                                    variant="outlined"
                                  />
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label="Wix Site ID (İsteğe Bağlı)"
                          value={wixSiteId}
                          onChange={(e) => handleWixSiteIdChange(e.target.value)}
                          placeholder="Boş bırakırsanız otomatik bulunur"
                          helperText="Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          variant="outlined"
                          size="medium"
                        />
                      )}
                      
                      {wixSiteId && siteInfo && (
                        <Alert severity="info" variant="outlined">
                          <Typography variant="caption" className="flex items-center gap-1">
                            <i className='ri-information-line text-blue-600' />
                            Site: {siteInfo.displayName}
                            {siteInfo.url && ` (${siteInfo.url})`}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Grid>
                
                {/* API Documentation Section - Alt genişlik */}
                <Grid size={{ xs: 12 }}>
                  <Box className='p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200'>
                    <Typography variant='subtitle1' className='mb-4 font-semibold text-gray-800 flex items-center gap-2'>
                      <i className='ri-book-open-line text-gray-600' />
                      Wix Contacts API v4 Dokümantasyonu
                    </Typography>
                    
                    <Grid container spacing={4}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box className='space-y-3'>
                          <Typography variant='body2' className='font-medium text-gray-700'>
                            📋 Desteklenen Sıralama Alanları:
                          </Typography>
                          <Box className='flex flex-wrap gap-2'>
                            {[
                              'createdDate', 'lastActivity.activityDate', 'primaryInfo.email', 
                              'info.name.first', 'info.name.last', 'info.company', 
                              'info.jobTitle', 'info.birthdate'
                            ].map((field) => (
                              <Chip 
                                key={field} 
                                label={field} 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box className='space-y-3'>
                          <Typography variant='body2' className='font-medium text-gray-700'>
                            ⚙️ API Limitleri ve İzinler:
                          </Typography>
                          <Box className='space-y-2'>
                            <Typography variant='caption' className='flex items-center gap-2'>
                              <Chip label="Max: 1000" size="small" color="warning" variant="outlined" />
                              Maksimum contact sayısı
                            </Typography>
                            <Typography variant='caption' className='flex items-center gap-2'>
                              <Chip label="CRM/Contacts" size="small" color="success" variant="outlined" />
                              Gerekli API izni
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid size={{ xs: 12 }}>
                        <Alert severity="info" variant="outlined">
                          <Typography variant="body2" className='flex items-center gap-2'>
                            <i className='ri-external-link-line' />
                            <strong>API Key almak için:</strong>
                            <a 
                              href="https://dev.wix.com/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              dev.wix.com
                            </a>
                            → My Apps → <strong>Contacts API</strong> izni verin
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      )}

      {/* ✨ En sadeleştirilmiş Filtreleme - Tarih filtreleri kaldırıldı */}
      {selectedPlatform === 'wix' && wixApiKey && (
        <Card>
          <CardContent className='p-0'>
            <Box className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b'>
              <Box className='flex items-center justify-between'>
                <Box className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center'>
                    <i className='ri-filter-3-line text-white text-lg' />
                  </div>
                  <Box>
                    <Typography variant='h6' className='font-medium'>
                      Wix API v4 Filtreleme
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Basit filtreleme seçenekleri
                    </Typography>
                  </Box>
                </Box>
                
                <Box className='flex items-center gap-2'>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetFilters}
                    startIcon={<i className='ri-refresh-line' />}
                  >
                    Sıfırla
                  </Button>
                  <IconButton
                    onClick={() => setShowFilters(!showFilters)}
                    color={showFilters ? 'primary' : 'default'}
                  >
                    <i className={showFilters ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            <Collapse in={showFilters}>
              <Box className='p-4'>
                <Grid container spacing={4}>
                  {/* Sıralama ve Limit */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box className='p-4 bg-gray-50 rounded-lg'>
                      <Typography variant='subtitle1' className='mb-3 font-medium flex items-center gap-2'>
                        <i className='ri-sort-desc text-green-600' />
                        Sıralama & Limit
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Sıralama Alanı</InputLabel>
                            <Select
                              value={filters.sortField}
                              label="Sıralama Alanı"
                              onChange={(e) => handleFilterChange('sortField', e.target.value)}
                            >
                              <MenuItem value="createdDate">Oluşturma Tarihi</MenuItem>
                              <MenuItem value="lastActivity.activityDate">Son Aktivite</MenuItem>
                              <MenuItem value="primaryInfo.email">Email</MenuItem>
                              <MenuItem value="info.name.first">Ad</MenuItem>
                              <MenuItem value="info.name.last">Soyad</MenuItem>
                              <MenuItem value="info.company">Şirket</MenuItem>
                              <MenuItem value="info.jobTitle">İş Unvanı</MenuItem>
                              <MenuItem value="info.birthdate">Doğum Tarihi</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 6 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Sıralama Yönü</InputLabel>
                            <Select
                              value={filters.sortOrder}
                              label="Sıralama Yönü"
                              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            >
                              <MenuItem value="DESC">Yeni → Eski (DESC)</MenuItem>
                              <MenuItem value="ASC">Eski → Yeni (ASC)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12 }}>
                          <Typography variant='caption' color='text.secondary' className='mb-2 block'>
                            Contact Sayısı Limiti: {filters.limit} (Max: 1000)
                          </Typography>
                          <Slider
                            value={filters.limit}
                            onChange={(e, value) => handleFilterChange('limit', value)}
                            min={10}
                            max={1000}
                            step={10}
                            marks={[
                              { value: 50, label: '50' },
                              { value: 100, label: '100' },
                              { value: 250, label: '250' },
                              { value: 500, label: '500' },
                              { value: 1000, label: '1000' }
                            ]}
                            valueLabelDisplay="auto"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Veri Filtreleri - sağa taşındı */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box className='p-4 bg-gray-50 rounded-lg'>
                      <Typography variant='subtitle1' className='mb-3 font-medium flex items-center gap-2'>
                        <i className='ri-database-line text-orange-600' />
                        Veri Filtreleri (Frontend)
                      </Typography>
                      
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={filters.onlyWithEmail}
                              onChange={(e) => handleFilterChange('onlyWithEmail', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Sadece Email Olanlar"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={filters.onlyWithPhone}
                              onChange={(e) => handleFilterChange('onlyWithPhone', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Sadece Telefon Olanlar"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={filters.onlyWithCompany}
                              onChange={(e) => handleFilterChange('onlyWithCompany', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Sadece Şirket Olanlar"
                        />
                      </FormGroup>
                      
                      <Divider className='my-3' />
                      
                      <FormControl fullWidth size="small">
                        <InputLabel>Veri Seti</InputLabel>
                        <Select
                          value={filters.fieldsets[0]}
                          label="Veri Seti"
                          onChange={(e) => handleFilterChange('fieldsets', [e.target.value])}
                        >
                          <MenuItem value="FULL">Tam Veri (FULL)</MenuItem>
                          <MenuItem value="BASIC">Temel Veri (BASIC)</MenuItem>
                          <MenuItem value="PUBLIC">Genel Veri (PUBLIC)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  {/* API Durumu ve İstatistikler */}
                  <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Box className='p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 h-full'>
                      <Typography variant='subtitle1' className='mb-3 font-medium text-green-800 flex items-center gap-2'>
                        <i className='ri-bar-chart-line text-green-600' />
                        API Durumu
                      </Typography>
                      
                      <Box className='space-y-3'>
                        {wixApiKey ? (
                          <Box className='flex items-center gap-2'>
                            ✅
                            <Typography variant='body2' className='text-green-700'>
                              API Key Bağlı
                            </Typography>
                          </Box>
                        ) : (
                          <Box className='flex items-center gap-2'>
                            ❌
                            <Typography variant='body2' className='text-red-700'>
                              API Key Gerekli
                            </Typography>
                          </Box>
                        )}
                        
                        {siteInfo && (
                          <Box className='flex items-center gap-2'>
                            🌐
                            <Typography variant='body2' className='text-blue-700'>
                              Site Seçili
                            </Typography>
                          </Box>
                        )}
                        
                        {contactsStats && (
                          <Box className='mt-3 p-2 bg-white rounded border'>
                            <Typography variant='caption' color='text.secondary' className='block'>
                              Toplam Contact
                            </Typography>
                            <Typography variant='h6' className='font-bold text-blue-600'>
                              {contactsStats.total?.toLocaleString('tr-TR') || '0'}
                            </Typography>
                          </Box>
                        )}
                        
                        <Typography variant='caption' color='text.secondary' className='block mt-2'>
                          Wix Contacts API v4
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Filter Summary */}
                <Alert severity="info" className="mt-4">
                  <Typography variant="body2">
                    <strong>Aktif Filtreler:</strong> {' '}
                    <Chip label={`${filters.limit} limit`} size="small" color="primary" variant="outlined" className="mx-1" />
                    <Chip label={`${filters.sortField} ${filters.sortOrder}`} size="small" color="secondary" variant="outlined" className="mx-1" />
                    {filters.onlyWithEmail && (
                      <Chip label="Email zorunlu" size="small" color="success" variant="outlined" className="mx-1" />
                    )}
                    {filters.onlyWithPhone && (
                      <Chip label="Telefon zorunlu" size="small" color="warning" variant="outlined" className="mx-1" />
                    )}
                    {filters.onlyWithCompany && (
                      <Chip label="Şirket zorunlu" size="small" color="error" variant="outlined" className="mx-1" />
                    )}
                    <Chip label={`Fieldset: ${filters.fieldsets[0]}`} size="small" color="default" variant="outlined" className="mx-1" />
                  </Typography>
                </Alert>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Contacts Çekme */}
      {selectedPlatform === 'wix' && (
        <Card>
          <CardContent className='p-6'>
            <Box className='flex justify-between items-center mb-4'>
              <Box>
                <Typography variant='h6'>
                  Wix Contacts (API v4)
                  {siteInfo && (
                    <Typography variant='caption' color='text.secondary' className='block'>
                      Site: {siteInfo.displayName || 'Bilinmeyen Site'} 
                      {siteInfo.url && ` (${siteInfo.url})`}
                    </Typography>
                  )}
                  {contactsStats && (
                    <Typography variant='caption' color='text.secondary' className='block'>
                      Toplam: {contactsStats.total} üye
                    </Typography>
                  )}
                  {members.length > 0 && (
                    <Typography variant='caption' color='primary.main' className='block'>
                      Yüklenen: {members.length} üye
                    </Typography>
                  )}
                </Typography>
              </Box>
              
              <Button
                variant='contained'
                size="large"
                onClick={fetchWixContacts}
                disabled={!wixApiKey || isConnecting}
                startIcon={isConnecting ? <CircularProgress size={20} /> : <i className='ri-download-cloud-line' />}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                {isConnecting ? 'Çekiliyor...' : `${filters.limit} Üyeleri Getir`}
              </Button>
            </Box>

            {members.length > 0 && (
              <>
                <Box className='flex items-center justify-between gap-3 mb-4'>
                  <Box className='flex items-center gap-3'>
                    <Chip 
                      label={`${members.length} üye yüklendi`} 
                      color='success' 
                      variant='outlined'
                    />
                    <Chip 
                      label={`Sayfa ${page + 1}/${Math.ceil(members.length / rowsPerPage)}`} 
                      color='info' 
                      variant='outlined'
                      size="small"
                    />
                  </Box>
                  
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={importToCustomerBase}
                    startIcon={<i className='ri-database-2-line' />}
                    disabled={isImporting}
                  >
                    {isImporting ? 'Aktarılıyor...' : 'Müşteri Tabanına Ekle'}
                  </Button>
                </Box>

                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Box className='flex items-center gap-1'>
                            Ad Soyad
                            <Typography variant='caption' color='text.secondary'>
                              ({members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell>Şirket</TableCell>
                        <TableCell>İş Unvanı</TableCell>
                        <TableCell>Kaynak</TableCell>
                        <TableCell>
                          <Box className='flex items-center gap-1'>
                            {filters.sortField === 'createdDate' ? 'Oluşturma Tarihi' : 
                             filters.sortField === 'lastActivity.activityDate' ? 'Son Aktivite' : 
                             filters.sortField}
                            <i className={`ri-arrow-${filters.sortOrder === 'DESC' ? 'down' : 'up'}-line text-xs`} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((contact, index) => (
                        <TableRow key={contact.id || index} hover>
                          <TableCell>
                            <Box>
                              <Typography variant='body2' className='font-medium'>
                                {contact.info?.name?.first || contact.info?.name?.last 
                                  ? `${contact.info.name.first || ''} ${contact.info.name.last || ''}`.trim()
                                  : 'İsimsiz'
                                }
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {contact.primaryInfo?.email || contact.info?.emails?.[0]?.email || 'Email yok'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {contact.primaryInfo?.phone || contact.info?.phones?.items?.[0]?.phone || 'Telefon yok'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {contact.info?.company || 'Şirket yok'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {contact.info?.jobTitle || 'Unvan yok'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={contact.source?.sourceType || 'UNKNOWN'}
                              color={contact.source?.sourceType === 'WIX_MEMBERS' ? 'success' : 'info'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {contact.createdDate ? 
                                new Date(contact.createdDate).toLocaleDateString('tr-TR') : 
                                contact.lastActivity?.activityDate ? 
                                  new Date(contact.lastActivity.activityDate).toLocaleDateString('tr-TR') : 
                                  'Bilinmiyor'
                              }
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={members.length}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10))
                    setPage(0)
                  }}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  labelRowsPerPage="Sayfa başına:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} / ${count}`
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Dialog */}
      <Dialog 
        open={importDialog} 
        onClose={closeImportDialog}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Wix Contacts'ı Müşteri Tabanına Aktar</DialogTitle>
        <DialogContent>
          {isImporting ? (
            <Box className='py-4'>
              <Typography variant='body1' className='mb-3 text-center'>
                Contacts aktarılıyor...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={importProgress} 
                className='h-2 rounded mb-2'
              />
              <Typography variant='caption' color='text.secondary' className='text-center block'>
                %{Math.round(importProgress)} tamamlandı
              </Typography>
            </Box>
          ) : importResults ? (
            <Box className='py-4'>
              <Alert severity={importResults.error === 0 ? 'success' : 'warning'} className='mb-4'>
                <Typography variant='h6' gutterBottom>
                  İçe Aktarma Tamamlandı!
                </Typography>
                <Typography variant='body2'>
                  {importResults.total} contact'dan {importResults.success} tanesi başarıyla eklendi.
                  {importResults.duplicate > 0 && ` (${importResults.duplicate} duplicate)`}
                </Typography>
              </Alert>
              
              {importResults.errors && importResults.errors.length > 0 && (
                <Alert severity="warning" className="mt-2">
                  <Typography variant="subtitle2">İlk {importResults.errors.length} hata:</Typography>
                  {importResults.errors.map((error, index) => (
                    <Typography key={index} variant="caption" display="block">
                      • {error}
                    </Typography>
                  ))}
                </Alert>
              )}
            </Box>
          ) : (
            <Box className='py-4 text-center'>
              <Typography variant='body1'>
                {members.length} Wix contact müşteri tabanınıza eklenecek.
              </Typography>
              {siteInfo && (
                <Typography variant='caption' color='text.secondary' className='block mt-2'>
                  Kaynak: {siteInfo.displayName}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImportDialog}>
            {importResults ? 'Kapat' : 'İptal'}
          </Button>
          {!isImporting && !importResults && (
            <Button onClick={importToCustomerBase} variant="contained">
              Başlat
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

      {/* Bilgilendirme */}
      <Alert severity="success">
        <Typography variant="body2">
          <strong>Wix Contacts API v4:</strong> Resmi API dokümantasyonuna uygun entegrasyon. Maksimum 1000 contact çekebilirsiniz.
        </Typography>
      </Alert>
        </>
      )}
    </Box>
  )
}

export default WebsiteMusterileri