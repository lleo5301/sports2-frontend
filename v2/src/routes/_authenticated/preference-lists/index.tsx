import { createFileRoute } from '@tanstack/react-router'
import { PreferenceListsPage } from '@/features/preference-lists/preference-lists-page'

export const Route = createFileRoute('/_authenticated/preference-lists/')({
  component: PreferenceListsPage,
})
