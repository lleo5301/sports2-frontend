import { useEffect, useState } from 'react'
import { brandingApi, type Branding } from '@/lib/branding-api'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [branding, setBranding] = useState<Branding | null>(null)

  useEffect(() => {
    brandingApi
      .get()
      .then((b) => setBranding(b ?? null))
      .catch(() => setBranding(null))
  }, [])

  const logoUrl = branding?.logo_url
  const teamName = branding?.name || 'Sports2'

  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={teamName}
              className='me-3 size-10 rounded-lg object-contain'
            />
          ) : (
            <div className='me-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold'>
              {teamName.charAt(0)}
            </div>
          )}
          <h1 className='text-xl font-medium'>{teamName}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
