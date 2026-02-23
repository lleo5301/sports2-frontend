import { useEffect, useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { useAiStore } from '@/stores/ai-store'
import { aiApi } from '@/lib/ai-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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

function substituteVariables(
  prompt: string,
  values: Record<string, string>
): string {
  let result = prompt
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, value)
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

  const handleVariableSubmit = () => {
    if (!selectedTemplate) return
    const filled = substituteVariables(selectedTemplate.prompt, variableValues)
    onSelectPrompt(filled)
    setSelectedTemplate(null)
    setVariableValues({})
  }

  const categories = Object.keys(PROMPT_CATEGORY_LABELS)

  return (
    <div className='flex h-full flex-col items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-3xl space-y-6'>
        {/* Header */}
        <div className='space-y-2 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10'>
            <Bot className='size-6 text-primary' />
          </div>
          <h1 className='text-2xl font-bold'>AI Coach Assistant</h1>
          <p className='text-muted-foreground'>
            Get insights about your team, players, and strategy
          </p>
        </div>

        {/* Prompt templates */}
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
                        className='cursor-pointer transition-colors hover:bg-accent'
                        onClick={() => handleTemplateClick(template)}
                      >
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-sm'>
                            {template.label}
                          </CardTitle>
                          <CardDescription className='text-xs'>
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-7 text-xs'
                          >
                            <Send className='mr-1 size-3' />
                            Use
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p className='text-center text-sm text-muted-foreground'>
            Start a conversation by typing a message below.
          </p>
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
}
