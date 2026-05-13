import { useState } from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'
import { useSynergyStore } from '@/stores/synergy-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function buildSeasonOptions(): number[] {
  const current = new Date().getFullYear()
  return [current + 1, current, current - 1, current - 2]
}

export function SyncControlPanel() {
  const { syncGames, syncAll, loading } = useSynergyStore()
  const [season, setSeason] = useState<number>(new Date().getFullYear())
  const [force, setForce] = useState(false)

  const isSyncing = loading.syncGames || loading.syncAll

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Data</CardTitle>
        <CardDescription>
          Pull the latest data from Synergy Sports into the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='season-select' className='whitespace-nowrap'>
              Season
            </Label>
            <Select
              value={String(season)}
              onValueChange={(v) => setSeason(Number(v))}
              disabled={isSyncing}
            >
              <SelectTrigger id='season-select' className='w-28'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {buildSeasonOptions().map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox
              id='force-resync'
              checked={force}
              onCheckedChange={(checked) => setForce(Boolean(checked))}
              disabled={isSyncing}
            />
            <Label htmlFor='force-resync' className='cursor-pointer'>
              Force re-sync
            </Label>
          </div>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Button
            variant='outline'
            onClick={() => syncGames(season)}
            disabled={isSyncing}
          >
            {loading.syncGames ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 size-4' />
            )}
            Sync Games
          </Button>

          <Button
            onClick={() => syncAll({ season, force })}
            disabled={isSyncing}
          >
            {loading.syncAll ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 size-4' />
            )}
            Full Sync
          </Button>
        </div>

        <p className='text-xs text-muted-foreground'>
          <strong>Sync Games</strong> imports the game list for the selected
          season. <strong>Full Sync</strong> imports games, pitch events for
          every game, and player identity maps. Full sync may take 1–2 minutes.
          {force && (
            <span className='text-amber-600 dark:text-amber-400'>
              {' '}
              Force re-sync is on — existing records will be overwritten.
            </span>
          )}
        </p>

        {isSyncing && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='size-4 animate-spin' />
            <span>
              {loading.syncAll
                ? 'Running full sync... this may take a minute.'
                : 'Syncing games...'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
