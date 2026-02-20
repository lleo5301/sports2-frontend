import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Trophy, Loader2, ChevronRight } from 'lucide-react'
import { tournamentsApi } from '@/lib/tournaments-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TournamentsList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournaments', page, limit],
    queryFn: () => tournamentsApi.list({ page, limit }),
  })

  const tournaments = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 }

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Tournaments</h2>
          <CardDescription>
            Tournaments from Presto schedule sync. Click to view games.
          </CardDescription>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className='flex items-center justify-center py-16'>
              <Loader2 className='size-8 animate-spin text-muted-foreground' />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className='py-8 text-center text-destructive'>
              {(error as Error).message}
            </CardContent>
          </Card>
        ) : tournaments.length === 0 ? (
          <Card>
            <CardContent className='py-8 text-center text-muted-foreground'>
              No tournaments. Sync Presto schedule to populate.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle>All tournaments</CardTitle>
              <CardDescription>
                {pagination.total} tournament{pagination.total !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {tournaments.map((t) => (
                  <div
                    key={t.id}
                    className='flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50'
                    onClick={() => navigate({ to: '/tournaments/$id', params: { id: String(t.id) } })}
                  >
                    <div className='flex items-center gap-3'>
                      <Trophy className='size-5 text-muted-foreground' />
                      <div>
                        <p className='font-medium'>{t.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {t.season_name ? `Season: ${t.season_name}` : ''}
                          {t.game_count != null && ` · ${t.game_count} game${t.game_count !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {t.game_count != null && t.game_count > 0 && (
                        <Badge variant='secondary'>{t.game_count} games</Badge>
                      )}
                      <ChevronRight className='size-4 text-muted-foreground' />
                    </div>
                  </div>
                ))}
              </div>
              {pagination.pages > 1 && (
                <div className='mt-4 flex justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className='flex items-center px-2 text-sm text-muted-foreground'>
                    {page} / {pagination.pages}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Main>
  )
}
