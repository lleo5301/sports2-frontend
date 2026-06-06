import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useSynergyStore } from '@/stores/synergy-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SynergyConfigureRequest } from '../types'

export function SynergyConfigForm() {
  const { configure, loading } = useSynergyStore()
  const [showSecret, setShowSecret] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SynergyConfigureRequest>()

  const onSubmit = async (values: SynergyConfigureRequest) => {
    await configure({
      client_id: values.client_id.trim(),
      client_secret: values.client_secret.trim(),
      synergy_team_id: values.synergy_team_id.trim(),
      api_url: values.api_url?.trim() || undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Synergy Sports</CardTitle>
        <CardDescription>
          Enter your Synergy Sports API credentials. The connection will be
          tested before saving.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='client_id'>Client ID</Label>
            <Input
              id='client_id'
              placeholder='your-client-id'
              {...register('client_id', { required: 'Client ID is required' })}
            />
            {errors.client_id && (
              <p className='text-sm text-destructive'>
                {errors.client_id.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='client_secret'>Client Secret</Label>
            <div className='relative'>
              <Input
                id='client_secret'
                type={showSecret ? 'text' : 'password'}
                placeholder='your-client-secret'
                className='pr-10'
                {...register('client_secret', {
                  required: 'Client secret is required',
                })}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute top-0 right-0 h-full px-3 py-0'
                onClick={() => setShowSecret((v) => !v)}
                tabIndex={-1}
              >
                {showSecret ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </Button>
            </div>
            {errors.client_secret && (
              <p className='text-sm text-destructive'>
                {errors.client_secret.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='synergy_team_id'>Synergy Team ID</Label>
            <Input
              id='synergy_team_id'
              placeholder='582ae8f035be47a9274b8700'
              {...register('synergy_team_id', {
                required: 'Team ID is required',
              })}
            />
            <p className='text-xs text-muted-foreground'>
              24-character hex ID provided by Synergy Sports for your team.
            </p>
            {errors.synergy_team_id && (
              <p className='text-sm text-destructive'>
                {errors.synergy_team_id.message}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='api_url'>
              API URL{' '}
              <span className='font-normal text-muted-foreground'>
                (optional)
              </span>
            </Label>
            <Input
              id='api_url'
              placeholder='Leave blank for default production URL'
              {...register('api_url')}
            />
            <p className='text-xs text-muted-foreground'>
              Only set this if Synergy has given you a custom API endpoint.
            </p>
          </div>

          <Button
            type='submit'
            disabled={loading.configure}
            className='w-full sm:w-auto'
          >
            {loading.configure && (
              <Loader2 className='mr-2 size-4 animate-spin' />
            )}
            {loading.configure ? 'Testing connection...' : 'Test & Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
