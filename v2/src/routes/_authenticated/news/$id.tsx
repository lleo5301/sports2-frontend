import { createFileRoute } from '@tanstack/react-router'
import { NewsDetail } from '@/features/news/news-detail'

export const Route = createFileRoute('/_authenticated/news/$id')({
  component: NewsDetailPage,
})

function NewsDetailPage() {
  const { id } = Route.useParams()
  return <NewsDetail id={id} />
}
