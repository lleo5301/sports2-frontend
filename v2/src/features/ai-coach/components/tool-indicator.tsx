import { Loader2 } from 'lucide-react'
import { TOOL_LABELS } from '../constants'

interface ToolIndicatorProps {
  activeTools: string[]
}

export function ToolIndicator({ activeTools }: ToolIndicatorProps) {
  if (activeTools.length === 0) return null

  return (
    <div className='flex flex-col gap-1.5 px-4 py-2'>
      {activeTools.map((tool) => (
        <div
          key={tool}
          className='flex items-center gap-2 text-sm text-muted-foreground'
        >
          <Loader2 className='size-3.5 animate-spin' />
          <span>{TOOL_LABELS[tool] || tool}...</span>
        </div>
      ))}
    </div>
  )
}
