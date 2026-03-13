import { useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import {
  EVENT_TYPES,
  REPORT_CONFIDENCE_OPTIONS,
  BODY_PROJECTION_OPTIONS,
  QUALITY_SCALE_OPTIONS,
} from '@/lib/scouting-api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { GradeSelect } from '@/components/ui/grade-select'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { type ScoutingFormValues } from './scouting-form-schema'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScoutingFormFieldsProps {
  form: UseFormReturn<ScoutingFormValues>
  /** Render the prospect selector slot (create form only) */
  prospectSlot?: React.ReactNode
}

/* ------------------------------------------------------------------ */
/*  Collapsible Section wrapper                                        */
/* ------------------------------------------------------------------ */

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Separator className='my-2' />
      <CollapsibleTrigger className='flex w-full items-center justify-between py-2 text-sm font-semibold hover:underline'>
        {title}
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-4 pb-2'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

/* ------------------------------------------------------------------ */
/*  Helpers — present/future grade row                                 */
/* ------------------------------------------------------------------ */

function PresentFutureRow({
  form,
  basePath,
  label,
}: {
  form: UseFormReturn<ScoutingFormValues>
  basePath: string
  label: string
}) {
  const presentName = `${basePath}.present` as keyof ScoutingFormValues
  const futureName = `${basePath}.future` as keyof ScoutingFormValues
  const descName = `${basePath}.description` as keyof ScoutingFormValues

  return (
    <div className='grid grid-cols-[1fr_auto_auto] items-end gap-2'>
      <FormField
        control={form.control}
        name={descName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                placeholder='Description'
                value={(field.value as string) ?? ''}
                onChange={(e) => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={presentName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-xs text-muted-foreground'>P</FormLabel>
            <FormControl>
              <GradeSelect
                value={field.value as number | undefined}
                onValueChange={field.onChange}
                placeholder='P'
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={futureName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-xs text-muted-foreground'>F</FormLabel>
            <FormControl>
              <GradeSelect
                value={field.value as number | undefined}
                onValueChange={field.onChange}
                placeholder='F'
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

function GradeWithDescRow({
  form,
  basePath,
  label,
}: {
  form: UseFormReturn<ScoutingFormValues>
  basePath: string
  label: string
}) {
  const gradeName = `${basePath}.grade` as keyof ScoutingFormValues
  const descName = `${basePath}.description` as keyof ScoutingFormValues

  return (
    <div className='grid grid-cols-[1fr_auto] items-end gap-2'>
      <FormField
        control={form.control}
        name={descName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                placeholder='Description'
                value={(field.value as string) ?? ''}
                onChange={(e) => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={gradeName}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-xs text-muted-foreground'>
              Grade
            </FormLabel>
            <FormControl>
              <GradeSelect
                value={field.value as number | undefined}
                onValueChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

function QualityScaleField({
  form,
  name,
  label,
}: {
  form: UseFormReturn<ScoutingFormValues>
  name: keyof ScoutingFormValues
  label: string
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={(field.value as string) ?? ''}
            onValueChange={(v) => field.onChange(v || undefined)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {QUALITY_SCALE_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Main fields component                                              */
/* ------------------------------------------------------------------ */

export function ScoutingFormFields({
  form,
  prospectSlot,
}: ScoutingFormFieldsProps) {
  return (
    <div className='space-y-4'>
      {/* ── Section 1: Report Info (always visible) ── */}
      <div className='space-y-4'>
        {prospectSlot}

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='report_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={(v) => field.onChange(v || undefined)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='hitter'>Hitter</SelectItem>
                    <SelectItem value='pitcher'>Pitcher</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='event_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
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

        <div className='grid gap-4 sm:grid-cols-3'>
          <FormField
            control={form.control}
            name='report_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date_seen_start'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Seen Start</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date_seen_end'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Seen End</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='video_report'
          render={({ field }) => (
            <FormItem className='flex items-center gap-2'>
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className='!mt-0'>Video Report</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* ── Section 2: Assessment ── */}
      <Section title='Assessment' defaultOpen>
        <FormField
          control={form.control}
          name='player_comparison'
          render={({ field }) => (
            <FormItem>
              <FormLabel>MLB Comparison</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. Marcus Semien'
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='impact_statement'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact Statement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Impact statement...'
                  rows={2}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='grid gap-4 sm:grid-cols-3'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role (1-9)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    max={9}
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
            name='round_would_take'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Would Take</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. 1st Round'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dollar_amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dollar Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder='$500,000'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-6'>
          <FormField
            control={form.control}
            name='money_save'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>Money Save</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='overpay'
            render={({ field }) => (
              <FormItem className='flex items-center gap-2'>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='!mt-0'>Overpay</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='report_confidence'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Confidence</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={(v) => field.onChange(v || undefined)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REPORT_CONFIDENCE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-[1fr_auto] items-end gap-2'>
          <FormField
            control={form.control}
            name='look_recommendation_desc'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Look Recommendation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Description'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='look_recommendation'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs text-muted-foreground'>
                  Grade
                </FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Section>

      {/* ── Section 3: Body & Athleticism ── */}
      <Section title='Body & Athleticism' defaultOpen>
        <div className='grid grid-cols-[1fr_auto] items-end gap-2'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='tool_grades.body.description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Description'
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value || undefined)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tool_grades.body.projection'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projection</FormLabel>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || undefined)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BODY_PROJECTION_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='tool_grades.body.grade'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs text-muted-foreground'>
                  Grade
                </FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <GradeWithDescRow
          form={form}
          basePath='tool_grades.athleticism'
          label='Athleticism'
        />
      </Section>

      {/* ── Section 4: Bat (hitter tools) ── */}
      <Section title='Bat' defaultOpen>
        <PresentFutureRow
          form={form}
          basePath='tool_grades.bat.hit'
          label='Hit'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.bat.power'
          label='Power'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.bat.raw_power'
          label='Raw Power'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.bat.bat_speed'
          label='Bat Speed'
        />

        <div className='grid gap-4 sm:grid-cols-3'>
          <QualityScaleField
            form={form}
            name={'tool_grades.bat.contact' as keyof ScoutingFormValues}
            label='Contact'
          />
          <QualityScaleField
            form={form}
            name={'tool_grades.bat.swing_decisions' as keyof ScoutingFormValues}
            label='Swing Decisions'
          />
          <QualityScaleField
            form={form}
            name={'tool_grades.bat.contact_quality' as keyof ScoutingFormValues}
            label='Contact Quality'
          />
        </div>
      </Section>

      {/* ── Section 5: Field ── */}
      <Section title='Field' defaultOpen>
        <PresentFutureRow
          form={form}
          basePath='tool_grades.field.arm_strength'
          label='Arm Strength'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.field.arm_accuracy'
          label='Arm Accuracy'
        />

        <div className='grid gap-4 sm:grid-cols-3'>
          <FormField
            control={form.control}
            name='tool_grades.field.current_position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder='SS'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tool_grades.field.defense_present'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defense (Present)</FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tool_grades.field.pop_times'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pop Times</FormLabel>
                <FormControl>
                  <Input
                    placeholder='1.90'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-[1fr_auto] items-end gap-2'>
          <FormField
            control={form.control}
            name='tool_grades.field.fielding_description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fielding</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Description'
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value || undefined)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tool_grades.field.fielding_grade'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs text-muted-foreground'>
                  Grade
                </FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Section>

      {/* ── Section 6: Run ── */}
      <Section title='Run' defaultOpen>
        <GradeWithDescRow
          form={form}
          basePath='tool_grades.run.speed'
          label='Speed'
        />
        <FormField
          control={form.control}
          name='tool_grades.run.times_to_first'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Times to First</FormLabel>
              <FormControl>
                <Input
                  placeholder='4.2'
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <GradeWithDescRow
          form={form}
          basePath='tool_grades.run.baserunning'
          label='Baserunning'
        />
        <GradeWithDescRow
          form={form}
          basePath='tool_grades.run.instincts'
          label='Instincts'
        />
        <GradeWithDescRow
          form={form}
          basePath='tool_grades.run.compete'
          label='Compete'
        />
      </Section>

      {/* ── Section 7: Pitching ── */}
      <Section title='Pitching' defaultOpen>
        <PresentFutureRow
          form={form}
          basePath='tool_grades.pitching.fastball'
          label='Fastball'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.pitching.slider'
          label='Slider'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.pitching.curveball'
          label='Curveball'
        />
        <PresentFutureRow
          form={form}
          basePath='tool_grades.pitching.changeup'
          label='Changeup'
        />

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='tool_grades.pitching.command'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Command</FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tool_grades.pitching.control'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control</FormLabel>
                <FormControl>
                  <GradeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='tool_grades.pitching.delivery'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery</FormLabel>
              <FormControl>
                <Input
                  placeholder='Delivery description'
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tool_grades.pitching.description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pitching Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Pitching notes...'
                  rows={3}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Section>

      {/* ── Section 8: Summary & Notes ── */}
      <Section title='Summary & Notes' defaultOpen>
        <FormField
          control={form.control}
          name='summary'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Overall summary...'
                  rows={4}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Scouting notes...'
                  rows={4}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Section>
    </div>
  )
}
