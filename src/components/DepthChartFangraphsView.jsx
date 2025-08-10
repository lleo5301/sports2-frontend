import React from 'react'

// A compact, Fangraphs-style depth chart board with position boxes around a field
// Props: depthChart (with DepthChartPositions)
export default function DepthChartFangraphsView({ depthChart }) {
  const positions = depthChart?.DepthChartPositions || []

  const byCode = (code) => {
    const pos = positions.find((p) => p.position_code === code)
    const players = (pos?.DepthChartPlayers || []).sort((a, b) => a.depth_order - b.depth_order)
    return players.map((a) => ({
      id: a.id,
      name: `${a.Player?.first_name || ''} ${a.Player?.last_name || ''}`.trim(),
      depth: a.depth_order
    }))
  }

  // Weight depth order to simple percentages (rough mimic)
  const weights = { 1: 70, 2: 20, 3: 10, 4: 6, 5: 4 }
  const withPercents = (arr) => {
    const w = arr.map((p) => weights[p.depth] ?? 2)
    const total = w.reduce((s, n) => s + n, 0) || 1
    return arr.map((p, i) => ({ ...p, pct: Math.round((w[i] / total) * 100) }))
  }

  const renderBox = (title, rows) => (
    <div className="w-[240px] bg-white/95 border border-gray-400 rounded-lg shadow-lg backdrop-blur-sm" data-testid={`position-box-${title}`}>
      <div className="bg-orange-500 text-white text-sm font-semibold px-3 py-2 rounded-t-lg">{title}</div>
      <div className="p-3 text-sm min-h-[180px]">
        <ul className="space-y-1.5">
          {rows.slice(0, 8).map((p) => (
            <li key={p.id} className="flex justify-between gap-3" data-testid={`player-${p.name.replace(/\s+/g, '-')}`}>
              <span className="text-gray-800 font-medium flex-1 min-w-0">{p.name}</span>
              <span className="text-blue-600 font-semibold text-xs bg-blue-50 px-2 py-0.5 rounded">{p.pct}%</span>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="text-gray-400 italic text-center py-4" data-testid="no-players">No players assigned</li>
          )}
        </ul>
      </div>
    </div>
  )

  // Precompute rows
  const LF = withPercents(byCode('LF'))
  const CF = withPercents(byCode('CF'))
  const RF = withPercents(byCode('RF'))
  const SS = withPercents(byCode('SS'))
  const _2B = withPercents(byCode('2B'))
  const _3B = withPercents(byCode('3B'))
  const _1B = withPercents(byCode('1B'))
  const C = withPercents(byCode('C'))
  const RP = withPercents(byCode('P')) // relief/overall pitchers list

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[1100px] rounded-xl border-2 border-gray-600 shadow-xl overflow-hidden" data-testid="fangraphs-depth-chart">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg,#b7e4c7 0%, #95d5b2 100%)'
      }} />
      {/* Baseball field */}
      <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" data-testid="baseball-field-svg">
        {/* Outfield grass (semicircle) */}
        <path d="M 10 70 A 40 40 0 0 1 90 70 L 50 100 Z" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" data-testid="outfield-area" />
        {/* Infield dirt */}
        <path d="M 28 70 A 22 22 0 0 1 72 70 L 50 92 Z" fill="#d97706" stroke="#92400e" strokeWidth="1" data-testid="infield-dirt" />
        {/* Baselines (diamond) */}
        <line x1="50" y1="92" x2="75" y2="70" stroke="#ffffff" strokeWidth="1.8" data-testid="baseline-1b" />
        <line x1="75" y1="70" x2="50" y2="48" stroke="#ffffff" strokeWidth="1.8" data-testid="baseline-2b" />
        <line x1="50" y1="48" x2="25" y2="70" stroke="#ffffff" strokeWidth="1.8" data-testid="baseline-3b" />
        <line x1="25" y1="70" x2="50" y2="92" stroke="#ffffff" strokeWidth="1.8" data-testid="baseline-home" />
        {/* Foul lines */}
        <line x1="50" y1="92" x2="95" y2="70" stroke="#ffffff" strokeWidth="2" data-testid="foul-line-right" />
        <line x1="50" y1="92" x2="5" y2="70" stroke="#ffffff" strokeWidth="2" data-testid="foul-line-left" />
        {/* Bases */}
        <rect x="48" y="46" width="4" height="4" fill="#fff" transform="rotate(45 50 48)" data-testid="second-base" />
        <rect x="73" y="68" width="4" height="4" fill="#fff" transform="rotate(45 75 70)" data-testid="first-base" />
        <rect x="23" y="68" width="4" height="4" fill="#fff" transform="rotate(45 25 70)" data-testid="third-base" />
        {/* Mound & plate */}
        <circle cx="50" cy="63" r="2.2" fill="#d1a06a" stroke="#92400e" strokeWidth="0.6" data-testid="pitchers-mound" />
        <polygon points="46,94 54,94 54,97 50,100 46,97" fill="#ffffff" stroke="#374151" strokeWidth="0.6" data-testid="home-plate" />
      </svg>

      {/* Top row - Outfield */}
      <div className="absolute top-8 left-8" data-testid="position-lf">{renderBox('LF', LF)}</div>
      <div className="absolute top-8 left-1/2 -translate-x-1/2" data-testid="position-cf">{renderBox('CF', CF)}</div>
      <div className="absolute top-8 right-8" data-testid="position-rf">{renderBox('RF', RF)}</div>

      {/* Middle row - Middle infield */}
      <div className="absolute top-[280px] left-[120px]" data-testid="position-ss">{renderBox('SS', SS)}</div>
      <div className="absolute top-[280px] right-[120px]" data-testid="position-2b">{renderBox('2B', _2B)}</div>

      {/* Bottom infield corners */}
      <div className="absolute top-[540px] left-[80px]" data-testid="position-3b">{renderBox('3B', _3B)}</div>
      <div className="absolute top-[540px] right-[80px]" data-testid="position-1b">{renderBox('1B', _1B)}</div>

      {/* Catcher */}
      <div className="absolute top-[820px] left-1/2 -translate-x-1/2" data-testid="position-c">{renderBox('C', C)}</div>

      {/* Relief Pitchers column */}
      <div className="absolute top-[820px] right-[60px]" data-testid="position-rp">{renderBox('RP', RP)}</div>
    </div>
  )
}


