/**
 * Single news release — full content.
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { newsApi } from '@/lib/news-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

interface NewsDetailProps {
  id: string
}

export function NewsDetail({ id }: NewsDetailProps) {
  const newsId = parseInt(id, 10)
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['news', newsId],
    queryFn: () => newsApi.getById(newsId),
    enabled: !Number.isNaN(newsId),
  })

  if (Number.isNaN(newsId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid news ID
        </div>
      </Main>
    )
  }

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error || !item) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'News not found'}
          </p>
          <Button asChild variant='outline' className='mt-4'>
            <Link to='/news'>Back to news</Link>
          </Button>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/news'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{item.title}</h2>
            <p className='text-muted-foreground'>
              {formatDate(item.publish_date)}
              {item.author && ` • ${item.author}`}
              {item.category && ` • ${item.category}`}
            </p>
          </div>
        </div>

        <Card>
          {item.image_url && (
            <div className='aspect-video overflow-hidden rounded-t-lg bg-muted'>
              <img
                src={item.image_url}
                alt=''
                className='h-full w-full object-cover'
              />
            </div>
          )}
          <CardHeader>
            {item.summary && (
              <CardDescription className='text-base'>{item.summary}</CardDescription>
            )}
            {item.player && (
              <p className='text-sm text-muted-foreground'>
                About: {item.player.first_name} {item.player.last_name}
              </p>
            )}
          </CardHeader>
          <CardContent className='prose prose-sm max-w-none dark:prose-invert'>
            {item.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className='news-content'
              />
            ) : (
              <p className='text-muted-foreground'>No content available.</p>
            )}
          </CardContent>
        </Card>

        {item.source_url && (
          <div>
            <Button variant='outline' asChild>
              <a
                href={item.source_url}
                target='_blank'
                rel='noreferrer noopener'
              >
                Read on PrestoSports
              </a>
            </Button>
          </div>
        )}
      </div>
    </Main>
  )
}
