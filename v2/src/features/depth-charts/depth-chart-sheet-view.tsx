import html2canvas from 'html2canvas'
import { Download, Printer } from 'lucide-react'
import type { DepthChart } from '@/lib/depth-charts-api'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const POSITION_ORDER = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']
const FALLBACK_NAMES: Record<string, string> = {
  P: 'Pitcher',
  C: 'Catcher',
  '1B': 'First Base',
  '2B': 'Second Base',
  '3B': 'Third Base',
  SS: 'Shortstop',
  LF: 'Left Field',
  CF: 'Center Field',
  RF: 'Right Field',
  DH: 'Designated Hitter',
}

function byCode(
  code: string,
  positions: DepthChart['DepthChartPositions']
): Array<{ id: number; name: string }> {
  const pos = positions?.find((p) => p.position_code === code)
  return (pos?.DepthChartPlayers ?? [])
    .sort((a, b) => (a.depth_order ?? 0) - (b.depth_order ?? 0))
    .map((a) => ({
      id: a.id,
      name: `${a.Player?.first_name ?? ''} ${a.Player?.last_name ?? ''}`.trim(),
    }))
}

function nameFor(
  code: string,
  positions: DepthChart['DepthChartPositions']
): string {
  const pos = positions?.find((p) => p.position_code === code)
  return pos?.position_name ?? FALLBACK_NAMES[code] ?? code
}

type DepthChartSheetViewProps = {
  depthChart: DepthChart
}

export function DepthChartSheetView({ depthChart }: DepthChartSheetViewProps) {
  const positions = depthChart.DepthChartPositions ?? []

  const handlePrint = () => {
    window.print()
  }

  const handleExportImage = async () => {
    const element = document.getElementById('depth-chart-sheet')
    if (!element) {
      toast.error('Unable to find depth chart element')
      return
    }
    try {
      toast.loading('Generating image...', { id: 'export' })
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `depth-chart-${depthChart.name ?? 'sheet'}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Depth chart exported', { id: 'export' })
    } catch {
      toast.error('Failed to export depth chart', { id: 'export' })
    }
  }

  return (
    <div className='w-full'>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #depth-chart-sheet, #depth-chart-sheet * { visibility: visible; }
          #depth-chart-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }
        }
      `}</style>

      <div className='mb-4 flex items-center justify-between print:hidden'>
        <h2 className='text-xl font-bold'>Depth Chart — Sheet View</h2>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={handlePrint}>
            <Printer className='size-4' />
            Print
          </Button>
          <Button variant='outline' size='sm' onClick={handleExportImage}>
            <Download className='size-4' />
            Export Image
          </Button>
        </div>
      </div>

      <div
        id='depth-chart-sheet'
        className='rounded-lg border bg-background p-6 print:border-0'
      >
        <h2 className='mb-6 text-center text-2xl font-bold'>
          {depthChart.name ?? 'Team Depth Chart'}
        </h2>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {POSITION_ORDER.map((code) => {
            const items = byCode(code, positions)
            const title = nameFor(code, positions)
            return (
              <div
                key={code}
                className='rounded-lg border bg-card p-4 print:break-inside-avoid'
              >
                <div className='mb-3 text-center font-semibold'>{title}</div>
                <ol className='space-y-2'>
                  {[0, 1, 2].map((i) => (
                    <li
                      key={i}
                      className='flex items-center border-b border-dashed pb-1'
                    >
                      <span className='mr-3 w-6 text-muted-foreground'>
                        {i + 1}.
                      </span>
                      <span className='font-medium'>
                        {items[i]?.name ?? ''}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
