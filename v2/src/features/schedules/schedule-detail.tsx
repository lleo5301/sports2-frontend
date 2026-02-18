import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  FileDown,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  schedulesApi,
  type Schedule,
  type ScheduleSection,
  type ScheduleActivity,
} from '@/lib/schedules-api'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AddSectionModal } from './add-section-modal'
import { AddActivityModal } from './add-activity-modal'

interface ScheduleDetailProps {
  id: string
}

export function ScheduleDetail({ id }: ScheduleDetailProps) {
  const queryClient = useQueryClient()
  const scheduleId = parseInt(id, 10)

  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [addActivityOpen, setAddActivityOpen] = useState(false)
  const [activitySection, setActivitySection] = useState<ScheduleSection | null>(
    null
  )
  const [deleteSectionTarget, setDeleteSectionTarget] =
    useState<ScheduleSection | null>(null)
  const [deleteActivityTarget, setDeleteActivityTarget] =
    useState<{ activity: ScheduleActivity; section: ScheduleSection } | null>(
      null
    )

  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: () => schedulesApi.getById(scheduleId),
    enabled: !Number.isNaN(scheduleId),
  })

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: number) => schedulesApi.deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
      setDeleteSectionTarget(null)
    },
  })

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: number) =>
      schedulesApi.deleteActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
      setDeleteActivityTarget(null)
    },
  })

  const openAddActivity = (section: ScheduleSection) => {
    setActivitySection(section)
    setAddActivityOpen(true)
  }

  const refreshSchedule = () => {
    queryClient.invalidateQueries({ queryKey: ['schedule', scheduleId] })
  }

  const handleExportPdf = async () => {
    try {
      await schedulesApi.exportPdf()
    } catch (err) {
      // toast already shown by api interceptor
    }
  }

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

  const sections = schedule.ScheduleSections ?? schedule.Sections ?? []

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
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
          <Button variant='outline' size='sm' onClick={handleExportPdf}>
            <FileDown className='size-4' />
            Export PDF
          </Button>
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

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <div>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Schedule sections and activities</CardDescription>
            </div>
            <Button
              size='sm'
              onClick={() => setAddSectionOpen(true)}
              className='gap-2'
            >
              <Plus className='size-4' />
              Add Section
            </Button>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <p className='py-6 text-center text-muted-foreground'>
                No sections yet. Add a section to get started.
              </p>
            ) : (
              <ul className='space-y-4'>
                {sections.map((sec) => {
                  const activities = sec.ScheduleActivities ?? sec.Activities ?? []
                  const sectionTitle =
                    sec.title || sec.type || `Section #${sec.id}`

                  return (
                    <li key={sec.id} className='rounded-lg border p-4'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className='font-medium'>{sectionTitle}</p>
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 gap-1 px-2'
                            onClick={() => openAddActivity(sec)}
                          >
                            <Plus className='size-3' />
                            Activity
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive hover:text-destructive'
                            onClick={() => setDeleteSectionTarget(sec)}
                            title='Delete section'
                          >
                            <Trash2 className='size-4' />
                          </Button>
                        </div>
                      </div>
                      {activities.length > 0 && (
                        <ul className='mt-3 space-y-2 pl-4'>
                          {(sec.ScheduleActivities ?? sec.Activities)!.map(
                            (act) => (
                              <li
                                key={act.id}
                                className='group flex items-center justify-between gap-2 rounded py-1 pr-2'
                              >
                                <span className='text-sm'>
                                  <span className='text-muted-foreground'>
                                    {act.time}
                                  </span>
                                  {' — '}
                                  {act.activity}
                                  {act.location && ` @ ${act.location}`}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
                                  onClick={() =>
                                    setDeleteActivityTarget({
                                      activity: act,
                                      section: sec,
                                    })
                                  }
                                  title='Delete activity'
                                >
                                  <Trash2 className='size-3 text-destructive' />
                                </Button>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <AddSectionModal
        open={addSectionOpen}
        onOpenChange={setAddSectionOpen}
        scheduleId={scheduleId}
        onAdded={refreshSchedule}
      />

      <AddActivityModal
        open={addActivityOpen}
        onOpenChange={(open) => {
          if (!open) setActivitySection(null)
          setAddActivityOpen(open)
        }}
        section={activitySection}
        scheduleId={scheduleId}
        onAdded={refreshSchedule}
      />

      <ConfirmDialog
        open={!!deleteSectionTarget}
        onOpenChange={(open) => !open && setDeleteSectionTarget(null)}
        title='Delete section'
        desc={
          deleteSectionTarget ? (
            <>
              Delete &quot;
              {deleteSectionTarget.title ||
                deleteSectionTarget.type ||
                `Section #${deleteSectionTarget.id}`}
              &quot; and all its activities? This cannot be undone.
            </>
          ) : (
            ''
          )
        }
        destructive
        confirmText='Delete'
        handleConfirm={() => {
          if (deleteSectionTarget) {
            deleteSectionMutation.mutate(deleteSectionTarget.id)
          }
        }}
        isLoading={deleteSectionMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteActivityTarget}
        onOpenChange={(open) => !open && setDeleteActivityTarget(null)}
        title='Delete activity'
        desc={
          deleteActivityTarget ? (
            <>
              Delete &quot;{deleteActivityTarget.activity.activity}&quot;? This
              cannot be undone.
            </>
          ) : (
            ''
          )
        }
        destructive
        confirmText='Delete'
        handleConfirm={() => {
          if (deleteActivityTarget) {
            deleteActivityMutation.mutate(deleteActivityTarget.activity.id)
          }
        }}
        isLoading={deleteActivityMutation.isPending}
      />
    </Main>
  )
}
