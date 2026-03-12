import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { brandingApi, type Branding } from '@/lib/branding-api'

const DEFAULT_PRIMARY = '#3B82F6'
const DEFAULT_SECONDARY = '#EF4444'

interface BrandingContextValue extends Branding {
  logoUrl: string | undefined
  primaryColor: string
  secondaryColor: string
  isLoading: boolean
}

const BrandingContext = createContext<BrandingContextValue | null>(null)

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<Branding | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    brandingApi
      .get()
      .then((b) => setBranding(b ?? null))
      .catch(() => setBranding(null))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const primary = branding?.primary_color ?? DEFAULT_PRIMARY
    const secondary = branding?.secondary_color ?? DEFAULT_SECONDARY
    document.documentElement.style.setProperty('--team-primary', primary)
    document.documentElement.style.setProperty('--team-secondary', secondary)
    return () => {
      document.documentElement.style.removeProperty('--team-primary')
      document.documentElement.style.removeProperty('--team-secondary')
    }
  }, [branding?.primary_color, branding?.secondary_color])

  const value: BrandingContextValue = {
    ...branding,
    logoUrl: branding?.logo_url,
    primaryColor: branding?.primary_color ?? DEFAULT_PRIMARY,
    secondaryColor: branding?.secondary_color ?? DEFAULT_SECONDARY,
    isLoading,
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding(): BrandingContextValue {
  const ctx = useContext(BrandingContext)
  if (!ctx)
    return {
      logoUrl: undefined,
      primaryColor: DEFAULT_PRIMARY,
      secondaryColor: DEFAULT_SECONDARY,
      isLoading: false,
    }
  return ctx
}
