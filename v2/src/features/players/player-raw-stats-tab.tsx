/**
 * Player raw stats tab — full 214 Presto keys from /players/byId/:id/stats/raw
 */
import { useQuery } from '@tanstack/react-query'
import { extendedStatsApi } from '@/lib/extended-stats-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const PRESTO_LABELS: Record<string, string> = {
  hittinggp: 'GP', hittinggs: 'GS', hittingab: 'AB', hittingruns: 'R', hittinghits: 'H',
  hittingdoubles: '2B', hittingtriples: '3B', hittinghr: 'HR', hittingrbi: 'RBI',
  hittingbb: 'BB', hittingso: 'SO', hittingsb: 'SB', hittingcs: 'CS',
  hittingavg: 'AVG', hittingobpct: 'OBP', hittingslgpct: 'SLG', hittingops: 'OPS',
  pitchingapp: 'APP', pitchinggs: 'GS', pitchingip: 'IP', pitchingw: 'W', pitchingl: 'L',
  pitchingsv: 'SV', pitchingh: 'H', pitchingr: 'R', pitchinger: 'ER',
  pitchingbb: 'BB', pitchingso: 'SO', pitchinghr: 'HR',
  pitchingera: 'ERA', pitchingwhip: 'WHIP',
  fieldingpo: 'PO', fieldinga: 'A', fieldinge: 'E', fieldingfldpct: 'FLD%', fieldingdp: 'DP',
}

export function PlayerRawStatsTab({ playerId }: { playerId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['player', playerId, 'raw-stats'],
    queryFn: () => extendedStatsApi.getPlayerRawStats(playerId),
  })

  if (isLoading) return <div className='py-4 text-center text-muted-foreground'>Loading...</div>
  if (error) return <div className='py-4 text-center text-destructive'>{(error as Error).message}</div>
  if (!data?.raw_stats) {
    return (
      <Card>
        <CardContent className='py-8 text-center text-muted-foreground'>
          No raw stats. Sync with PrestoSports to populate.
        </CardContent>
      </Card>
    )
  }

  const entries = Object.entries(data.raw_stats).filter(([, v]) => v != null && v !== '' && v !== '--')
  const hitting = entries.filter(([k]) => k.startsWith('hitting'))
  const pitching = entries.filter(([k]) => k.startsWith('pitching'))
  const fielding = entries.filter(([k]) => k.startsWith('fielding'))
  const catching = entries.filter(([k]) => k.startsWith('catching'))

  const renderSection = (title: string, items: [string, string][]) => {
    if (items.length === 0) return null
    return (
      <div>
        <h4 className='mb-2 text-sm font-medium text-muted-foreground'>{title}</h4>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
          {items.map(([k, v]) => (
            <div key={k} className='rounded border bg-muted/30 px-2 py-1.5'>
              <p className='text-xs text-muted-foreground'>{PRESTO_LABELS[k] ?? k}</p>
              <p className='font-semibold'>{v}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw stats</CardTitle>
        <CardDescription>
          {data.season_name ?? data.season ?? ''} · Full Presto payload
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {renderSection('Batting', hitting)}
        {renderSection('Pitching', pitching)}
        {renderSection('Fielding', fielding)}
        {renderSection('Catching', catching)}
      </CardContent>
    </Card>
  )
}
