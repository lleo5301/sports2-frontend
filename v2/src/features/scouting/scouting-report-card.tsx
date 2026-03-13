import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Pencil,
  User,
} from 'lucide-react'
import type { ScoutingReport, ToolGrades } from '@/lib/scouting-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GradeBadge } from '@/components/ui/grade-badge'
import { Separator } from '@/components/ui/separator'

interface ScoutingReportCardProps {
  report: ScoutingReport
  defaultExpanded?: boolean
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function scoutName(report: ScoutingReport) {
  return report.User
    ? [report.User.first_name, report.User.last_name].filter(Boolean).join(' ')
    : null
}

/** Render the legacy 7-tool table when tool_grades is not populated */
function LegacyGradeTable({ report }: { report: ScoutingReport }) {
  const rows = [
    {
      label: 'Overall',
      present: report.overall_present,
      future: report.overall_future,
    },
    {
      label: 'Hitting',
      present: report.hitting_present,
      future: report.hitting_future,
    },
    {
      label: 'Power',
      present: report.power_present,
      future: report.power_future,
    },
    {
      label: 'Fielding',
      present: report.fielding_present,
      future: report.fielding_future,
    },
    { label: 'Arm', present: report.arm_present, future: report.arm_future },
    {
      label: 'Speed',
      present: report.speed_present,
      future: report.speed_future,
    },
    {
      label: 'Pitching',
      present: report.pitching_present,
      future: report.pitching_future,
    },
  ].filter(
    (r) =>
      (r.present != null && r.present !== '') ||
      (r.future != null && r.future !== '')
  )
  if (rows.length === 0) return null
  return (
    <div>
      <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
        Tool Grades
      </h4>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b'>
            <th className='pb-2 text-left font-medium text-muted-foreground'>
              Tool
            </th>
            <th className='pb-2 text-center font-medium text-muted-foreground'>
              P
            </th>
            <th className='pb-2 text-center font-medium text-muted-foreground'>
              F
            </th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className='py-2 font-medium'>{r.label}</td>
              <td className='py-2 text-center'>
                <GradeBadge value={r.present} />
              </td>
              <td className='py-2 text-center'>
                <GradeBadge value={r.future} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PFTable({
  title,
  rows,
}: {
  title: string
  rows: {
    label: string
    present?: number
    future?: number
    description?: string
  }[]
}) {
  const filtered = rows.filter(
    (r) => r.present != null || r.future != null || r.description
  )
  if (filtered.length === 0) return null
  return (
    <div>
      <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
        {title}
      </h4>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b'>
            <th className='pb-2 text-left font-medium text-muted-foreground'>
              Tool
            </th>
            <th className='pb-2 text-center font-medium text-muted-foreground'>
              P
            </th>
            <th className='pb-2 text-center font-medium text-muted-foreground'>
              F
            </th>
            <th className='pb-2 text-left font-medium text-muted-foreground'>
              Description
            </th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {filtered.map((r) => (
            <tr key={r.label}>
              <td className='py-2 font-medium'>{r.label}</td>
              <td className='py-2 text-center'>
                <GradeBadge value={r.present} />
              </td>
              <td className='py-2 text-center'>
                <GradeBadge value={r.future} />
              </td>
              <td className='py-2 text-sm text-muted-foreground'>
                {r.description || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function QualityRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm font-medium'>{label}</span>
      <Badge variant='outline'>{value}</Badge>
    </div>
  )
}

function BodySection({ tg }: { tg: ToolGrades }) {
  const body = tg.body
  const ath = tg.athleticism
  if (
    !body?.grade &&
    !body?.projection &&
    !body?.description &&
    !ath?.grade &&
    !ath?.description
  )
    return null
  return (
    <div>
      <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
        Body & Athleticism
      </h4>
      <div className='grid gap-3 sm:grid-cols-2'>
        {(body?.grade != null || body?.projection || body?.description) && (
          <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Body</span>
              {body?.grade != null && <GradeBadge value={body.grade} />}
              {body?.projection && (
                <Badge variant='outline' className='text-xs'>
                  {body.projection}
                </Badge>
              )}
            </div>
            {body?.description && (
              <p className='text-sm text-muted-foreground'>
                {body.description}
              </p>
            )}
          </div>
        )}
        {(ath?.grade != null || ath?.description) && (
          <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Athleticism</span>
              {ath?.grade != null && <GradeBadge value={ath.grade} />}
            </div>
            {ath?.description && (
              <p className='text-sm text-muted-foreground'>{ath.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BatSection({ tg }: { tg: ToolGrades }) {
  const bat = tg.bat
  if (!bat) return null
  const pfRows = [
    { label: 'Hit', ...bat.hit },
    { label: 'Power', ...bat.power },
    { label: 'Raw Power', ...bat.raw_power },
    { label: 'Bat Speed', ...bat.bat_speed },
  ]
  const hasTable = pfRows.some((r) => r.present != null || r.future != null)
  const hasQuality = bat.contact || bat.swing_decisions || bat.contact_quality
  if (!hasTable && !hasQuality) return null
  return (
    <div className='space-y-3'>
      {hasTable && <PFTable title='Bat' rows={pfRows} />}
      {hasQuality && (
        <div className='flex flex-wrap gap-4'>
          <QualityRow label='Contact' value={bat.contact} />
          <QualityRow label='Swing Decisions' value={bat.swing_decisions} />
          <QualityRow label='Contact Quality' value={bat.contact_quality} />
        </div>
      )}
    </div>
  )
}

function FieldSection({ tg }: { tg: ToolGrades }) {
  const field = tg.field
  if (!field) return null
  const armRows = [
    { label: 'Arm Strength', ...field.arm_strength },
    { label: 'Arm Accuracy', ...field.arm_accuracy },
  ]
  const hasArms = armRows.some((r) => r.present != null || r.future != null)
  const hasMeta =
    field.current_position || field.defense_present != null || field.pop_times
  const hasFuture = field.future_positions && field.future_positions.length > 0
  if (!hasArms && !hasMeta && !hasFuture && !field.fielding_description)
    return null
  return (
    <div className='space-y-3'>
      {hasArms && <PFTable title='Field' rows={armRows} />}
      {hasMeta && (
        <div className='flex flex-wrap gap-4 text-sm'>
          {field.current_position && (
            <div>
              <span className='text-muted-foreground'>Position:</span>{' '}
              <span className='font-medium'>{field.current_position}</span>
            </div>
          )}
          {field.defense_present != null && (
            <div>
              <span className='text-muted-foreground'>Def (P):</span>{' '}
              <GradeBadge value={field.defense_present} />
            </div>
          )}
          {field.pop_times && (
            <div>
              <span className='text-muted-foreground'>Pop Times:</span>{' '}
              <span className='font-medium'>{field.pop_times}</span>
            </div>
          )}
        </div>
      )}
      {field.fielding_description && (
        <p className='text-sm text-muted-foreground'>
          {field.fielding_description}
        </p>
      )}
      {hasFuture && (
        <div>
          <h5 className='mb-1 text-xs font-medium text-muted-foreground'>
            Future Positions
          </h5>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='pb-1.5 text-left font-medium text-muted-foreground'>
                  Pos
                </th>
                <th className='pb-1.5 text-center font-medium text-muted-foreground'>
                  %
                </th>
                <th className='pb-1.5 text-center font-medium text-muted-foreground'>
                  Grade
                </th>
                <th className='pb-1.5 text-left font-medium text-muted-foreground'>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {field.future_positions!.map((fp, i) => (
                <tr key={i}>
                  <td className='py-1.5 font-medium'>{fp.position}</td>
                  <td className='py-1.5 text-center'>
                    {fp.pct != null ? `${fp.pct}%` : '—'}
                  </td>
                  <td className='py-1.5 text-center'>
                    <GradeBadge value={fp.grade} />
                  </td>
                  <td className='py-1.5 text-sm text-muted-foreground'>
                    {fp.description || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function RunSection({ tg }: { tg: ToolGrades }) {
  const run = tg.run
  if (!run) return null
  const entries = [
    { label: 'Speed', grade: run.speed?.grade },
    {
      label: 'Baserunning',
      grade: run.baserunning?.grade,
      desc: run.baserunning?.description,
    },
    {
      label: 'Instincts',
      grade: run.instincts?.grade,
      desc: run.instincts?.description,
    },
    {
      label: 'Compete',
      grade: run.compete?.grade,
      desc: run.compete?.description,
    },
  ].filter((e) => e.grade != null)
  if (entries.length === 0 && !run.times_to_first) return null
  return (
    <div>
      <h4 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
        Run
      </h4>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {entries.map((e) => (
          <div key={e.label} className='flex items-start gap-2'>
            <div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{e.label}</span>
                <GradeBadge value={e.grade} />
              </div>
              {e.desc && (
                <p className='mt-0.5 text-xs text-muted-foreground'>{e.desc}</p>
              )}
            </div>
          </div>
        ))}
        {run.times_to_first && (
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Times to First</span>
              <span className='text-sm font-bold tabular-nums'>
                {run.times_to_first}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ExpandedToolGrades({ tg }: { tg: ToolGrades }) {
  return (
    <div className='space-y-4'>
      <BodySection tg={tg} />
      <BatSection tg={tg} />
      <FieldSection tg={tg} />
      <RunSection tg={tg} />
    </div>
  )
}

export function ScoutingReportCard({
  report,
  defaultExpanded = false,
}: ScoutingReportCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const scout = scoutName(report)
  const ofp = report.overall_future ?? report.tool_grades?.body?.grade
  const hasToolGrades =
    report.tool_grades && Object.keys(report.tool_grades).length > 0
  const hasLegacyGrades = [
    report.overall_present,
    report.overall_future,
    report.hitting_present,
    report.hitting_future,
    report.power_present,
    report.power_future,
  ].some((v) => v != null && v !== '')
  const comparison = report.player_comparison ?? report.mlb_comparison

  return (
    <Card>
      <CardHeader
        className='cursor-pointer pb-3'
        onClick={() => setExpanded(!expanded)}
      >
        <div className='flex items-center justify-between'>
          <div className='min-w-0 flex-1'>
            <CardTitle className='flex flex-wrap items-center gap-2 text-base'>
              <Calendar className='size-4 shrink-0 text-muted-foreground' />
              {formatDate(report.date_seen_start ?? report.report_date)}
              {report.event_type && (
                <Badge variant='outline' className='capitalize'>
                  {report.event_type}
                </Badge>
              )}
              {report.report_type && (
                <Badge variant='secondary' className='capitalize'>
                  {report.report_type}
                </Badge>
              )}
              {ofp != null && (
                <Badge className='bg-primary text-primary-foreground'>
                  OFP: {String(ofp)}
                </Badge>
              )}
              {report.role != null && (
                <Badge variant='outline'>Role {report.role}</Badge>
              )}
              {report.round_would_take && (
                <Badge variant='outline'>{report.round_would_take}</Badge>
              )}
            </CardTitle>
            <CardDescription className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1'>
              {scout && (
                <span className='flex items-center gap-1'>
                  <User className='size-3' />
                  {scout}
                </span>
              )}
              {comparison && <span>Comp: {comparison}</span>}
              {report.dollar_amount && <span>${report.dollar_amount}</span>}
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            {expanded && (
              <Button
                variant='outline'
                size='sm'
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link to='/scouting/$id' params={{ id: String(report.id) }}>
                  <Pencil className='size-3.5' />
                  Update
                </Link>
              </Button>
            )}
            {expanded ? (
              <ChevronUp className='size-4 text-muted-foreground' />
            ) : (
              <ChevronDown className='size-4 text-muted-foreground' />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className='space-y-4 pt-0'>
          {/* Impact Statement */}
          {report.impact_statement && (
            <div className='rounded-lg border bg-muted/30 px-4 py-3'>
              <p className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                Impact Statement
              </p>
              <p className='mt-1 font-medium'>{report.impact_statement}</p>
            </div>
          )}

          {/* Tool Grades — new or legacy */}
          {hasToolGrades ? (
            <ExpandedToolGrades tg={report.tool_grades!} />
          ) : hasLegacyGrades ? (
            <LegacyGradeTable report={report} />
          ) : null}

          {/* Legacy athleticism for old reports */}
          {!hasToolGrades &&
            (report.sixty_yard_dash != null || report.mlb_comparison) && (
              <>
                <Separator />
                <div className='grid grid-cols-2 gap-4'>
                  {report.sixty_yard_dash != null && (
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        60-Yard Dash
                      </p>
                      <p className='text-lg font-bold tabular-nums'>
                        {report.sixty_yard_dash}s
                      </p>
                    </div>
                  )}
                  {report.mlb_comparison && (
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        MLB Comparison
                      </p>
                      <p className='text-lg font-medium'>
                        {report.mlb_comparison}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

          {/* Look Recommendation */}
          {(report.look_recommendation != null ||
            report.look_recommendation_desc) && (
            <>
              <Separator />
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>
                    Look Recommendation
                  </span>
                  {report.look_recommendation != null && (
                    <GradeBadge value={report.look_recommendation} />
                  )}
                </div>
                {report.look_recommendation_desc && (
                  <p className='mt-1 text-sm text-muted-foreground italic'>
                    {report.look_recommendation_desc}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Summary */}
          {report.summary && (
            <>
              <Separator />
              <div>
                <h4 className='mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                  <FileText className='size-3.5' />
                  Summary
                </h4>
                <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                  {report.summary}
                </p>
              </div>
            </>
          )}

          {/* Notes (legacy / additional) */}
          {report.notes && (
            <>
              <Separator />
              <div>
                <h4 className='mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                  Scout Notes
                </h4>
                <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                  {report.notes}
                </p>
              </div>
            </>
          )}

          {/* Metadata footer */}
          <Separator />
          <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
            <span>Report #{report.id}</span>
            {report.report_date && (
              <span>Filed: {formatDate(report.report_date)}</span>
            )}
            {report.report_confidence && (
              <span>Confidence: {report.report_confidence}</span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
