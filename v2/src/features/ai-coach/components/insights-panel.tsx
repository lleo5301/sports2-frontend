import { useState } from 'react'
import { Lightbulb, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { INSIGHT_CATEGORY_LABELS } from '../constants'
import { useInsights } from '../hooks/use-insights'
import type { InsightCategory } from '../types'
import { InsightCard } from './insight-card'

const categories: InsightCategory[] = [
  'player_performance',
  'pitching_analysis',
  'recruiting',
  'lineup',
  'scouting',
  'game_recap',
  'weekly_digest',
]

export function InsightsPanel() {
  const {
    insights,
    loading,
    generating,
    fetchInsights,
    generateInsight,
    togglePin,
    deleteInsight,
  } = useInsights()
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [showGenerate, setShowGenerate] = useState(false)
  const [genCategory, setGenCategory] =
    useState<InsightCategory>('player_performance')
  const [genPrompt, setGenPrompt] = useState('')

  const handleFilterChange = (category: string) => {
    setFilterCategory(category)
    fetchInsights({
      category: category === 'all' ? undefined : (category as InsightCategory),
      pinned: pinnedOnly || undefined,
    })
  }

  const handlePinnedToggle = (checked: boolean) => {
    setPinnedOnly(checked)
    fetchInsights({
      category:
        filterCategory === 'all'
          ? undefined
          : (filterCategory as InsightCategory),
      pinned: checked || undefined,
    })
  }

  const handleGenerate = async () => {
    await generateInsight({
      category: genCategory,
      prompt: genPrompt.trim() || undefined,
    })
    setShowGenerate(false)
    setGenPrompt('')
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Insights</h2>
        <Button onClick={() => setShowGenerate(true)}>
          <Lightbulb className='mr-1.5 size-4' />
          Generate Insight
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4'>
        <Select value={filterCategory} onValueChange={handleFilterChange}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All categories' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {INSIGHT_CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='flex items-center gap-2'>
          <Switch
            id='pinned-only'
            checked={pinnedOnly}
            onCheckedChange={handlePinnedToggle}
          />
          <Label htmlFor='pinned-only' className='text-sm'>
            Pinned only
          </Label>
        </div>
      </div>

      {/* Insights list */}
      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-20 w-full rounded-lg' />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className='rounded-lg border border-dashed p-8 text-center'>
          <Lightbulb className='mx-auto mb-2 size-8 text-muted-foreground' />
          <p className='font-medium'>No insights yet</p>
          <p className='text-sm text-muted-foreground'>
            Generate your first insight to get started
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onTogglePin={togglePin}
              onDelete={deleteInsight}
            />
          ))}
        </div>
      )}

      {/* Generate dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Insight</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Category</Label>
              <Select
                value={genCategory}
                onValueChange={(v) => setGenCategory(v as InsightCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {INSIGHT_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Custom Prompt (optional)</Label>
              <Input
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder='Leave empty for default analysis...'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setShowGenerate(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={generating}>
                {generating && (
                  <Loader2 className='mr-1.5 size-4 animate-spin' />
                )}
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
