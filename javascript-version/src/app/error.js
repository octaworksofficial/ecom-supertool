'use client'

import { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
        Hata!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Bir şeyler yanlış gitti
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {error?.message || 'Beklenmeyen bir hata oluştu'}
      </Typography>
      <Button
        onClick={reset}
        variant="contained"
        color="primary"
      >
        Tekrar Dene
      </Button>
    </Box>
  )
}
