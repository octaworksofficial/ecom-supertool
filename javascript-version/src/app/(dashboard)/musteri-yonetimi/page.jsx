'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Chip,
  TablePagination,
  Alert,
  DialogContentText,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Toolbar,
  Menu,
  MenuList,
  LinearProgress,
  Backdrop,
  CircularProgress,
  InputAdornment,
  Tooltip // ✅ Tooltip import'u eklendi
} from '@mui/material'
import padding from 'tailwindcss-logical/plugins/padding'

const MusteriYonetimi = () => {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [customerForm, setCustomerForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [interactions, setInteractions] = useState([])
  const [newNote, setNewNote] = useState({
    type: 'NOTE',
    title: '',
    description: ''
  })
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [importMenuAnchor, setImportMenuAnchor] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState(null)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // State'lere ekleyin
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [bulkDeletingCustomers, setBulkDeletingCustomers] = useState([])

  // Müşterileri yükle
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/customers')
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        
        if (Array.isArray(data)) {
          setCustomers(data)
        } else if (data && Array.isArray(data.customers)) {
          setCustomers(data.customers)
        } else {
          console.warn('API unexpected format:', data)
          setCustomers([])
        }
      } else {
        throw new Error(`API Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Müşteriler yüklenirken hata:', error)
      setError('Müşteriler yüklenirken bir hata oluştu: ' + error.message)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Müşteri etkileşimlerini yükle - email yerine ID kullan
  const fetchCustomerInteractions = async (customerId) => {
    try {
      // ID'yi direkt URL'de kullan, email aramaya çalışma
      const response = await fetch(`/api/customers/${customerId}/interactions`)
      
      if (response.ok) {
        const data = await response.json()
        setInteractions(data)
      } else {
        console.error(`Etkileşimler yüklenemedi (HTTP ${response.status})`)
        setInteractions([])
      }
    } catch (error) {
      console.error('Etkileşimler yüklenirken hata:', error)
      setInteractions([])
    }
  }

  // Yeni not ekle - email yerine ID kullan
  const handleAddNote = async () => {
    try {
      if (!newNote.title.trim() || !editingCustomer) return

      const noteData = {
        ...newNote,
        date: new Date().toISOString()
      }

      // Doğrudan müşteri ID'sini kullan, email ile aramaya çalışma
      const response = await fetch(`/api/customers/${editingCustomer.id}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      })

      if (response.ok) {
        await fetchCustomerInteractions(editingCustomer.id)
        setNewNote({
          type: 'NOTE',
          title: '',
          description: ''
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Not eklenemedi (HTTP ${response.status})`)
      }
    } catch (error) {
      console.error('Not eklenirken hata:', error)
      setError('Not eklenirken bir hata oluştu: ' + error.message)
    }
  }

  // Müşteri ekleme/güncelleme işlemi
  const handleSaveCustomer = async () => {
    try {
      // Form validasyonu
      if (!customerForm.companyName.trim()) {
        setError('Şirket adı zorunludur')
        return
      }

      // Email validasyonu - boş string yerine null kullan
      const updatedForm = {
        ...customerForm,
        email: customerForm.email?.trim() || null
      }

      let response
      
      if (editMode) {
        // Müşteri güncelleme
        const updateData = { 
          ...updatedForm, 
          id: editingCustomer.id 
        }
        
        console.log('Updating customer:', updateData)
        
        response = await fetch('/api/customers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })
      } else {
        // Yeni müşteri ekleme
        console.log('Adding customer:', updatedForm)
        
        response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
        })
      }

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (response.ok) {
        await fetchCustomers()
        handleCloseDialog()
        setError(null)
      } else {
        throw new Error(responseData.error || `İşlem başarısız: ${response.status}`)
      }
    } catch (error) {
      console.error('Müşteri işlemi sırasında hata:', error)
      setError('İşlem sırasında bir hata oluştu: ' + error.message)
    }
  }

  // Müşteri düzenleme modalını aç
  const handleEditCustomer = async (customer) => {
    setEditMode(true)
    setEditingCustomer(customer)
    setCustomerForm({
      companyName: customer.companyName || '',
      contactName: customer.contactName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      country: customer.country || ''
    })
    setDialogOpen(true)
    
    // Müşterinin etkileşimlerini yükle
    await fetchCustomerInteractions(customer.id)
  }

  // Yeni müşteri modalını aç
  const handleAddNewCustomer = () => {
    setEditMode(false)
    setEditingCustomer(null)
    setCustomerForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    })
    setInteractions([])
    setTabValue(0)
    setDialogOpen(true)
  }

  // Dialog'u kapat ve state'leri temizle
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditMode(false)
    setEditingCustomer(null)
    setCustomerForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    })
    setInteractions([])
    setNewNote({
      type: 'NOTE',
      title: '',
      description: ''
    })
    setTabValue(0)
    setError(null)
  }

  // Form input değişikliklerini handle et
  const handleFormChange = (field) => (event) => {
    setCustomerForm(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  // Note form değişikliklerini handle et
  const handleNoteChange = (field) => (event) => {
    setNewNote(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  // Müşteri silme işlemi
  const handleDeleteCustomer = async () => {
    try {
      if (!customerToDelete) return

      console.log('Deleting customer:', customerToDelete.id)

      const response = await fetch(`/api/customers?id=${customerToDelete.id}`, {
        method: 'DELETE'
      })

      const responseData = await response.json()
      console.log('Delete response:', responseData)

      if (response.ok) {
        await fetchCustomers()
        setDeleteDialogOpen(false)
        setCustomerToDelete(null)
        setError(null)
        
        if (dialogOpen && editingCustomer?.id === customerToDelete.id) {
          handleCloseDialog()
        }
      } else {
        throw new Error(responseData.error || `Müşteri silinemedi: ${response.status}`)
      }
    } catch (error) {
      console.error('Müşteri silinirken hata:', error)
      setError('Müşteri silinirken bir hata oluştu: ' + error.message)
    }
  }

  // Silme onay dialogunu aç
  const openDeleteDialog = (customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  // Silme dialogunu kapat
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  // Not türü iconları - Unicode kullanarak
  const getInteractionIcon = (type) => {
    const iconConfigs = {
      'CALL': { 
        icon: '📞', 
        color: '#4CAF50', 
        bg: '#e8f5e8',
        label: 'Telefon Görüşmesi'
      },
      'EMAIL': { 
        icon: '📧', 
        color: '#2196F3', 
        bg: '#e3f2fd',
        label: 'Email İletişimi'
      },
      'MEETING': { 
        icon: '📅', 
        color: '#FF9800', 
        bg: '#fff3e0',
        label: 'Toplantı'
      },
      'NOTE': { 
        icon: '📝', 
        color: '#9C27B0', 
        bg: '#f3e5f5',
        label: 'Not'
      }
    }
    
    const config = iconConfigs[type] || {
      icon: '📄',
      color: '#757575',
      bg: '#f5f5f5',
      label: 'Genel'
    }
    
    return (
      <Box
        sx={{
          width: 48,  // ✅ 40'dan 48'e yükseltildi
          height: 48, // ✅ 40'dan 48'e yükseltildi
          borderRadius: '50%',
          backgroundColor: config.bg,
          border: `2px solid ${config.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px', // ✅ İkonu da biraz büyüttük
          padding: 1      // ✅ Ekstra iç boşluk eklendi
        }}
        title={config.label}
      >
        {config.icon}
      </Box>
    )
  }

  // Tarih formatı
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Array kontrolü ve güvenli slice
  const safeCustomers = Array.isArray(customers) ? customers : []
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return safeCustomers
    
    const search = searchTerm.toLowerCase()
    return safeCustomers.filter(customer => {
      return (
        (customer.companyName || '').toLowerCase().includes(search) ||
        (customer.contactName || '').toLowerCase().includes(search) ||
        (customer.email || '').toLowerCase().includes(search) ||
        (customer.phone || '').toLowerCase().includes(search) ||
        (customer.city || '').toLowerCase().includes(search) ||
        (customer.country || '').toLowerCase().includes(search) ||
        (customer.address || '').toLowerCase().includes(search)
      )
    })
  }, [safeCustomers, searchTerm])

  // Filtrelenmiş müşterilerden sayfalama
  const displayedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Seçim fonksiyonları
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCustomers(displayedCustomers.map(customer => customer.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  // XLSX Export fonksiyonları
  const exportToXLSX = (customers, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(
      customers.map(customer => ({
        'Şirket Adı': customer.companyName || '',
        'İletişim Kişisi': customer.contactName || '',
        'Email': customer.email || '',
        'Telefon': customer.phone || '',
        'Adres': customer.address || '',
        'Şehir': customer.city || '',
        'Ülke': customer.country || '',
        'Durum': customer.status || 'ACTIVE',
        'Kaynak': customer.source || 'MANUAL',
        'Oluşturma Tarihi': customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('tr-TR') : '',
        'Etkileşim Sayısı': customer.interactions?.length || 0
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Müşteriler')
    XLSX.writeFile(workbook, filename)
  }

  const exportSelectedCustomers = () => {
    const selectedData = customers.filter(customer => 
      selectedCustomers.includes(customer.id)
    )
    
    if (selectedData.length === 0) {
      setError('Lütfen export edilecek müşterileri seçin')
      return
    }
    
    exportToXLSX(selectedData, `secili-musteriler-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportAllCustomers = () => {
    exportToXLSX(customers, `tum-musteriler-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Müşterinin etkileşim türlerini al (max 3) - bu fonksiyon zaten var
  const getCustomerInteractionTypes = (customer) => {
    if (!customer.interactions || customer.interactions.length === 0) {
      return []
    }
    
    // Benzersiz etkileşim türlerini al
    const uniqueTypes = [...new Set(customer.interactions.map(interaction => interaction.type))]
    
    // En fazla 3 tane göster
    return uniqueTypes.slice(0, 3)
  }

  // Etkileşim türlerine göre ikon göster - bu fonksiyon da zaten var
  const renderInteractionIcons = (customer) => {
    const types = getCustomerInteractionTypes(customer)
    
    if (types.length === 0) {
      return (
        <Badge badgeContent={0} color="default">
          <span style={{ fontSize: '18px' }}>📝</span>
        </Badge>
      )
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Badge badgeContent={customer.interactions?.length || 0} color="primary">
          <Box sx={{ display: 'flex', gap: 0.2 }}>
            {types.map(type => (
              <span key={type} style={{ fontSize: '14px' }}>
                {type === 'CALL' && '📞'}
                {type === 'EMAIL' && '📧'}
                {type === 'MEETING' && '📅'}
                {type === 'NOTE' && '📝'}
              </span>
            ))}
          </Box>
        </Badge>
      </Box>
    )
  }

  // İçe aktarma fonksiyonları
  const handleImportMenuOpen = (event) => {
    setImportMenuAnchor(event.currentTarget)
  }

  const handleImportMenuClose = () => {
    setImportMenuAnchor(null)
  }

  // Şablon indirme
  const downloadTemplate = () => {
    const templateData = [
      {
        'Şirket Adı': 'Örnek Şirket A.Ş.',
        'İletişim Kişisi': 'Ahmet Yılmaz',
        'Email': 'ahmet@ornek.com',
        'Telefon': '+90 212 123 45 67',
        'Adres': 'Maslak Mahallesi İş Merkezi',
        'Şehir': 'İstanbul',
        'Ülke': 'Türkiye'
      },
      {
        'Şirket Adı': 'Test Teknoloji Ltd.',
        'İletişim Kişisi': 'Fatma Kaya',
        'Email': 'fatma@test.com',
        'Telefon': '+90 312 987 65 43',
        'Adres': 'Çankaya İş Merkezi',
        'Şehir': 'Ankara',
        'Ülke': 'Türkiye'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Müşteri Şablonu')
    XLSX.writeFile(workbook, 'musteri-sablonu.xlsx')
    handleImportMenuClose()
  }

  // Dosya yükleme ve önizleme
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    const reader = new FileReader()
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100
        setUploadProgress(progress)
      }
    }

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Veri formatını kontrol et ve dönüştür
        const processedData = jsonData.map(row => ({
          companyName: row['Şirket Adı'] || row['Company Name'] || row['companyName'] || '',
          contactName: row['İletişim Kişisi'] || row['Contact Name'] || row['contactName'] || '',
          email: row['Email'] || row['email'] || '',
          phone: row['Telefon'] || row['Phone'] || row['phone'] || '',
          address: row['Adres'] || row['Address'] || row['address'] || '',
          city: row['Şehir'] || row['City'] || row['city'] || '',
          country: row['Ülke'] || row['Country'] || row['country'] || ''
        })).filter(row => row.companyName.trim()) // Boş şirket adı olanları filtrele

        setPreviewData(processedData)
        setPreviewDialog(true)
        setIsUploading(false)
        setUploadProgress(0)
        handleImportMenuClose()
        
      } catch (error) {
        console.error('Dosya okuma hatası:', error)
        setError('Dosya okunamadı. Lütfen geçerli bir Excel dosyası seçin.')
        setIsUploading(false)
        setUploadProgress(0)
      }
    }

    reader.readAsArrayBuffer(file)
    event.target.value = '' // Input'u temizle
  }

  // Toplu müşteri ekleme
  const confirmImport = async () => {
    try {
      setIsUploading(true)
      let successCount = 0
      let errorCount = 0
      const errors = []

      for (let i = 0; i < previewData.length; i++) {
        const customer = previewData[i]
        setUploadProgress((i / previewData.length) * 100)

        try {
          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              companyName: customer.companyName,
              contactName: customer.contactName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              country: customer.country,
              source: 'IMPORT',  // Schema'da IMPORT var, bu doğru
              status: 'ACTIVE'   // Schema'da ACTIVE var, bu da doğru
            }),
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            const errorData = await response.json()
            errors.push(`${customer.companyName}: ${errorData.error}`)
          }
        } catch (error) {
          errorCount++
          errors.push(`${customer.companyName}: ${error.message}`)
        }
      }

      await fetchCustomers() // Listeyi yenile
      setPreviewDialog(false)
      setPreviewData(null)
      setIsUploading(false)
      setUploadProgress(0)

      // Sonuç mesajı
      if (errorCount === 0) {
        setError(null)
        // Success mesajı gösterebilirsiniz
      } else {
        setError(`${successCount} müşteri başarıyla eklendi. ${errorCount} hatada hata oluştu: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`)
      }

    } catch (error) {
      console.error('İçe aktarma hatası:', error)
      setError('İçe aktarma sırasında bir hata oluştu: ' + error.message)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Müşteri meta bilgilerini formatla
  const getSourceText = (source) => {
    switch (source) {
      case 'MANUAL': return '✋ Manuel Giriş'
      case 'IMPORT': return '📊 Excel İçe Aktarım'
      case 'GMAPS': return '🗺️ Google Maps'  // Schema'da GMAPS olarak tanımlı
      case 'WEBSITE': return '🌐 Website'  // Schema'da WEBSITE olarak tanımlı
      default: return '❓ Bilinmeyen'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return { text: 'Aktif', color: 'success' }
      case 'INACTIVE': return { text: 'Pasif', color: 'default' }
      case 'PROSPECT': return { text: 'Potansiyel', color: 'warning' }
      case 'CUSTOMER': return { text: 'Müşteri', color: 'primary' }
      default: return { text: 'Aktif', color: 'success' }
    }
  }

  // Search değiştiğinde sayfa sıfırla
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(0) // Arama yapılınca ilk sayfaya dön
  }

  // Toplu silme fonksiyonları
  const handleBulkDeleteStart = () => {
    if (selectedCustomers.length === 0) {
      setError('Lütfen silinecek müşterileri seçin')
      return
    }
    
    const customersToDelete = customers.filter(customer => 
      selectedCustomers.includes(customer.id)
    )
    setBulkDeletingCustomers(customersToDelete)
    setBulkDeleteDialogOpen(true)
  }

  const handleBulkDeleteConfirm = () => {
    setBulkDeleteDialogOpen(false)
    setBulkDeleteConfirmOpen(true)
  }

  const handleBulkDeleteExecute = async () => {
    try {
      setBulkDeleteConfirmOpen(false)
      setLoading(true)
      
      let successCount = 0
      let errorCount = 0
      const errors = []

      for (const customer of bulkDeletingCustomers) {
        try {
          const response = await fetch(`/api/customers?id=${customer.id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            const errorData = await response.json()
            errors.push(`${customer.companyName}: ${errorData.error || 'Bilinmeyen hata'}`)
          }
        } catch (error) {
          errorCount++
          errors.push(`${customer.companyName}: ${error.message}`)
        }
      }

      // Listeyi yenile
      await fetchCustomers()
      
      // Seçimi temizle
      setSelectedCustomers([])
      setBulkDeletingCustomers([])
      
      // Sonuç mesajı
      if (errorCount === 0) {
        setError(null)
        // Başarı mesajı verebilirsiniz
      } else {
        setError(`${successCount} müşteri silindi. ${errorCount} hatada hata oluştu: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`)
      }

    } catch (error) {
      console.error('Toplu silme hatası:', error)
      setError('Toplu silme sırasında bir hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false)
    setBulkDeleteConfirmOpen(false)
    setBulkDeletingCustomers([])
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Müşteri Yönetimi
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedCustomers.length > 0 && (
              <Button
                variant="outlined"
                onClick={exportSelectedCustomers}
                startIcon={<span>📊</span>}
              >
                Seçilileri Dışa Aktar ({selectedCustomers.length})
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={exportAllCustomers}
              startIcon={<span>📋</span>}
            >
              Tümünü Dışa Aktar
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleImportMenuOpen}
              startIcon={<span>📥</span>}
              endIcon={<span>▼</span>}
            >
              İçe Aktar
            </Button>
            
            <Button
              variant="contained"
              onClick={handleAddNewCustomer}
              startIcon={<span>➕</span>}
            >
              Yeni Müşteri
            </Button>
          </Box>
        </Box>

        {/* Search Bar ve İstatistikler */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Arama Kutusu */}
          <TextField
            placeholder="Müşteri ara... (şirket, kişi, email, telefon, şehir)"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ fontSize: '16px' }}>🔍</span>
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('')
                      setPage(0)
                    }}
                    title="Aramayı Temizle"
                  >
                    <span style={{ fontSize: '14px' }}>❌</span>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {/* Sonuç İstatistikleri */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`${filteredCustomers.length} müşteri`} 
              color="primary" 
              variant="outlined"
              size="small"
            />
            {searchTerm && (
              <Chip 
                label={`"${searchTerm}" için ${filteredCustomers.length} sonuç`} 
                color="success" 
                variant="filled"
                size="small"
                onDelete={() => {
                  setSearchTerm('')
                  setPage(0)
                }}
                deleteIcon={<span style={{ fontSize: '12px' }}>❌</span>}
              />
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Müşteriler yükleniyor...</Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < displayedCustomers.length}
                        checked={displayedCustomers.length > 0 && selectedCustomers.length === displayedCustomers.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Şirket Adı</TableCell>
                    <TableCell>İletişim Kişisi</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Telefon</TableCell>
                    <TableCell>Şehir</TableCell>
                    <TableCell>Etkileşim</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedCustomers.length > 0 ? (
                    displayedCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id}
                        hover
                        selected={selectedCustomers.includes(customer.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => handleSelectCustomer(customer.id)}
                          />
                        </TableCell>
                        <TableCell>{customer.companyName || 'N/A'}</TableCell>
                        <TableCell>{customer.contactName || 'N/A'}</TableCell>
                        <TableCell>{customer.email || 'N/A'}</TableCell>
                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                        <TableCell>{customer.city || 'N/A'}</TableCell>
                        <TableCell>
                          <Box className='flex gap-1'>
                            {(() => {
                              const customerInteractions = customer.interactions || []
                              const uniqueTypes = [...new Set(customerInteractions.map(i => i.type))]
                              
                              if (uniqueTypes.length === 0) {
                                return (
                                  <Chip 
                                    icon={<span style={{ fontSize: '12px' }}>📝</span>}
                                    label="Etkileşim Yok" 
                                    size="small" 
                                    variant="outlined" 
                                    color="default"
                                  />
                                )
                              }
                              
                              return uniqueTypes.map(type => {
                                const count = customerInteractions.filter(i => i.type === type).length
                                
                                const typeConfig = {
                                  'CALL': { 
                                    icon: '📞', 
                                    label: 'Arama', 
                                    color: 'success',
                                    bgColor: '#e8f5e8',
                                    padding: '15px'
                                  },
                                  'EMAIL': { 
                                    icon: '📧', 
                                    label: 'Email', 
                                    color: 'primary',
                                    bgColor: '#e3f2fd',
                                  },
                                  'MEETING': { 
                                    icon: '📅', 
                                    label: 'Toplantı', 
                                    color: 'warning',
                                    bgColor: '#fff3e0'
                                  },
                                  'NOTE': { 
                                    icon: '📝', 
                                    label: 'Not', 
                                    color: 'info',
                                    bgColor: '#f3e5f5'
                                  }
                                }
                                
                                const config = typeConfig[type] || {
                                  icon: '📄',
                                  label: type,
                                  color: 'default',
                                  bgColor: '#f5f5f5'
                                }
                                
                                return (
                                  <Tooltip 
                                    key={type}
                                    title={`${config.label}: ${count} adet etkileşim`}
                                    arrow
                                  >
                                    <Chip
                                      icon={
                                        <Box 
                                          sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontSize: '12px',  // ✅ Font size artırıldı
                                            width: '28px',     // ✅ Genişlik eklendi
                                            height: '28px',    // ✅ Yükseklik eklendi
                                            margin: '-4px 0',  // ✅ Negatif margin ile chip içinde daha fazla alan kaplar
                                            padding: '0px'     // ✅ İkona iç boşluk eklendi
                                          }}
                                        >
                                          {config.icon}
                                        </Box>
                                      }
                                      label={count}
                                      size="small"
                                      color={config.color}
                                      variant="filled"
                                      sx={{
                                        backgroundColor: config.bgColor,
                                        fontWeight: 'bold',
                                        '& .MuiChip-icon': {
                                          fontSize: '12px',         // ✅ İkon boyutu artırıldı
                                          marginLeft: '12px',        // ✅ Sol boşluk artırıldı
                                          marginRight: '-4px',
                                          paddingLeft: '12px',      // ✅ Label sol boşluğu artırıldı
                                          paddingRight: '12px',
                                          marginTop: '12px',
                                          marginBottom: '12px'      // ✅ Sağ boşluk azaltıldı (sayı ile ikon arasındaki mesafeyi ayarlar)
                                        },
                                        '& .MuiChip-label': {
                                          paddingLeft: '12px',      // ✅ Label sol boşluğu artırıldı
                                          paddingRight: '12px',
                                          paddingTop: '12px',
                                          paddingBottom: '12px'    // ✅ Label alt boşluğu artırıldı
                                        },
                                        height: '28px'              // ✅ Chip yüksekliği artırıldı
                                      }}
                                    />
                                  </Tooltip>
                                )
                              })
                            })()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Aktif"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {/* Müşteri Detayına Git Butonu */}
                            <IconButton 
                              size="small"
                              color="primary"
                              onClick={() => handleEditCustomer(customer)}
                              title="Müşteri Detayına Git"
                              sx={{
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                minWidth: 32,
                                backgroundColor: 'primary.white',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                }
                              }}
                            >
                              <span style={{ fontSize: '12px' }}>➡️</span>
                            </IconButton>
                            
                            {/* Düzenleme Butonu */}
                            <IconButton 
                              size="small"
                              onClick={() => handleEditCustomer(customer)}
                              title="Düzenle"
                            >
                              <span style={{ fontSize: '12px' }}>✏️</span>
                            </IconButton>
                            
                            {/* Silme Butonu */}
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openDeleteDialog(customer)}
                              title="Sil"
                            >
                              <span style={{ fontSize: '12px' }}>🗑️</span>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="textSecondary">
                          {searchTerm 
                            ? `"${searchTerm}" araması için sonuç bulunamadı.`
                            : 'Henüz müşteri bulunmuyor. İlk müşteriyi eklemek için "Yeni Müşteri" butonunu kullanın.'
                        }
                        </Typography>
                        {searchTerm && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => {
                              setSearchTerm('')
                              setPage(0)
                            }}
                            sx={{ mt: 1 }}
                          >
                            Aramayı Temizle
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredCustomers.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
                setPage(0)
              }}
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} / ${count}${searchTerm ? ` (${safeCustomers.length} toplam)` : ''}`
              }
            />
          </>
        )}

        {/* Müşteri Ekleme/Düzenleme Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
          <DialogTitle>
            {editMode ? `${editingCustomer?.companyName} - Müşteri Düzenle` : 'Yeni Müşteri Ekle'}
          </DialogTitle>
          <DialogContent>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab label="Müşteri Bilgileri" />
              {editMode && (
                <Tab 
                  label={
                    <Box display="flex" alignItems="center" gap={4.5}>
                      Notlar & Etkileşimler 
                      <Badge badgeContent={interactions.length} color="primary" />
                    </Box>
                  } 
                />
              )}
              {editMode && (
                <Tab label="Detaylar & Geçmiş" />
              )}
            </Tabs>

            {/* Tab 0: Müşteri Bilgileri */}
            {tabValue === 0 && (
              <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
                <TextField
                  label="Şirket Adı"
                  value={customerForm.companyName}
                  onChange={handleFormChange('companyName')}
                  fullWidth
                  required
                />
                <TextField
                  label="İletişim Kişisi"
                  value={customerForm.contactName}
                  onChange={handleFormChange('contactName')}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={customerForm.email}
                  onChange={handleFormChange('email')}
                  fullWidth
                />
                <TextField
                  label="Telefon"
                  value={customerForm.phone}
                  onChange={handleFormChange('phone')}
                  fullWidth
                />
                <TextField
                  label="Adres"
                  value={customerForm.address}
                  onChange={handleFormChange('address')}
                  multiline
                  rows={3}
                  fullWidth
                />
                <TextField
                  label="Şehir"
                  value={customerForm.city}
                  onChange={handleFormChange('city')}
                  fullWidth
                />
                <TextField
                  label="Ülke"
                  value={customerForm.country}
                  onChange={handleFormChange('country')}
                  fullWidth
                />
              </Box>
            )}

            {/* Tab 1: Notlar & Etkileşimler */}
            {tabValue === 1 && editMode && (
              <Box>
                {/* Yeni Not Ekleme Formu */}
                <Card sx={{ mb: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Yeni Etkileşim Ekle
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Etkileşim Türü</InputLabel>
                      <Select
                        value={newNote.type}
                        onChange={handleNoteChange('type')}
                        label="Etkileşim Türü"
                      >
                        <MenuItem value="NOTE">📝 Not</MenuItem>
                        <MenuItem value="CALL">📞 Telefon Görüşmesi</MenuItem>
                        <MenuItem value="EMAIL">📧 Email</MenuItem>
                        <MenuItem value="MEETING">📅 Toplantı</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Başlık"
                      value={newNote.title}
                      onChange={handleNoteChange('title')}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Açıklama"
                      value={newNote.description}
                      onChange={handleNoteChange('description')}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddNote}
                      disabled={!newNote.title.trim()}
                      startIcon={<span>➕</span>}
                    >
                      Ekle
                    </Button>
                  </Box>
                </Card>

                {/* Mevcut Etkileşimler */}
                <Typography variant="h6" gutterBottom>
                  Etkileşim Geçmişi ({interactions.length})
                </Typography>
                {interactions.length > 0 ? (
                  <List>
                    {interactions.map((interaction, index) => (
                      <Box key={interaction.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemIcon>
                            {getInteractionIcon(interaction.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {interaction.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(interaction.date)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Chip 
                                  label={interaction.type} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }}
                                />
                                {interaction.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {interaction.description}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < interactions.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    Henüz etkileşim geçmişi bulunmuyor.
                  </Typography>
                )}
              </Box>
            )}

            {/* Tab 2: Detaylar & Geçmiş (diğer tab'lardan sonra ekleyin) */}
            {tabValue === 2 && editMode && (
              <Box>
                {/* Müşteri Meta Bilgileri */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>ℹ️</span>
                      Müşteri Bilgileri
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                      {/* Kaynak Bilgisi */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Kaynak
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getSourceText(editingCustomer?.source || 'MANUAL')}
                        </Typography>
                      </Box>

                      {/* Durum Bilgisi */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Durum
                        </Typography>
                        <Chip 
                          label={getStatusText(editingCustomer?.status || 'ACTIVE').text}
                          color={getStatusText(editingCustomer?.status || 'ACTIVE').color}
                          size="small"
                        />
                      </Box>

                      {/* Oluşturma Tarihi */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Oluşturma Tarihi
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>📅</span>
                          {editingCustomer?.createdAt 
                            ? new Date(editingCustomer.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Belirtilmemiş'
                          }
                        </Typography>
                      </Box>

                      {/* Son Güncelleme */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Son Güncelleme
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>🔄</span>
                          {editingCustomer?.updatedAt 
                            ? new Date(editingCustomer.updatedAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Güncellenmemiş'
                          }
                        </Typography>
                      </Box>

                      {/* Müşteri ID */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Müşteri ID
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'monospace' }}>
                          <span>🔢</span>
                          {editingCustomer?.id || 'N/A'}
                        </Typography>
                      </Box>

                      {/* Toplam Etkileşim */}
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Toplam Etkileşim
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>💬</span>
                          {interactions.length} etkileşim
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Etkileşim İstatistikleri */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>📊</span>
                      Etkileşim İstatistikleri
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      {/* Etkileşim Türü Dağılımı */}
                      {['CALL', 'EMAIL', 'MEETING', 'NOTE'].map(type => {
                        const count = interactions.filter(i => i.type === type).length
                        const icon = {
                          'CALL': '📞',
                          'EMAIL': '📧', 
                          'MEETING': '📅',
                          'NOTE': '📝'
                        }[type]
                        
                        const label = {
                          'CALL': 'Telefon',
                          'EMAIL': 'Email',
                          'MEETING': 'Toplantı', 
                          'NOTE': 'Not'
                        }[type]

                        return (
                          <Box key={type} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                            <Box 
                              sx={{ 
                                fontSize: '32px',          // ✅ Font boyutu artırıldı
                                width: '64px',             // ✅ Genişlik eklendi
                                height: '64px',            // ✅ Yükseklik eklendi
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',     // ✅ Alt boşluk artırıldı
                                padding: '12px',           // ✅ İç boşluk eklendi
                                borderRadius: '50%',       // ✅ Yuvarlak arka plan
                                backgroundColor: type === 'CALL' ? '#e8f5e8' : 
                                                type === 'EMAIL' ? '#e3f2fd' : 
                                                type === 'MEETING' ? '#fff3e0' : 
                                                '#f3e5f5'  // ✅ Tür bazlı arka plan rengi
                              }}
                            >
                              {icon}
                            </Box>
                            <Typography variant="h6" color="primary">
                              {count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {label}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  </CardContent>
                </Card>

                {/* Son Etkileşimler */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>⏰</span>
                      Son Etkileşimler
                    </Typography>
                    
                    {interactions.length > 0 ? (
                      <Box>
                        {interactions.slice(0, 3).map((interaction, index) => (
                          <Box 
                            key={interaction.id}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              p: 2, 
                              border: '1px solid', 
                              borderColor: 'divider', 
                              borderRadius: 1,
                              mb: index < 2 ? 1 : 0
                            }}
                          >
                            <Box>
                              {getInteractionIcon(interaction.type)}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {interaction.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(interaction.date)}
                              </Typography>
                            </Box>
                            <Chip 
                              label={interaction.type} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        ))}
                        
                        {interactions.length > 3 && (
                          <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => setTabValue(1)}
                            >
                              Tüm Etkileşimleri Gör ({interactions.length})
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography color="text.secondary" textAlign="center" py={4}>
                        Henüz etkileşim bulunmuyor.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Box>
                {editMode && (
                  <Button 
                    onClick={() => openDeleteDialog(editingCustomer)}
                    color="error"
                    variant="outlined"
                    startIcon={<span>🗑️</span>}
                  >
                    Sil
                  </Button>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleCloseDialog}>
                  İptal
                </Button>
                <Button 
                  onClick={handleSaveCustomer}
                  variant="contained"
                  disabled={!customerForm.companyName?.trim()}
                >
                  {editMode ? 'Güncelle' : 'Kaydet'}
                </Button>
              </Box>
            </Box>
          </DialogActions>
        </Dialog>

        {/* Silme Onay Dialog'u */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Müşteri Silme Onayı
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>{customerToDelete?.companyName}</strong> adlı müşteriyi silmek istediğinizden emin misiniz?
              <br /><br />
              Bu işlem geri alınamaz ve müşteriye ait tüm etkileşim geçmişi de silinecektir.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>
              İptal
            </Button>
            <Button 
              onClick={handleDeleteCustomer}
              color="error"
              variant="contained"
              startIcon={<span>🗑️</span>}
            >
              Sil
            </Button>
          </DialogActions>
        </Dialog>

        {/* İçe Aktarma Menu'sunu ekleyin (diğer Dialog'lardan önce) */}
        <Menu
          anchorEl={importMenuAnchor}
          open={Boolean(importMenuAnchor)}
          onClose={handleImportMenuClose}
        >
          <MenuList>
            <MenuItem onClick={downloadTemplate}>
              <ListItemText>
                <Box display="flex" alignItems="center" gap={1}>
                  <span>📄</span>
                  Şablon İndir
                </Box>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ width: '100%', cursor: 'pointer' }}>
                <ListItemText>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>📤</span>
                    Şablon Yükle
                  </Box>
                </ListItemText>
              </label>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Yükleme Progress Dialog'u */}
        <Dialog open={isUploading && !previewDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} />
              Dosya İşleniyor...
            </Box>
          </DialogTitle>
          <DialogContent>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {uploadProgress.toFixed(0)}% tamamlandı
            </Typography>
          </DialogContent>
        </Dialog>

        {/* Önizleme Dialog'u */}
        <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            İçe Aktarma Önizlemesi
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>{previewData?.length || 0}</strong> müşteri bulundu. İlk 5 kayıt:
            </Alert>
            
            {previewData && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Şirket Adı</TableCell>
                      <TableCell>İletişim Kişisi</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Telefon</TableCell>
                      <TableCell>Şehir</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.slice(0, 5).map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>{customer.companyName}</TableCell>
                        <TableCell>{customer.contactName}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.city}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {previewData && previewData.length > 5 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ... ve {previewData.length - 5} kayıt daha
              </Typography>
            )}
            
            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {uploadProgress.toFixed(0)}% - Müşteriler ekleniyor...
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setPreviewDialog(false)
                setPreviewData(null)
              }}
              disabled={isUploading}
            >
              İptal
            </Button>
            <Button 
              onClick={confirmImport}
              variant="contained"
              disabled={isUploading}
              startIcon={<span>✅</span>}
            >
              Onayla ve İçe Aktar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Seçili müşteri sayısını göstermek için toolbar (opsiyonel) */}
        {selectedCustomers.length > 0 && (
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 1,
              mb: 2
            }}
          >
            <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
              {selectedCustomers.length} müşteri seçildi
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={exportSelectedCustomers}
                startIcon={<span>📊</span>}
              >
                Dışa Aktar
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleBulkDeleteStart}
                startIcon={<span>🗑️</span>}
              >
                Seçilileri Sil ({selectedCustomers.length})
              </Button>
            </Box>
          </Toolbar>
        )}

        {/* 1. Onay Dialog'u - İlk Uyarı */}
        <Dialog
          open={bulkDeleteDialogOpen}
          onClose={handleBulkDeleteCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>⚠️</span>
            Toplu Müşteri Silme - İlk Onay
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <strong>{bulkDeletingCustomers.length}</strong> müşteriyi silmek üzeresiniz!
            </Alert>
            
            <Typography variant="body1" gutterBottom>
              Silinecek müşteriler:
            </Typography>
            
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
              {bulkDeletingCustomers.map((customer, index) => (
                <Box key={customer.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <span>🏢</span>
                  <Typography variant="body2">
                    <strong>{customer.companyName}</strong>
                    {customer.contactName && ` - ${customer.contactName}`}
                    {customer.email && ` (${customer.email})`}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>DİKKAT:</strong> Bu işlem geri alınamaz! Tüm müşteri bilgileri ve etkileşim geçmişleri kalıcı olarak silinecektir.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBulkDeleteCancel} variant="outlined">
              İptal
            </Button>
            <Button 
              onClick={handleBulkDeleteConfirm}
              color="warning"
              variant="contained"
              startIcon={<span>⚠️</span>}
            >
              Devam Et
            </Button>
          </DialogActions>
        </Dialog>

        {/* 2. Onay Dialog'u - Son Uyarı */}
        <Dialog
          open={bulkDeleteConfirmOpen}
          onClose={handleBulkDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <span>🚨</span>
            SON UYARI - Toplu Silme Onayı
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {bulkDeletingCustomers.length} MÜŞTERİ SİLİNECEK!
              </Typography>
              <Typography variant="body2">
                Bu işlem GERİ ALINAMAZ ve TÜM VERİLER kalıcı olarak kaybolacaktır.
              </Typography>
            </Alert>
            
            <Typography variant="body1" textAlign="center" sx={{ my: 3 }}>
              Bu işlemi gerçekleştirmek istediğinizden <strong>EMİN MİSİNİZ?</strong>
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Chip 
                label={`${bulkDeletingCustomers.length} Müşteri`} 
                color="error" 
                size="large"
                icon={<span>🗑️</span>}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              onClick={handleBulkDeleteCancel}
              variant="outlined"
              size="large"
              sx={{ minWidth: '120px' }}
            >
              HAYIR, İptal Et
            </Button>
            <Button 
              onClick={handleBulkDeleteExecute}
              color="error"
              variant="contained"
              size="large"
              startIcon={<span>💀</span>}
              sx={{ minWidth: '120px' }}
            >
              EVET, SİL!
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default MusteriYonetimi
