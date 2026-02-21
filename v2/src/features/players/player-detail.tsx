/**
 * Player detail view with edit capability.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, Loader2, Mail, Pencil, Phone, Play, Trash2, User, Video } from 'lucide-react'
import { playersApi, type PlayerStatsResponse } from '@/lib/players-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDateShort } from '@/lib/format-date'
import { toast } from 'sonner'
import { useState } from 'react'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { EditPlayerForm } from './edit-player-form'
import { PlayerSplitsTab } from './player-splits-tab'
import { PlayerRawStatsTab } from './player-raw-stats-tab'
import { PlayerGameLogTab } from './player-game-log-tab'

interface PlayerDetailProps {
  id: string
}

export function PlayerDetail({ id }: PlayerDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const playerId = parseInt(id, 10)
  const { data: player, isLoading, error } = useQuery({
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

  if (Number.isNaN(playerId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid player ID
        </div>
      </Main>
    )
  }

  if (isLoading) {
    return (
      <Main>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-muted-foreground' />
        </div>
      </Main>
    )
  }

  if (error || !player) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>{(error as Error)?.message ?? 'Player not found'}</p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/players'>Back to roster</Link>
          </Button>
        </div>
      </Main>
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
      />
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/players'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {[player.first_name, player.last_name].filter(Boolean).join(' ') || `Player #${id}`}
              </h2>
              <CardDescription>Roster profile</CardDescription>
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
        </div>

        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
              <div className='flex flex-col items-center gap-4 sm:flex-row lg:flex-col lg:items-center lg:shrink-0'>
                <div className='relative'>
                  <Avatar className='size-36 shrink-0 shadow-lg ring-2 ring-border sm:size-44 lg:size-52'>
                    <AvatarImage
                      src={(statsResp?.player?.photo_url ?? player.photo_url) ?? undefined}
                      alt={[player.first_name, player.last_name].filter(Boolean).join(' ')}
                      className='object-cover'
                    />
                    <AvatarFallback className='bg-muted text-3xl font-medium sm:text-4xl'>
                      {[player.first_name?.[0], player.last_name?.[0]]
                        .filter(Boolean)
                        .join('')
                        .toUpperCase() || <User className='size-16' />}
                    </AvatarFallback>
                  </Avatar>
                  {(statsResp?.player?.jersey_number ?? player.jersey_number) != null && (
                    <div className='absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md'>
                      #{String(statsResp?.player?.jersey_number ?? player.jersey_number)}
                    </div>
                  )}
                </div>
                <div className='text-center sm:text-left lg:text-center'>
                  <h3 className='text-lg font-semibold'>
                    {player.position || 'Player'}
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {[statsResp?.player?.bats ?? player.bats, statsResp?.player?.throws ?? player.throws]
                      .filter(Boolean)
                      .join(' / ') || '—'}
                  </p>
                  {(statsResp?.player?.class_year ?? player.class_year) && (
                    <p className='text-sm text-muted-foreground'>
                      {statsResp?.player?.class_year ?? player.class_year}
                    </p>
                  )}
                </div>
              </div>
              <div className='min-w-0 flex-1 space-y-4'>
                <div className='flex flex-wrap items-center gap-2'>
                  {player.position && (
                    <Badge variant='secondary'>{player.position}</Badge>
                  )}
                  {player.school_type && (
                    <Badge variant='outline'>{player.school_type}</Badge>
                  )}
                  {player.status && (
                    <Badge variant={player.status === 'active' ? 'default' : 'secondary'}>
                      {player.status}
                    </Badge>
                  )}
                </div>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <DetailRow label='Position' value={player.position} />
                  <DetailRow label='Jersey' value={statsResp?.player?.jersey_number ?? player.jersey_number ?? undefined} />
                  <DetailRow label='Bats / Throws' value={[statsResp?.player?.bats ?? player.bats, statsResp?.player?.throws ?? player.throws].filter(Boolean).join(' / ') || undefined} />
                  <DetailRow label='Class' value={statsResp?.player?.class_year ?? player.class_year ?? undefined} />
                  <DetailRow label='Height' value={player.height ?? undefined} />
                  <DetailRow label='Weight' value={player.weight != null ? `${player.weight} lbs` : undefined} />
                  <DetailRow label='School' value={player.school} />
                  <DetailRow label='City' value={player.city} />
                  <DetailRow label='State' value={player.state} />
                  <DetailRow label='Graduation year' value={player.graduation_year?.toString()} />
                </div>
                <div className='flex flex-wrap gap-4 border-t pt-4'>
                  {player.email && (
                    <a
                      href={`mailto:${player.email}`}
                      className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
                    >
                      <Mail className='size-4' />
                      {player.email}
                    </a>
                  )}
                  {player.phone && (
                    <a
                      href={`tel:${player.phone}`}
                      className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
                    >
                      <Phone className='size-4' />
                      {player.phone}
                    </a>
                  )}
                </div>
                {statsResp?.current_season && (() => {
                  const s = statsResp.current_season as Record<string, unknown>
                  const hasBatting = Number(s.at_bats ?? 0) > 0
                  const hasPitching = Number(s.innings_pitched ?? s.pitching_appearances ?? 0) > 0
                  const gp = s.games_played ?? s.games_started
                  const lastGame = gameLogData?.games?.[0]
                  if (!hasBatting && !hasPitching && !gp && !lastGame) return null
                  return (
                    <div className='rounded-lg border bg-muted/30 p-4 space-y-4'>
                      <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                        This season
                      </p>
                      <div className='flex flex-wrap gap-4 text-sm'>
                        {gp != null && (gp as number) > 0 && (
                          <span><strong>GP</strong> {formatStatValue(gp)}</span>
                        )}
                        {hasBatting && (
                          <>
                            <span><strong>AVG</strong> {formatStatValue(s.batting_average)}</span>
                            <span><strong>AB</strong> {formatStatValue(s.at_bats)}</span>
                            <span><strong>H</strong> {formatStatValue(s.hits)}</span>
                            <span><strong>HR</strong> {formatStatValue(s.home_runs)}</span>
                            <span><strong>RBI</strong> {formatStatValue(s.rbi)}</span>
                            <span><strong>OBP</strong> {formatStatValue(s.on_base_percentage)}</span>
                          </>
                        )}
                        {hasPitching && (
                          <>
                            <span><strong>ERA</strong> {formatStatValue(s.era)}</span>
                            <span><strong>IP</strong> {formatStatValue(s.innings_pitched)}</span>
                            <span><strong>W-L</strong> {formatStatValue(s.pitching_wins)}-{formatStatValue(s.pitching_losses)}</span>
                            <span><strong>K</strong> {formatStatValue(s.strikeouts_pitching)}</span>
                          </>
                        )}
                      </div>
                      {lastGame && (
                        <div className='border-t pt-3'>
                          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                            Last game
                          </p>
                          <Link
                            to='/games/$id'
                            params={{ id: String(lastGame.game.id) }}
                            className='group flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm hover:underline'
                          >
                            <span className='font-medium'>
                              vs {lastGame.game.opponent}
                            </span>
                            <span className='text-muted-foreground'>
                              {formatDateShort(lastGame.game.date)}
                            </span>
                            <span className='text-muted-foreground'>
                              · {lastGame.game.game_summary || lastGame.game.score}
                            </span>
                            {lastGame.batting?.ab != null && lastGame.batting.ab > 0 && (
                              <span>
                                {lastGame.batting.h}-{lastGame.batting.ab}
                                {lastGame.batting.rbi != null && lastGame.batting.rbi > 0 && `, ${lastGame.batting.rbi} RBI`}
                                {lastGame.batting.hr != null && lastGame.batting.hr > 0 && `, ${lastGame.batting.hr} HR`}
                              </span>
                            )}
                            {lastGame.pitching && (Number(lastGame.pitching.ip) > 0 || Number(lastGame.pitching.so) > 0) && (
                              <span>
                                {lastGame.pitching.ip} IP
                                {lastGame.pitching.er != null && lastGame.pitching.er > 0 && `, ${lastGame.pitching.er} ER`}
                                {lastGame.pitching.so > 0 && `, ${lastGame.pitching.so} K`}
                              </span>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue='stats' className='space-y-4'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='stats'>Stats</TabsTrigger>
            <TabsTrigger value='splits'>Splits</TabsTrigger>
            <TabsTrigger value='raw'>Raw stats</TabsTrigger>
            <TabsTrigger value='game-log'>Game log</TabsTrigger>
            <TabsTrigger value='videos'>Videos</TabsTrigger>
          </TabsList>
          <TabsContent value='stats' className='space-y-4'>
            {statsResp && hasStats(statsResp) ? (
              <Card>
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    <BarChart3 className='size-5 text-muted-foreground' />
                    <CardTitle>Statistics</CardTitle>
                  </div>
                  <CardDescription>
                    Season and career stats from PrestoSports
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {statsResp.current_season && (
                    <div>
                      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
                        Current season{' '}
                        {(statsResp.current_season as { season_name?: string }).season_name ?? ''}
                      </h4>
                      <SeasonStatsGrid season={statsResp.current_season} />
                    </div>
                  )}
                  {statsResp.seasons && statsResp.seasons.length > 1 && (
                    <div>
                      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
                        Season history
                      </h4>
                      <SeasonsTable seasons={statsResp.seasons} />
                    </div>
                  )}
                  {statsResp.career && (
                    <div>
                      <h4 className='mb-2 text-sm font-medium text-muted-foreground'>
                        Career totals
                      </h4>
                      <CareerStatsGrid career={statsResp.career} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className='py-8 text-center text-muted-foreground'>
                  No stats available. Sync with PrestoSports.
                </CardContent>
              </Card>
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
              <Card>
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    <Video className='size-5 text-muted-foreground' />
                    <CardTitle>Videos</CardTitle>
                  </div>
                  <CardDescription>Highlight reels and game footage</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlayerVideosGrid videos={videosResp.data} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className='py-8 text-center text-muted-foreground'>
                  No videos
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  )
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium'>{value}</p>
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
      <h5 className='mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {title}
      </h5>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {entries.map(([key, value]) => (
          <div key={key} className='rounded-lg border bg-muted/30 p-2'>
            <p className='text-xs text-muted-foreground'>
              {STAT_LABELS[key] ?? key.replace(/_/g, ' ')}
            </p>
            <p className='font-semibold'>{formatStatValue(value)}</p>
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
        <StatSection title='Batting' keys={[...BATTING_SEASON_KEYS]} data={data} />
      )}
      {hasPitching && (
        <StatSection title='Pitching' keys={[...PITCHING_SEASON_KEYS]} data={data} />
      )}
      {hasFielding && (
        <StatSection title='Fielding' keys={[...FIELDING_SEASON_KEYS]} data={data} />
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
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b'>
            {colsWithData.map((c) => (
              <th key={c} className='px-2 py-1.5 text-left text-muted-foreground'>
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
                  <td key={c} className='px-2 py-1.5'>
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
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
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
              <span className='absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                {formatDuration(v.duration)}
              </span>
            )}
          </div>
          <div className='p-2'>
            <p className='font-medium line-clamp-2 group-hover:text-primary'>
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
