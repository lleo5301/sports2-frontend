import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Palette, Trash2, Upload, Users, UserPlus, Eye, EyeOff } from 'lucide-react'
import { brandingApi } from '@/lib/branding-api'
import { teamsApi, type TeamUser, type TeamPermission } from '@/lib/teams-api'
import { useAuth } from '@/contexts/AuthContext'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const teamInfoSchema = z.object({
  name: z.string().optional(),
  program_name: z.string().optional(),
  conference: z.string().optional(),
  division: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

type TeamInfoFormValues = z.infer<typeof teamInfoSchema>

const brandingSchema = z.object({
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
})

type BrandingFormValues = z.infer<typeof brandingSchema>

const addUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.string().min(1, 'Role is required'),
  phone: z.string().optional(),
})

type AddUserFormValues = z.infer<typeof addUserSchema>

const USER_ROLES = [
  { label: 'Head Coach', value: 'head_coach' },
  { label: 'Assistant Coach', value: 'assistant_coach' },
  { label: 'Admin', value: 'admin' },
  { label: 'Scout', value: 'scout' },
  { label: 'Manager', value: 'manager' },
] as const

export function TeamSettingsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check if current user is a superadmin (role check)
  const isSuperAdmin =
    user?.role === 'superadmin' ||
    user?.role === 'super_admin' ||
    user?.role === 'admin' ||
    user?.role === 'head_coach'

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['teams', 'me'],
    queryFn: () => teamsApi.getMyTeam() as Promise<Record<string, unknown>>,
  })

  const { data: branding, isLoading: brandingLoading } = useQuery({
    queryKey: ['branding'],
    queryFn: brandingApi.get,
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['teams', 'users'],
    queryFn: teamsApi.getUsers,
  })

  const { data: permissions = [], isLoading: permsLoading } = useQuery({
    queryKey: ['teams', 'permissions'],
    queryFn: teamsApi.getPermissions,
  })

  const teamInfoForm = useForm<TeamInfoFormValues>({
    resolver: zodResolver(teamInfoSchema),
    defaultValues: {
      name: '',
      program_name: '',
      conference: '',
      division: '',
      city: '',
      state: '',
    },
    values: team
      ? {
          name: String(team.name ?? ''),
          program_name: String(team.program_name ?? ''),
          conference: String(team.conference ?? ''),
          division: String(team.division ?? ''),
          city: String(team.city ?? ''),
          state: String(team.state ?? ''),
        }
      : undefined,
  })

  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primary_color: '',
      secondary_color: '',
    },
    values: branding
      ? {
          primary_color: branding.primary_color ?? '',
          secondary_color: branding.secondary_color ?? '',
        }
      : undefined,
  })

  const addUserForm = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
    },
  })

  const updateTeamMutation = useMutation({
    mutationFn: (data: TeamInfoFormValues) => teamsApi.updateMyTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Team info updated')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  const updateBrandingMutation = useMutation({
    mutationFn: (data: BrandingFormValues) =>
      brandingApi.updateColors(data.primary_color, data.secondary_color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Branding updated')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to update')
    },
  })

  const logoMutation = useMutation({
    mutationFn: (file: File) => teamsApi.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Logo updated')
      setLogoUploading(false)
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to upload logo')
      setLogoUploading(false)
    },
  })

  const deleteLogoMutation = useMutation({
    mutationFn: () => teamsApi.deleteLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Logo removed')
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to remove logo')
    },
  })

  const addUserMutation = useMutation({
    mutationFn: (data: AddUserFormValues) => teamsApi.addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'users'] })
      toast.success('User added successfully')
      setAddUserOpen(false)
      addUserForm.reset()
      setShowPassword(false)
    },
    onError: (err) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error).message
        || 'Failed to add user'
      toast.error(message)
    },
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    logoMutation.mutate(file)
    e.target.value = ''
  }

  const isLoading = teamLoading || brandingLoading

  return (
    <Main fixed>
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Team Settings
          </h1>
          <p className='text-muted-foreground'>
            Branding, team details, users, and permissions
          </p>
        </div>

        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Update your team name, program, conference, and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex items-center gap-2 py-4 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading...
              </div>
            ) : (
              <Form {...teamInfoForm}>
                <form
                  onSubmit={teamInfoForm.handleSubmit((d) =>
                    updateTeamMutation.mutate(d)
                  )}
                  className='grid gap-4 sm:grid-cols-2'
                >
                  <FormField
                    control={teamInfoForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Hurricanes' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamInfoForm.control}
                    name='program_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Miami Dade Baseball' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamInfoForm.control}
                    name='conference'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conference</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. ACC' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamInfoForm.control}
                    name='division'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Division I' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamInfoForm.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Miami' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamInfoForm.control}
                    name='state'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. FL' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='sm:col-span-2'>
                    <Button
                      type='submit'
                      disabled={updateTeamMutation.isPending}
                    >
                      {updateTeamMutation.isPending ? (
                        <Loader2 className='size-4 animate-spin' />
                      ) : null}
                      Save Team Info
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Palette className='size-5' />
              <CardTitle>Branding</CardTitle>
            </div>
            <CardDescription>
              Logo and colors used across the app
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <p className='mb-2 text-sm font-medium'>Team Logo</p>
              <div className='flex items-center gap-4'>
                {branding?.logo_url ? (
                  <div className='relative'>
                    <img
                      src={branding.logo_url}
                      alt='Team logo'
                      className='size-20 rounded-lg object-contain ring-1 ring-border'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute -right-2 -top-2 size-6 rounded-full'
                      onClick={() => deleteLogoMutation.mutate()}
                      disabled={deleteLogoMutation.isPending}
                    >
                      <Trash2 className='size-3' />
                    </Button>
                  </div>
                ) : null}
                <div className='flex flex-col gap-1'>
                  <input
                    ref={logoInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleLogoChange}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading}
                  >
                    {logoUploading ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <Upload className='size-4' />
                    )}
                    {branding?.logo_url ? 'Replace Logo' : 'Upload Logo'}
                  </Button>
                </div>
              </div>
            </div>

            <Form {...brandingForm}>
              <form
                onSubmit={brandingForm.handleSubmit((d) =>
                  updateBrandingMutation.mutate(d)
                )}
                className='grid gap-4 sm:grid-cols-2'
              >
                <FormField
                  control={brandingForm.control}
                  name='primary_color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className='flex gap-2'>
                          <input
                            type='color'
                            className='h-9 w-14 cursor-pointer rounded-md border border-input p-1'
                            value={field.value || '#DC2626'}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <Input
                            placeholder='#DC2626'
                            className='flex-1 font-mono text-sm'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandingForm.control}
                  name='secondary_color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <div className='flex gap-2'>
                          <input
                            type='color'
                            className='h-9 w-14 cursor-pointer rounded-md border border-input p-1'
                            value={field.value || '#EF4444'}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <Input
                            placeholder='#EF4444'
                            className='flex-1 font-mono text-sm'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='sm:col-span-2'>
                  <Button
                    type='submit'
                    disabled={updateBrandingMutation.isPending}
                  >
                    {updateBrandingMutation.isPending ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : null}
                    Save Colors
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Team Users */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='size-5' />
                <CardTitle>Team Members</CardTitle>
              </div>
              {isSuperAdmin && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setAddUserOpen(true)}
                >
                  <UserPlus className='size-4' />
                  Add User
                </Button>
              )}
            </div>
            <CardDescription>
              Users with access to this team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className='flex items-center gap-2 py-4 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className='py-6 text-center'>
                <Users className='mx-auto size-10 text-muted-foreground/40' />
                <p className='mt-2 text-sm text-muted-foreground'>
                  No team members found.
                </p>
                {isSuperAdmin && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-3'
                    onClick={() => setAddUserOpen(true)}
                  >
                    <UserPlus className='size-4' />
                    Add First User
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u: TeamUser) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name ?? '-'}</TableCell>
                      <TableCell>{u.email ?? '-'}</TableCell>
                      <TableCell className='capitalize'>
                        {u.role?.replace(/_/g, ' ') ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Granular permissions for team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {permsLoading ? (
              <div className='flex items-center gap-2 py-4 text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading permissions...
              </div>
            ) : permissions.length === 0 ? (
              <p className='py-4 text-sm text-muted-foreground'>
                No permissions configured.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((p: TeamPermission) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.user_id}</TableCell>
                      <TableCell className='font-mono text-sm'>
                        {p.permission_type}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            p.is_granted
                              ? 'text-green-600 dark:text-green-500'
                              : 'text-muted-foreground'
                          }
                        >
                          {p.is_granted ? 'Granted' : 'Revoked'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog
        open={addUserOpen}
        onOpenChange={(open) => {
          setAddUserOpen(open)
          if (!open) {
            addUserForm.reset()
            setShowPassword(false)
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <UserPlus className='size-5' />
              Add User
            </DialogTitle>
            <DialogDescription>
              Create a new user account and add them to your team.
            </DialogDescription>
          </DialogHeader>
          <Form {...addUserForm}>
            <form
              id='add-user-form'
              onSubmit={addUserForm.handleSubmit((d) =>
                addUserMutation.mutate(d)
              )}
              className='space-y-4'
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={addUserForm.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addUserForm.control}
                  name='last_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={addUserForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john.doe@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Minimum 8 characters'
                          className='pr-10'
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className='size-4 text-muted-foreground' />
                          ) : (
                            <Eye className='size-4 text-muted-foreground' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='(555) 555-5555'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className='gap-y-2'>
            <Button
              variant='outline'
              onClick={() => {
                setAddUserOpen(false)
                addUserForm.reset()
                setShowPassword(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='add-user-form'
              disabled={addUserMutation.isPending}
            >
              {addUserMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <UserPlus className='size-4' />
              )}
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Main>
  )
}
