import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/high-school-coaches/')({
  component: () => (
    <PlaceholderPage
      title='High School Coaches'
      description='High school coach contacts'
    />
  ),
})
