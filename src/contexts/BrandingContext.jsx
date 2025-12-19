import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const BrandingContext = createContext()

// Convert hex color to HSL values (DaisyUI uses HSL format)
function hexToHSL(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
      default:
        h = 0
    }
  }

  // Return as DaisyUI format: "H S% L%"
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// Generate contrasting content color (text color for buttons, etc.)
function getContrastColor(hex) {
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white or dark based on luminance
  return luminance > 0.5 ? '0 0% 20%' : '0 0% 100%'
}

// Convert hex to RGB string for use with rgba()
function hexToRGB(hex) {
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

// Darken a hex color by a percentage (for readable heading text)
function darkenColor(hex, percent) {
  hex = hex.replace(/^#/, '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  r = Math.max(0, Math.floor(r * (1 - percent / 100)))
  g = Math.max(0, Math.floor(g * (1 - percent / 100)))
  b = Math.max(0, Math.floor(b * (1 - percent / 100)))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Lighten a hex color by a percentage (for subtle backgrounds)
function lightenColor(hex, percent) {
  hex = hex.replace(/^#/, '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function BrandingProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [branding, setBranding] = useState({
    name: '',
    programName: '',
    logoUrl: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    loading: true
  })

  const fetchBranding = useCallback(async () => {
    if (!isAuthenticated) {
      setBranding(prev => ({ ...prev, loading: false }))
      return
    }

    try {
      const response = await api.get('/teams/branding')
      if (response.data.success) {
        const data = response.data.data
        setBranding({
          name: data.name || '',
          programName: data.program_name || '',
          logoUrl: data.logo_url,
          primaryColor: data.primary_color || '#3B82F6',
          secondaryColor: data.secondary_color || '#EF4444',
          loading: false
        })
      }
    } catch (error) {
      console.error('Error fetching branding:', error)
      setBranding(prev => ({ ...prev, loading: false }))
    }
  }, [isAuthenticated])

  // Apply CSS variables for team colors
  const applyBrandingColors = useCallback(() => {
    if (!branding.primaryColor || !branding.secondaryColor) return

    const root = document.documentElement

    // Set primary color (DaisyUI)
    root.style.setProperty('--p', hexToHSL(branding.primaryColor))
    root.style.setProperty('--pc', getContrastColor(branding.primaryColor))

    // Set secondary color (DaisyUI)
    root.style.setProperty('--s', hexToHSL(branding.secondaryColor))
    root.style.setProperty('--sc', getContrastColor(branding.secondaryColor))

    // Also set accent to primary for consistency
    root.style.setProperty('--a', hexToHSL(branding.primaryColor))
    root.style.setProperty('--ac', getContrastColor(branding.primaryColor))

    // Set custom CSS variables for direct color access (hex format)
    root.style.setProperty('--team-primary', branding.primaryColor)
    root.style.setProperty('--team-secondary', branding.secondaryColor)
    root.style.setProperty('--team-primary-rgb', hexToRGB(branding.primaryColor))
    root.style.setProperty('--team-secondary-rgb', hexToRGB(branding.secondaryColor))

    // Set heading/text colors based on primary (slightly darker for better readability)
    root.style.setProperty('--team-heading', darkenColor(branding.primaryColor, 15))
    root.style.setProperty('--team-heading-light', branding.primaryColor)
    root.style.setProperty('--team-accent-bg', lightenColor(branding.primaryColor, 90))
    root.style.setProperty('--team-accent-border', lightenColor(branding.primaryColor, 70))

    // Set page background color (subtle gray for light mode, handled by theme for dark)
    const currentTheme = root.getAttribute('data-theme')
    const isDarkTheme = currentTheme && ['dark', 'night', 'black', 'dracula', 'synthwave', 'halloween', 'forest', 'luxury', 'coffee'].includes(currentTheme)
    if (!isDarkTheme) {
      root.style.setProperty('--page-bg', '#f8fafc')
    } else {
      root.style.removeProperty('--page-bg')
    }
  }, [branding.primaryColor, branding.secondaryColor])

  // Clear branding colors (reset to theme defaults)
  const clearBrandingColors = useCallback(() => {
    const root = document.documentElement
    root.style.removeProperty('--p')
    root.style.removeProperty('--pc')
    root.style.removeProperty('--s')
    root.style.removeProperty('--sc')
    root.style.removeProperty('--a')
    root.style.removeProperty('--ac')
    root.style.removeProperty('--team-primary')
    root.style.removeProperty('--team-secondary')
    root.style.removeProperty('--team-primary-rgb')
    root.style.removeProperty('--team-secondary-rgb')
    root.style.removeProperty('--team-heading')
    root.style.removeProperty('--team-heading-light')
    root.style.removeProperty('--team-accent-bg')
    root.style.removeProperty('--team-accent-border')
  }, [])

  // Fetch branding when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.team_id) {
      fetchBranding()
    } else {
      clearBrandingColors()
      setBranding({
        name: '',
        programName: '',
        logoUrl: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#EF4444',
        loading: false
      })
    }
  }, [isAuthenticated, user?.team_id, fetchBranding, clearBrandingColors])

  // Apply colors when branding changes
  useEffect(() => {
    if (!branding.loading && isAuthenticated) {
      applyBrandingColors()
    }
  }, [branding, isAuthenticated, applyBrandingColors])

  // Update branding (for immediate feedback after changes)
  const updateBranding = useCallback((updates) => {
    setBranding(prev => ({ ...prev, ...updates }))
  }, [])

  // Refresh branding from server
  const refreshBranding = useCallback(() => {
    fetchBranding()
  }, [fetchBranding])

  const value = {
    ...branding,
    updateBranding,
    refreshBranding,
    isLoaded: !branding.loading
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider')
  }
  return context
}
