import React from 'react'

import Grid from '@mui/material/Grid2'
import { Card, CardContent, Typography, Box, Button } from '@mui/material'
import './GridFix.css'

/**
 * ExampleGridUsage - MUI v7 Grid2 kullanım örnekleri
 * Bu bileşen Grid sisteminin farklı kullanım senaryolarını gösterir
 */
const ExampleGridUsage = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        📋 Grid Kullanım Örnekleri
      </Typography>

      {/* Örnek 1: Temel Grid Layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          1. Temel Grid Layout
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography>Grid 1</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography>Grid 2</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={12} md={4}>
            <Card sx={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography>Grid 3</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Örnek 2: Dashboard Layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          2. Dashboard Layout
        </Typography>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid xs={12}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Dashboard Header</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Sidebar */}
          <Grid xs={12} md={3}>
            <Card sx={{ height: '200px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Sidebar</Typography>
                <Button variant="outlined" fullWidth sx={{ mb: 1 }}>Menu 1</Button>
                <Button variant="outlined" fullWidth sx={{ mb: 1 }}>Menu 2</Button>
                <Button variant="outlined" fullWidth>Menu 3</Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Main Content */}
          <Grid xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Card sx={{ height: '90px' }}>
                  <CardContent>
                    <Typography variant="h6">İstatistik 1</Typography>
                    <Typography variant="h4" color="primary">123</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} sm={6}>
                <Card sx={{ height: '90px' }}>
                  <CardContent>
                    <Typography variant="h6">İstatistik 2</Typography>
                    <Typography variant="h4" color="secondary">456</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12}>
                <Card sx={{ height: '100px' }}>
                  <CardContent>
                    <Typography variant="h6">Ana İçerik Alanı</Typography>
                    <Typography variant="body2">Bu alanda ana içerik gösterilir</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Örnek 3: Form Layout */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          3. Form Layout
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2">İsim Alanı</Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2">Soyisim Alanı</Typography>
                </Box>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2">Email Alanı</Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2">Telefon Alanı</Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography variant="body2">Şehir Alanı</Typography>
                </Box>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined">İptal</Button>
                  <Button variant="contained">Kaydet</Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Örnek 4: Card Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          4. Card Grid Layout
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Card {item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bu bir örnek card içeriğidir
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Detay
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Grid Debug Bilgileri */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
          🐛 Grid Debug Bilgileri
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Grid2 kullanımında "item" prop'u gerekli değil
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • xs, sm, md, lg, xl prop'ları direkt kullanılıyor
        </Typography>
        <Typography variant="body2">
          • container ve spacing prop'ları aynı şekilde kullanılıyor
        </Typography>
      </Box>
    </Box>
  )
}

export default ExampleGridUsage
