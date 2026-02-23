import { createFileRoute } from '@tanstack/react-router'
import { RecruitingBoard } from '@/features/recruiting/recruiting-board'

export const Route = createFileRoute('/_authenticated/recruiting/')({
  component: RecruitingBoard,
})
