import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { aiApi } from '@/lib/ai-api'
import type { AiInsight, InsightCategory, Pagination } from '../types'

export function useInsights() {
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  const fetchInsights = useCallback(
    async (params?: {
      category?: InsightCategory
      pinned?: boolean
      page?: number
    }) => {
      setLoading(true)
      try {
        const result = await aiApi.listInsights(params)
        setInsights(result.data)
        setPagination(result.pagination)
      } catch {
        toast.error('Failed to load insights')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  const generateInsight = useCallback(
    async (params: {
      category: InsightCategory
      prompt?: string
      player_id?: number
      game_id?: number
    }) => {
      setGenerating(true)
      try {
        const result = await aiApi.generateInsight(params)
        if (result?.insight) {
          setInsights((prev) => [result.insight, ...prev])
          toast.success('Insight generated')
          return result
        }
      } catch (err) {
        toast.error((err as Error).message || 'Failed to generate insight')
      } finally {
        setGenerating(false)
      }
      return null
    },
    []
  )

  const togglePin = useCallback(
    async (id: string, currentlyPinned: boolean) => {
      try {
        await aiApi.updateInsight(id, { is_pinned: !currentlyPinned })
        setInsights((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, is_pinned: !currentlyPinned } : i
          )
        )
      } catch {
        toast.error('Failed to update insight')
      }
    },
    []
  )

  const deleteInsight = useCallback(async (id: string) => {
    try {
      await aiApi.deleteInsight(id)
      setInsights((prev) => prev.filter((i) => i.id !== id))
      toast.success('Insight deleted')
    } catch {
      toast.error('Failed to delete insight')
    }
  }, [])

  return {
    insights,
    loading,
    generating,
    pagination,
    fetchInsights,
    generateInsight,
    togglePin,
    deleteInsight,
  }
}
