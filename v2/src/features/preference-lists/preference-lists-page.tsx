import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2, Trash2 } from 'lucide-react'
import {
  recruitsApi,
  LIST_TYPES,
  LIST_TYPE_LABELS,
  PREF_LIST_STATUSES,
  type ListType,
  type PreferenceListEntry,
  type PrefListStatus,
} from '@/lib/recruits-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AddToPreferenceListModal } from './add-to-preference-list-modal'

function EntryCard({
  entry,
  onRemove,
  isRemoving,
}: {
  entry: PreferenceListEntry
  onRemove: () => void
  isRemoving: boolean
}) {
  const prospect = entry.Prospect
  const player = entry.Player
  const person = prospect ?? player
  const isProspect = !!prospect

  const name = person
    ? [person.first_name, person.last_name].filter(Boolean).join(' ') || '—'
    : '—'

  const position = prospect?.primary_position ?? (player as { primary_position?: string })?.primary_position
  const schoolType = prospect?.school_type
  const gradYear = prospect?.graduation_year

  return (
    <Card className='group'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <div className='flex-1 min-w-0'>
          <CardTitle className='text-base'>
            <Link
              to={isProspect ? '/prospects/$id' : '/players/$id'}
              params={{ id: String(person?.id ?? entry.id) }}
              className='font-medium text-primary hover:underline'
            >
              {name}
            </Link>
          </CardTitle>
          <CardDescription className='flex flex-wrap gap-1 mt-1'>
            {position && <Badge variant='outline'>{position}</Badge>}
            {schoolType && <span>{schoolType}</span>}
            {gradYear && <span>'{String(gradYear).slice(-2)}</span>}
          </CardDescription>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive'
          onClick={onRemove}
          disabled={isRemoving}
          title='Remove from list'
        >
          <Trash2 className='size-4' />
        </Button>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='flex flex-wrap gap-1'>
          <Badge variant={entry.status === 'committed' || entry.status === 'signed' ? 'default' : 'secondary'}>
            {entry.status}
          </Badge>
          {entry.interest_level && (
            <Badge variant='outline'>{entry.interest_level}</Badge>
          )}
        </div>
        {entry.notes && (
          <p className='mt-2 text-sm text-muted-foreground line-clamp-2'>
            {entry.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ListColumn({
  listType,
  statusFilter,
}: {
  listType: ListType
  statusFilter: string
}) {
  const queryClient = useQueryClient()
  const [removeTarget, setRemoveTarget] = useState<PreferenceListEntry | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['preference-lists', listType, statusFilter],
    queryFn: () =>
      recruitsApi.listPreferenceLists({
        list_type: listType,
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100,
      }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => recruitsApi.removeFromPreferenceList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preference-lists'] })
      setRemoveTarget(null)
    },
  })

  const entries = data?.data ?? []

  return (
    <div className='space-y-4'>
      <h3 className='font-semibold'>{LIST_TYPE_LABELS[listType]}</h3>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
        </div>
      ) : error ? (
        <p className='text-sm text-destructive'>{(error as Error).message}</p>
      ) : entries.length === 0 ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>
          No entries in this list
        </p>
      ) : (
        <ul className='space-y-3'>
          {entries.map((entry) => (
            <li key={entry.id}>
              <EntryCard
                entry={entry}
                onRemove={() => setRemoveTarget(entry)}
                isRemoving={removeMutation.isPending && removeTarget?.id === entry.id}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title='Remove from list'
        desc={
          removeTarget
            ? `Remove ${removeTarget.Prospect?.first_name ?? ''} ${removeTarget.Prospect?.last_name ?? 'this entry'}`.trim() + ' from this list?'
            : ''
        }
        destructive
        confirmText='Remove'
        handleConfirm={() => removeTarget && removeMutation.mutate(removeTarget.id)}
        isLoading={removeMutation.isPending}
      />
    </div>
  )
}

export function PreferenceListsPage() {
  const [activeTab, setActiveTab] = useState<ListType>('hs_pref_list')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Preference Lists</h2>
            <CardDescription>
              Organize prospects by list type. Add prospects from the Recruiting
              Board or Prospects page.
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[130px]'>
                <SelectValue placeholder='All' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {PREF_LIST_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ListType)}>
          <TabsList className='flex-wrap h-auto gap-1'>
            {LIST_TYPES.map((t) => (
              <TabsTrigger key={t} value={t}>
                {LIST_TYPE_LABELS[t]}
              </TabsTrigger>
            ))}
          </TabsList>
          {LIST_TYPES.map((t) => (
            <TabsContent key={t} value={t} className='mt-6'>
              <ListColumn listType={t} statusFilter={statusFilter} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Main>
  )
}
