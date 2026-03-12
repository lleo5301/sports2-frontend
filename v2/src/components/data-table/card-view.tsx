import { flexRender, type Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface DataTableCardViewProps<TData> {
  table: Table<TData>
  /** Column ID to show as the card title (first row, bold) */
  titleColumnId?: string
  /** Column IDs to always show in the card */
  visibleColumnIds?: string[]
  /** Render a custom card for full control */
  renderCard?: (row: TData, index: number) => React.ReactNode
  className?: string
}

export function DataTableCardView<TData>({
  table,
  titleColumnId,
  visibleColumnIds,
  renderCard,
  className,
}: DataTableCardViewProps<TData>) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-muted-foreground'>
        No results.
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {rows.map((row, i) => {
        if (renderCard) {
          return <div key={row.id}>{renderCard(row.original, i)}</div>
        }

        const cells = row.getVisibleCells().filter((cell) => {
          if (!visibleColumnIds) return true
          return (
            visibleColumnIds.includes(cell.column.id) ||
            cell.column.id === titleColumnId
          )
        })

        const titleCell = titleColumnId
          ? cells.find((c) => c.column.id === titleColumnId)
          : cells[0]
        const otherCells = cells.filter((c) => c !== titleCell)

        return (
          <Card key={row.id} className='py-3'>
            <CardContent className='space-y-1.5'>
              {titleCell && (
                <div className='font-semibold'>
                  {flexRender(
                    titleCell.column.columnDef.cell,
                    titleCell.getContext()
                  )}
                </div>
              )}
              {otherCells.map((cell) => (
                <div
                  key={cell.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span className='text-muted-foreground'>
                    {typeof cell.column.columnDef.header === 'string'
                      ? cell.column.columnDef.header
                      : cell.column.id}
                  </span>
                  <span className='font-medium'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
