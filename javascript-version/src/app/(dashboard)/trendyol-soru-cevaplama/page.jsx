'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  LinearProgress,
  Grid,
  Avatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Snackbar
} from '@mui/material'

// İkon yerine emojiler kullan
const iconEmojis = {
  start: '▶️',
  stop: '⏹️',
  refresh: '🔄',
  settings: '⚙️',
  question: '❓',
  send: '📤',
  check: '✅',
  error: '❌',
  timer: '⏱️',
  view: '👁️',
  edit: '✏️',
  save: '💾',
  cancel: '❌',
  brain: '🧠',
  loading: '⏳',
  success: '✅',
  failure: '💥'
}

const TrendyolSoruCevaplama = () => {
  // State Management
  const [isRunning, setIsRunning] = useState(false)
  const [questions, setQuestions] = useState([])
  const [settings, setSettings] = useState({
    supplierId: '',
    apiKey: '',
    apiSecret: '',
    openaiApiKey: '',
    openaiAssistantId: '',
    openaiModel: 'gpt-4o',
    openaiMaxTokens: 1000,
    openaiTemperature: 0.7,
    autoAnswer: true,
    checkInterval: 30, // saniye
    answerDelay: 5, // saniye
    answerTemplate: `Merhaba,

Sorunuz için teşekkür ederiz. 

{answer}

Başka sorularınız için her zaman buradayız.

İyi günler dileriz.`
  })
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    pendingQuestions: 0,
    todayQuestions: 0,
    averageResponseTime: '0 dk'
  })
  const [logs, setLogs] = useState([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  // Debug için settingsOpen değişimini izle
  useEffect(() => {
    console.log('settingsOpen changed:', settingsOpen)
  }, [settingsOpen])
  const [questionDetailOpen, setQuestionDetailOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [editingAnswer, setEditingAnswer] = useState(false)
  const [customAnswer, setCustomAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false) // Ayarların yüklenip yüklenmediğini takip et
  const [filterStatus, setFilterStatus] = useState('all')
  const [aiLoading, setAiLoading] = useState(false)
  const [quickAnswerStates, setQuickAnswerStates] = useState({}) // Her soru için ayrı durum
  const [botStats, setBotStats] = useState({
    totalProcessed: 0,
    successfulAnswers: 0,
    failedAnswers: 0,
    lastProcessedAt: null,
    uptime: 0,
    queueSize: 0
  })

  // Sadece component mount olduğunda çalışacak useEffect
  useEffect(() => {
    checkBotStatus()
    loadSettings()
  }, []) // Boş dependency array = sadece mount'ta çalışır

  // Settings yüklendikten sonra çalışacak useEffect
  useEffect(() => {
    if (settingsLoaded && settings.supplierId) { // Settings yüklendiyse ve supplierId varsa
      // Settings yüklendiğinde soruları çek
      const timer = setTimeout(() => {
        fetchQuestions()
      }, 500)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [settingsLoaded]) // Sadece settingsLoaded değiştiğinde

  // Periyodik kontroller için ayrı useEffect
  useEffect(() => {
    // Her 30 saniyede bir soruları güncelle
    const questionsInterval = setInterval(() => {
      if (isRunning) {
        fetchQuestions()
      }
    }, 30000)
    
    // Her 10 saniyede bir bot durumunu kontrol et
    const statusInterval = setInterval(() => {
      checkBotStatus()
    }, 10000)

    return () => {
      clearInterval(questionsInterval)
      clearInterval(statusInterval)
    }
  }, [isRunning]) // isRunning değiştiğinde yeniden başlat

  const loadSettings = async () => {
    // Eğer ayarlar zaten yüklenmişse tekrar yükleme
    if (settingsLoaded) {
      console.log('⚠️ Ayarlar zaten yüklendi, tekrar yüklenmeyecek')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/trendyol-settings')
      if (response.ok) {
        const dbSettings = await response.json()
        
        // DB'den gelen ayarları mevcut settings formatına dönüştür
        const updatedSettings = {
          ...settings,
          supplierId: dbSettings.sellerId || '',
          apiKey: dbSettings.apiKey || '',
          apiSecret: dbSettings.secretKey || '',
          openaiApiKey: dbSettings.openaiApiKey || '',
          openaiModel: dbSettings.openaiModel || 'gpt-4o',
          openaiAssistantId: dbSettings.assistantId || '',
          checkInterval: dbSettings.checkInterval || 30
        }
        
        setSettings(updatedSettings)
        setSettingsLoaded(true) // Ayarlar yüklendi olarak işaretle
        console.log('✅ Ayarlar DB\'den yüklendi:', updatedSettings)
      } else {
        console.error('❌ Ayarlar yüklenirken hata:', await response.text())
        // Hata durumunda localStorage'dan yükle (fallback)
        const savedSettings = localStorage.getItem('trendyol_bot_settings')
        if (savedSettings) {
          try {
            setSettings(JSON.parse(savedSettings))
            setSettingsLoaded(true) // localStorage'dan yüklendi olarak işaretle
            console.log('📦 Ayarlar localStorage\'dan yüklendi (fallback)')
          } catch (e) {
            console.error('Settings parse error:', e)
          }
        }
      }
    } catch (error) {
      console.error('❌ Ayarlar yüklenirken hata:', error)
      // Hata durumunda localStorage'dan yükle (fallback)
      const savedSettings = localStorage.getItem('trendyol_bot_settings')
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings))
          setSettingsLoaded(true) // localStorage'dan yüklendi olarak işaretle
          console.log('📦 Ayarlar localStorage\'dan yüklendi (fallback)')
        } catch (e) {
          console.error('Settings parse error:', e)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      
      // Settings'i DB formatına dönüştür
      const dbSettings = {
        sellerId: settings.supplierId || '',
        apiKey: settings.apiKey || '',
        secretKey: settings.apiSecret || '',
        checkInterval: settings.checkInterval || 30,
        openaiApiKey: settings.openaiApiKey || '',
        openaiModel: settings.openaiModel || 'gpt-4o',
        assistantId: settings.openaiAssistantId || '',
        isActive: true
      }
      
      const response = await fetch('/api/trendyol-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dbSettings)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Ayarlar DB\'ye kaydedildi:', result)
        setSuccess('✅ Ayarlar başarıyla kaydedildi!')
        
        // Backup olarak localStorage'a da kaydet
        localStorage.setItem('trendyol_bot_settings', JSON.stringify(settings))
      } else {
        const errorData = await response.text()
        console.error('❌ Ayarlar kaydedilirken hata:', errorData)
        setError('❌ Ayarlar kaydedilirken hata oluştu!')
        
        // Hata durumunda sadece localStorage'a kaydet
        localStorage.setItem('trendyol_bot_settings', JSON.stringify(settings))
      }
    } catch (error) {
      console.error('❌ Ayarlar kaydedilirken hata:', error)
      setError('❌ Ayarlar kaydedilirken hata oluştu!')
      
      // Hata durumunda sadece localStorage'a kaydet
      localStorage.setItem('trendyol_bot_settings', JSON.stringify(settings))
    } finally {
      setLoading(false)
      
      // Mesajları 3 saniye sonra temizle
      setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 3000)
    }
  }

  const checkBotStatus = async () => {
    try {
      const response = await fetch('/api/trendyol/status')
      if (response.ok) {
        const data = await response.json()
        setIsRunning(data.isRunning)
        if (data.stats) {
          setBotStats({
            ...data.stats,
            currentActivity: data.currentActivity,
            nextCheckAt: data.nextCheckAt
          })
        }
      }
    } catch (error) {
      console.error('Status check failed:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // API parameters'ı hazırla
      const params = new URLSearchParams()
      if (settings.supplierId && settings.apiKey && settings.apiSecret) {
        params.append('useRealAPI', 'true')
        params.append('supplierId', settings.supplierId)
        params.append('apiKey', settings.apiKey)
        params.append('apiSecret', settings.apiSecret)
      }
      params.append('orderByField', 'CreatedDate')
      params.append('page', '0') // İlk sayfa
      params.append('size', '100') // 100 soru getir
      
      const response = await fetch(`/api/trendyol/questions?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        const questions = data.questions || []
        setQuestions(questions)
        
        // API'den gelen gerçek verilerle istatistikleri hesapla
        const calculateStats = (questions, apiData) => {
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          
          // API'den gelen toplam değerleri kullan (sayfa x boyut hesaplaması)
          const totalQuestions = apiData?.totalElements || questions.length
          const calculatedTotal = apiData?.totalPages && apiData?.size 
            ? apiData.totalPages * apiData.size 
            : totalQuestions
          
          // Bekleyen sorular - sadece WAITING_FOR_ANSWER statusu olanları say
          const pendingQuestions = questions.filter(q => 
            q.status === 'pending' || q.status === 'WAITING_FOR_ANSWER' || !q.answer
          ).length
          
          // Yanıtlanan sorular
          const answeredQuestions = questions.filter(q => 
            q.status === 'answered' || q.answer
          ).length
          
          // Bugün gelen sorular
          const todayQuestions = questions.filter(q => {
            const questionDate = new Date(q.createdAt || q.creationDate)
            return questionDate >= today
          }).length
          
          return {
            totalQuestions: totalQuestions, // API'den gelen gerçek sayı
            answeredQuestions,
            pendingQuestions,
            todayQuestions,
            averageResponseTime: '2.5 saat',
            totalPages: apiData?.totalPages || Math.ceil(totalQuestions / (apiData?.size || 20)),
            pageSize: apiData?.size || 20,
            calculationInfo: {
              fromAPI: totalQuestions,
              calculated: calculatedTotal,
              pages: apiData?.totalPages,
              size: apiData?.size
            }
          }
        }        // İstatistikleri güncelle
        const newStats = calculateStats(questions, data)
        setStats(newStats)
        
        // API durumuna göre log ve uyarı
        if (data.usingMockData) {
          if (data.apiStatus === 'credentials_missing') {
            addLog(`⚠️ Trendyol API bilgileri eksik - Mock data gösteriliyor`, 'warning')
            setError('Trendyol API bilgileri eksik. Ayarlardan API bilgilerinizi girin.')
          } else {
            addLog(`� Mock data yüklendi (${data.questions?.length || 0} soru)`, 'info')
          }
        } else {
                    addLog(`✅ Trendyol API'den ${questions.length} soru yüklendi (Toplam: ${newStats.totalQuestions}, Bekleyen: ${newStats.pendingQuestions}, Sayfa: ${newStats.pageSize} soru/sayfa)`, 'success')
        }
        
        // Uyarı varsa göster
        if (data.warning) {
          setError(data.warning)
        }
        
      } else {
        throw new Error(data.error || 'Sorular yüklenemedi')
      }
    } catch (error) {
      console.error('Questions fetch failed:', error)
      setError(`Sorular yüklenirken hata: ${error.message}`)
      addLog(`❌ Soru yükleme hatası: ${error.message}`, 'error')
      setQuestions([]) // Hata durumunda boş liste
    } finally {
      setLoading(false)
    }
  }

  const startBot = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/trendyol/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsRunning(true)
        setSuccess('Trendyol bot başlatıldı!')
        addLog('✅ Bot başlatıldı', 'success')
        saveSettings()
      } else {
        throw new Error(data.error || 'Bot başlatılamadı')
      }
    } catch (error) {
      setError(error.message)
      addLog(`❌ Bot başlatma hatası: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const stopBot = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/trendyol/stop', { method: 'POST' })
      
      if (response.ok) {
        setIsRunning(false)
        setSuccess('Trendyol bot durduruldu!')
        addLog('⏹️ Bot durduruldu', 'info')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const answerQuestion = async (questionId, answer = null) => {
    try {
      setLoading(true)
      const response = await fetch('/api/trendyol/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          customAnswer: answer,
          template: settings.answerTemplate,
          settings: settings
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.mock) {
          setSuccess(data.message + ' (API bilgileri eksik)')
          addLog(`⚠️ Mock yanıt gönderildi: ${questionId} - ${data.warning}`, 'warning')
        } else {
          setSuccess(data.message)
          addLog(`✅ Trendyol'a yanıt gönderildi: ${questionId}`, 'success')
        }
        fetchQuestions()
        setQuestionDetailOpen(false)
        setEditingAnswer(false)
        setCustomAnswer('')
      } else {
        throw new Error(data.error || 'Soru yanıtlanamadı')
      }
    } catch (error) {
      setError(error.message)
      addLog(`❌ Yanıtlama hatası: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const generateAiAnswer = async (question) => {
    if (!settings.openaiApiKey) {
      setError('OpenAI API anahtarı eksik! Önce ayarlardan OpenAI bilgilerini girin.')
      addLog('❌ AI yanıt üretilemedi: API anahtarı eksik', 'error')
      return
    }

    try {
      setAiLoading(true)
      setError(null)
      addLog('🤖 ChatGPT\'den yanıt üretiliyor...', 'info')
      
      const response = await fetch('/api/openai/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.questionText,
          productName: question.productName,
          customerName: question.customerName,
          settings: settings
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCustomAnswer(data.answer)
        setSuccess(`✅ AI yanıtı oluşturuldu! ${data.assistantUsed ? '(Özel Asistan)' : '(GPT Model)'}`)
        addLog(`🤖 AI yanıt üretildi (${data.model}, ${data.answer.length} karakter)`, 'success')
      } else {
        throw new Error(data.error || 'AI yanıt üretilemedi')
      }
    } catch (error) {
      setError(`❌ AI yanıt hatası: ${error.message}`)
      addLog(`❌ AI yanıt hatası: ${error.message}`, 'error')
    } finally {
      setAiLoading(false)
    }
  }

  const quickAnswerQuestion = async (question) => {
    if (!settings.openaiApiKey) {
      setError('OpenAI API anahtarı eksik! Hızlı yanıt için OpenAI bilgilerini girin.')
      addLog('❌ Hızlı yanıt başarısız: API anahtarı eksik', 'error')
      return
    }

    const questionId = question.id
    
    try {
      // Loading durumunu başlat
      setQuickAnswerStates(prev => ({
        ...prev,
        [questionId]: { status: 'generating', step: 'AI yanıt üretiliyor...' }
      }))
      
      addLog(`🚀 Hızlı yanıt başlatıldı: ${questionId}`, 'info')
      
      // 1. Adım: AI'dan yanıt al
      const aiResponse = await fetch('/api/openai/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.questionText,
          productName: question.productName,
          customerName: question.customerName,
          settings: settings
        })
      })
      
      const aiData = await aiResponse.json()
      
      if (!aiData.success) {
        throw new Error(aiData.error || 'AI yanıt üretilemedi')
      }
      
      // 2. Adım: Yanıtı Trendyol'a gönder
      setQuickAnswerStates(prev => ({
        ...prev,
        [questionId]: { status: 'sending', step: 'Trendyol\'a gönderiliyor...' }
      }))
      
      const sendResponse = await fetch('/api/trendyol/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          customAnswer: aiData.answer,
          template: settings.answerTemplate,
          settings: settings
        })
      })
      
      const sendData = await sendResponse.json()
      
      if (!sendData.success) {
        throw new Error(sendData.error || 'Yanıt gönderilemedi')
      }
      
      // 3. Adım: Başarı durumu
      setQuickAnswerStates(prev => ({
        ...prev,
        [questionId]: { status: 'success', step: 'Başarıyla gönderildi!' }
      }))
      
      if (sendData.mock) {
        setSuccess(`✅ Hızlı yanıt gönderildi (Mock): ${questionId}`)
        addLog(`⚠️ Hızlı mock yanıt: ${questionId} - AI: ${aiData.answer.length} karakter`, 'warning')
      } else {
        setSuccess(`✅ Hızlı yanıt başarıyla gönderildi: ${questionId}`)
        addLog(`🚀 Hızlı yanıt tamamlandı: ${questionId} - AI: ${aiData.answer.length} karakter`, 'success')
      }
      
      // Soruları yenile
      fetchQuestions()
      
      // 3 saniye sonra durumu temizle
      setTimeout(() => {
        setQuickAnswerStates(prev => {
          const newStates = { ...prev }
          delete newStates[questionId]
          return newStates
        })
      }, 3000)
      
    } catch (error) {
      // Hata durumu
      setQuickAnswerStates(prev => ({
        ...prev,
        [questionId]: { status: 'error', step: 'Hata oluştu!' }
      }))
      
      setError(`❌ Hızlı yanıt hatası: ${error.message}`)
      addLog(`❌ Hızlı yanıt hatası (${questionId}): ${error.message}`, 'error')
      
      // 3 saniye sonra hata durumunu temizle
      setTimeout(() => {
        setQuickAnswerStates(prev => {
          const newStates = { ...prev }
          delete newStates[questionId]
          return newStates
        })
      }, 3000)
    }
  }

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    }
    setLogs(prev => [newLog, ...prev.slice(0, 49)]) // Son 50 log
  }

  const testApiConnection = async () => {
    if (!settings.supplierId || !settings.apiKey || !settings.apiSecret) {
      setError('API bilgileri eksik! Önce ayarlardan Trendyol API bilgilerini girin.')
      addLog('❌ API test edilemedi: Bilgiler eksik', 'error')
      return
    }

    try {
      setLoading(true)
      setError(null)
      addLog('🔍 Trendyol API bağlantısı test ediliyor...', 'info')
      
      const params = new URLSearchParams({
        useRealAPI: 'true',
        supplierId: settings.supplierId,
        apiKey: settings.apiKey,
        apiSecret: settings.apiSecret
      })
      
      const response = await fetch(`/api/trendyol/questions?${params.toString()}`)
      const data = await response.json()
      
      if (data.success && !data.usingMockData) {
        setSuccess(`✅ API bağlantısı başarılı! ${data.totalFromAPI || data.total} soru bulundu.`)
        addLog(`✅ API test başarılı: ${data.total} soru`, 'success')
        
        // Test başarılıysa soruları da yükle
        setQuestions(data.questions || [])
      } else if (data.success && data.usingMockData) {
        setError('❌ API bilgileri eksik veya hatalı. Mock data gösteriliyor.')
        addLog('❌ API test başarısız: Mock data kullanılıyor', 'error')
      } else {
        throw new Error(data.error || 'API test başarısız')
      }
    } catch (error) {
      setError(`❌ API bağlantı hatası: ${error.message}`)
      addLog(`❌ API test hatası: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'answered': return 'success'
      case 'processing': return 'info'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Bekliyor'
      case 'answered': return 'Yanıtlandı'
      case 'processing': return 'İşleniyor'
      case 'failed': return 'Başarısız'
      default: return status
    }
  }

  const openQuestionDetail = (question) => {
    setSelectedQuestion(question)
    setCustomAnswer('')
    setEditingAnswer(false)
    setQuestionDetailOpen(true)
  }

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === 'all') return true
    return q.status === filterStatus
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🛒 Trendyol Soru Cevaplama
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Trendyol müşteri sorularını AI ile otomatik yanıtlama sistemi
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {}
          
          {isRunning && settings.autoAnswer && (
            <Chip 
              label={`${Math.round((settings.checkInterval || 180) / 60)} dakikada bir`}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
          
          {isRunning && botStats.totalProcessed > 0 && (
            <Chip 
              label={`${botStats.totalProcessed} işlendi`}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
          
          <IconButton 
            onClick={() => {
              console.log('Settings button clicked')
              setSettingsOpen(true)
            }} 
            color="primary"
            sx={{
              borderRadius: '50%',
              width: 48,
              height: 48,
              border: '0px solid',
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.main',
                '& .MuiBox-root': {
                  transform: 'scale(1.1)'
                }
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                fontSize: '1.2rem',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              {iconEmojis.settings}
            </Box>
          </IconButton>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Box component="span" sx={{ fontSize: '1.5rem' }}>{iconEmojis.question}</Box>
              </Avatar>
              <Typography variant="h4" color="primary">
                {stats.totalQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Toplam Soru
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tüm zamanlar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Box component="span" sx={{ fontSize: '1.5rem' }}>{iconEmojis.check}</Box>
              </Avatar>
              <Typography variant="h4" color="success.main">
                {stats.answeredQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Yanıtlanan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Başarıyla çözülmüş
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Box component="span" sx={{ fontSize: '1.5rem' }}>{iconEmojis.timer}</Box>
              </Avatar>
              <Typography variant="h4" color="warning.main">
                {stats.pendingQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Bekleyen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yanıt bekliyor
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <Box component="span" sx={{ fontSize: '1.5rem' }}>📅</Box>
              </Avatar>
              <Typography variant="h4" color="info.main">
                {stats.todayQuestions}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Bugünkü Sorular
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Son 24 saat
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ 
              textAlign: 'center', 
              py: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 80
            }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Box component="span" sx={{ fontSize: '1.4rem' }}>🔗</Box>
                <Typography variant="body2" color="text.secondary">
                  API Durumu:
                </Typography>
                <Chip 
                  label={settings.supplierId && settings.apiKey && settings.apiSecret ? "Bilgiler Mevcut" : "Bilgiler Eksik"} 
                  color={settings.supplierId && settings.apiKey && settings.apiSecret ? "success" : "warning"}
                  size="medium"
                />
                {(!settings.supplierId || !settings.apiKey || !settings.apiSecret) && (
                  <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                    Gerçek sorular için API bilgilerini girin
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Control Panel */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="🎮 Kontrol Paneli" 
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Box component="span">📦</Box>}
                onClick={() => window.open('https://partner.trendyol.com/questions/orders', '_blank')}
                size="medium"
                sx={{ 
                  minHeight: 38,
                  fontSize: '13px'
                }}
              >
                Sipariş Soruları
              </Button>
              <Button
                variant="outlined"
                startIcon={<Box component="span">{iconEmojis.settings}</Box>}
                onClick={() => setSettingsOpen(true)}
                size="medium"
                sx={{ 
                  minHeight: 38,
                  fontSize: '13px'
                }}
              >
                Ayarlar
              </Button>
            </Box>
          }
        />
        <CardContent>
          {/* Bot Durum Kartı - Sadece bot çalışırken görünür */}
          {isRunning && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                fontSize: '14px',
                '& .MuiAlert-message': {
                  fontSize: '14px'
                }
              }}
              icon={<Box component="span">{botStats?.currentActivity ? '🔄' : iconEmojis.check}</Box>}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {botStats?.currentActivity || "Bot beklemede..."}
                </Typography>
                {botStats?.nextCheckAt && (
                  <Typography variant="caption" color="text.secondary">
                    Sonraki kontrol: {new Date(botStats.nextCheckAt).toLocaleTimeString('tr-TR')}
                  </Typography>
                )}
              </Box>
            </Alert>
          )}

          {/* Ana Kontrol Butonları */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap', mb: 3 }}>
            {/* Bot Kontrol Alanı */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 }}>
              {!isRunning ? (
                <Button
                  variant="contained"
                  startIcon={<Box component="span">{iconEmojis.start}</Box>}
                  onClick={startBot}
                  disabled={loading || !settings.supplierId || !settings.openaiApiKey}
                  color="success"
                  size="medium"
                  sx={{ 
                    minHeight: 42,
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Bot'u Başlat
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Box component="span">{iconEmojis.stop}</Box>}
                  onClick={stopBot}
                  disabled={loading}
                  color="error"
                  size="medium"
                  sx={{ 
                    minHeight: 42,
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Bot'u Durdur
                </Button>
              )}
            </Box>
            
            {/* Diğer Kontrol Butonları */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Box component="span">{iconEmojis.refresh}</Box>}
                onClick={() => {
                  fetchQuestions()
                  addLog('🔄 Veriler yenilendi', 'info')
                }}
                disabled={loading}
                size="medium"
                sx={{ 
                  minHeight: 42,
                  minWidth: 120,
                  fontSize: '14px'
                }}
              >
                Yenile
              </Button>

              <Button
                variant="outlined"
                startIcon={<Box component="span">🔍</Box>}
                onClick={testApiConnection}
                disabled={loading}
                color="info"
                size="medium"
                sx={{ 
                  minHeight: 42,
                  minWidth: 130,
                  fontSize: '14px'
                }}
              >
                API Test Et
              </Button>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: 60, alignSelf: 'center' }} />
            
            {/* Otomatik AI Yanıtlama Switch */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAnswer}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      autoAnswer: e.target.checked 
                    }))}
                    color="success"
                    size="medium"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span">🤖</Box>
                    <Typography variant="body2" sx={{ fontWeight: settings.autoAnswer ? 'bold' : 'normal' }}>
                      Otomatik AI Yanıtlama
                    </Typography>
                    {settings.autoAnswer && (
                      <Chip 
                        label="Aktif" 
                        size="small" 
                        color="success" 
                        variant="filled"
                        sx={{ height: 20, fontSize: '11px' }}
                      />
                    )}
                  </Box>
                }
                sx={{ margin: 0 }}
              />
            </Box>
            
            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', minWidth: 200 }}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            )}
            
            {/* Hızlı Yanıt Durum Göstergesi */}
            {Object.keys(quickAnswerStates).length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                <Chip
                  icon={<Box component="span">🤖</Box>}
                  label={`${Object.keys(quickAnswerStates).length} soru işleniyor`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Yanıtlama Oranı
              </Typography>
              <Typography variant="h6" color="success.main">
                %{stats.totalQuestions > 0 ? Math.round((stats.answeredQuestions / stats.totalQuestions) * 100) : 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Ortalama Yanıt Süresi
              </Typography>
              <Typography variant="h6" color="info.main">
                {stats.averageResponseTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Bot Durumu
              </Typography>
              <Typography variant="h6" color={isRunning ? "success.main" : "text.secondary"}>
                {isRunning ? 'Aktif' : 'Pasif'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                AI Durumu
              </Typography>
              <Typography variant="h6" color={settings.openaiApiKey ? "success.main" : "warning.main"}>
                {settings.openaiApiKey ? 'Hazır' : 'API Eksik'}
              </Typography>
            </Box>
            {isRunning && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  İşlenen Soru
                </Typography>
                <Typography variant="h6" color="info.main">
                  {botStats.totalProcessed}
                </Typography>
              </Box>
            )}
            {isRunning && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Başarı Oranı
                </Typography>
                <Typography variant="h6" color="success.main">
                  %{botStats.totalProcessed > 0 ? Math.round((botStats.successfulAnswers / botStats.totalProcessed) * 100) : 0}
                </Typography>
              </Box>
            )}
            {Object.keys(quickAnswerStates).length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  AI İşlem
                </Typography>
                <Typography variant="h6" color="info.main">
                  {Object.keys(quickAnswerStates).length} İşleniyor
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="❓ Müşteri Soruları" 
          subheader={`${filteredQuestions.length} soru görüntüleniyor`}
          action={
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Durum Filtresi</InputLabel>
              <Select
                value={filterStatus}
                label="Durum Filtresi"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="pending">Bekleyen</MenuItem>
                <MenuItem value="answered">Yanıtlanan</MenuItem>
                <MenuItem value="processing">İşleniyor</MenuItem>
                <MenuItem value="failed">Başarısız</MenuItem>
              </Select>
            </FormControl>
          }
        />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Müşteri</TableCell>
                  <TableCell>Soru</TableCell>
                  <TableCell>Ürün</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {filterStatus === 'all' ? 'Henüz soru bulunmuyor' : `${getStatusText(filterStatus)} durumunda soru bulunmuyor`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {filterStatus === 'all' ? 'Bot çalışmaya başladığında sorular burada görünecek.' : 'Farklı bir durum filtresi deneyin.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.slice(0, 20).map((question) => (
                    <TableRow key={question.id} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          {formatDate(question.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {question.customerName || 'Anonim Müşteri'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {question.questionText}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {question.productName || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(question.status)} 
                          color={getStatusColor(question.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Detayları Görüntüle">
                            <IconButton 
                              size="small" 
                              onClick={() => openQuestionDetail(question)}
                              color="info"
                            >
                              <Box component="span">{iconEmojis.view}</Box>
                            </IconButton>
                          </Tooltip>
                          
                          {question.status === 'pending' && (
                            <Tooltip title={
                              quickAnswerStates[question.id] 
                                ? quickAnswerStates[question.id].step 
                                : "Hızlı AI Yanıtla"
                            }>
                              <span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => quickAnswerQuestion(question)}
                                  color={
                                    quickAnswerStates[question.id]?.status === 'success' ? 'success' :
                                    quickAnswerStates[question.id]?.status === 'error' ? 'error' :
                                    quickAnswerStates[question.id] ? 'info' : 'success'
                                  }
                                  disabled={
                                    !!quickAnswerStates[question.id] || 
                                    loading || 
                                    !settings.openaiApiKey
                                  }
                                  sx={{
                                    animation: quickAnswerStates[question.id]?.status === 'generating' || 
                                              quickAnswerStates[question.id]?.status === 'sending' 
                                      ? 'pulse 1.5s infinite' : 'none',
                                    '@keyframes pulse': {
                                      '0%': { transform: 'scale(1)', opacity: 1 },
                                      '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                                      '100%': { transform: 'scale(1)', opacity: 1 }
                                    }
                                  }}
                                >
                                  <Box component="span">
                                    {quickAnswerStates[question.id]?.status === 'generating' && iconEmojis.brain}
                                    {quickAnswerStates[question.id]?.status === 'sending' && iconEmojis.loading}
                                    {quickAnswerStates[question.id]?.status === 'success' && iconEmojis.success}
                                    {quickAnswerStates[question.id]?.status === 'error' && iconEmojis.failure}
                                    {!quickAnswerStates[question.id] && iconEmojis.send}
                                  </Box>
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {filteredQuestions.length > 20 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                İlk 20 soru gösteriliyor. Toplam {filteredQuestions.length} soru bulundu.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader title="📋 İşlem Logları" />
        <CardContent>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {logs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                Henüz log bulunmuyor
              </Typography>
            ) : (
              logs.map((log) => (
                <Box 
                  key={log.id} 
                  sx={{ 
                    mb: 1, 
                    p: 2, 
                    bgcolor: log.type === 'error' 
                      ? 'error.lighter' 
                      : log.type === 'success' 
                        ? 'success.lighter' 
                        : 'background.paper', 
                    borderRadius: 1,
                    borderLeft: 4,
                    borderLeftColor: log.type === 'error' ? 'error.main' : log.type === 'success' ? 'success.main' : 'info.main',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.primary">
                      {log.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component="span" sx={{ fontSize: '1.5rem' }}>{iconEmojis.settings}</Box>
            Bot Ayarları
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Trendyol API Bilgileri */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Trendyol API Bilgileri
              </Typography>
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label="Satıcı ID (Supplier ID)"
                value={settings.supplierId || ''} // Null/undefined durumunu handle et
                onChange={(e) => {
                  const value = e.target.value
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    supplierId: value
                  }))
                }}
                placeholder="Örn: 123456"
                helperText="Trendyol satıcı panelinizden alabilirsiniz"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="API Key"
                value={settings.apiKey || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    apiKey: value
                  }))
                }}
                placeholder="API anahtarınız"
                type="password"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="API Secret"
                value={settings.apiSecret || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    apiSecret: value
                  }))
                }}
                placeholder="API gizli anahtarınız"
                type="password"
              />
            </Grid>

            {/* OpenAI Ayarları */}
            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                🤖 OpenAI & ChatGPT Ayarları
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  💡 <strong>Assistant ID</strong> belirtirseniz özel ChatGPT asistanınız kullanılır.<br/>
                  Boş bırakırsanız genel GPT modeli kullanılır.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label="OpenAI API Key"
                value={settings.openaiApiKey || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    openaiApiKey: value
                  }))
                }}
                placeholder="sk-..."
                type="password"
                helperText="OpenAI hesabınızdan API anahtarı"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Assistant ID (Opsiyonel)"
                value={settings.openaiAssistantId || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    openaiAssistantId: value
                  }))
                }}
                placeholder="asst_..."
                helperText="Özel ChatGPT asistanınızın ID'si"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>OpenAI Model</InputLabel>
                <Select
                  value={settings.openaiModel || 'gpt-4o'}
                  label="OpenAI Model"
                  onChange={(e) => {
                    const value = e.target.value
                    setSettings(prevSettings => ({
                      ...prevSettings, 
                      openaiModel: value
                    }))
                  }}
                >
                  <MenuItem value="gpt-4o">GPT-4o (Önerilen)</MenuItem>
                  <MenuItem value="gpt-4o-mini">GPT-4o Mini (Ekonomik)</MenuItem>
                  <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                  <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (En Ekonomik)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Max Tokens"
                type="number"
                value={settings.openaiMaxTokens || 1000}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  setSettings(prevSettings => ({
                    ...prevSettings, 
                    openaiMaxTokens: value
                  }))
                }}
                inputProps={{ min: 100, max: 4000, step: 100 }}
                helperText="Yanıt uzunluğu limiti (100-4000)"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Temperature"
                type="number"
                value={settings.openaiTemperature}
                onChange={(e) => setSettings({...settings, openaiTemperature: parseFloat(e.target.value)})}
                inputProps={{ min: 0, max: 2, step: 0.1 }}
                helperText="Yaratıcılık seviyesi (0.0-2.0)"
              />
            </Grid>

            {/* Bot Ayarları */}
            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Bot Ayarları
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Kontrol Aralığı (saniye)"
                type="number"
                value={settings.checkInterval}
                onChange={(e) => setSettings({...settings, checkInterval: parseInt(e.target.value)})}
                helperText="Bot ne sıklıkla soru kontrol etsin"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Yanıt Gecikmesi (saniye)"
                type="number"
                value={settings.answerDelay}
                onChange={(e) => setSettings({...settings, answerDelay: parseInt(e.target.value)})}
                helperText="Yanıt göndermeden önce bekle"
              />
            </Grid>
            
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAnswer}
                    onChange={(e) => setSettings({...settings, autoAnswer: e.target.checked})}
                    color="success"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span">🤖</Box>
                    <Typography variant="body1" sx={{ fontWeight: settings.autoAnswer ? 'bold' : 'normal' }}>
                      Otomatik AI Yanıtlama
                    </Typography>
                  </Box>
                }
              />
              {settings.autoAnswer && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    🚀 <strong>Otomatik yanıtlama aktif!</strong><br/>
                    Bot her {Math.round((settings.checkInterval || 180) / 60)} dakikada bir bekleyen soruları kontrol edip AI ile yanıtlayacak.
                  </Typography>
                </Alert>
              )}
              {!settings.autoAnswer && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    ℹ️ <strong>Sadece manuel yanıtlama:</strong><br/>
                    Sorular otomatik yanıtlanmayacak, sadece manuel "Hızlı Yanıtla" butonları çalışacak.
                  </Typography>
                </Alert>
              )}
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Yanıt Şablonu"
                value={settings.answerTemplate}
                onChange={(e) => setSettings({...settings, answerTemplate: e.target.value})}
                helperText="{answer} yazan yere AI yanıtı yerleştirilir"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            İptal
          </Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              await saveSettings()
              setSettingsOpen(false)
            }}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Detail Dialog */}
      <Dialog open={questionDetailOpen} onClose={() => setQuestionDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box component="span" sx={{ fontSize: '1.5rem', color: 'primary.main' }}>{iconEmojis.question}</Box>
            Soru Detayları
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuestion && (
            <Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Müşteri Bilgileri
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedQuestion.customerName || 'Anonim Müşteri'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Soru Tarihi
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(selectedQuestion.createdAt)}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ürün
                  </Typography>
                  <Typography variant="body1">
                    {selectedQuestion.productName || 'Belirtilmemiş'}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Durum
                  </Typography>
                  <Chip 
                    label={getStatusText(selectedQuestion.status)} 
                    color={getStatusColor(selectedQuestion.status)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Soru ID
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace' }}>
                    {selectedQuestion.id}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Müşteri Sorusu
              </Typography>
              <Paper variant="outlined" sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="body1" color="text.primary">
                  {selectedQuestion.questionText}
                </Typography>
              </Paper>
              
              {selectedQuestion.answer && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Verilen Yanıt
                  </Typography>
                  <Paper variant="outlined" sx={{ 
                    p: 2, 
                    mb: 3, 
                    bgcolor: 'success.light',
                    '&.MuiPaper-root': {
                      bgcolor: theme => theme.palette.mode === 'dark' ? 'success.dark' : 'success.lighter'
                    }
                  }}>
                    <Typography variant="body1" color="text.primary">
                      {selectedQuestion.answer}
                    </Typography>
                  </Paper>
                </>
              )}
              
              {selectedQuestion.status === 'pending' && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Özel Yanıt Hazırla
                  </Typography>
                  {!editingAnswer ? (
                    <Button
                      variant="outlined"
                      startIcon={<Box component="span">{iconEmojis.edit}</Box>}
                      onClick={() => setEditingAnswer(true)}
                      fullWidth
                    >
                      Özel Yanıt Yaz
                    </Button>
                  ) : (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={customAnswer}
                        onChange={(e) => setCustomAnswer(e.target.value)}
                        placeholder="Özel yanıtınızı yazın..."
                        sx={{ mb: 2 }}
                      />
                      
                      {/* AI Yanıt Alma Butonu */}
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Box component="span">🤖</Box>}
                          onClick={() => generateAiAnswer(selectedQuestion)}
                          disabled={aiLoading || !settings.openaiApiKey}
                          color="secondary"
                          size="small"
                        >
                          {aiLoading ? 'AI Düşünüyor...' : 'Yapay Zeka\'dan Yanıt Al'}
                        </Button>
                        {aiLoading && (
                          <LinearProgress sx={{ mt: 1 }} />
                        )}
                        {!settings.openaiApiKey && (
                          <Typography variant="caption" color="warning.main" sx={{ ml: 2 }}>
                            OpenAI API anahtarı gerekli
                          </Typography>
                        )}
                      </Box>
                      
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<Box component="span">{iconEmojis.save}</Box>}
                          onClick={() => answerQuestion(selectedQuestion.id, customAnswer)}
                          disabled={!customAnswer.trim() || loading}
                        >
                          Yanıtı Gönder
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Box component="span">{iconEmojis.cancel}</Box>}
                          onClick={() => {
                            setEditingAnswer(false)
                            setCustomAnswer('')
                          }}
                        >
                          İptal
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDetailOpen(false)}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TrendyolSoruCevaplama