import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import {
  scoutingApi,
  EVENT_TYPES,
  type GradeValue,
} from '@/lib/scouting-api'
import { prospectsApi, type Prospect } from '@/lib/prospects-api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { CreateProspectModal } from './create-prospect-modal'

const schema = z.object({
  prospect_id: z.number().optional(),
  player_id: z.number().optional(),
  report_date: z.string().min(1, 'Required'),
  event_type: z.string().min(1, 'Required'),
  overall_present: z.union([z.number(), z.string()]).optional(),
  overall_future: z.union([z.number(), z.string()]).optional(),
  hitting_present: z.union([z.number(), z.string()]).optional(),
  hitting_future: z.union([z.number(), z.string()]).optional(),
  pitching_present: z.union([z.number(), z.string()]).optional(),
  pitching_future: z.union([z.number(), z.string()]).optional(),
  fielding_present: z.union([z.number(), z.string()]).optional(),
  fielding_future: z.union([z.number(), z.string()]).optional(),
  speed_present: z.union([z.number(), z.string()]).optional(),
  speed_future: z.union([z.number(), z.string()]).optional(),
  sixty_yard_dash: z.number().optional(),
  mlb_comparison: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => !!data.prospect_id,
  { message: 'Select a prospect', path: ['prospect_id'] }
)

type FormValues = z.infer<typeof schema>

function toGradeValue(v: number | string | undefined): GradeValue | undefined {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'number') return v
  const n = Number(v)
  if (!Number.isNaN(n)) return n
  return String(v).trim() || undefined
}

interface CreateScoutingFormProps {
  preselectedProspectId?: string
}

export function CreateScoutingForm({ preselectedProspectId }: CreateScoutingFormProps) {
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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      prospect_id: Number.isNaN(prospectIdNum!) ? undefined : prospectIdNum,
      player_id: undefined,
      report_date: new Date().toISOString().slice(0, 10),
      event_type: '',
      overall_present: undefined,
      overall_future: undefined,
      hitting_present: undefined,
      hitting_future: undefined,
      pitching_present: undefined,
      pitching_future: undefined,
      fielding_present: undefined,
      fielding_future: undefined,
      speed_present: undefined,
      speed_future: undefined,
      sixty_yard_dash: undefined,
      mlb_comparison: '',
      notes: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const result = await scoutingApi.create({
        prospect_id: data.prospect_id,
        player_id: data.player_id,
        report_date: data.report_date,
        event_type: data.event_type,
        overall_present: toGradeValue(data.overall_present),
        overall_future: toGradeValue(data.overall_future),
        hitting_present: toGradeValue(data.hitting_present),
        hitting_future: toGradeValue(data.hitting_future),
        pitching_present: toGradeValue(data.pitching_present),
        pitching_future: toGradeValue(data.pitching_future),
        fielding_present: toGradeValue(data.fielding_present),
        fielding_future: toGradeValue(data.fielding_future),
        speed_present: toGradeValue(data.speed_present),
        speed_future: toGradeValue(data.speed_future),
        sixty_yard_dash: data.sixty_yard_dash,
        mlb_comparison: data.mlb_comparison || undefined,
        notes: data.notes || undefined,
      })
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
      const axiosErr = err as { response?: { data?: { error?: string; message?: string } }; message?: string }
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

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Create Scouting Report</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Grades: 20–80 numeric or letter (B+, A, etc.)
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
                          value={
                            field.value
                              ? String(field.value)
                              : 'all'
                          }
                        >
                          <FormControl>
                            <SelectTrigger className='flex-1'>
                              <SelectValue placeholder='Select prospect' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='all'>
                              Select prospect...
                            </SelectItem>
                            {prospectsData?.data?.map((p: Prospect) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {[p.first_name, p.last_name]
                                  .filter(Boolean)
                                  .join(' ')}{' '}
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

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='report_date'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='event_type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EVENT_TYPES.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-4'>
                <GradeField form={form} name='overall_present' label='Overall (P)' />
                <GradeField form={form} name='overall_future' label='Overall (F)' />
                <GradeField form={form} name='hitting_present' label='Hitting (P)' />
                <GradeField form={form} name='hitting_future' label='Hitting (F)' />
                <GradeField form={form} name='pitching_present' label='Pitching (P)' />
                <GradeField form={form} name='pitching_future' label='Pitching (F)' />
                <GradeField form={form} name='fielding_present' label='Fielding (P)' />
                <GradeField form={form} name='fielding_future' label='Fielding (F)' />
                <GradeField form={form} name='speed_present' label='Speed (P)' />
                <GradeField form={form} name='speed_future' label='Speed (F)' />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='sixty_yard_dash'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>60-yard dash (sec)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step={0.01}
                          placeholder='6.72'
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const v = e.target.value
                            field.onChange(v === '' ? undefined : Number(v))
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='mlb_comparison'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MLB comparison</FormLabel>
                      <FormControl>
                        <Input placeholder='Marcus Semien' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Scouting notes...'
                        className='min-h-[80px]'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : null}
                  Create Report
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link to='/scouting'>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Main>
  )
}

function GradeField({
  form,
  name,
  label,
}: {
  form: ReturnType<typeof useForm<FormValues>>
  name: keyof FormValues
  label: string
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder='50 or B-'
              value={
                field.value !== undefined && field.value !== null
                  ? String(field.value)
                  : ''
              }
              onChange={(e) => {
                const v = e.target.value
                if (v === '') {
                  field.onChange(undefined)
                  return
                }
                const n = Number(v)
                field.onChange(Number.isNaN(n) ? v : n)
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
