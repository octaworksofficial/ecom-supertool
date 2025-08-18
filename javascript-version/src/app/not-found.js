'use client'

import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        gap: 2
      }}
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Sayfa Bulunamadı
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Aradığınız sayfa mevcut değil.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        color="primary"
      >
        Ana Sayfaya Dön
      </Button>
    </Box>
  )
}
