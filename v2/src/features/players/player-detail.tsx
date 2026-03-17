/**
 * Player detail view with edit capability.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Play,
  Trash2,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { formatDateShort } from '@/lib/format-date'
import { playersApi, type PlayerStatsResponse } from '@/lib/players-api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GameResultBadge } from '@/components/ui/game-result-badge'
import { PositionBadge } from '@/components/ui/position-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import { EditPlayerForm } from './edit-player-form'
import { PlayerGameLogTab } from './player-game-log-tab'
import { PlayerRawStatsTab } from './player-raw-stats-tab'
import { PlayerSplitsTab } from './player-splits-tab'

interface PlayerDetailProps {
  id: string
  /** When true, renders without Main wrapper and back button (for use inside sheets/modals) */
  embedded?: boolean
  onClose?: () => void
}

export function PlayerDetail({ id, embedded, onClose }: PlayerDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const playerId = parseInt(id, 10)
  const {
    data: player,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['player', playerId],
    queryFn: () => playersApi.getById(playerId),
    enabled: !Number.isNaN(playerId),
  })

  const { data: statsResp } = useQuery({
    queryKey: ['player', playerId, 'stats'],
    queryFn: () => playersApi.getStats(playerId),
    enabled: !Number.isNaN(playerId) && !!player,
  })

  const { data: videosResp } = useQuery({
    queryKey: ['player', playerId, 'videos'],
    queryFn: () => playersApi.getVideos(playerId, { limit: 12 }),
    enabled: !Number.isNaN(playerId) && !!player,
  })

  const { data: gameLogData } = useQuery({
    queryKey: ['player', playerId, 'game-log'],
    queryFn: () => extendedStatsApi.getPlayerGameLog(playerId),
    enabled: !Number.isNaN(playerId) && !!player,
  })

  const deleteMutation = useMutation({
    mutationFn: () => playersApi.delete(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      toast.success('Player deleted')
      navigate({ to: '/players' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  const Wrapper = embedded
    ? ({ children }: { children: React.ReactNode }) => (
        <div className='space-y-6 overflow-y-auto p-6'>{children}</div>
      )
    : Main

  if (Number.isNaN(playerId)) {
    return (
      <Wrapper>
        <div className='py-8 text-center text-destructive'>
          Invalid player ID
        </div>
      </Wrapper>
    )
  }

  if (isLoading) {
    return (
      <Wrapper>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Wrapper>
    )
  }

  if (error || !player) {
    return (
      <Wrapper>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Player not found'}
          </p>
          {!embedded && (
            <Button asChild className='mt-4' variant='outline'>
              <Link to='/players'>Back to roster</Link>
            </Button>
          )}
        </div>
      </Wrapper>
    )
  }

  if (editing) {
    return (
      <EditPlayerForm
        player={player}
        onSuccess={() => {
          setEditing(false)
          queryClient.invalidateQueries({ queryKey: ['player', playerId] })
        }}
        onCancel={() => setEditing(false)}
        embedded={embedded}
      />
    )
  }

  const playerName =
    [player.first_name, player.last_name].filter(Boolean).join(' ') ||
    `Player #${id}`

  /** Semantic color for hero stat based on performance quality */
  const statColor = (
    value: unknown,
    thresholds: { good: number; bad: number; lowerIsBetter?: boolean }
  ) => {
    const n = parseFloat(String(value ?? ''))
    if (Number.isNaN(n)) return ''
    if (thresholds.lowerIsBetter) {
      if (n <= thresholds.good) return 'text-success'
      if (n >= thresholds.bad) return 'text-destructive'
      return ''
    }
    if (n >= thresholds.good) return 'text-success'
    if (n <= thresholds.bad) return 'text-destructive'
    return ''
  }

  const seasonBlock = statsResp?.current_season
    ? (() => {
        const s = statsResp.current_season as Record<string, unknown>
        const hasBatting = Number(s.at_bats ?? 0) > 0
        const hasPitching =
          Number(s.innings_pitched ?? s.pitching_appearances ?? 0) > 0
        const gp = s.games_played ?? s.games_started
        const lastGame = gameLogData?.games?.[0]
        if (!hasBatting && !hasPitching && !gp && !lastGame) return null
        return { s, hasBatting, hasPitching, gp, lastGame }
      })()
    : null

  return (
    <Wrapper>
      <div>
        {/* ── Identity Strip ── */}
        <section className='flex flex-wrap items-start gap-5'>
          <div className='flex items-center gap-4'>
            {!embedded && (
              <Button variant='ghost' size='icon' asChild>
                <Link to='/players'>
                  <ArrowLeft className='size-4' />
                </Link>
              </Button>
            )}
            <div className='relative'>
              <Avatar className='size-20 shrink-0 sm:size-24'>
                <AvatarImage
                  src={
                    statsResp?.player?.photo_url ??
                    player.photo_url ??
                    undefined
                  }
                  alt={playerName}
                  className='object-cover'
                />
                <AvatarFallback className='bg-muted text-2xl font-medium sm:text-3xl'>
                  {[player.first_name?.[0], player.last_name?.[0]]
                    .filter(Boolean)
                    .join('')
                    .toUpperCase() || <User className='size-8 sm:size-10' />}
                </AvatarFallback>
              </Avatar>
              {(statsResp?.player?.jersey_number ?? player.jersey_number) !=
                null && (
                <div className='absolute -right-1.5 -bottom-1.5 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground'>
                  #
                  {String(
                    statsResp?.player?.jersey_number ?? player.jersey_number
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <h2 className='text-2xl font-extrabold tracking-tight sm:text-3xl'>
              {playerName}
            </h2>
            <div className='mt-1 flex flex-wrap items-center gap-2'>
              {player.position && <PositionBadge position={player.position} />}
              {player.school_type && (
                <Badge variant='outline'>{player.school_type}</Badge>
              )}
              {player.status && (
                <Badge
                  variant={player.status === 'active' ? 'default' : 'secondary'}
                  className={
                    player.status === 'active'
                      ? 'bg-success text-success-foreground'
                      : undefined
                  }
                >
                  {player.status}
                </Badge>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setEditing(true)}>
              <Pencil className='size-4' />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Trash2 className='size-4 text-destructive' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  Delete player
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* ── Season Summary (promoted — second thing a coach sees) ── */}
        {seasonBlock &&
          (() => {
            const { s, hasBatting, hasPitching, gp, lastGame } = seasonBlock
            return (
              <>
                <div className='my-8 border-t border-border/40 sm:my-10' />
                <section className='space-y-3'>
                  <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                    This season
                    {gp != null && (gp as number) > 0 && (
                      <span className='ml-2 tracking-normal normal-case'>
                        · {formatStatValue(gp)} GP
                      </span>
                    )}
                  </p>
                  {hasBatting && (
                    <div className='flex items-baseline gap-6'>
                      <div>
                        <p
                          className={`font-display text-5xl font-extrabold tracking-tighter tabular-nums ${statColor(s.batting_average, { good: 0.3, bad: 0.22 })}`}
                        >
                          {formatStatValue(s.batting_average)}
                        </p>
                        <p className='text-xs text-muted-foreground'>AVG</p>
                      </div>
                      <div className='flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted-foreground'>
                        {Number(s.home_runs ?? 0) > 0 && (
                          <span>
                            <span className='font-display font-bold text-foreground tabular-nums'>
                              {formatStatValue(s.home_runs)}
                            </span>{' '}
                            HR
                          </span>
                        )}
                        {Number(s.rbi ?? 0) > 0 && (
                          <span>
                            <span className='font-display font-bold text-foreground tabular-nums'>
                              {formatStatValue(s.rbi)}
                            </span>{' '}
                            RBI
                          </span>
                        )}
                        <span>
                          <span className='font-display font-bold text-foreground tabular-nums'>
                            {formatStatValue(s.on_base_percentage)}
                          </span>{' '}
                          OBP
                        </span>
                      </div>
                    </div>
                  )}
                  {hasPitching && (
                    <div className='flex items-baseline gap-6'>
                      <div>
                        <p
                          className={`font-display text-5xl font-extrabold tracking-tighter tabular-nums ${statColor(s.era, { good: 3.0, bad: 5.0, lowerIsBetter: true })}`}
                        >
                          {formatStatValue(s.era)}
                        </p>
                        <p className='text-xs text-muted-foreground'>ERA</p>
                      </div>
                      <div className='flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-muted-foreground'>
                        <span>
                          <span className='font-display font-bold text-foreground tabular-nums'>
                            {formatStatValue(s.pitching_wins)}-
                            {formatStatValue(s.pitching_losses)}
                          </span>{' '}
                          W-L
                        </span>
                        {Number(s.strikeouts_pitching ?? 0) > 0 && (
                          <span>
                            <span className='font-display font-bold text-foreground tabular-nums'>
                              {formatStatValue(s.strikeouts_pitching)}
                            </span>{' '}
                            K
                          </span>
                        )}
                        <span>
                          <span className='font-display font-bold text-foreground tabular-nums'>
                            {formatStatValue(s.innings_pitched)}
                          </span>{' '}
                          IP
                        </span>
                      </div>
                    </div>
                  )}
                  {lastGame && (
                    <div className='border-t border-border/40 pt-3'>
                      <p className='mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                        Last game
                      </p>
                      <Link
                        to='/games/$id'
                        params={{ id: String(lastGame.game.id) }}
                        className='group flex flex-wrap items-center gap-x-2 gap-y-1 text-sm hover:underline'
                      >
                        <span className='font-medium'>
                          vs {lastGame.game.opponent}
                        </span>
                        {(() => {
                          const summary =
                            lastGame.game.game_summary ||
                            lastGame.game.score ||
                            ''
                          const match =
                            String(summary).match(/^(W|L|T)\s*(.*)$/)
                          if (match) {
                            return (
                              <GameResultBadge
                                result={match[1] as 'W' | 'L' | 'T'}
                                score={match[2] || undefined}
                              />
                            )
                          }
                          return summary ? (
                            <span className='text-muted-foreground'>
                              {summary}
                            </span>
                          ) : null
                        })()}
                        <span className='text-muted-foreground'>
                          {formatDateShort(lastGame.game.date)}
                        </span>
                        {lastGame.batting?.ab != null &&
                          lastGame.batting.ab > 0 && (
                            <span>
                              {lastGame.batting.h}-{lastGame.batting.ab}
                              {lastGame.batting.rbi != null &&
                                lastGame.batting.rbi > 0 &&
                                `, ${lastGame.batting.rbi} RBI`}
                              {lastGame.batting.hr != null &&
                                lastGame.batting.hr > 0 &&
                                `, ${lastGame.batting.hr} HR`}
                            </span>
                          )}
                        {lastGame.pitching &&
                          (Number(lastGame.pitching.ip) > 0 ||
                            Number(lastGame.pitching.so) > 0) && (
                            <span>
                              {lastGame.pitching.ip} IP
                              {lastGame.pitching.er != null &&
                                lastGame.pitching.er > 0 &&
                                `, ${lastGame.pitching.er} ER`}
                              {lastGame.pitching.so > 0 &&
                                `, ${lastGame.pitching.so} K`}
                            </span>
                          )}
                      </Link>
                    </div>
                  )}
                </section>
              </>
            )
          })()}

        {/* ── Profile Details (reference data) ── */}
        <div className='my-8 border-t border-border/40 sm:my-10' />
        <section>
          <h3 className='mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
            Profile
          </h3>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
            <DetailRow
              label='Bats / Throws'
              value={
                [
                  statsResp?.player?.bats ?? player.bats,
                  statsResp?.player?.throws ?? player.throws,
                ]
                  .filter(Boolean)
                  .join(' / ') || undefined
              }
            />
            <DetailRow
              label='Class'
              value={
                statsResp?.player?.class_year ?? player.class_year ?? undefined
              }
            />
            <DetailRow label='Height' value={player.height ?? undefined} />
            <DetailRow
              label='Weight'
              value={player.weight != null ? `${player.weight} lbs` : undefined}
            />
            <DetailRow label='School' value={player.school} />
          </div>
          {(player.city || player.state || player.graduation_year) && (
            <div className='mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground'>
              {player.city && <span>{player.city}</span>}
              {player.city && player.state && <span>·</span>}
              {player.state && <span>{player.state}</span>}
              {player.graduation_year && (
                <span>
                  {player.city || player.state ? '·' : ''} Class of{' '}
                  {player.graduation_year}
                </span>
              )}
            </div>
          )}
          {(player.email || player.phone) && (
            <div className='mt-4 flex flex-wrap gap-4 border-t border-border/40 pt-4'>
              {player.email && (
                <a
                  href={`mailto:${player.email}`}
                  className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
                >
                  <Mail className='size-4 text-primary' />
                  {player.email}
                </a>
              )}
              {player.phone && (
                <a
                  href={`tel:${player.phone}`}
                  className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
                >
                  <Phone className='size-4 text-primary' />
                  {player.phone}
                </a>
              )}
            </div>
          )}
        </section>

        {/* ── Tabs ── */}
        <div className='my-8 border-t border-border/40 sm:my-10' />
        <Tabs defaultValue='stats' className='space-y-4'>
          <div className='overflow-x-auto'>
            <TabsList className='flex-nowrap'>
              <TabsTrigger value='stats'>Stats</TabsTrigger>
              <TabsTrigger value='splits'>Splits</TabsTrigger>
              <TabsTrigger value='raw'>Raw</TabsTrigger>
              <TabsTrigger value='game-log'>Game log</TabsTrigger>
              <TabsTrigger value='videos'>Videos</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='stats' className='space-y-8'>
            {statsResp && hasStats(statsResp) ? (
              <>
                {statsResp.current_season && (
                  <div>
                    <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
                      Current season
                      {(statsResp.current_season as { season_name?: string })
                        .season_name && (
                        <span className='ml-2 text-sm font-normal text-muted-foreground'>
                          {
                            (
                              statsResp.current_season as {
                                season_name?: string
                              }
                            ).season_name
                          }
                        </span>
                      )}
                    </h3>
                    <SeasonStatsGrid season={statsResp.current_season} />
                  </div>
                )}
                {statsResp.seasons && statsResp.seasons.length > 1 && (
                  <div className='border-t border-border/40 pt-6'>
                    <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
                      Season history
                    </h3>
                    <SeasonsTable seasons={statsResp.seasons} />
                  </div>
                )}
                {statsResp.career && (
                  <div className='border-t border-border/40 pt-6'>
                    <h3 className='mb-4 font-display text-base font-bold tracking-tight'>
                      Career totals
                    </h3>
                    <CareerStatsGrid career={statsResp.career} />
                  </div>
                )}
              </>
            ) : (
              <p className='py-8 text-center text-muted-foreground'>
                No stats available. Sync with PrestoSports.
              </p>
            )}
          </TabsContent>
          <TabsContent value='splits'>
            <PlayerSplitsTab playerId={playerId} />
          </TabsContent>
          <TabsContent value='raw'>
            <PlayerRawStatsTab
              playerId={playerId}
              rawStats={statsResp?.current_season?.raw_stats ?? undefined}
              seasonName={statsResp?.current_season?.season_name}
            />
          </TabsContent>
          <TabsContent value='game-log'>
            <PlayerGameLogTab playerId={playerId} />
          </TabsContent>
          <TabsContent value='videos'>
            {videosResp && videosResp.data.length > 0 ? (
              <PlayerVideosGrid videos={videosResp.data} />
            ) : (
              <p className='py-8 text-center text-muted-foreground'>
                No videos
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='font-display text-base font-bold tabular-nums'>{value}</p>
    </div>
  )
}

// Per player-stats-reference.md — all season stats
const BATTING_SEASON_KEYS = [
  'games_played',
  'games_started',
  'at_bats',
  'runs',
  'hits',
  'doubles',
  'triples',
  'home_runs',
  'rbi',
  'walks',
  'strikeouts',
  'stolen_bases',
  'caught_stealing',
  'hit_by_pitch',
  'sacrifice_flies',
  'sacrifice_bunts',
  'batting_average',
  'on_base_percentage',
  'slugging_percentage',
  'ops',
] as const
const PITCHING_SEASON_KEYS = [
  'pitching_appearances',
  'pitching_starts',
  'innings_pitched',
  'pitching_wins',
  'pitching_losses',
  'saves',
  'holds',
  'hits_allowed',
  'runs_allowed',
  'earned_runs',
  'walks_allowed',
  'strikeouts_pitching',
  'home_runs_allowed',
  'era',
  'whip',
  'k_per_9',
  'bb_per_9',
] as const
const FIELDING_SEASON_KEYS = [
  'fielding_games',
  'putouts',
  'assists',
  'errors',
  'fielding_percentage',
] as const

const STAT_LABELS: Record<string, string> = {
  games_played: 'GP',
  games_started: 'GS',
  at_bats: 'AB',
  runs: 'R',
  hits: 'H',
  doubles: '2B',
  triples: '3B',
  home_runs: 'HR',
  rbi: 'RBI',
  walks: 'BB',
  strikeouts: 'K',
  stolen_bases: 'SB',
  caught_stealing: 'CS',
  hit_by_pitch: 'HBP',
  sacrifice_flies: 'SF',
  sacrifice_bunts: 'SH',
  batting_average: 'AVG',
  on_base_percentage: 'OBP',
  slugging_percentage: 'SLG',
  ops: 'OPS',
  pitching_appearances: 'APP',
  pitching_starts: 'GS',
  innings_pitched: 'IP',
  pitching_wins: 'W',
  pitching_losses: 'L',
  saves: 'SV',
  holds: 'HD',
  hits_allowed: 'H',
  runs_allowed: 'R',
  earned_runs: 'ER',
  walks_allowed: 'BB',
  strikeouts_pitching: 'K',
  home_runs_allowed: 'HR',
  era: 'ERA',
  whip: 'WHIP',
  k_per_9: 'K/9',
  bb_per_9: 'BB/9',
  fielding_games: 'G',
  putouts: 'PO',
  assists: 'A',
  errors: 'E',
  fielding_percentage: 'FLD%',
  season: 'Season',
  season_name: 'Season',
  // Career
  career_games: 'G',
  career_at_bats: 'AB',
  career_runs: 'R',
  career_hits: 'H',
  career_doubles: '2B',
  career_triples: '3B',
  career_home_runs: 'HR',
  career_rbi: 'RBI',
  career_walks: 'BB',
  career_strikeouts: 'K',
  career_stolen_bases: 'SB',
  career_batting_average: 'AVG',
  career_obp: 'OBP',
  career_slg: 'SLG',
  career_ops: 'OPS',
  career_pitching_appearances: 'APP',
  career_innings_pitched: 'IP',
  career_wins: 'W',
  career_losses: 'L',
  career_saves: 'SV',
  career_earned_runs: 'ER',
  career_strikeouts_pitching: 'K',
  career_era: 'ERA',
  career_whip: 'WHIP',
  seasons_played: 'Seasons',
}

function hasStats(resp: PlayerStatsResponse): boolean {
  return !!(
    (resp.current_season && Object.keys(resp.current_season).length > 1) ||
    (resp.seasons && resp.seasons.length > 0) ||
    (resp.career && Object.keys(resp.career).length > 1)
  )
}

function formatStatValue(value: unknown): string {
  if (value == null || value === '') return '—'
  const s = String(value)
  const n = parseFloat(s)
  if (Number.isNaN(n)) return s
  if (Number.isInteger(n)) return String(n)
  return s
}

function StatSection({
  title,
  keys,
  data,
}: {
  title: string
  keys: readonly string[]
  data: Record<string, unknown>
}) {
  const entries = keys
    .filter((k) => {
      const v = data[k]
      return v !== undefined && v !== null && v !== ''
    })
    .map((k) => [k, data[k]] as [string, unknown])
  if (entries.length === 0) return null
  return (
    <div>
      <h5 className='mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {title}
      </h5>
      <div className='grid grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
        {entries.map(([key, value]) => (
          <div key={key}>
            <p className='text-[11px] text-muted-foreground'>
              {STAT_LABELS[key] ?? key.replace(/_/g, ' ')}
            </p>
            <p className='font-display text-base font-bold tabular-nums'>
              {formatStatValue(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SeasonStatsGrid({
  season,
}: {
  season: PlayerStatsResponse['current_season']
}) {
  if (!season) return null
  const data = season as Record<string, unknown>
  const hasBatting = BATTING_SEASON_KEYS.some(
    (k) => data[k] !== undefined && data[k] !== null && data[k] !== ''
  )
  const hasPitching = PITCHING_SEASON_KEYS.some(
    (k) => data[k] !== undefined && data[k] !== null && data[k] !== ''
  )
  const hasFielding = FIELDING_SEASON_KEYS.some(
    (k) => data[k] !== undefined && data[k] !== null && data[k] !== ''
  )
  if (!hasBatting && !hasPitching && !hasFielding) return null
  return (
    <div className='space-y-4'>
      {hasBatting && (
        <StatSection
          title='Batting'
          keys={[...BATTING_SEASON_KEYS]}
          data={data}
        />
      )}
      {hasPitching && (
        <StatSection
          title='Pitching'
          keys={[...PITCHING_SEASON_KEYS]}
          data={data}
        />
      )}
      {hasFielding && (
        <StatSection
          title='Fielding'
          keys={[...FIELDING_SEASON_KEYS]}
          data={data}
        />
      )}
    </div>
  )
}

const SEASONS_TABLE_COLS = [
  'season_name',
  'games_played',
  'at_bats',
  'batting_average',
  'hits',
  'home_runs',
  'rbi',
  'stolen_bases',
  'innings_pitched',
  'era',
  'pitching_wins',
  'pitching_losses',
  'strikeouts_pitching',
  'fielding_percentage',
] as const

function SeasonsTable({
  seasons,
}: {
  seasons: PlayerStatsResponse['seasons']
}) {
  if (!seasons || seasons.length === 0) return null
  const data = seasons as Array<Record<string, unknown>>
  const colsWithData = SEASONS_TABLE_COLS.filter((c) =>
    data.some((s) => s[c] != null && s[c] !== '')
  )
  if (colsWithData.length === 0) return null
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm whitespace-nowrap'>
        <thead>
          <tr className='border-b'>
            {colsWithData.map((c) => (
              <th
                key={c}
                className='px-2 py-1.5 text-left text-[11px] text-muted-foreground'
              >
                {STAT_LABELS[c] ?? c.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={(s.id as number) ?? i} className='border-b last:border-0'>
              {colsWithData.map((c) => {
                const val = s[c]
                const display = val
                return (
                  <td
                    key={c}
                    className='px-2 py-1.5 font-display font-semibold tabular-nums'
                  >
                    {display != null && display !== ''
                      ? formatStatValue(display)
                      : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CAREER_BATTING_KEYS = [
  'seasons_played',
  'career_games',
  'career_at_bats',
  'career_runs',
  'career_hits',
  'career_doubles',
  'career_triples',
  'career_home_runs',
  'career_rbi',
  'career_walks',
  'career_strikeouts',
  'career_stolen_bases',
  'career_batting_average',
  'career_obp',
  'career_slg',
  'career_ops',
] as const
const CAREER_PITCHING_KEYS = [
  'career_pitching_appearances',
  'career_innings_pitched',
  'career_wins',
  'career_losses',
  'career_saves',
  'career_earned_runs',
  'career_strikeouts_pitching',
  'career_era',
  'career_whip',
] as const

function CareerStatsGrid({
  career,
}: {
  career: PlayerStatsResponse['career']
}) {
  if (!career) return null
  const data = career as Record<string, unknown>
  const hasBatting = CAREER_BATTING_KEYS.some(
    (k) => data[k] !== undefined && data[k] !== null && data[k] !== ''
  )
  const hasPitching = CAREER_PITCHING_KEYS.some(
    (k) => data[k] !== undefined && data[k] !== null && data[k] !== ''
  )
  if (!hasBatting && !hasPitching) return null
  return (
    <div className='space-y-4'>
      {hasBatting && (
        <StatSection
          title='Career batting'
          keys={[...CAREER_BATTING_KEYS]}
          data={data}
        />
      )}
      {hasPitching && (
        <StatSection
          title='Career pitching'
          keys={[...CAREER_PITCHING_KEYS]}
          data={data}
        />
      )}
    </div>
  )
}

function formatDuration(sec: number | null | undefined): string {
  if (sec == null || sec < 0) return ''
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function PlayerVideosGrid({
  videos,
}: {
  videos: import('@/lib/players-api').PlayerVideo[]
}) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {videos.map((v) => (
        <a
          key={v.id}
          href={v.embed_url ?? v.url}
          target='_blank'
          rel='noreferrer noopener'
          className='group flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary/50'
        >
          <div className='relative aspect-video bg-muted'>
            {v.thumbnail_url ? (
              <img
                src={v.thumbnail_url}
                alt={v.title ?? 'Video'}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <Play className='size-8 text-muted-foreground' />
              </div>
            )}
            {v.duration != null && v.duration > 0 && (
              <span className='absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                {formatDuration(v.duration)}
              </span>
            )}
          </div>
          <div className='p-2'>
            <p className='line-clamp-2 font-medium group-hover:text-primary'>
              {v.title ?? 'Untitled'}
            </p>
            {v.video_type && (
              <p className='text-xs text-muted-foreground capitalize'>
                {v.video_type.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
