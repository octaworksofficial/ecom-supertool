'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const ModeDropdown = () => {
  // States
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const { settings, updateSettings } = useSettings()
  const { mode, setMode } = useColorScheme()

  const handleToggle = () => {
    const newMode = settings.mode === 'dark' ? 'light' : 'dark'
    
    // Update both settings and MUI color scheme
    updateSettings({ mode: newMode })
    setMode(newMode)
  }

  const getModeIcon = () => {
    // Use MUI mode if available, fallback to settings
    const currentMode = mode || settings.mode
    if (currentMode === 'dark') {
      return '🌙'
    } else {
      return '☀️'
    }
  }

  return (
    <>
      <Tooltip
        title={(mode || settings.mode) + ' Mode'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={tooltipOpen}
        PopperProps={{ className: 'capitalize' }}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          {getModeIcon()}
        </IconButton>
      </Tooltip>
    </>
  )
}

export default ModeDropdown
