/**
 * Depth Chart View Toggle Component
 *
 * Provides toggle buttons for switching between different view modes
 * of the depth chart (List View, Pro View, Sheet View, Sheet View V2).
 */

import { Layers, Users } from 'lucide-react';

/**
 * DepthChartViewToggle - Displays view mode toggle buttons
 * @param {Object} props - Component props
 * @param {string} props.chartViewMode - The currently active view mode ('list', 'enhanced', 'sheet', 'sheetv2')
 * @param {Function} props.onViewModeChange - Callback when user changes view mode (receives view mode string)
 */
export default function DepthChartViewToggle({
  chartViewMode,
  onViewModeChange
}) {
  return (
    <div className="flex justify-center">
      <div className="btn-group">
        <button
          className={`btn btn-sm ${chartViewMode === 'list' ? 'btn-active' : 'btn-outline'}`}
          onClick={() => onViewModeChange('list')}
        >
          <Layers className="h-4 w-4 mr-2" />
          List View
        </button>
        <button
          className={`btn btn-sm ${chartViewMode === 'enhanced' ? 'btn-active' : 'btn-outline'}`}
          onClick={() => onViewModeChange('enhanced')}
        >
          <Users className="h-4 w-4 mr-2" />
          Pro View
        </button>
        <button
          className={`btn btn-sm ${chartViewMode === 'sheet' ? 'btn-active' : 'btn-outline'}`}
          onClick={() => onViewModeChange('sheet')}
        >
          <Layers className="h-4 w-4 mr-2" />
          Sheet View
        </button>
        <button
          className={`btn btn-sm ${chartViewMode === 'sheetv2' ? 'btn-active' : 'btn-outline'}`}
          onClick={() => onViewModeChange('sheetv2')}
        >
          <Layers className="h-4 w-4 mr-2" />
          Sheet View V2
        </button>
      </div>
    </div>
  );
}
