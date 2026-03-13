import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { prospectsApi, type Prospect } from '@/lib/prospects-api'
import { scoutingApi } from '@/lib/scouting-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { CreateProspectModal } from './create-prospect-modal'
import { ScoutingFormFields } from './scouting-form-fields'
import {
  scoutingFormSchema,
  type ScoutingFormValues,
  buildScoutingPayload,
} from './scouting-form-schema'

interface CreateScoutingFormProps {
  preselectedProspectId?: string
}

export function CreateScoutingForm({
  preselectedProspectId,
}: CreateScoutingFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [createProspectOpen, setCreateProspectOpen] = useState(false)

  const { data: prospectsData } = useQuery({
    queryKey: ['prospects-simple'],
    queryFn: () => prospectsApi.list({ limit: 100 }),
  })

  const prospectIdNum = preselectedProspectId
    ? parseInt(preselectedProspectId, 10)
    : undefined

  // Require prospect_id for create
  const createSchema = scoutingFormSchema.refine((d) => !!d.prospect_id, {
    message: 'Select a prospect',
    path: ['prospect_id'],
  })

  const form = useForm<ScoutingFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      prospect_id: Number.isNaN(prospectIdNum!) ? undefined : prospectIdNum,
      player_id: undefined,
      report_type: undefined,
      report_date: new Date().toISOString().slice(0, 10),
      event_type: '',
      date_seen_start: undefined,
      date_seen_end: undefined,
      video_report: false,
      player_comparison: undefined,
      impact_statement: undefined,
      role: undefined,
      round_would_take: undefined,
      dollar_amount: undefined,
      money_save: false,
      overpay: false,
      report_confidence: undefined,
      look_recommendation: undefined,
      look_recommendation_desc: undefined,
      tool_grades: {},
      summary: undefined,
      notes: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: ScoutingFormValues) => {
      const payload = buildScoutingPayload(data)
      const result = await scoutingApi.create(payload)
      if (!result) {
        throw new Error('No data returned from server')
      }
      return result
    },
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ['scouting-reports'] })
      toast.success('Scouting report created')
      if (report.id) {
        navigate({
          to: '/scouting/$id',
          params: { id: String(report.id) },
        })
      } else {
        navigate({ to: '/scouting' })
      }
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: string; message?: string } }
        message?: string
      }
      const message =
        axiosErr?.response?.data?.error ??
        axiosErr?.response?.data?.message ??
        (err as Error)?.message ??
        'Failed to create report'
      toast.error(message)
    },
  })

  const preselectedProspect = prospectsData?.data?.find(
    (p) => p.id === prospectIdNum
  )

  /* ── Prospect selector slot ── */
  const prospectSlot = (
    <>
      {preselectedProspectId ? (
        <FormField
          control={form.control}
          name='prospect_id'
          render={({ field }) => (
            <FormItem className='hidden'>
              <FormControl>
                <input
                  {...field}
                  type='hidden'
                  value={String(field.value ?? '')}
                  readOnly
                />
              </FormControl>
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name='prospect_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prospect (required)</FormLabel>
              <div className='flex gap-2'>
                <Select
                  onValueChange={(v) =>
                    field.onChange(
                      v && v !== 'all' ? parseInt(v, 10) : undefined
                    )
                  }
                  value={field.value ? String(field.value) : 'all'}
                >
                  <FormControl>
                    <SelectTrigger className='flex-1'>
                      <SelectValue placeholder='Select prospect' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='all'>Select prospect...</SelectItem>
                    {prospectsData?.data?.map((p: Prospect) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {[p.first_name, p.last_name].filter(Boolean).join(' ')}{' '}
                        ({p.primary_position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  title='Create new prospect'
                  onClick={() => setCreateProspectOpen(true)}
                >
                  <Plus className='size-4' />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <CreateProspectModal
        open={createProspectOpen}
        onOpenChange={setCreateProspectOpen}
        onCreated={(prospect) => {
          form.setValue('prospect_id', prospect.id, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }}
      />
    </>
  )

  return (
    <Main>
      <Card className='max-w-3xl'>
        <CardHeader>
          <CardTitle>Create Scouting Report</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Fill out the scouting report sections below. Grades use the 20-80
            scale.
          </p>
          {preselectedProspect && (
            <p className='text-sm font-medium'>
              For:{' '}
              {[preselectedProspect.first_name, preselectedProspect.last_name]
                .filter(Boolean)
                .join(' ')}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className='space-y-4'
            >
              <ScoutingFormFields form={form} prospectSlot={prospectSlot} />

              <div className='flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  asChild
                  className='w-full sm:w-auto'
                >
                  <Link to='/scouting'>Cancel</Link>
                </Button>
                <Button
                  type='submit'
                  disabled={mutation.isPending}
                  className='w-full sm:w-auto'
                >
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Report
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}
