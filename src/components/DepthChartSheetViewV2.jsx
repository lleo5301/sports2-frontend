import { Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export default function DepthChartSheetViewV2({ depthChart }) {
  const positions = depthChart?.DepthChartPositions || [];

  const byCode = (code) => {
    const pos = positions.find((p) => p.position_code === code);
    return (pos?.DepthChartPlayers || [])
      .sort((a, b) => a.depth_order - b.depth_order)
      .map((a) => ({
        id: a.id,
        name: `${a.Player?.first_name || ''} ${a.Player?.last_name || ''}`.trim(),
        depth: a.depth_order
      }));
  };

  const take = (arr, n) => arr.slice(0, n);

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Export as image
  const handleExportImage = async () => {
    try {
      const element = document.getElementById('depth-chart-sheet-v2');
      if (!element) {
        toast.error('Unable to find depth chart element');
        return;
      }

      toast.loading('Generating image...', { id: 'export' });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `depth-chart-v2-${depthChart?.name || 'sheet'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Depth chart exported successfully!', { id: 'export' });
    } catch (error) {
      toast.error('Failed to export depth chart', { id: 'export' });
    }
  };

  // Map position codes to full names
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
  };
  const nameFor = (code) => positions.find((p) => p.position_code === code)?.position_name || fallbackNames[code] || code;

  // Get players by position
  const pitchers = byCode('P');
  const catcher = byCode('C');
  const first = byCode('1B');
  const second = byCode('2B');
  const third = byCode('3B');
  const short = byCode('SS');
  const left = byCode('LF');
  const center = byCode('CF');
  const right = byCode('RF');
  const dh = byCode('DH');

  // Build starters and subs
  const orderCodes = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
  const starters = orderCodes.map((c) => byCode(c)[0]).filter(Boolean);
  const subs = orderCodes.map((c) => byCode(c)[1]).filter(Boolean);

  // Bench players
  const usedStarterIds = new Set(starters.map((p) => p.id));
  const bench = positions
    .flatMap((p) => p.DepthChartPlayers || [])
    .sort((a, b) => a.depth_order - b.depth_order)
    .map((a) => ({ id: a.id, name: `${a.Player?.first_name || ''} ${a.Player?.last_name || ''}`.trim() }))
    .filter((a) => !usedStarterIds.has(a.id));

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-foreground">Depth Chart - Sheet View V2</h2>
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
        id="depth-chart-sheet-v2"
        className="depth-chart-container"
      >
        <style>{`
          .depth-chart-container {
            display: grid;
            grid-template-columns: repeat(14, 1fr);
            grid-template-rows: auto repeat(8, 1fr) auto;
            gap: 1rem;
            min-height: 80vh;
            max-width: 100%;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
            padding: 2rem;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
          }

          .position-card {
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            min-height: 120px;
          }

          .position-title {
            font-weight: 700;
            text-align: center;
            margin-bottom: 0.75rem;
            color: #1f2937;
            font-size: 0.875rem;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 0.5rem;
          }

          .player-list {
            list-style: none;
            margin: 0;
            padding: 0;
            flex: 1;
            overflow-y: auto;
          }

          .player-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            min-height: 24px;
          }

          .player-number {
            width: 1.5rem;
            color: #6b7280;
            font-weight: 600;
            flex-shrink: 0;
          }

          .player-name {
            flex: 1;
            border-bottom: 1px dashed #d1d5db;
            padding-bottom: 2px;
            color: #374151;
            font-weight: 500;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          /* Chart Title */
          .chart-title {
            grid-column: 1 / -1;
            text-align: center;
            font-size: 1.875rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          /* Outfield */
          .left-field { grid-column: 1 / 4; grid-row: 2; }
          .center-field { grid-column: 6 / 10; grid-row: 2; }
          .right-field { grid-column: 12 / 15; grid-row: 2; }

          /* Infield */
          .shortstop { grid-column: 1 / 4; grid-row: 3; }
          .second-base { grid-column: 12 / 15; grid-row: 3; }
          .third-base { grid-column: 1 / 4; grid-row: 4; }
          .first-base { grid-column: 12 / 15; grid-row: 4; }

          /* Pitchers */
          .pitchers-main { grid-column: 6 / 10; grid-row: 3 / 6; }
          .starting-relief { grid-column: 1 / 4; grid-row: 5 / 7; }
          .closer { grid-column: 1 / 4; grid-row: 7; }

          /* Catcher */
          .catcher { grid-column: 6 / 10; grid-row: 6; }

          /* Batting Order - Wider for better content fit */
          .batting-order { grid-column: 11 / 15; grid-row: 5 / 9; }

          /* Bench */
          .bench { grid-column: 1 / -1; grid-row: 10; }

          /* Special styling for batting order */
          .batting-order-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            height: 100%;
          }

          .batting-section {
            display: flex;
            flex-direction: column;
          }

          .batting-section h4 {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #374151;
            text-align: center;
            font-size: 0.75rem;
          }

          .batting-list {
            flex: 1;
            overflow-y: auto;
          }

          /* Bench grid */
          .bench-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            height: 100%;
          }

          /* Print styles */
          @media print {
            .depth-chart-container {
              min-height: auto;
              height: auto;
              page-break-inside: avoid;
            }
            
            .position-card {
              page-break-inside: avoid;
            }
            
            .chart-title {
              font-size: 1.5rem;
            }
            
            .position-title {
              font-size: 0.75rem;
            }
            
            .player-name {
              font-size: 0.75rem;
            }
          }
        `}</style>

        {/* Chart Title */}
        <div className="chart-title">
          {depthChart?.name || 'Team Depth Chart'}
        </div>

        {/* Left Field */}
        <div className="left-field position-card">
          <div className="position-title">{nameFor('LF')}</div>
          <ol className="player-list">
            {take(left, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Center Field */}
        <div className="center-field position-card">
          <div className="position-title">{nameFor('CF')}</div>
          <ol className="player-list">
            {take(center, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right Field */}
        <div className="right-field position-card">
          <div className="position-title">{nameFor('RF')}</div>
          <ol className="player-list">
            {take(right, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Shortstop */}
        <div className="shortstop position-card">
          <div className="position-title">{nameFor('SS')}</div>
          <ol className="player-list">
            {take(short, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Main Pitchers List */}
        <div className="pitchers-main position-card">
          <div className="position-title">{nameFor('P')}s</div>
          <ol className="player-list">
            {take(pitchers, 12).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.625rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '0.5rem'
          }}>
            <span>A - Available</span>
            <span>N/A - Not Available</span>
          </div>
        </div>

        {/* Second Base */}
        <div className="second-base position-card">
          <div className="position-title">{nameFor('2B')}</div>
          <ol className="player-list">
            {take(second, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Third Base */}
        <div className="third-base position-card">
          <div className="position-title">{nameFor('3B')}</div>
          <ol className="player-list">
            {take(third, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Starting Pitcher/Relief */}
        <div className="starting-relief position-card">
          <div className="position-title">Starting Pitcher/Relief</div>
          <ol className="player-list">
            {take(pitchers, 6).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* First Base */}
        <div className="first-base position-card">
          <div className="position-title">{nameFor('1B')}</div>
          <ol className="player-list">
            {take(first, 3).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Catcher */}
        <div className="catcher position-card">
          <div className="position-title">{nameFor('C')}</div>
          <ol className="player-list">
            {take(catcher, 4).map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}.</span>
                <div className="player-name">{player.name}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Closer */}
        <div className="closer position-card">
          <div className="position-title">Closer</div>
          <div style={{
            borderBottom: '2px dashed #d1d5db',
            padding: '0.5rem 0',
            textAlign: 'center',
            fontWeight: '600',
            color: '#374151'
          }}>
            {pitchers[0]?.name || ''}
          </div>
        </div>

        {/* Batting Order */}
        <div className="batting-order position-card">
          <div className="position-title">Batting Order</div>
          <div className="batting-order-container">
            <div className="batting-section">
              <h4>Starters</h4>
              <ol className="batting-list player-list">
                {take(starters, 9).map((player, i) => (
                  <li key={i} className="player-item">
                    <span className="player-number">{i + 1}.</span>
                    <div className="player-name">{player.name}</div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="batting-section">
              <h4>Substitutes</h4>
              <ol className="batting-list player-list">
                {take(subs, 9).map((player, i) => (
                  <li key={i} className="player-item">
                    <span className="player-number">{i + 1}.</span>
                    <div className="player-name">{player.name}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Bench/Player List */}
        <div className="bench position-card">
          <div className="position-title">Bench/Player List</div>
          <div className="bench-grid">
            {[0, 1, 2, 3].map((col) => (
              <ol key={col} className="player-list">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = col * 5 + i;
                  return (
                    <li key={idx} className="player-item">
                      <span className="player-number">{idx + 1}.</span>
                      <div className="player-name">{bench[idx]?.name || ''}</div>
                    </li>
                  );
                })}
              </ol>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
