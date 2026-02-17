import { Main } from '@/components/layout/main'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Main>
      <div className='flex flex-col items-center justify-center gap-4 py-16'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        {description && (
          <p className='text-muted-foreground'>{description}</p>
        )}
        <p className='text-sm text-muted-foreground'>
          This section will be implemented in Phase 5.
        </p>
      </div>
    </Main>
  )
}
