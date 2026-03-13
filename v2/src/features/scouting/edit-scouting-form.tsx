import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { scoutingApi, type ScoutingReport } from '@/lib/scouting-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Main } from '@/components/layout/main'
import { ScoutingFormFields } from './scouting-form-fields'
import {
  scoutingFormSchema,
  type ScoutingFormValues,
  buildScoutingPayload,
} from './scouting-form-schema'

interface EditScoutingFormProps {
  report: ScoutingReport
  onSuccess: () => void
  onCancel: () => void
}

export function EditScoutingForm({
  report,
  onSuccess,
  onCancel,
}: EditScoutingFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<ScoutingFormValues>({
    resolver: zodResolver(scoutingFormSchema),
    defaultValues: {
      prospect_id: report.prospect_id,
      player_id: report.player_id,
      report_type: report.report_type,
      report_date: report.report_date ?? '',
      event_type: report.event_type ?? '',
      date_seen_start: report.date_seen_start,
      date_seen_end: report.date_seen_end,
      video_report: report.video_report ?? false,
      player_comparison:
        report.player_comparison ?? report.mlb_comparison ?? undefined,
      impact_statement: report.impact_statement,
      role: report.role,
      round_would_take: report.round_would_take,
      dollar_amount: report.dollar_amount,
      money_save: report.money_save ?? false,
      overpay: report.overpay ?? false,
      report_confidence: report.report_confidence,
      look_recommendation: report.look_recommendation,
      look_recommendation_desc: report.look_recommendation_desc,
      tool_grades: report.tool_grades ?? {},
      summary: report.summary,
      notes: report.notes,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ScoutingFormValues) => {
      const payload = buildScoutingPayload(data)
      return scoutingApi.update(report.id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouting-reports'] })
      queryClient.invalidateQueries({
        queryKey: ['scouting-report', report.id],
      })
      toast.success('Report updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update report')
    },
  })

  return (
    <Main>
      <Card className='max-w-3xl'>
        <CardHeader>
          <CardTitle>Edit Scouting Report</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Update the scouting report sections below. Grades use the 20-80
            scale.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className='space-y-4'
            >
              <ScoutingFormFields form={form} />

              <div className='flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end'>
                <Button
                  type='button'
                  variant='ghost'
                  asChild
                  className='w-full sm:w-auto'
                >
                  <Link to='/scouting'>Back to reports</Link>
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  className='w-full sm:w-auto'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={mutation.isPending}
                  className='w-full sm:w-auto'
                >
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
