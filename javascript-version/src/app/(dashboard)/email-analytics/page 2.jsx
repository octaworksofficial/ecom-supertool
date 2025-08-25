'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

// Recharts için Charts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const EmailAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeFilter, setTimeFilter] = useState(30)
  const [showAllCampaigns, setShowAllCampaigns] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  
  // Kampanya pagination
  const CAMPAIGNS_PER_PAGE = 6

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/email-campaigns/stats?timeFilter=${timeFilter}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Analytics yüklenemedi')
      }
      
      setAnalytics(data)
      
    } catch (error) {
      console.error('Analytics fetch error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeFilter])

  // Chart colors
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'default'
      case 'delivered': return 'info'
      case 'opened': return 'success'
      case 'clicked': return 'primary'
      case 'bounced': return 'error'
      default: return 'default'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleOpenPreview = async (campaign) => {
    setPreviewError(null)
    setPreviewData(null)
    setPreviewLoading(true)
    setPreviewOpen(true)

    try {
      const res = await fetch(`/api/email/campaign-latest?subject=${encodeURIComponent(campaign.id)}`, {
        headers: { Accept: 'application/json' }
      })

      const ct = res.headers.get('content-type') || ''

      if (!ct.includes('application/json')) {
        const raw = await res.text()

        throw new Error('Beklenmeyen içerik: ' + raw.slice(0, 120))
      }

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Önizleme alınamadı')
      setPreviewData(data)
    } catch (e) {
      setPreviewError(e.message)
    } finally {
      setPreviewLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Analytics yükleniyor...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button onClick={fetchAnalytics} sx={{ ml: 2 }}>
          Tekrar Dene
        </Button>
      </Alert>
    )
  }

  if (!analytics) {
    return (
      <Alert severity="info">
        Henüz analiz edilecek email verisi bulunmuyor.
      </Alert>
    )
  }

  const { 
    totalCampaigns, 
    totalEmails, 
    totalClicks, 
    campaignStats,
    chartData, 
    campaigns 
  } = analytics

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            📊 E-Posta İstatistikleri
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email kampanyalarınızın detaylı performans analizi
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Zaman Aralığı</InputLabel>
          <Select
            value={timeFilter}
            label="Zaman Aralığı"
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <MenuItem value={7}>Son 7 Gün</MenuItem>
            <MenuItem value={30}>Son 30 Gün</MenuItem>
            <MenuItem value={90}>Son 90 Gün</MenuItem>
            <MenuItem value={365}>Son 1 Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Ana Metrik Kutuları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                🚀
              </Avatar>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                {totalCampaigns || 0}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Toplam Kampanya
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aynı konulu email grupları
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                📧
              </Avatar>
              <Typography variant="h3" color="info.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                {totalEmails?.toLocaleString() || 0}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Toplam E-posta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gönderilen mail sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                🌐
              </Avatar>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                {totalClicks || 0}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Link Tıklamaları
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maillerdeki linke tıklanma sayısı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performans Özeti Kutuları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                👁️
              </Avatar>
              <Typography variant="h5" color="warning.main">
                {campaignStats?.totalOpened?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Açılan E-postalar
              </Typography>
              <Typography variant="caption" color="warning.main">
                %{campaignStats?.openRate || 0} açılma oranı
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
                �
              </Avatar>
              <Typography variant="h5" color="error.main">
                %{campaignStats?.clickRate || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tıklama Oranı
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CTR (Click Through Rate)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                ⏱️
              </Avatar>
              <Typography variant="h5" color="secondary.main">
                {campaignStats?.avgResponseTime || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ort. Yanıt Süresi
              </Typography>
              <Typography variant="caption" color="text.secondary">
                İlk açılma süresi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.light', mx: 'auto', mb: 1 }}>
                🎯
              </Avatar>
              <Typography variant="h5" color="info.main">
                %{campaignStats?.conversionRate || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dönüşüm Oranı
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Açılandan tıklama
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grafik */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="📊 Kampanya Performans Grafiği"
          subheader={`Son ${timeFilter} günün detaylı analizi - zamana göre filtrelenebilir`}
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('tr-TR')}
                formatter={(value, name) => [
                  value, 
                  name === 'emails' ? 'Gönderilen E-posta' : 
                  name === 'opens' ? 'Açılan E-posta' : 
                  name === 'clicks' ? 'Tıklanan Link' : name
                ]}
              />
              <Area type="monotone" dataKey="emails" stackId="1" stroke="#1976d2" fill="#1976d2" name="emails" fillOpacity={0.8} />
              <Area type="monotone" dataKey="opens" stackId="1" stroke="#2e7d32" fill="#2e7d32" name="opens" fillOpacity={0.8} />
              <Area type="monotone" dataKey="clicks" stackId="1" stroke="#ed6c02" fill="#ed6c02" name="clicks" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Kampanya Listesi */}
      <Card>
        <CardHeader 
          title="📈 Kampanya Performansları"
          subheader={`Toplam ${campaigns?.length || 0} kampanya görüntüleniyor`}
        />
        <CardContent>
          <Grid container spacing={3}>
            {campaigns?.slice(0, showAllCampaigns ? undefined : CAMPAIGNS_PER_PAGE).map((campaign) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={campaign.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: (theme) => theme.shadows[4],
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        📢
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {campaign.name}
                        </Typography>
                        <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 0.5, fontWeight: 'medium' }}>
                          Kampanya ID: {campaign.campaignId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {new Date(campaign.createdAt).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'medium' }}>
                          {campaign.status} • {campaign.duration}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          📧 Gönderilen E-posta
                        </Typography>
                        <Typography variant="h6" color="primary.main">
                          {campaign.totalEmails?.toLocaleString() || 0}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          👁️ Açılan
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="success.main">
                            {campaign.totalOpened || 0}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            %{campaign.openRate || 0}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          🔗 Tıklanan
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="warning.main">
                            {campaign.totalClicks || 0}
                          </Typography>
                          <Typography variant="caption" color="warning.main">
                            %{campaign.clickRate || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Performans Skoru
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((campaign.openRate || 0) * 2, 100)}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: campaign.openRate > 25 ? 'success.main' : campaign.openRate > 15 ? 'warning.main' : 'error.main'
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {campaign.openRate > 25 ? 'Mükemmel' : campaign.openRate > 15 ? 'İyi' : 'Geliştirilebilir'} performans
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenPreview(campaign)}
                      >
                        Gönderilen Eposta
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {(!campaigns || campaigns.length === 0) && (
              <Grid size={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Henüz kampanya bulunmuyor
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    İlk kampanyanızı oluşturmak için Toplu E-posta sayfasını ziyaret edin.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {/* Daha fazla göster butonu */}
          {campaigns && campaigns.length > CAMPAIGNS_PER_PAGE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                sx={{ px: 4 }}
              >
                {showAllCampaigns ? 'Daha Az Göster' : `Daha Fazla Göster (${campaigns.length - CAMPAIGNS_PER_PAGE} daha)`}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Gönderilen Eposta Önizleme</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 300 }}>
          {previewLoading && <Typography variant="body2">Yükleniyor...</Typography>}
          {previewError && <Typography color="error" variant="body2">{previewError}</Typography>}
          {!previewLoading && !previewError && previewData && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Konu: {previewData.subject}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Alıcı: {previewData.to || '-'} | Tarih: {previewData.sentAt ? new Date(previewData.sentAt).toLocaleString('tr-TR') : '-'}
              </Typography>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  p: 2,
                  background: '#fff',
                  '& img': { maxWidth: '100%' },
                  '& a': { color: 'primary.main', textDecoration: 'underline' },
                  '& table': { borderCollapse: 'collapse', width: '100%' },
                  '& td, & th': { border: '1px solid #ccc', padding: '6px', fontSize: '12px' },
                  maxHeight: 400,
                  overflow: 'auto'
                }}
                dangerouslySetInnerHTML={{
                  __html: (previewData.htmlContent || previewData.content || '').trim()
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (previewData?.htmlContent || previewData?.content) {
                const w = window.open('', '_blank')

                w.document.write(previewData.htmlContent || previewData.content)
                w.document.close()
              }
            }}
            disabled={!previewData}
          >
            Yeni Sekmede Aç
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmailAnalytics