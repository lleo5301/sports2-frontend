import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Pencil, Trash2 } from 'lucide-react'
import { vendorsApi } from '@/lib/vendors-api'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditVendorForm } from './edit-vendor-form'

interface VendorDetailProps {
  id: string
}

export function VendorDetail({ id }: VendorDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const vendorId = parseInt(id, 10)
  const { data: vendor, isLoading, error } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => vendorsApi.getById(vendorId),
    enabled: !Number.isNaN(vendorId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => vendorsApi.delete(vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      toast.success('Vendor deleted')
      navigate({ to: '/vendors' })
    },
    onError: (err) => {
      toast.error((err as Error).message || 'Failed to delete')
    },
  })

  if (Number.isNaN(vendorId)) {
    return (
      <Main>
        <div className='py-8 text-center text-destructive'>
          Invalid vendor ID
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

  if (error || !vendor) {
    return (
      <Main>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {(error as Error)?.message ?? 'Vendor not found'}
          </p>
          <Button asChild className='mt-4' variant='outline'>
            <Link to='/vendors'>Back to vendors</Link>
          </Button>
        </div>
      </Main>
    )
  }

  if (editing) {
    return (
      <Main>
        <EditVendorForm
          vendor={vendor}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['vendor', vendorId] })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/vendors'>
                <ArrowLeft className='size-4' />
              </Link>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {vendor.company_name || 'Vendor'}
              </h2>
              <CardDescription>
                {vendor.contact_name && vendor.contact_name}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Pencil className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 className='size-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {vendor.contact_name && (
              <div>
                <p className='text-sm text-muted-foreground'>Contact</p>
                <p className='font-medium'>{vendor.contact_name}</p>
              </div>
            )}
            {vendor.email && (
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <a
                  href={`mailto:${vendor.email}`}
                  className='font-medium text-primary hover:underline'
                >
                  {vendor.email}
                </a>
              </div>
            )}
            {vendor.phone && (
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <a
                  href={`tel:${vendor.phone}`}
                  className='font-medium text-primary hover:underline'
                >
                  {vendor.phone}
                </a>
              </div>
            )}
            {vendor.notes && (
              <div>
                <p className='text-sm text-muted-foreground'>Notes</p>
                <p className='whitespace-pre-wrap'>{vendor.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}
