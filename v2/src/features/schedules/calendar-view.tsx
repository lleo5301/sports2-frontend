import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from 'date-fns'
import { scheduleEventsApi } from '@/lib/schedule-events-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { 'en-US': undefined }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const range = useMemo(() => {
    const start = startOfMonth(subMonths(currentDate, 1))
    const end = endOfMonth(addMonths(currentDate, 1))
    return { start, end }
  }, [currentDate])

  const { data: events, isLoading } = useQuery({
    queryKey: [
      'schedule-events',
      format(range.start, 'yyyy-MM-dd'),
      format(range.end, 'yyyy-MM-dd'),
    ],
    queryFn: () =>
      scheduleEventsApi.list({
        start_date: format(range.start, 'yyyy-MM-dd'),
        end_date: format(range.end, 'yyyy-MM-dd'),
      }),
  })

  const calendarEvents = useMemo(() => {
    if (!Array.isArray(events)) return []
    return events.map((e) => {
      const start = e.start_date
        ? new Date(e.start_date)
        : new Date()
      const end = e.end_date
        ? new Date(e.end_date)
        : new Date(start.getTime() + 60 * 60 * 1000)
      return {
        id: e.id,
        title: e.title ?? `Event #${e.id}`,
        start,
        end,
        resource: e,
      }
    })
  }, [events])

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Schedule Calendar
            </h2>
            <CardDescription>
              Schedule events by date
            </CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentDate((d) => subMonths(d, 1))}
            >
              <ChevronLeft className='size-4' />
            </Button>
            <Button
              variant='outline'
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentDate((d) => addMonths(d, 1))}
            >
              <ChevronRight className='size-4' />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <CardDescription>
              Full calendar view of schedule events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex h-[500px] items-center justify-center'>
                <Loader2 className='size-8 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <div className='h-[500px] [&_.rbc-calendar]:h-full'>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor='start'
                  endAccessor='end'
                  titleAccessor='title'
                  defaultView='month'
                  defaultDate={currentDate}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  views={['month', 'week', 'day', 'agenda']}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
