import { createFileRoute } from '@tanstack/react-router'
import { CreatePlayerForm } from '@/features/players/create-player-form'

export const Route = createFileRoute('/_authenticated/players/create')({
  component: CreatePlayerForm,
})
