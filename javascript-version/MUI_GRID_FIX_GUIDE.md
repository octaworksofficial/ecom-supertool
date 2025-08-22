# MUI Grid v7 Compatibility Fix Guide

## Problem
MUI v7'de Grid sistemi değişti ve eski Grid API'si deprecated oldu. Yeni Grid2 kullanılması öneriliyor.

## Çözüm

### 1. Grid Import Değişikliği
```javascript
// Eski
import { Grid } from '@mui/material'

// Yeni
import Grid from '@mui/material/Grid2'
```

### 2. Props Değişiklikleri
```javascript
// Eski
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    Content
  </Grid>
</Grid>

// Yeni
<Grid container spacing={2}>
  <Grid xs={12} md={6}>
    Content
  </Grid>
</Grid>
```

### 3. Otomatik Fix Script
`./fix-grid.sh` scriptini çalıştırarak tüm dosyalarda otomatik düzeltme yapabilirsiniz.

### 4. GridFix Component
GridFix.jsx komponenti eski Grid kullanımlarını otomatik olarak yeni Grid2'ye çevirir.

## Uygulama
1. `npm run fix-grid` veya `./fix-grid.sh`
2. GridFix komponenti import edin
3. Kodunuzu test edin
