import { useEffect, useState } from 'react'
import { Key, Loader2, Check, X, Trash2 } from 'lucide-react'
import { aiApi } from '@/lib/ai-api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import type { ApiKeyStatus, ApiKeyTestResult } from '../types'

export function ApiKeySettings() {
  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [testResult, setTestResult] = useState<ApiKeyTestResult | null>(null)

  useEffect(() => {
    aiApi
      .getApiKeyStatus()
      .then((status) => {
        if (status) setKeyStatus(status)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleTest = async () => {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestResult(null)
    try {
      const result = await aiApi.testApiKey(apiKey)
      if (result) setTestResult(result)
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey.trim()) return
    setSaving(true)
    try {
      const status = await aiApi.saveApiKey(apiKey)
      if (status) {
        setKeyStatus(status)
        setApiKey('')
        setTestResult(null)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await aiApi.removeApiKey()
      setKeyStatus({ has_key: false })
    } finally {
      setRemoving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Key className='size-4' />
            API Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='size-4' />
          API Key Settings
        </CardTitle>
        <CardDescription>
          Bring your own OpenRouter API key for AI features.{' '}
          <a
            href='https://openrouter.ai/keys'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary underline'
          >
            Get a key
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {keyStatus?.has_key ? (
          <>
            <Alert>
              <Check className='size-4' />
              <AlertTitle>Key Active</AlertTitle>
              <AlertDescription>
                Provider: {keyStatus.provider || 'anthropic'} &middot;{' '}
                {keyStatus.created_at &&
                  `Added ${new Date(keyStatus.created_at).toLocaleDateString()}`}
              </AlertDescription>
            </Alert>
            <Button
              variant='destructive'
              size='sm'
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? (
                <Loader2 className='mr-1.5 size-4 animate-spin' />
              ) : (
                <Trash2 className='mr-1.5 size-4' />
              )}
              Remove Key
            </Button>
          </>
        ) : (
          <>
            <div className='space-y-2'>
              <Label htmlFor='api-key'>OpenRouter API Key</Label>
              <Input
                id='api-key'
                type='password'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder='sk-or-...'
              />
            </div>

            {testResult && (
              <Alert variant={testResult.valid ? 'default' : 'destructive'}>
                {testResult.valid ? (
                  <Check className='size-4' />
                ) : (
                  <X className='size-4' />
                )}
                <AlertDescription>
                  {testResult.valid
                    ? 'Key is valid!'
                    : testResult.error || 'Key is invalid'}
                </AlertDescription>
              </Alert>
            )}

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleTest}
                disabled={!apiKey.trim() || testing}
              >
                {testing && <Loader2 className='mr-1.5 size-4 animate-spin' />}
                Test Key
              </Button>
              <Button
                size='sm'
                onClick={handleSave}
                disabled={!apiKey.trim() || saving}
              >
                {saving && <Loader2 className='mr-1.5 size-4 animate-spin' />}
                Save Key
              </Button>
            </div>

            <p className='text-xs text-muted-foreground'>
              Your key is encrypted at rest. It is used to access AI models via
              OpenRouter.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
