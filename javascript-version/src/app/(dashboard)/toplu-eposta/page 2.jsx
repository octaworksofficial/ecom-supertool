'use client'

// React Imports
import crypto from 'crypto'

import { useState, useEffect, useCallback, useMemo } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Alert,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Badge,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuList,
  ListItemIcon
} from '@mui/material'

// React-Quill import with full CSS support
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Editor yükleniyor...</p>
})

import 'react-quill/dist/quill.snow.css'

// Quill editor custom CSS
const injectQuillStyles = () => {
  if (typeof document !== 'undefined') {
    // Remove existing custom styles first
    const existingStyle = document.getElementById('custom-quill-styles')

    if (existingStyle) {
      existingStyle.remove()
    }
    
    // Detect dark mode
    const isDarkMode = document.documentElement.getAttribute('data-mui-color-scheme') === 'dark' ||
                      document.body.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const textColor = isDarkMode ? '#e0e0e0' : '#333'
    const bgColor = isDarkMode ? '#1e1e1e' : '#ffffff'
    const borderColor = isDarkMode ? '#404040' : '#ddd'
    const tableBgColor = isDarkMode ? '#2a2a2a' : '#f5f5f5'
    
    const style = document.createElement('style')

    style.id = 'custom-quill-styles'
    style.innerHTML = `
      /* FORCE OVERRIDE ALL MUI AND QUILL STYLES - DARK MODE COMPATIBLE */
      .ql-editor *, .email-preview-content *, .ql-editor, .email-preview-content {
        font-family: Arial, Helvetica, sans-serif !important;
        line-height: 1.6 !important;
        color: ${textColor} !important;
        box-sizing: border-box !important;
      }
      
      /* Headers - FORCE STYLING - DARK MODE COMPATIBLE */
      .ql-editor h1, .email-preview-content h1 {
        font-size: 28px !important;
        font-weight: bold !important;
        margin: 16px 0 12px 0 !important;
        color: ${textColor} !important;
        line-height: 1.2 !important;
        display: block !important;
      }
      
      .ql-editor h2, .email-preview-content h2 {
        font-size: 24px !important;
        font-weight: bold !important;
        margin: 16px 0 12px 0 !important;
        color: ${textColor} !important;
        line-height: 1.2 !important;
        display: block !important;
      }
      
      .ql-editor h3, .email-preview-content h3 {
        font-size: 20px !important;
        font-weight: bold !important;
        margin: 16px 0 12px 0 !important;
        color: ${textColor} !important;
        line-height: 1.2 !important;
        display: block !important;
      }
      
      /* Paragraphs - FORCE STYLING - DARK MODE COMPATIBLE */
      .ql-editor p, .email-preview-content p {
        margin: 0 0 12px 0 !important;
        padding: 0 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        color: ${textColor} !important;
        display: block !important;
        font-weight: normal !important;
      }
      
      /* BUTTONS - KRITIK STYLING */
      .ql-editor button, .email-preview-content button {
        background-color: #1976d2 !important;
        background: #1976d2 !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        padding: 12px 24px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        text-decoration: none !important;
        display: inline-block !important;
        margin: 8px 4px !important;
        transition: all 0.2s ease !important;
        min-height: auto !important;
        height: auto !important;
        width: auto !important;
        box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3) !important;
        text-align: center !important;
        vertical-align: middle !important;
        line-height: 1.2 !important;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      
      .ql-editor button:hover, .email-preview-content button:hover {
        background-color: #1565c0 !important;
        background: #1565c0 !important;
        box-shadow: 0 4px 8px rgba(25, 118, 210, 0.4) !important;
        transform: translateY(-1px) !important;
      }
      
      .ql-editor button:active, .email-preview-content button:active {
        transform: translateY(0) !important;
        box-shadow: 0 2px 4px rgba(25, 118, 210, 0.3) !important;
      }
      
      /* Links - FORCE STYLING */
      .ql-editor a, .email-preview-content a {
        color: #1976d2 !important;
        text-decoration: underline !important;
        cursor: pointer !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        display: inline !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      .ql-editor a:hover, .email-preview-content a:hover {
        color: #1565c0 !important;
        text-decoration: underline !important;
      }
      
      /* Tables - FORCE STYLING - DARK MODE COMPATIBLE */
      .ql-editor table, .email-preview-content table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 12px 0 !important;
        font-size: 14px !important;
        display: table !important;
      }
      
      .ql-editor td, .ql-editor th, .email-preview-content td, .email-preview-content th {
        border: 1px solid ${borderColor} !important;
        padding: 12px !important;
        text-align: left !important;
        font-size: 14px !important;
        color: ${textColor} !important;
        display: table-cell !important;
        vertical-align: top !important;
      }
      
      .ql-editor th, .email-preview-content th {
        background-color: ${tableBgColor} !important;
        font-weight: bold !important;
      }
      
      /* Text formatting - FORCE STYLING */
      .ql-editor strong, .ql-editor b, .email-preview-content strong, .email-preview-content b {
        font-weight: bold !important;
        color: inherit !important;
        display: inline !important;
      }
      
      .ql-editor em, .ql-editor i, .email-preview-content em, .email-preview-content i {
        font-style: italic !important;
        color: inherit !important;
        display: inline !important;
      }
      
      /* Lists - FORCE STYLING - DARK MODE COMPATIBLE */
      .ql-editor ul, .ql-editor ol, .email-preview-content ul, .email-preview-content ol {
        margin: 0 0 12px 20px !important;
        padding: 0 !important;
        display: block !important;
      }
      
      .ql-editor li, .email-preview-content li {
        margin: 0 0 4px 0 !important;
        padding: 0 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        color: ${textColor} !important;
        display: list-item !important;
      }
      
      /* Dividers - FORCE STYLING - DARK MODE COMPATIBLE */
      .ql-editor hr, .email-preview-content hr {
        border: none !important;
        border-top: 1px solid ${borderColor} !important;
        margin: 16px 0 !important;
        padding: 0 !important;
        display: block !important;
        height: 1px !important;
        width: 100% !important;
      }
      
      /* Images - FORCE STYLING */
      .ql-editor img, .email-preview-content img {
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
        margin: 8px 0 !important;
      }
      
      /* Divs - FORCE STYLING */
      .ql-editor div, .email-preview-content div {
        font-size: inherit !important;
        color: inherit !important;
        line-height: inherit !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Spans - FORCE STYLING */
      .ql-editor span, .email-preview-content span {
        font-size: inherit !important;
        color: inherit !important;
        display: inline !important;
      }
      
      /* Reset all default browser and framework styles */
      .ql-editor *, .email-preview-content * {
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
      }
      
      /* Quill specific overrides */
      .ql-editor.ql-blank::before {
        color: #999 !important;
        font-style: italic !important;
      }
    `
    document.head.appendChild(style)
    
    console.log('🎨 Custom Quill styles injected!')
  }
}

// Template initial data - TEK TANIMLA
const defaultTemplates = [
  {
    id: 1,
    name: 'Hoş Geldin Mesajı (Görsel Editör)',
    subject: 'Hoş Geldiniz! - {company}',
    content: `<h2>Merhaba {contactName},</h2>
    <p><strong>{company}</strong> firmasına hoş geldiniz!</p>
    <p>Size en iyi hizmeti sunmak için buradayız. Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin.</p>
    <p>Saygılarımızla,<br>Ecom SuperTool Ekibi</p>`,
    isHtml: true,
    createdAt: '2025-08-20T15:00:00.000Z'
  },
  {
    id: 2,
    name: 'Ürün Tanıtımı (Görsel Editör)',
    subject: 'Yeni Ürünlerimiz - Özel Fırsat!',
    content: `<h2>Değerli {contactName},</h2>
    <p>Yeni ürün gamımızı tanıtmaktan mutluluk duyuyoruz!</p>
    <ul>
      <li>✨ Yeni özellikler</li>
      <li>💰 Özel indirimler</li>
      <li>🚀 Hızlı teslimat</li>
    </ul>
    <p>Detaylar için hemen iletişime geçin!</p>
    <p>İyi günler dileriz.</p>`,
    isHtml: true,
    createdAt: '2025-08-20T15:01:00.000Z'
  },
  {
    id: 3,
    name: 'Kampanya Duyurusu (Ham HTML)',
    subject: 'Büyük Kampanya! Kaçırmayın!',
    content: `<!DOCTYPE html>
<html>
<head>
<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .header {
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  }
  .content {
    background-color: #f8f9fa;
    padding: 20px;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  .button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  .footer {
    background-color: #343a40;
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 12px;
    border-radius: 0 0 10px 10px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÜYÜK KAMPANYA!</h1>
      <p>Değerli {contactName}, size özel indirimler</p>
    </div>
    <div class="content">
      <h2>Fırsatları Kaçırmayın</h2>
      <p>Sadece bu hafta <strong>tüm ürünlerde %50'ye varan indirimler</strong> sizleri bekliyor.</p>
      <p>Kampanya 5 gün içinde sona erecek!</p>
      <div style="text-align: center;">
        <a href="https://example.com/campaign" class="button">HEMEN ALIŞVERİŞE BAŞLA</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2023 {company} - Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>`,
    isHtml: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Takip Mesajı (Görsel Editör)',
    subject: 'Görüşmemizin Takibi',
    content: `<p>Merhaba {contactName},</p>

<p>Geçen hafta <strong>{company}</strong> ile yaptığımız görüşme için teşekkür ederiz.</p>

<p>Konuştuğumuz konular:</p>
<ul>
  <li>Ürün detayları</li>
  <li>Fiyat bilgisi</li>
  <li>Teslimat süreci</li>
</ul>

<p>Başka sorularınız varsa lütfen bizimle iletişime geçin.</p>

<p>Saygılarımızla,</p>
<strong>Ecom SuperTool</strong>`,
    isHtml: true,
    createdAt: new Date().toISOString()
  }
]

const TopluEposta = () => {
  // Inject custom CSS for Quill editor on component mount and theme changes
  useEffect(() => {
    injectQuillStyles()
    
    // Listen for theme changes
    const handleThemeChange = () => {
      setTimeout(() => injectQuillStyles(), 100)
    }
    
    // Watch for attribute changes on documentElement (for MUI theme)
    const observer = new MutationObserver(handleThemeChange)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mui-color-scheme', 'class']
    })
    
    // Watch for changes in body class (for other dark mode implementations)
    const bodyObserver = new MutationObserver(handleThemeChange)

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    mediaQuery.addListener(handleThemeChange)
    
    return () => {
      observer.disconnect()
      bodyObserver.disconnect()
      mediaQuery.removeListener(handleThemeChange)
    }
  }, [])

  // States
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    isHtml: true
  })

  const [gmailConfig, setGmailConfig] = useState({
    email: '',
    password: ''
  })

  const [sendingProgress, setSendingProgress] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [configDialog, setConfigDialog] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Pagination states
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Template states
  const [templates, setTemplates] = useState([])
  const [templateDialog, setTemplateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)

  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    content: '',
    isHtml: true,
    description: '',
    category: 'General'
  })

  const [templateMenuAnchor, setTemplateMenuAnchor] = useState(null)
  const [selectedTemplateForMenu, setSelectedTemplateForMenu] = useState(null)
  
  // Filtreleme state'leri
  const [filters, setFilters] = useState({
    emailInteraction: 'all', // all, contacted, not_contacted
    source: 'all', // all, MANUAL, IMPORT, GMAPS, WEBSITE
    status: 'all' // all, ACTIVE, INACTIVE
  })

  // OAuth states
  const [oauthTokens, setOauthTokens] = useState(null)
  const [isOauthAuthorized, setIsOauthAuthorized] = useState(false)

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      // CSS'leri korumak için clipboard ayarları
      matchVisual: false,
    }
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'align', 'list', 'bullet',
    'link', 'image', 'blockquote', 'code-block',
    'style' // Style attribute'unu dahil et
  ]

  // Fetch customers and templates on mount
  useEffect(() => {
    fetchCustomers()
    loadTemplates()
  }, [])

  // Load templates from database
  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates')

      if (response.ok) {
        const templates = await response.json()

        setTemplates(templates)
      } else {
        console.error('Template yükleme hatası')

        // Fallback to default templates
        setTemplates(defaultTemplates)
      }
    } catch (error) {
      console.error('Template yükleme hatası:', error)

      // Fallback to default templates
      setTemplates(defaultTemplates)
    }
  }

  // Save template to database
  const saveTemplate = async (templateData) => {
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      })

      if (response.ok) {
        const newTemplate = await response.json()

        setTemplates(prev => [...prev, newTemplate])
        
return newTemplate
      } else {
        const errorData = await response.json()

        throw new Error(errorData.error || 'Template kaydetme hatası')
      }
    } catch (error) {
      console.error('Template kaydetme hatası:', error)
      throw error
    }
  }

  // Update template in database
  const updateTemplate = async (id, templateData) => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      })

      if (response.ok) {
        const updatedTemplate = await response.json()

        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t))
        
return updatedTemplate
      } else {
        const errorData = await response.json()

        throw new Error(errorData.error || 'Template güncelleme hatası')
      }
    } catch (error) {
      console.error('Template güncelleme hatası:', error)
      throw error
    }
  }

  // Delete template from database
  const deleteTemplate = async (id) => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id))
        
return true
      } else {
        throw new Error('Template silme hatası')
      }
    } catch (error) {
      console.error('Template silme hatası:', error)
      throw error
    }
  }

  // Check URL parameters for OAuth result - Enhanced error handling
  useEffect(() => {
    // Client-side only - prevent hydration mismatch
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.get('oauth_success') === 'true') {
      const accessToken = urlParams.get('access_token')
      const refreshToken = urlParams.get('refresh_token')
      const expiryDate = urlParams.get('expiry_date')
      
      console.log('OAuth success params:', {
        accessToken: !!accessToken,
        accessTokenLength: accessToken?.length,
        refreshToken: !!refreshToken,
        expiryDate
      })
      
      if (accessToken) {
        const tokens = {
          access_token: accessToken,
          refresh_token: refreshToken || null,
          expiry_date: parseInt(expiryDate) || (Date.now() + 3600000)
        }
        
        setOauthTokens(tokens)
        setIsOauthAuthorized(true)
        setSuccess('✅ Gmail yetkilendirmesi başarılı! Email gönderebilirsiniz.')
        
        // LocalStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('gmail_oauth_tokens', JSON.stringify(tokens))
        }
        
        // URL'yi temizle
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      } else {
        setError('❌ OAuth başarılı ama access token alınamadı')

        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    } else if (urlParams.get('error')) {
      const error = urlParams.get('error')
      const details = urlParams.get('details')
      
      console.error('OAuth error from URL:', { error, details })
      
      let userFriendlyMessage = 'OAuth yetkilendirme hatası'
      
      switch (error) {
        case 'token_exchange_failed':
          userFriendlyMessage = 'Google ile token değişimi başarısız. Lütfen tekrar deneyin.'
          break
        case 'invalid_authorization_code':
          userFriendlyMessage = 'Yetkilendirme kodu geçersiz. Lütfen yeniden yetkilendirin.'
          break
        case 'redirect_uri_mismatch':
          userFriendlyMessage = 'Google Console ayarları hatalı. Redirect URI kontrol edin.'
          break
        case 'network_error':
          userFriendlyMessage = 'Ağ bağlantısı sorunu. İnternet bağlantınızı kontrol edin.'
          break
        case 'missing_oauth_config':
          userFriendlyMessage = 'OAuth yapılandırması eksik. Environment variables kontrol edin.'
          break
        case 'no_tokens_received':
          userFriendlyMessage = 'Google\'dan token alınamadı. Lütfen tekrar deneyin.'
          break
        default:
          userFriendlyMessage = `OAuth hatası: ${error}`
      }
      
      setError(`❌ ${userFriendlyMessage}${details ? ` (${details})` : ''}`)

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Load saved tokens on mount
  useEffect(() => {
    // Client-side only - prevent hydration mismatch
    if (typeof window === 'undefined') return
    
    const savedTokens = localStorage.getItem('gmail_oauth_tokens')

    if (savedTokens) {
      try {
        const tokens = JSON.parse(savedTokens)
        
        // Token'ın süresi dolmadığını kontrol et
        if (tokens.expiry_date && tokens.expiry_date > Date.now()) {
          setOauthTokens(tokens)
          setIsOauthAuthorized(true)
        } else {
          // Süresi dolmuş token'ı temizle
          localStorage.removeItem('gmail_oauth_tokens')
        }
      } catch (error) {
        console.error('Token parse error:', error)
        localStorage.removeItem('gmail_oauth_tokens')
      }
    }
  }, [])

  // Gmail OAuth Authorization - Ana pencerede yönlendir
  const handleGmailOAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting OAuth flow...')
      
      const response = await fetch('/api/auth/gmail')
      const data = await response.json()
      
      console.log('OAuth API response:', data)
      
      if (data.success && data.authUrl) {
        console.log('Redirecting to:', data.authUrl)

        // Ana pencerede OAuth sayfasına git
        window.location.href = data.authUrl
      } else {
        setError(`OAuth hatası: ${data.error || 'Bilinmeyen hata'}`)
        console.error('OAuth error details:', data)
      }
    } catch (error) {
      console.error('OAuth start error:', error)
      setError('Gmail yetkilendirmesi başlatılamadı: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filtre değiştiğinde müşterileri filtrele
  useEffect(() => {
    applyFilters()
  }, [customers, filters, searchTerm])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      
      if (response.ok) {
        const data = await response.json()

        // Sadece email'i olan müşterileri filtrele
        const customersWithEmail = data.filter(customer => customer.email && customer.email.trim() !== '')

        setCustomers(customersWithEmail)
      }
    } catch (error) {
      console.error('Müşteriler yüklenirken hata:', error)
      setError('Müşteri listesi yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...customers]

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()

      filtered = filtered.filter(customer => 
        customer.companyName?.toLowerCase().includes(search) ||
        customer.contactName?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search)
      )
    }

    // Email etkileşimi filtresi
    if (filters.emailInteraction === 'contacted') {
      filtered = filtered.filter(customer => 
        customer.interactions && customer.interactions.some(interaction => 
          interaction.type === 'EMAIL'
        )
      )
    } else if (filters.emailInteraction === 'not_contacted') {
      filtered = filtered.filter(customer => 
        !customer.interactions || !customer.interactions.some(interaction => 
          interaction.type === 'EMAIL'
        )
      )
    }

    // Kaynak filtresi
    if (filters.source !== 'all') {
      filtered = filtered.filter(customer => customer.source === filters.source)
    }

    // Durum filtresi
    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => customer.status === filters.status)
    }

    setFilteredCustomers(filtered)
    
    // Seçili müşterileri güncelle (filtrelenenler arasında olmayanları kaldır)
    const filteredIds = filtered.map(c => c.id)

    setSelectedCustomers(prev => prev.filter(id => filteredIds.includes(id)))
    
    // Sayfa sıfırla eğer mevcut sayfa geçerliz değilse
    const maxPage = Math.ceil(filtered.length / rowsPerPage) - 1

    if (page > maxPage && maxPage >= 0) {
      setPage(0)
    }
  }, [customers, filters, searchTerm, page, rowsPerPage])

  // Paginated customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = page * rowsPerPage

    
return filteredCustomers.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredCustomers, page, rowsPerPage])

  // Template functions
  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setTemplateData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      isHtml: template.isHtml,
      description: template.description || '',
      category: template.category || 'General'
    })
    setTemplateDialog(true)
  }

  const handleSaveTemplate = async () => {
    // Validation - daha detaylı kontrol
    const errors = []
    
    if (!templateData.name.trim()) {
      errors.push('Taslak adı')
    }
    
    if (!templateData.subject.trim()) {
      errors.push('Email başlığı')
    }
    
    if (!templateData.content.trim()) {
      errors.push('Email içeriği')
    }
    
    if (errors.length > 0) {
      setError(`Şu alanlar zorunludur: ${errors.join(', ')}`)
      
return
    }

    try {
      setLoading(true)
      
      const templatePayload = {
        name: templateData.name.trim(),
        subject: templateData.subject.trim(),
        content: templateData.content.trim(),
        isHtml: templateData.isHtml,
        description: templateData.description?.trim() || null,
        category: templateData.category || 'General'
      }
      
      if (editingTemplate) {
        // Güncelleme
        await updateTemplate(editingTemplate.id, templatePayload)
        setSuccess('Taslak güncellendi!')
      } else {
        // Yeni oluşturma
        await saveTemplate(templatePayload)
        setSuccess('Yeni taslak oluşturuldu!')
      }
      
      setTemplateDialog(false)
      setEditingTemplate(null)
      setTemplateData({
        name: '',
        subject: '',
        content: '',
        isHtml: true,
        description: '',
        category: 'General'
      })
    } catch (error) {
      console.error('Template save error:', error)
      setError('Taslak kaydedilemedi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    try {
      setLoading(true)
      await deleteTemplate(templateId)
      setSuccess('Taslak silindi!')
      setTemplateMenuAnchor(null)
    } catch (error) {
      setError('Taslak silinemedi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (template) => {
    setEmailData({
      subject: template.subject,
      content: template.content,
      isHtml: template.isHtml
    })
    setSuccess(`"${template.name}" taslağı yüklendi! ${!template.isHtml ? '(Ham HTML Modu)' : ''}`)
    setTemplateMenuAnchor(null)
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setTemplateData({
      name: '',
      subject: '',
      content: '',
      isHtml: true,
      description: '',
      category: 'General'
    })
    setTemplateDialog(true)
  }

  // --- ÖNİZLEME: Dialog yerine yeni sekme aç ---
  const openPreviewTab = useCallback(() => {
    if (!emailData.content.trim()) {
      setError('Önizleme için içerik gerekli')
      
return
    }

    // Değişkenleri örnek placeholder ile göster (gerçek gönderimde zaten değişiyor)
    const demoHtml = emailData.content
      .replace(/{company}/g, 'Örnek Şirket')
      .replace(/{contactName}/g, 'Örnek Kişi')
      .replace(/{email}/g, 'ornek@mail.com')

    const htmlDoc = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<title>${emailData.subject || 'Email Preview'}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;margin:0;padding:24px;line-height:1.6;color:#333;}
  .wrap{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.08);overflow:hidden;}
  .hdr{background:#1976d2;color:#fff;padding:16px 24px;font-weight:600;font-size:16px;}
  .cnt{padding:24px;}
  .cnt table{border-collapse:collapse;width:100%;}
  .cnt table td,.cnt table th{border:1px solid #ddd;padding:8px;text-align:left;vertical-align:top;}
  .cnt a{color:#1976d2;text-decoration:underline;}
  .cnt a.button,
  .cnt .button,
  .cnt button{background:#1976d2;color:#fff !important;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;border:none;cursor:pointer;font-size:14px;margin:6px 4px;transition:.2s;}
  .cnt a.button:hover,
  .cnt .button:hover,
  .cnt button:hover{background:#1565c0;}
  h1,h2,h3{margin:18px 0 12px;line-height:1.25;}
  p{margin:0 0 12px;}
  ul,ol{margin:0 0 12px 22px;padding:0;}
  hr{border:none;border-top:1px solid #ddd;margin:24px 0;}
  img{max-width:100%;height:auto;display:block;margin:8px 0;}
  pre,code{font-family:Consolas,monospace;font-size:13px;background:#f0f0f0;padding:6px 8px;border-radius:4px;display:block;overflow:auto;}
  .ftr{padding:16px 24px;font-size:12px;color:#666;background:#fafafa;border-top:1px solid #eee;}
</style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">📧 ${emailData.subject || 'Başlıksız Email'}</div>
    <div class="cnt">
      ${demoHtml}
    </div>
    <div class="ftr">
      Preview zamanı: ${new Date().toLocaleString('tr-TR')}
    </div>
  </div>
</body>
</html>`

    const win = window.open('', '_blank')

    if (!win) {
      setError('Popup engellendi, tarayıcı ayarlarını kontrol edin.')
      
return
    }

    win.document.write(htmlDoc)
    win.document.close()
    win.focus()
  }, [emailData, setError])

  const handleSaveCurrentAsTemplate = () => {
    setTemplateData({
      name: '',
      subject: emailData.subject,
      content: emailData.content,
      isHtml: emailData.isHtml
    })
    setEditingTemplate(null)
    setTemplateDialog(true)
  }

  const handleTemplateMenuOpen = (event, template) => {
    event.stopPropagation()
    setTemplateMenuAnchor(event.currentTarget)
    setSelectedTemplateForMenu(template)
  }

  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null)
    setSelectedTemplateForMenu(null)
  }

  // Selection functions
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectAllButton = () => {
    setSelectedCustomers(filteredCustomers.map(c => c.id))
  }

  const handleSelectPageButton = () => {
    const pageCustomerIds = paginatedCustomers.map(c => c.id)

    setSelectedCustomers(prev => [...new Set([...prev, ...pageCustomerIds])])
  }

  const handleSelectPage = (event) => {
    if (event.target.checked) {
      const pageCustomerIds = paginatedCustomers.map(c => c.id)

      setSelectedCustomers(prev => [...new Set([...prev, ...pageCustomerIds])])
    } else {
      const pageCustomerIds = paginatedCustomers.map(c => c.id)

      setSelectedCustomers(prev => prev.filter(id => !pageCustomerIds.includes(id)))
    }
  }

  const handleSelectCustomer = useCallback((customerId, event) => {
    if (event) {
      event.stopPropagation()
    }
    
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId)
      } else {
        return [...prev, customerId]
      }
    })
  }, [])

  const handleRowClick = (customerId) => {
    handleSelectCustomer(customerId)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleClearAll = () => {
    setSelectedCustomers([])
  }

  // Send email with OAuth
  const handleSendEmailOAuth = async () => {
    if (!isOauthAuthorized || !oauthTokens) {
      setError('Gmail yetkilendirmesi gerekli')
      
return
    }

    if (!emailData.subject.trim() || !emailData.content.trim()) {
      setError('Email başlığı ve içeriği gereklidir')
      
return
    }

    if (selectedCustomers.length === 0) {
      setError('En az bir alıcı seçmelisiniz')
      
return
    }

    try {
      setIsSending(true)
      setSendingProgress(0)
      setError(null)
      
      const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id))
      let successCount = 0
      let errorCount = 0
      
      // Timestamp-based ID to avoid hydration mismatch
      const campaignId = Math.floor(Math.random() * 2147483647) // SQLite INT sınırları içinde random ID

    
      
      console.log('🚀 Starting bulk email campaign:', {
        campaignId,
        recipientCount: selectedCustomers.length,
        subject: emailData.subject,
        timestamp: new Date().toISOString()
      })

      for (let i = 0; i < selectedCustomerData.length; i++) {
        const customer = selectedCustomerData[i]
        
        // Template değişkenlerini değiştir
        const personalizedSubject = emailData.subject
          .replace(/{company}/g, customer.companyName || '')
          .replace(/{contactName}/g, customer.contactName || '')
          .replace(/{email}/g, customer.email || '')
        
        let personalizedContent = emailData.content
          .replace(/{company}/g, customer.companyName || '')
          .replace(/{contactName}/g, customer.contactName || '')
          .replace(/{email}/g, customer.email || '')
        
        // Raw HTML placeholder değişiklikler - HTML Editör kapalı ise her zaman raw HTML
        const isRawHtmlMode = !emailData.isHtml || emailData.isRawHtml

        if (isRawHtmlMode) {
          personalizedContent = personalizedContent
            .replace(/\[İlgili Kişinin Adı Soyadı\]/g, customer.contactName || 'Değerli Müşterimiz')
            .replace(/\[Adınız Soyadınız\]/g, 'Satış Ekibi')
            .replace(/\[Telefon Numaranız\]/g, '+90 XXX XXX XX XX')
        }
        
        try {
          const response = await fetch('/api/email/send-oauth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: customer.email,
              subject: personalizedSubject,
              content: personalizedContent,
              isHtml: true, // HTML Editör kapalı olsa da HTML olarak gönder
              isRawHtml: isRawHtmlMode, // Raw HTML flag
              tokens: oauthTokens,
              customerId: customer.id,
              campaignId: parseInt(campaignId),
              htmlContent: personalizedContent
            }),
          })

          if (response.ok) {
            successCount++
            console.log(`✅ Email gönderildi: ${customer.email}`)
          } else {
            errorCount++
            const errorData = await response.json()
            
            if (response.status === 401) {
              // Token süresi dolmuş
              setError('Token süresi dolmuş, yeniden yetkilendirme gerekli')
              setIsOauthAuthorized(false)
              setOauthTokens(null)
              localStorage.removeItem('gmail_oauth_tokens')
              break
            }
            
            console.error(`❌ Email gönderilemedi: ${customer.email}`, errorData)
          }
        } catch (emailError) {
          errorCount++
          console.error(`❌ Email gönderim hatası: ${customer.email}`, emailError)
        }

        setSendingProgress(((i + 1) / selectedCustomerData.length) * 100)
        
        // Rate limiting - Gmail API için 1 saniye bekle
        if (i < selectedCustomerData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (successCount > 0) {
        setSuccess(`✅ ${successCount} müşteriye email başarıyla gönderildi!${errorCount > 0 ? ` (${errorCount} hata)` : ''}`)
      } else {
        setError(`❌ Hiçbir email gönderilemedi. ${errorCount} hata oluştu.`)
      }
      
      setSelectedCustomers([])
      setEmailData({ subject: '', content: '', isHtml: true })
      
    } catch (error) {
      console.error('Email gönderimi hatası:', error)
      setError('Email gönderimi sırasında hata oluştu: ' + error.message)
    } finally {
      setIsSending(false)
      setSendingProgress(0)
    }
  }

  const getEmailInteractionIcon = (customer) => {
    const emailInteractions = customer.interactions?.filter(i => i.type === 'EMAIL') || []
    
    if (emailInteractions.length === 0) {
      return (
        <Tooltip title="Henüz email gönderilmedi">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>📬</span>
          </Box>
        </Tooltip>
      )
    }
    
    return (
      <Tooltip title={`${emailInteractions.length} email gönderildi`}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Badge badgeContent={emailInteractions.length} color="primary">
            <span style={{ fontSize: '20px' }}>📧</span>
          </Badge>
        </Box>
      </Tooltip>
    )
  }

  const getSourceColor = (source) => {
    const colors = {
      'MANUAL': 'primary',
      'IMPORT': 'secondary', 
      'GMAPS': 'success',
      'WEBSITE': 'warning'
    }

    
return colors[source] || 'default'
  }

  const steps = [
    'Gmail Yapılandırması',
    'Email İçeriği',
    'Alıcı Seçimi',
    'Gönderim'
  ]

  // Selection statistics
  const pageSelectedCount = paginatedCustomers.filter(c => selectedCustomers.includes(c.id)).length
  const isPageFullySelected = pageSelectedCount === paginatedCustomers.length && paginatedCustomers.length > 0
  const isPagePartiallySelected = pageSelectedCount > 0 && pageSelectedCount < paginatedCustomers.length

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          📧 Toplu Eposta Gönderimi
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            onClick={() => setConfigDialog(true)}
            startIcon={<span>⚙️</span>}
            sx={{ mr: 2 }}
          >
            Gmail Ayarları
          </Button>
          <Chip 
            label={`${selectedCustomers.length} müşteri seçili`}
            color={selectedCustomers.length > 0 ? 'primary' : 'default'}
          />
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Progress Bar */}
      {isSending && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Email gönderiliyor... {Math.round(sendingProgress)}%
          </Typography>
          <LinearProgress variant="determinate" value={sendingProgress} />
        </Box>
      )}

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Email Composer - FULL WIDTH */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>✉️</span>
            Email Kompozisyonu
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Subject */}
              <TextField
                fullWidth
                label="Email Başlığı"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                margin="normal"
                placeholder="Email konusunu yazın... (Değişkenler: {company}, {contactName}, {email})"
              />

              {/* HTML/Text Toggle */}
              <Box sx={{ my: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailData.isHtml}
                      onChange={(e) => setEmailData(prev => ({ ...prev, isHtml: e.target.checked }))}
                    />
                  }
                  label="HTML Editör"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 2, mt: 0.5 }}>
                  {emailData.isHtml ? 'Görsel editör aktif' : 'Ham HTML modu aktif (CSS korunur)'}
                </Typography>
              </Box>

              {/* Content Editor */}
              {emailData.isHtml ? (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email İçeriği (Değişkenler: {'{company}'}, {'{contactName}'}, {'{email}'})
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={openPreviewTab}   // setPreviewDialog kaldırıldı
                      startIcon={<span>👁️</span>}
                    >
                      Önizleme
                    </Button>
                  </Box>
                  <ReactQuill
                    theme="snow"
                    value={emailData.content}
                    onChange={(content) => setEmailData(prev => ({ ...prev, content }))}
                    modules={modules}
                    formats={formats}
                    placeholder="Email içeriğinizi buraya yazın..."
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </Box>
              ) : (

                // HTML Editör kapalı => RAW HTML/Text koru
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  label="Email İçeriği (Raw HTML)"
                  value={emailData.content}
                  onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="HTML / Plain text içeriğinizi buraya yapıştırın (CSS korunur)"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }
                  }}
                  helperText="HTML Editör kapalı: Yapıştırdığınız HTML/CSS aynen korunur ve HTML olarak gönderilir."
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              {/* Email Templates */}
              <Box sx={{ p: 2, borderRadius: 1, height: 'fit-content' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    📝 Email Taslakları ({templates.length})
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleCreateTemplate}
                    sx={{ 
                      minWidth: 'auto', 
                      px: 2, 
                      py: 2,
                      fontSize: '0.75rem'
                    }}
                  >
                    Yeni Taslak
                  </Button>
                </Box>

                {templates.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Henüz taslak yok. İlk taslağınızı oluşturun!
                  </Typography>
                ) : (
                  <List dense>
                    {templates.map((template) => (
                      <ListItem
                        key={template.id}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: 'white',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => handleUseTemplate(template)}
                      >
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {template.name}
                              </Typography>
                              {template.category && (
                                <Chip 
                                  label={template.category} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {template.subject.length > 30 
                                ? template.subject.substring(0, 30) + '...' 
                                : template.subject}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={(e) => handleTemplateMenuOpen(e, template)}
                          >
                            <span>⚙️</span>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}

                {/* Template Variables Info */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" display="block" color="text.secondary">
                  💡 <strong>Kullanılabilir Değişkenler:</strong>
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • {'{company}'} - Şirket adı
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • {'{contactName}'} - İletişim kişisi
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • {'{email}'} - Email adresi
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons - OAuth Version */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={handleSendEmailOAuth}
              disabled={isSending || selectedCustomers.length === 0 || !isOauthAuthorized}
              startIcon={isSending ? <span>⏳</span> : <span>🚀</span>}
              size="large"
            >
              {isSending 
                ? `Gönderiliyor... (${Math.round(sendingProgress)}%)` 
                : `${selectedCustomers.length} Müşteriye Gönder`
              }
            </Button>
            
            {!isOauthAuthorized && (
              <Button 
                variant="outlined"
                onClick={() => setConfigDialog(true)}
                startIcon={<span>🔐</span>}
                size="large"
                color="warning"
              >
                Gmail Yetkilendir
              </Button>
            )}
            
            <Button 
              variant="outlined"
              onClick={openPreviewTab}
              startIcon={<span>👁️</span>}
              size="large"
            >
              Önizleme
            </Button>

            <Button 
              variant="text"
              onClick={() => {
                setEmailData({ subject: '', content: '', isHtml: true })
                setSelectedCustomers([])
              }}
              startIcon={<span>🗑️</span>}
              size="large"
            >
              Temizle
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Customer Selection - FULL WIDTH */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>👥</span>
            Alıcı Müşteriler ({filteredCustomers.length}/{customers.length})
          </Typography>

          {/* Bilgi Notu */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              📋 <strong>Bilgi:</strong> Bu liste Müşteri Yönetimi panelinden email adresi olan müşterileri gösterir. 
              Müşteriyi seçmek için satırın herhangi bir yerine tıklayabilirsiniz.
            </Typography>
          </Alert>

          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder="🔍 Müşteri ara... (şirket, kişi, email)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Filtreler ve Seçim */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  🔍 Filtreler
                </Typography>
                
                <Grid container spacing={2}>
                  {/* Email Etkileşimi Filtresi */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Email Durumu</InputLabel>
                      <Select
                        value={filters.emailInteraction}
                        label="Email Durumu"
                        onChange={(e) => setFilters(prev => ({ ...prev, emailInteraction: e.target.value }))}
                      >
                        <MenuItem value="all">Tümü</MenuItem>
                        <MenuItem value="contacted">📧 Email Gönderildi</MenuItem>
                        <MenuItem value="not_contacted">📬 Email Gönderilmedi</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Kaynak Filtresi */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Kaynak</InputLabel>
                      <Select
                        value={filters.source}
                        label="Kaynak"
                        onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                      >
                        <MenuItem value="all">Tümü</MenuItem>
                        <MenuItem value="MANUAL">Manuel</MenuItem>
                        <MenuItem value="IMPORT">İçe Aktarım</MenuItem>
                        <MenuItem value="GMAPS">Google Maps</MenuItem>
                        <MenuItem value="WEBSITE">Website</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Durum Filtresi */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Durum</InputLabel>
                      <Select
                        value={filters.status}
                        label="Durum"
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <MenuItem value="all">Tümü</MenuItem>
                        <MenuItem value="ACTIVE">Aktif</MenuItem>
                        <MenuItem value="INACTIVE">Pasif</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              {/* Seçim Kontrolü */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✅ Seçim Kontrolleri
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleSelectAllButton}
                    startIcon={<span>☑️</span>}
                  >
                    Tümünü Seç ({filteredCustomers.length})
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleSelectPageButton}
                    startIcon={<span>📄</span>}
                  >
                    Bu Sayfa ({paginatedCustomers.length})
                  </Button>
                  
                  {selectedCustomers.length > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={handleClearAll}
                      startIcon={<span>🗑️</span>}
                    >
                      Temizle
                    </Button>
                  )}
                </Box>

                {/* Seçim İstatistikleri */}
                <Box sx={{ p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" display="block">
                    📊 <strong>Seçim Durumu:</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • Toplam: {customers.length} müşteri
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Filtrelenen: {filteredCustomers.length} müşteri
                  </Typography>
                  <Typography variant="caption" color="primary" display="block">
                    • Seçili: {selectedCustomers.length} müşteri
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <LinearProgress />
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" sx={{ width: 60 }}>
                        <Checkbox
                          checked={isPageFullySelected}
                          indeterminate={isPagePartiallySelected}
                          onChange={handleSelectPage}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>İletişim Kişisi</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Kaynak</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Email Durumu</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id}
                        hover
                        selected={selectedCustomers.includes(customer.id)}
                        onClick={() => handleRowClick(customer.id)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={(e) => handleSelectCustomer(customer.id, e)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {customer.companyName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {customer.contactName || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="primary">
                            {customer.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={customer.source} 
                            size="small" 
                            color={getSourceColor(customer.source)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {getEmailInteractionIcon(customer)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={customer.status} 
                            size="small" 
                            color={customer.status === 'ACTIVE' ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredCustomers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100, 200]}
                labelRowsPerPage="Sayfa başına:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} / ${count !== -1 ? count : `${to}'den fazla`}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Template Menu */}
      <Menu
        anchorEl={templateMenuAnchor}
        open={Boolean(templateMenuAnchor)}
        onClose={handleTemplateMenuClose}
      >
        <MenuList dense>
          <MenuItem onClick={() => {
            handleUseTemplate(selectedTemplateForMenu)
            handleTemplateMenuClose()
          }}>
            <ListItemIcon sx={{ minWidth: '36px' }}>
              🔄
            </ListItemIcon>
            <ListItemText primary="Kullan" />
          </MenuItem>
          <MenuItem onClick={() => {
            handleEditTemplate(selectedTemplateForMenu)
            handleTemplateMenuClose()
          }}>
            <ListItemIcon sx={{ minWidth: '36px' }}>
              ✏️
            </ListItemIcon>
            <ListItemText primary="Düzenle" />
          </MenuItem>
          <MenuItem onClick={() => {
            handleDeleteTemplate(selectedTemplateForMenu.id)
            handleTemplateMenuClose()
          }}>
            <ListItemIcon sx={{ minWidth: '36px' }}>
              🗑️
            </ListItemIcon>
            <ListItemText primary="Sil" />
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Template Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? '✏️ Taslağı Düzenle' : '📝 Yeni Taslak Oluştur'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Taslak Adı"
            value={templateData.name}
            onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            placeholder="Örn: Hoş Geldin Mesajı"
          />

          <TextField
            fullWidth
            label="Açıklama (İsteğe Bağlı)"
            value={templateData.description || ''}
            onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
            placeholder="Bu taslağın ne için kullanılacağını açıklayın"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Kategori</InputLabel>
            <Select
              value={templateData.category || 'General'}
              onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value }))}
              label="Kategori"
            >
              <MenuItem value="General">Genel</MenuItem>
              <MenuItem value="Karşılama">Karşılama</MenuItem>
              <MenuItem value="Pazarlama">Pazarlama</MenuItem>
              <MenuItem value="Takip">Takip</MenuItem>
              <MenuItem value="Duyuru">Duyuru</MenuItem>
              <MenuItem value="Teşekkür">Teşekkür</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Email Başlığı"
            value={templateData.subject}
            onChange={(e) => setTemplateData(prev => ({ ...prev, subject: e.target.value }))}
            margin="normal"
            placeholder="Değişkenler: {company}, {contactName}, {email}"
          />

          <Box sx={{ my: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={templateData.isHtml}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, isHtml: e.target.checked }))}
                />
              }
              label="HTML Editör"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {templateData.isHtml ? 'Görsel editör aktif' : 'Ham HTML modu aktif (CSS korunur)'}
            </Typography>
          </Box>

          {templateData.isHtml ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email İçeriği
              </Typography>
              <ReactQuill
                theme="snow"
                value={templateData.content}
                onChange={(content) => setTemplateData(prev => ({ ...prev, content }))}
                modules={modules}
                formats={formats}
                placeholder="Email taslağınızı buraya yazın..."
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Ham HTML İçeriği"
              value={templateData.content}
              onChange={(e) => setTemplateData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="HTML kodunuzu buraya yapıştırın (CSS dahil). Değişkenler: {company}, {contactName}, {email}"
              margin="normal"
              sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>İptal</Button>
          <Button variant="contained" onClick={handleSaveTemplate}>
            {editingTemplate ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gmail Config Dialog - OAuth Version */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <span>🔐</span>
            Gmail OAuth 2.0 Yetkilendirmesi
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>🔐 OAuth 2.0 Güvenlik:</strong><br/>
              • Google'ın önerdiği güvenli yöntem<br/>
              • Şifre paylaşımı gerekmez<br/>
              • Workspace hesapları için ideal<br/>
              • Token tabanlı erişim
            </Typography>
          </Alert>

          {/* Gmail Config Dialog - Enhanced Error Info */}
          {!isOauthAuthorized ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Gmail Hesabınızı Yetkilendirin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Workspace hesabınız için güvenli OAuth 2.0 yetkilendirmesi
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleGmailOAuth}
                disabled={loading}
                startIcon={loading ? <span>⏳</span> : <span>🔐</span>}
                sx={{ mb: 2 }}
              >
                {loading ? 'Yönlendiriliyor...' : 'Gmail ile Yetkilendir'}
              </Button>
              
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                Google yetkilendirme sayfasına yönlendirileceksiniz
              </Typography>

              {/* Debug Bilgisi */}
              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1, mt: 2 }}>
                <Typography variant="caption" display="block" color="info.main">
                  🔍 <strong>Debug Bilgisi:</strong>
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • Client ID: {process.env.NEXT_PUBLIC_DEBUG ? 'Configured' : 'Check console'}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • Redirect URI: {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/callback
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  • Environment: {process.env.NODE_ENV}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom color="success.main">
                ✅ Gmail Yetkilendirmesi Aktif
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Token süresi: {oauthTokens?.expiry_date ? 
                  new Date(oauthTokens.expiry_date).toLocaleString('tr-TR') : 
                  'Belirsiz'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Workspace hesabınızdan email gönderebilirsiniz<br/>
                Günlük limit: 2,000 email
              </Typography>
              
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  setOauthTokens(null)
                  setIsOauthAuthorized(false)
                  localStorage.removeItem('gmail_oauth_tokens')
                  setSuccess('Yetkilendirme iptal edildi')
                }}
                startIcon={<span>🔓</span>}
              >
                Yetkilendirmeyi İptal Et
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              📊 OAuth 2.0 Avantajları:
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              • ✅ Şifre paylaşımı yok (güvenli)
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              • ✅ Workspace hesapları desteklenir
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              • ✅ "Less secure apps" sorunu yok
            </Typography>
            <Typography variant="caption" display="block">
              • ✅ Google'ın önerdiği standart yöntem
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TopluEposta