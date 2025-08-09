import React from 'react'

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

  const listBox = (title, items = [], lines = 3) => (
    <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0">
      {title && <div className="font-semibold text-center mb-2">{title}</div>}
      <ol className="text-sm space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <li key={i} className="flex items-center">
            <span className="w-5 text-gray-400">{i + 1}.</span>
            <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
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
    <div className="relative w-full max-w-[980px] mx-auto print:w-[816px] print:h-[1056px]">
      {/* Background field tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-200/60 via-green-100/60 to-green-50/60 rounded-lg" />

      <div className="relative p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Depth Chart</h2>

        {/* Letter size ~ 816x1056 px at 96 DPI. A4 ~ 794x1123. Choose 980x1200 for on-screen, scale in print. */}
        <div className="relative h-[1200px] bg-gradient-to-b from-white/50 to-white/30 rounded-lg border border-gray-200">
          <div className="absolute inset-0 p-6 grid grid-cols-12 grid-rows-12 gap-4">
            {/* Top row: LF - CF - RF */}
            <div className="col-span-3 row-span-2">{listBox('LF', take(left, 3))}</div>
            <div className="col-start-5 col-span-4 row-span-2">{listBox('CF', take(center, 3))}</div>
            <div className="col-start-10 col-span-3 row-span-2">{listBox('RF', take(right, 3))}</div>

            {/* Mid row between outfield and bases: SS and 2B */}
            <div className="col-start-2 col-span-3 row-start-4 row-span-2">{listBox('SS', take(short, 3))}</div>
            <div className="col-start-9 col-span-3 row-start-4 row-span-2">{listBox('2B', take(second, 3))}</div>

            {/* Infield corners: 3B and 1B */}
            <div className="col-start-2 col-span-3 row-start-6 row-span-2">{listBox('3B', take(third, 3))}</div>
            <div className="col-start-9 col-span-3 row-start-6 row-span-2">{listBox('1B', take(first, 3))}</div>

            {/* Center column: Starting Pitcher/Relief & Closer */}
            <div className="col-start-5 col-span-4 row-start-6 row-span-3 flex flex-col">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0">
                <div className="font-semibold text-center mb-2">Starting Pitcher/Relief</div>
                <ol className="text-sm space-y-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-5 text-gray-400">{i + 1}.</span>
                      <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
                        {pitchers[i]?.name || ''}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 mt-3 w-full min-w-0">
                <div className="font-semibold text-center mb-2">Closer</div>
                <div className="border-b border-dashed border-gray-300 h-6 text-sm text-gray-800 truncate">
                  {pitchers[0]?.name || ''}
                </div>
              </div>
            </div>

            {/* Catcher below home area */}
            <div className="col-start-5 col-span-4 row-start-9 row-span-2">{listBox('C', take(catcher, 4), 4)}</div>

            {/* Left pane: Pitchers list */}
            <div className="col-start-1 col-span-4 row-start-6 row-span-6">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full">
                <div className="font-semibold text-center mb-2">Pitchers</div>
                <ol className="text-sm space-y-1 max-h-full overflow-y-auto pr-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-5 text-gray-400">{i + 1}.</span>
                      <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
                        {pitchers[i]?.name || ''}
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="flex justify-between text-[11px] text-gray-500 mt-2">
                  <span>A - Available</span>
                  <span>N/A - Not Available</span>
                </div>
              </div>
            </div>

            {/* Right pane: Batting Order Starters/Sub */}
            <div className="col-start-9 col-span-4 row-start-6 row-span-6">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full">
                <div className="font-semibold text-center mb-2">Batting Order</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold mb-1">Starters</div>
                    <ol className="text-sm space-y-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-5 text-gray-400">{i + 1}.</span>
                          <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
                            {starters[i]?.name || ''}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1">Sub</div>
                    <ol className="text-sm space-y-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-5 text-gray-400">{i + 1}.</span>
                          <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
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
            <div className="col-start-2 col-span-10 row-start-11 row-span-2">
              <div className="bg-white/90 border border-gray-300 rounded shadow p-3 w-full min-w-0 h-full">
                <div className="font-semibold text-center mb-2">Bench/Player List</div>
                <div className="grid grid-cols-3 gap-6 h-full">
                  {[0, 1, 2].map((col) => (
                    <ol key={col} className="text-sm space-y-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const idx = col * 5 + i
                        return (
                          <li key={idx} className="flex items-center">
                            <span className="w-5 text-gray-400">{idx + 1}.</span>
                            <div className="flex-1 border-b border-dashed border-gray-300 ml-2 text-gray-800 truncate">
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
  )
}


