/**
 * News releases feed — list and filter.
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatDate } from '@/lib/format-date'
import { newsApi } from '@/lib/news-api'
import { Main } from '@/components/layout/main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export function NewsList() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['news', { search, page: 1 }],
    queryFn: () => newsApi.list({ search: search || undefined, page: 1, limit: 24 }),
  })

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>News</h2>
          <p className='text-muted-foreground'>
            Team news and press releases from PrestoSports
          </p>
        </div>

        <div className='flex gap-4'>
          <Input
            placeholder='Search news...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-sm'
          />
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : data ? (
          data.data.length === 0 ? (
            <div className='rounded-lg border border-dashed p-12 text-center text-muted-foreground'>
              No news releases found
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {data.data.map((item) => (
                <Link
                  key={item.id}
                  to='/news/$id'
                  params={{ id: String(item.id) }}
                  className='group'
                >
                  <Card className='h-full overflow-hidden transition-colors hover:border-primary/50'>
                    {item.image_url && (
                      <div className='aspect-video overflow-hidden bg-muted'>
                        <img
                          src={item.image_url}
                          alt=''
                          className='h-full w-full object-cover transition-transform group-hover:scale-105'
                        />
                      </div>
                    )}
                    <CardHeader className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        {item.category && (
                          <span className='rounded bg-muted px-2 py-0.5 text-xs font-medium'>
                            {item.category}
                          </span>
                        )}
                        <span className='text-xs text-muted-foreground'>
                          {formatDate(item.publish_date)}
                        </span>
                      </div>
                      <CardTitle className='line-clamp-2 group-hover:text-primary'>
                        {item.title}
                      </CardTitle>
                      {item.summary && (
                        <CardDescription className='line-clamp-2'>
                          {item.summary}
                        </CardDescription>
                      )}
                      {item.player && (
                        <p className='text-xs text-muted-foreground'>
                          {item.player.first_name} {item.player.last_name}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )
        ) : null}
      </div>
    </Main>
  )
}
