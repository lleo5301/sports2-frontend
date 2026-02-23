import { createFileRoute } from '@tanstack/react-router'
import { AiCoach } from '@/features/ai-coach'

export const Route = createFileRoute('/_authenticated/ai-coach/')({
  component: AiCoach,
  errorComponent: ({ error }) => (
    <div className='space-y-4 p-8'>
      <h2 className='text-xl font-bold text-destructive'>AI Coach Error</h2>
      <pre className='overflow-auto rounded-lg bg-muted p-4 text-sm whitespace-pre-wrap'>
        {error instanceof Error
          ? `${error.message}\n\n${error.stack}`
          : String(error)}
      </pre>
    </div>
  ),
})
