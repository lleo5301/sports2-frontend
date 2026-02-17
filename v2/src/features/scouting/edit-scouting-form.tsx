import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import {
  scoutingApi,
  type ScoutingReport,
  EVENT_TYPES,
  type GradeValue,
} from '@/lib/scouting-api'
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

const schema = z.object({
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
})

type FormValues = z.infer<typeof schema>

function toGradeValue(v: number | string | undefined): GradeValue | undefined {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'number') return v
  const n = Number(v)
  if (!Number.isNaN(n)) return n
  return String(v).trim() || undefined
}

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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      report_date: report.report_date ?? '',
      event_type: report.event_type ?? '',
      overall_present: report.overall_present,
      overall_future: report.overall_future,
      hitting_present: report.hitting_present,
      hitting_future: report.hitting_future,
      pitching_present: report.pitching_present,
      pitching_future: report.pitching_future,
      fielding_present: report.fielding_present,
      fielding_future: report.fielding_future,
      speed_present: report.speed_present,
      speed_future: report.speed_future,
      sixty_yard_dash: report.sixty_yard_dash,
      mlb_comparison: report.mlb_comparison ?? '',
      notes: report.notes ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      scoutingApi.update(report.id, {
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
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scouting-reports'] })
      queryClient.invalidateQueries({ queryKey: ['scouting-report', report.id] })
      toast.success('Report updated')
      onSuccess()
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update report')
    },
  })

  return (
    <Main>
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Edit Scouting Report</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Grades: 20–80 numeric or letter (B+, A, etc.)
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className='space-y-4'
            >
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
                        <Input {...field} />
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
                  Save changes
                </Button>
                <Button type='button' variant='outline' onClick={onCancel}>
                  Cancel
                </Button>
                <Button type='button' variant='ghost' asChild>
                  <Link to='/scouting'>Back to reports</Link>
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
