import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { schedulesApi, type Schedule } from '@/lib/schedules-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ScheduleDetailProps {
  id: string
}

export function ScheduleDetail({ id }: ScheduleDetailProps) {
  const scheduleId = parseInt(id, 10)
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: () => schedulesApi.getById(scheduleId),
    enabled: !Number.isNaN(scheduleId),
  })

  if (Number.isNaN(scheduleId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid schedule ID
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

  if (error || !schedule) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Schedule not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/schedules'>Back to schedules</Link>
          </Button>
        </div>
      </Main>
    )
  }

  const sections = schedule.Sections ?? []

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/schedules'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {schedule.program_name || schedule.team_name || `Schedule #${id}`}
            </h2>
            <CardDescription>
              {schedule.date} • {schedule.team_name}
            </CardDescription>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Date</p>
              <p className='font-medium'>{schedule.date}</p>
            </div>
            {schedule.team_name && (
              <div>
                <p className='text-sm text-muted-foreground'>Team</p>
                <p className='font-medium'>{schedule.team_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {sections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Schedule sections and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-4'>
                {sections.map((sec) => (
                  <li key={sec.id} className='rounded-lg border p-4'>
                    <p className='font-medium'>
                      {sec.title || sec.type || `Section #${sec.id}`}
                    </p>
                    {sec.Activities && sec.Activities.length > 0 && (
                      <ul className='mt-3 space-y-2 pl-4'>
                        {sec.Activities.map((act) => (
                          <li key={act.id} className='text-sm'>
                            <span className='text-muted-foreground'>
                              {act.time}
                            </span>{' '}
                            — {act.activity}
                            {act.location && ` @ ${act.location}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </Main>
  )
}
