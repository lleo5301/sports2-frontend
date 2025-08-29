import React from 'react'
import { Printer, Download, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

// DepthChartSheetView: a printable/overview sheet that mimics a paper depth chart layout
// Props: depthChart (full object with DepthChartPositions)
export default function DepthChartSheetView({ depthChart }) {
  const positions = depthChart?.DepthChartPositions || []

  const byCode = (code) => {
    const pos = positions.find((p) => p.position_code === code)
    return (pos?.DepthChartPlayers || [])
      .sort((a, b) => a.depth_order - b.depth_order)
      .map((a) => ({
        id: a.id,
        name: `${a.Player?.first_name || ''} ${a.Player?.last_name || ''}`.trim(),
        depth: a.depth_order,
      }))
  }

  const take = (arr, n) => arr.slice(0, n)

  // Print functionality
  const handlePrint = () => {
    window.print()
  }

  // Export as image
  const handleExportImage = async () => {
    try {
      const element = document.getElementById('depth-chart-sheet')
      if (!element) {
        toast.error('Unable to find depth chart element')
        return
      }

      toast.loading('Generating image...', { id: 'export' })
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight
      })

      // Create download link
      const link = document.createElement('a')
      link.download = `depth-chart-${depthChart?.name || 'sheet'}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Depth chart exported successfully!', { id: 'export' })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export depth chart', { id: 'export' })
    }
  }

  // Map position codes to full names (fallbacks if not configured on chart)
  const fallbackNames = {
    P: 'Pitcher',
    C: 'Catcher',
    '1B': 'First Base',
    '2B': 'Second Base',
    '3B': 'Third Base',
    SS: 'Shortstop',
    LF: 'Left Field',
    CF: 'Center Field',
    RF: 'Right Field',
    DH: 'Designated Hitter'
  }
  const nameFor = (code) => positions.find((p) => p.position_code === code)?.position_name || fallbackNames[code] || code

  const listBox = (title, items = [], lines = 3) => (
    <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 print:bg-white print:shadow-none print:break-inside-avoid">
      {title && <div className="font-semibold text-center mb-2 text-sm print:text-xs">{title}</div>}
      <ol className="text-sm space-y-1 print:text-xs print:space-y-0.5">
        {Array.from({ length: lines }).map((_, i) => (
          <li key={i} className="flex items-center">
            <span className="w-5 text-gray-400 print:w-4 print:text-[10px]">{i + 1}.</span>
            <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate print:text-[10px] print:ml-1">
              {items[i]?.name || ''}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )

  // Build starters (depth 1) and subs (depth 2) across common positions
  const orderCodes = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']
  const starters = orderCodes
    .map((c) => byCode(c)[0])
    .filter(Boolean)
  const subs = orderCodes
    .map((c) => byCode(c)[1])
    .filter(Boolean)

  const pitchers = byCode('P')
  const catcher = byCode('C')
  const first = byCode('1B')
  const second = byCode('2B')
  const third = byCode('3B')
  const short = byCode('SS')
  const left = byCode('LF')
  const center = byCode('CF')
  const right = byCode('RF')
  const dh = byCode('DH')

  // Bench = everyone not used as a starter (depth > 1 or positions not in order codes)
  const usedStarterIds = new Set(starters.map((p) => p.id))
  const bench = positions
    .flatMap((p) => p.DepthChartPlayers || [])
    .sort((a, b) => a.depth_order - b.depth_order)
    .map((a) => ({ id: a.id, name: `${a.Player?.first_name || ''} ${a.Player?.last_name || ''}`.trim() }))
    .filter((a) => !usedStarterIds.has(a.id))

  return (
    <div className="w-full">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #depth-chart-sheet, #depth-chart-sheet * {
            visibility: visible;
          }
          #depth-chart-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            transform: scale(0.9);
            transform-origin: top left;
          }
        }
      `}</style>

      {/* Action Buttons - Hidden when printing */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h2 className="text-2xl font-bold text-base-content">Depth Chart - Sheet View</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="btn btn-outline btn-sm"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleExportImage}
            className="btn btn-outline btn-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Image
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div 
        id="depth-chart-sheet"
        className="relative w-full max-w-none mx-auto print:w-full print:h-auto bg-white"
      >
        {/* Background field tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-200/60 via-green-100/60 to-green-50/60 rounded-lg print:bg-white" />

        <div className="relative p-6 print:p-4">
          <h2 className="text-3xl font-bold text-center mb-6 print:text-2xl print:mb-4">
            {depthChart?.name || 'Team Depth Chart'}
          </h2>

        {/* Expanded chart size for better visibility */}
        <div className="relative min-h-[800px] h-[80vh] max-h-[1400px] bg-gradient-to-b from-white/50 to-white/30 rounded-lg border border-gray-200 print:h-[1000px] print:max-h-none">
          <div className="absolute inset-0 p-6 grid grid-cols-12 grid-rows-12 gap-4 print:gap-3">
            {/* Top row: LF - CF - RF */}
            <div className="col-span-3 row-span-2">{listBox(nameFor('LF'), take(left, 3))}</div>
            <div className="col-start-5 col-span-4 row-span-2">{listBox(nameFor('CF'), take(center, 3))}</div>
            <div className="col-start-10 col-span-3 row-span-2">{listBox(nameFor('RF'), take(right, 3))}</div>

            {/* Mid row between outfield and bases: SS and 2B */}
            <div className="col-start-1 col-span-3 row-start-3 row-span-2">{listBox(nameFor('SS'), take(short, 3))}</div>
            <div className="col-start-10 col-span-3 row-start-3 row-span-2">{listBox(nameFor('2B'), take(second, 3))}</div>

            {/* Infield corners: 3B and 1B */}
            <div className="col-start-1 col-span-3 row-start-5 row-span-2">{listBox(nameFor('3B'), take(third, 3))}</div>
            <div className="col-start-10 col-span-3 row-start-5 row-span-2">{listBox(nameFor('1B'), take(first, 3))}</div>

            {/* Left column: Starting Pitcher/Relief & Closer */}
            <div className="col-start-1 col-span-3 row-start-7 row-span-4">
              <div className="space-y-2 h-full">
                <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 print:bg-white print:shadow-none print:break-inside-avoid flex-1">
                  <div className="font-semibold text-center mb-2 text-sm print:text-xs">Starting Pitcher/Relief</div>
                  <ol className="text-sm space-y-1 print:text-xs print:space-y-0.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-5 text-gray-400 print:w-4 print:text-[10px]">{i + 1}.</span>
                        <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate print:text-[10px] print:ml-1">
                          {pitchers[i]?.name || ''}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 print:bg-white print:shadow-none print:break-inside-avoid">
                  <div className="font-semibold text-center mb-2 text-sm print:text-xs">Closer</div>
                  <div className="border-b border-dashed border-gray-300 h-6 text-sm text-gray-800 truncate print:text-[10px] print:h-4">
                    {pitchers[0]?.name || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Center pane: Pitchers list */}
            <div className="col-start-5 col-span-4 row-start-3 row-span-6">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full print:bg-white print:shadow-none print:break-inside-avoid">
                <div className="font-semibold text-center mb-2 text-sm print:text-xs">{nameFor('P')}s</div>
                <ol className="text-sm space-y-1 max-h-full overflow-y-auto pr-1 print:text-xs print:space-y-0.5 print:overflow-visible">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-5 text-gray-400 print:w-4 print:text-[10px]">{i + 1}.</span>
                      <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate print:text-[10px] print:ml-1">
                        {pitchers[i]?.name || ''}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="flex justify-between text-[11px] text-gray-500 mt-2 print:text-[8px]">
                  <span>A - Available</span>
                  <span>N/A - Not Available</span>
                </div>
              </div>
            </div>

            {/* Catcher below home area */}
            <div className="col-start-5 col-span-4 row-start-9 row-span-2">{listBox(nameFor('C'), take(catcher, 4), 4)}</div>

            {/* Right pane: Batting Order Starters/Sub */}
            <div className="col-start-9 col-span-4 row-start-7 row-span-4">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full overflow-hidden print:bg-white print:shadow-none print:break-inside-avoid print:overflow-visible">
                <div className="font-semibold text-center mb-2 text-sm print:text-xs">Batting Order</div>
                <div className="grid grid-cols-2 gap-3 h-[calc(100%-2.5rem)] overflow-hidden print:gap-2 print:h-auto">
                  <div className="overflow-hidden print:overflow-visible">
                    <div className="text-xs font-semibold mb-1 print:text-[10px]">Starters</div>
                    <ol className="text-xs space-y-0.5 overflow-y-auto max-h-full print:text-[9px] print:space-y-0 print:overflow-visible print:max-h-none">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-3 text-gray-400 text-[10px] print:text-[8px] print:w-2">{i + 1}.</span>
                          <div className="flex-1 border-b border-dashed border-gray-300 ml-1 text-gray-800 truncate text-[10px] leading-tight print:text-[8px] print:leading-none">
                            {starters[i]?.name || ''}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="overflow-hidden print:overflow-visible">
                    <div className="text-xs font-semibold mb-1 print:text-[10px]">Sub</div>
                    <ol className="text-xs space-y-0.5 overflow-y-auto max-h-full print:text-[9px] print:space-y-0 print:overflow-visible print:max-h-none">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-3 text-gray-400 text-[10px] print:text-[8px] print:w-2">{i + 1}.</span>
                          <div className="flex-1 border-b border-dashed border-gray-300 ml-1 text-gray-800 truncate text-[10px] leading-tight print:text-[8px] print:leading-none">
                            {subs[i]?.name || ''}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Bench list across bottom */}
            <div className="col-start-1 col-span-12 row-start-11 row-span-2">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full print:bg-white print:shadow-none print:break-inside-avoid">
                <div className="font-semibold text-center mb-2 text-sm print:text-xs">Bench/Player List</div>
                <div className="grid grid-cols-4 gap-4 h-full print:gap-2">
                  {[0, 1, 2, 3].map((col) => (
                    <ol key={col} className="text-sm space-y-1 print:text-xs print:space-y-0.5">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const idx = col * 4 + i
                        return (
                          <li key={idx} className="flex items-center">
                            <span className="w-5 text-gray-400 print:w-4 print:text-[10px]">{idx + 1}.</span>
                            <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate print:text-[10px] print:ml-1">
                              {bench[idx]?.name || ''}
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}


