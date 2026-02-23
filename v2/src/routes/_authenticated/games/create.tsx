import { createFileRoute } from '@tanstack/react-router'
import { CreateGameForm } from '@/features/games/create-game-form'

export const Route = createFileRoute('/_authenticated/games/create')({
  component: CreateGameForm,
})
