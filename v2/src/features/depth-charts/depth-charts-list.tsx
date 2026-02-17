import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { depthChartsApi } from '@/lib/depth-charts-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export function DepthChartsList() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const { data: charts = [], isLoading, error } = useQuery({
    queryKey: ['depth-charts'],
    queryFn: () => depthChartsApi.list(),
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => depthChartsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depth-charts'] })
      setCreateOpen(false)
      setNewName('')
      toast.success('Depth chart created')
      navigate({ to: '/depth-charts' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to create')
    },
  })

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Depth Charts</h2>
            <CardDescription>Manage depth charts and lineup views</CardDescription>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className='size-4' />
            Create Depth Chart
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Depth Charts</CardTitle>
            <CardDescription>
              Baseball field view and position assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className='py-8 text-center text-muted-foreground'>Loading...</p>
            ) : error ? (
              <p className='py-8 text-center text-destructive'>
                {(error as Error).message}
              </p>
            ) : charts.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-muted-foreground'>No depth charts yet</p>
                <Button className='mt-4' onClick={() => setCreateOpen(true)}>
                  Create your first depth chart
                </Button>
              </div>
            ) : (
              <ul className='divide-y'>
                {charts.map((chart) => (
                  <li key={chart.id} className='flex items-center justify-between py-3'>
                    <Link
                      to='/depth-charts/$id'
                      params={{ id: String(chart.id) }}
                      className='font-medium hover:underline'
                    >
                      {chart.name || `Depth Chart #${chart.id}`}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Depth Chart</DialogTitle>
            <DialogDescription>
              Give your depth chart a name (e.g., &quot;Opening Day&quot;, &quot;vs State&quot;)
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder='Depth chart name'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createMutation.mutate(newName)}
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(newName)}
              disabled={!newName.trim() || createMutation.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Main>
  )
}
