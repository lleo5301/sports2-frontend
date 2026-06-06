import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, TrendingUp, Users, Zap } from 'lucide-react'
import { synergyApi } from '@/lib/synergy-api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PitchTypeStat, PitcherStat } from '../types'

// ─── Pitch type color palette (consistent across charts) ─────────────────────
const PITCH_COLORS: Record<string, string> = {
  Fastball: '#3b82f6',
  Slider: '#f59e0b',
  Changeup: '#22c55e',
  Curveball: '#a855f7',
  Cutter: '#06b6d4',
  Sinker: '#f97316',
  Splitter: '#ec4899',
}

const pitchColor = (kind: string) => PITCH_COLORS[kind] ?? '#6b7280'

// ─── Strike Zone Chart ────────────────────────────────────────────────────────
// px range: -0.83 to 0.83 ft (plate width ~17in + ball radius each side)
// pz range: 1.5 to 3.5 ft (typical collegiate strike zone)
const ZONE = { xMin: -1.2, xMax: 1.2, zMin: 1.0, zMax: 4.0 }
const SVG_W = 280
const SVG_H = 280

function toSvg(px: number, pz: number) {
  const x = ((px - ZONE.xMin) / (ZONE.xMax - ZONE.xMin)) * SVG_W
  const y = ((ZONE.zMax - pz) / (ZONE.zMax - ZONE.zMin)) * SVG_H
  return { x, y }
}

interface PitchZoneProps {
  pitcherId?: string
  pitchKind?: string
}

function PitchZoneChart({ pitcherId, pitchKind }: PitchZoneProps) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['synergy-locations', pitcherId, pitchKind],
    queryFn: () =>
      synergyApi.getPitchLocations({
        pitcher_id: pitcherId,
        pitch_kind: pitchKind,
      }),
    staleTime: 5 * 60_000,
  })

  // Strike zone corners in SVG coords
  const szLeft = toSvg(-0.83, ZONE.zMin)
  const szTopLeft = toSvg(-0.83, 3.5)
  const szWidth = toSvg(0.83, 3.5).x - szLeft.x
  const szHeight = toSvg(-0.83, 1.5).y - szTopLeft.y

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center rounded bg-muted/50'>
            <span className='text-xs text-muted-foreground'>Loading…</span>
          </div>
        )}
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className='rounded border border-border bg-card'
        >
          {/* Strike zone */}
          <rect
            x={szLeft.x}
            y={szTopLeft.y}
            width={szWidth}
            height={szHeight}
            fill='none'
            stroke='hsl(var(--muted-foreground))'
            strokeWidth='1.5'
            strokeDasharray='4 2'
          />
          {/* Home plate symbol */}
          <polygon
            points={`${SVG_W / 2 - 8},${SVG_H - 6} ${SVG_W / 2 + 8},${SVG_H - 6} ${SVG_W / 2 + 8},${SVG_H - 2} ${SVG_W / 2},${SVG_H} ${SVG_W / 2 - 8},${SVG_H - 2}`}
            fill='hsl(var(--muted-foreground) / 0.4)'
          />
          {/* Pitch dots */}
          {data.slice(0, 500).map((p, i) => {
            const { x, y } = toSvg(p.px, p.pz)
            const color = pitchColor(p.pitch_kind)
            const isStrike = p.pitch_result !== 'Ball'
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill={color}
                fillOpacity={isStrike ? 0.85 : 0.45}
                stroke={isStrike ? color : 'transparent'}
                strokeWidth='1'
              />
            )
          })}
        </svg>
      </div>
      <p className='text-xs text-muted-foreground'>
        {data.length > 500
          ? `Showing 500 of ${data.length} pitches`
          : `${data.length} pitches`}
      </p>
    </div>
  )
}

// ─── Repertoire Bar Chart ─────────────────────────────────────────────────────
function RepertoireChart({ data }: { data: PitchTypeStat[] }) {
  const max = Math.max(...data.map((d) => d.total))
  return (
    <div className='space-y-3'>
      {data.map((row) => (
        <div key={row.pitch_kind} className='space-y-1'>
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-2'>
              <span
                className='size-2 rounded-full'
                style={{ background: pitchColor(row.pitch_kind) }}
              />
              <span className='font-medium'>{row.pitch_kind}</span>
            </div>
            <div className='flex items-center gap-3 text-muted-foreground'>
              <span className='tabular-nums'>{row.pct}%</span>
              <span className='tabular-nums'>{row.avg_mph} mph</span>
              <span className='w-12 text-right tabular-nums'>
                {row.total.toLocaleString()} pitches
              </span>
            </div>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full rounded-full transition-all'
              style={{
                width: `${(row.total / max) * 100}%`,
                background: pitchColor(row.pitch_kind),
              }}
            />
          </div>
          <div className='flex gap-4 text-[10px] text-muted-foreground'>
            <span>Whiff {row.whiff_rate}%</span>
            <span>K {row.called_strikes + row.swinging_strikes}</span>
            <span>Ball {row.balls}</span>
            <span>InPlay {row.in_play}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Pitcher Table ────────────────────────────────────────────────────────────
function PitcherTable({ data }: { data: PitcherStat[] }) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border text-left text-xs text-muted-foreground'>
            <th className='py-2 pr-4 font-medium'>Pitcher</th>
            <th className='py-2 pr-4 text-right font-medium'>Pitches</th>
            <th className='py-2 pr-4 text-right font-medium'>Games</th>
            <th className='py-2 pr-4 text-right font-medium'>Avg MPH</th>
            <th className='py-2 pr-4 text-right font-medium'>Whiff%</th>
            <th className='py-2 text-right font-medium'>K</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {data.map((p) => (
            <tr key={p.pitcher_synergy_id} className='hover:bg-muted/40'>
              <td className='py-2 pr-4'>
                <div className='font-medium'>{p.pitcher_name}</div>
                {p.pitcher_side && (
                  <div className='text-xs text-muted-foreground'>
                    {p.pitcher_side}HP
                  </div>
                )}
              </td>
              <td className='py-2 pr-4 text-right tabular-nums'>
                {p.total_pitches.toLocaleString()}
              </td>
              <td className='py-2 pr-4 text-right tabular-nums'>{p.games}</td>
              <td className='py-2 pr-4 text-right tabular-nums'>{p.avg_mph}</td>
              <td className='py-2 pr-4 text-right tabular-nums'>
                <span
                  className={
                    p.whiff_pct >= 25
                      ? 'text-green-500'
                      : p.whiff_pct >= 20
                        ? 'text-amber-500'
                        : ''
                  }
                >
                  {p.whiff_pct}%
                </span>
              </td>
              <td className='py-2 text-right tabular-nums'>{p.strikeouts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Analytics Component ─────────────────────────────────────────────────
export function PitchAnalytics() {
  const [selectedPitcher, setSelectedPitcher] = useState<string>('all')
  const [selectedKind, setSelectedKind] = useState<string>('all')

  const { data: repertoire, isLoading: loadingRepertoire } = useQuery({
    queryKey: ['synergy-pitches', selectedPitcher],
    queryFn: () =>
      synergyApi.getPitchRepertoire({
        pitcher_id: selectedPitcher === 'all' ? undefined : selectedPitcher,
      }),
    staleTime: 5 * 60_000,
  })

  const { data: pitchers = [], isLoading: loadingPitchers } = useQuery({
    queryKey: ['synergy-pitchers'],
    queryFn: () => synergyApi.getPitchers(),
    staleTime: 5 * 60_000,
  })

  const pitchTypes = repertoire?.data ?? []
  const totalPitches = repertoire?.total_pitches ?? 0

  const stats = [
    {
      icon: Activity,
      label: 'Total Pitches',
      value: totalPitches.toLocaleString(),
    },
    {
      icon: Zap,
      label: 'Avg Fastball',
      value: pitchTypes.find((p) => p.pitch_kind === 'Fastball')
        ? `${pitchTypes.find((p) => p.pitch_kind === 'Fastball')!.avg_mph} mph`
        : '—',
    },
    {
      icon: TrendingUp,
      label: 'Team Whiff%',
      value:
        pitchTypes.length > 0
          ? `${
              Math.round(
                (pitchTypes.reduce((a, p) => a + p.swinging_strikes, 0) /
                  Math.max(
                    pitchTypes.reduce(
                      (a, p) => a + p.swinging_strikes + p.fouls + p.in_play,
                      0
                    ),
                    1
                  )) *
                  1000
              ) / 10
            }%`
          : '—',
    },
    {
      icon: Users,
      label: 'Pitchers',
      value: pitchers.length.toString(),
    },
  ]

  return (
    <div className='space-y-6'>
      {/* KPI row */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className='p-4'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Icon className='size-3.5' />
              <span className='text-xs'>{label}</span>
            </div>
            <div className='mt-1 font-display text-2xl font-bold tabular-nums'>
              {value}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3'>
        <Select value={selectedPitcher} onValueChange={setSelectedPitcher}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All pitchers' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All pitchers</SelectItem>
            {pitchers.map((p) => (
              <SelectItem
                key={p.pitcher_synergy_id}
                value={p.pitcher_synergy_id}
              >
                {p.pitcher_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedKind} onValueChange={setSelectedKind}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='All pitch types' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All types</SelectItem>
            {pitchTypes.map((p) => (
              <SelectItem key={p.pitch_kind} value={p.pitch_kind}>
                {p.pitch_kind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPitcher !== 'all' && (
          <Badge variant='secondary'>
            {
              pitchers.find((p) => p.pitcher_synergy_id === selectedPitcher)
                ?.pitcher_name
            }
          </Badge>
        )}
      </div>

      {/* Main content */}
      <Tabs defaultValue='repertoire'>
        <TabsList>
          <TabsTrigger value='repertoire'>Repertoire</TabsTrigger>
          <TabsTrigger value='zone'>Pitch Zone</TabsTrigger>
          <TabsTrigger value='pitchers'>Pitchers</TabsTrigger>
        </TabsList>

        <TabsContent value='repertoire' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Pitch Mix</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRepertoire ? (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  Loading…
                </div>
              ) : pitchTypes.length === 0 ? (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  No pitch data available
                </div>
              ) : (
                <RepertoireChart data={pitchTypes} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='zone' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Strike Zone Chart</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col items-center gap-4'>
              <PitchZoneChart
                pitcherId={
                  selectedPitcher === 'all' ? undefined : selectedPitcher
                }
                pitchKind={selectedKind === 'all' ? undefined : selectedKind}
              />
              {/* Legend */}
              <div className='flex flex-wrap justify-center gap-3'>
                {Object.entries(PITCH_COLORS).map(([kind, color]) => (
                  <button
                    key={kind}
                    onClick={() =>
                      setSelectedKind(selectedKind === kind ? 'all' : kind)
                    }
                    className='flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80'
                    style={{
                      opacity:
                        selectedKind !== 'all' && selectedKind !== kind
                          ? 0.35
                          : 1,
                    }}
                  >
                    <span
                      className='size-2.5 rounded-full'
                      style={{ background: color }}
                    />
                    {kind}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='pitchers' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Pitcher Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPitchers ? (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  Loading…
                </div>
              ) : (
                <PitcherTable data={pitchers} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
