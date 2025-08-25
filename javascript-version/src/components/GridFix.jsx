import React from 'react'

import Grid from '@mui/material/Grid2'
import { Card, CardContent, Typography, Box } from '@mui/material'

/**
 * GridFix - MUI v7 Grid2 uyumlu örnek bileşen
 * Eski Grid kullanımlarını yeni Grid2 sistemine uyarlar
 */
const GridFix = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🔧 MUI Grid v7 Fix Demo
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Bu bileşen MUI v7 Grid2 sisteminin doğru kullanımını gösterir.
      </Typography>

      {/* Ana Grid Container */}
      <Grid container spacing={3}>
        
        {/* Sol Kolon - Responsive */}
        <Grid xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                📱 Responsive Grid
              </Typography>
              <Typography variant="body2">
                xs=12, md=6, lg=4 kullanarak responsive tasarım
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Orta Kolon */}
        <Grid xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                🎯 Grid Özellikleri
              </Typography>
              <Typography variant="body2">
                • item prop artık gerekli değil<br/>
                • Daha temiz syntax<br/>
                • Daha iyi performans
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Kolon */}
        <Grid xs={12} md={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                ✨ Yeni Özellikler
              </Typography>
              <Typography variant="body2">
                Grid2 ile daha esnek ve güçlü layout sistemi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tam Genişlik */}
        <Grid xs={12}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                🌟 Tam Genişlik Grid
              </Typography>
              <Typography variant="body2">
                xs=12 ile tam genişlik kullanım örneği
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Nested Grid Örneği */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                🔗 İç İçe Grid Örneği
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    İç Grid 1
                  </Box>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    İç Grid 2
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}

export default GridFix
