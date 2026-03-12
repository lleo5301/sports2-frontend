import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import {
  recruitsApi,
  LIST_TYPES,
  LIST_TYPE_LABELS,
  type RecruitProspect,
} from '@/lib/recruits-api'
import { SCHOOL_TYPES, POSITIONS } from '@/lib/prospects-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AddToPreferenceListModal } from '@/features/preference-lists/add-to-preference-list-modal'

function ProspectCard({
  prospect,
  onAddToList,
}: {
  prospect: RecruitProspect
  onAddToList: (prospect: RecruitProspect) => void
}) {
  const name = [prospect.first_name, prospect.last_name].filter(Boolean).join(' ') || '—'
  const lists = prospect.PreferenceLists ?? []
  const onLists = lists.length > 0

  return (
    <Card className='group'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <CardTitle className='text-base'>
          <Link
            to='/prospects/$id'
            params={{ id: String(prospect.id) }}
            className='font-medium text-primary hover:underline'
          >
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
        <CardContent className='pt-0'>
          <div className='flex flex-wrap gap-1 mb-2'>
            {prospect.primary_position && (
              <Badge variant='outline'>{prospect.primary_position}</Badge>
            )}
            {prospect.school_type && (
              <Badge variant='secondary'>{prospect.school_type}</Badge>
            )}
            {prospect.school_name && (
              <span className='text-sm text-muted-foreground'>
                {prospect.school_name}
              </span>
            )}
          </div>
          {onLists && (
            <div className='flex flex-wrap gap-1 mb-2'>
              {lists.map((pl) => (
                <Badge key={pl.list_type} variant='default' className='text-xs'>
                  {LIST_TYPE_LABELS[pl.list_type as keyof typeof LIST_TYPE_LABELS] ?? pl.list_type}
                </Badge>
              ))}
            </div>
          )}
          <Button
            variant='outline'
            size='sm'
            className='w-full gap-2'
            onClick={() => onAddToList(prospect)}
          >
            <Plus className='size-4' />
            {onLists ? 'Add to another list' : 'Add to list'}
          </Button>
        </CardContent>
    </Card>
  )
}

export function RecruitingBoard() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [schoolType, setSchoolType] = useState<string>('all')
  const [position, setPosition] = useState<string>('all')
  const [addModalProspect, setAddModalProspect] = useState<RecruitProspect | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['recruits', page, search, schoolType, position],
    queryFn: () =>
      recruitsApi.listRecruits({
        page,
        limit: 24,
        search: search || undefined,
        school_type: schoolType === 'all' ? undefined : schoolType,
        position: position === 'all' ? undefined : position,
      }),
  })

  const prospects = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 24, total: 0, pages: 0 }

  return (
    <Main>
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Recruiting Board</h2>
          <CardDescription>
            Browse prospects and add them to preference lists
          </CardDescription>
        </div>

        <div className='flex flex-wrap gap-4'>
          <Input
            placeholder='Search name, school, city, state...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-sm'
          />
          <Select value={schoolType} onValueChange={setSchoolType}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='School type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              {SCHOOL_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Position' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : error ? (
          <p className='py-8 text-center text-destructive'>
            {(error as Error).message}
          </p>
        ) : prospects.length === 0 ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>No prospects found</p>
              <Button asChild className='mt-4'>
                <Link to='/prospects/create'>Create prospect</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {prospects.map((prospect) => (
                <ProspectCard
                  key={prospect.id}
                  prospect={prospect}
                  onAddToList={setAddModalProspect}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className='flex items-center justify-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className='text-sm text-muted-foreground'>
                  Page {page} of {pagination.pages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AddToPreferenceListModal
        open={!!addModalProspect}
        onOpenChange={(open) => !open && setAddModalProspect(null)}
        prospectId={addModalProspect?.id ?? 0}
        prospectName={
          addModalProspect
            ? [addModalProspect.first_name, addModalProspect.last_name]
                .filter(Boolean)
                .join(' ')
            : undefined
        }
        onAdded={() => setAddModalProspect(null)}
      />
    </Main>
  )
}
