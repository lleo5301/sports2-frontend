import { useEffect, useState } from 'react'
import {
  ArrowRight,
  TrendingUp,
  Users,
  ClipboardList,
  Calendar,
} from 'lucide-react'
import { useAiStore } from '@/stores/ai-store'
import { aiApi } from '@/lib/ai-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PROMPT_CATEGORY_LABELS } from '../constants'
import type { PromptTemplate, PromptTemplates } from '../types'

interface PromptGalleryProps {
  onSelectPrompt: (prompt: string) => Promise<void>
}

/** Hardcoded quick-start prompts shown when the API hasn't returned templates */
const QUICK_PROMPTS = [
  {
    icon: TrendingUp,
    label: 'Game Recap',
    description: 'Get a recap of the most recent game',
    prompt: 'Give me a comprehensive recap of our most recent completed game.',
  },
  {
    icon: Users,
    label: 'Top Performers',
    description: 'See who is performing best this season',
    prompt: 'Who are our top 5 performers this season? Show their key stats.',
  },
  {
    icon: ClipboardList,
    label: 'Scouting Summary',
    description: 'Review recent scouting reports',
    prompt:
      'Summarize the most recent scouting reports and highlight standout prospects.',
  },
  {
    icon: Calendar,
    label: 'Upcoming Games',
    description: 'Preview the next games on the schedule',
    prompt:
      'What are our upcoming games? Give me a preview and any matchup insights.',
  },
]

function substituteVariables(
  prompt: string,
  values: Record<string, string>
): string {
  let result = prompt
  for (const [key, value] of Object.entries(values)) {
    result = result.split(`{${key}}`).join(value)
  }
  return result
}

export function PromptGallery({ onSelectPrompt }: PromptGalleryProps) {
  const { prompts, setPrompts } = useAiStore()
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  )

  useEffect(() => {
    if (!prompts) {
      setLoading(true)
      aiApi
        .getPrompts()
        .then((data) => {
          if (data) setPrompts(data)
        })
        .catch(() => {
          // Ignore — we show quick prompts as fallback
        })
        .finally(() => setLoading(false))
    }
  }, [prompts, setPrompts])

  const handleTemplateClick = (template: PromptTemplate) => {
    if (template.variables.length === 0) {
      onSelectPrompt(template.prompt)
    } else {
      setSelectedTemplate(template)
      setVariableValues({})
    }
  }

  const categories = Object.keys(PROMPT_CATEGORY_LABELS)

  return (
    <div className='flex h-full flex-col items-center justify-center overflow-y-auto p-4 sm:p-8'>
      <div className='w-full max-w-3xl space-y-6'>
        {/* Header */}
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold tracking-tight'>
            Ask your coaching staff anything
          </h1>
          <p className='text-sm text-muted-foreground'>
            Start with a question or pick from common analyses below.
          </p>
        </div>

        {/* Prompt templates from API */}
        {loading ? (
          <div className='grid gap-3 sm:grid-cols-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full rounded-lg' />
            ))}
          </div>
        ) : prompts ? (
          <Tabs defaultValue={categories[0]}>
            <TabsList className='w-full'>
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className='flex-1 text-xs sm:text-sm'
                >
                  {PROMPT_CATEGORY_LABELS[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className='grid gap-3 sm:grid-cols-2'>
                  {(prompts[cat as keyof PromptTemplates] || []).map(
                    (template) => (
                      <Card
                        key={template.id}
                        className='group cursor-pointer transition-colors hover:bg-accent'
                        onClick={() => handleTemplateClick(template)}
                      >
                        <CardHeader className='flex-row items-start justify-between gap-2 space-y-0 pb-2'>
                          <div className='space-y-1'>
                            <CardTitle className='text-sm'>
                              {template.label}
                            </CardTitle>
                            <CardDescription className='text-xs'>
                              {template.description}
                            </CardDescription>
                          </div>
                          <ArrowRight className='size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
                        </CardHeader>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          /* Fallback: hardcoded quick-start prompts */
          <div className='grid gap-3 sm:grid-cols-2'>
            {QUICK_PROMPTS.map((qp) => (
              <Card
                key={qp.label}
                className='group cursor-pointer transition-colors hover:bg-accent'
                onClick={() => onSelectPrompt(qp.prompt)}
              >
                <CardHeader className='flex-row items-start justify-between gap-2 space-y-0 pb-2'>
                  <div className='space-y-1'>
                    <CardTitle className='flex items-center gap-2 text-sm'>
                      <qp.icon className='size-4 text-primary' />
                      {qp.label}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      {qp.description}
                    </CardDescription>
                  </div>
                  <ArrowRight className='size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Variable input dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.label}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleVariableSubmit()
            }}
            className='space-y-4'
          >
            {selectedTemplate?.variables.map((variable) => (
              <div key={variable} className='space-y-2'>
                <Label htmlFor={variable} className='capitalize'>
                  {variable}
                </Label>
                <Input
                  id={variable}
                  value={variableValues[variable] || ''}
                  onChange={(e) =>
                    setVariableValues((prev) => ({
                      ...prev,
                      [variable]: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${variable}...`}
                  autoFocus
                />
              </div>
            ))}
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={selectedTemplate?.variables.some(
                  (v) => !variableValues[v]?.trim()
                )}
              >
                Send
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )

  function handleVariableSubmit() {
    if (!selectedTemplate) return
    const filled = substituteVariables(selectedTemplate.prompt, variableValues)
    onSelectPrompt(filled)
    setSelectedTemplate(null)
    setVariableValues({})
  }
}
