import { createFileRoute } from '@tanstack/react-router'
import { NewsList } from '@/features/news/news-list'

export const Route = createFileRoute('/_authenticated/news/')({
  component: NewsList,
})
