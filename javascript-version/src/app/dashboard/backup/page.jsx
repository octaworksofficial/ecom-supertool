'use client'

import { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert,
  LinearProgress,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material'

export default function DatabaseBackupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [clearData, setClearData] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleBackup = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/backup')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `database-backup-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setResult({ type: 'success', message: 'Backup downloaded successfully!' })
      } else {
        const error = await response.json()
        setResult({ type: 'error', message: error.message || 'Backup failed' })
      }
    } catch (error) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
    setResult(null)
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setResult({ type: 'error', message: 'Please select a backup file first' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const fileContent = await selectedFile.text()
      const backupData = JSON.parse(fileContent)

      const url = clearData ? '/api/import?clear=true' : '/api/import'
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupData)
      })

      const result = await response.json()

      if (response.ok) {
        setResult({ 
          type: 'success', 
          message: 'Import completed successfully!',
          details: result.importStats
        })
      } else {
        setResult({ 
          type: 'error', 
          message: result.message || 'Import failed',
          details: result.importStats
        })
      }
    } catch (error) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
      setSelectedFile(null)
      // Reset file input
      const fileInput = document.getElementById('backup-file-input')
      if (fileInput) fileInput.value = ''
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Database Backup & Import
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Backup your database or restore from a previous backup file.
      </Typography>

      <Grid container spacing={3}>
        {/* Backup Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create Backup
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Download a complete backup of your database including all customers, settings, and data.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleBackup}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Creating Backup...' : 'Download Backup'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Import Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Import Backup
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Restore your database from a backup file.
              </Typography>

              <input
                id="backup-file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ marginBottom: '16px', width: '100%' }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={clearData}
                    onChange={(e) => setClearData(e.target.checked)}
                    color="warning"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Clear existing data
                  </Box>
                }
                sx={{ mb: 2 }}
              />

              {clearData && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  This will permanently delete all existing data before importing!
                </Alert>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleImport}
                disabled={loading || !selectedFile}
                fullWidth
              >
                {loading ? 'Importing...' : 'Import Backup'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress */}
      {loading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Please wait...
          </Typography>
        </Box>
      )}

      {/* Results */}
      {result && (
        <Box sx={{ mt: 3 }}>
          <Alert severity={result.type}>
            {result.message}
          </Alert>
          
          {result.details && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Import Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Customers: {result.details.customers}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Interactions: {result.details.customerInteractions}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Email Sends: {result.details.emailSends}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Templates: {result.details.emailTemplates}</Typography>
                  </Grid>
                </Grid>
                
                {result.details.errors && result.details.errors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="error">
                      Errors ({result.details.errors.length}):
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {result.details.errors.slice(0, 10).map((error, index) => (
                        <Typography key={index} variant="caption" display="block" color="error">
                          {error}
                        </Typography>
                      ))}
                      {result.details.errors.length > 10 && (
                        <Typography variant="caption" color="text.secondary">
                          ... and {result.details.errors.length - 10} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  )
}
