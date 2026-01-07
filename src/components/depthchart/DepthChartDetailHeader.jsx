/**
 * Depth Chart Detail Header Component
 *
 * Displays the header section for a selected depth chart, including
 * the chart name, description, metadata (version, creator, effective date),
 * and navigation tabs for different views (Chart, Positions, History, Permissions).
 */

import { Layers, Settings, History, Shield } from 'lucide-react';

/**
 * DepthChartDetailHeader - Displays chart details and navigation tabs
 * @param {Object} props - Component props
 * @param {Object} props.depthChart - The depth chart object to display
 * @param {string} props.activeTab - The currently active tab ('chart', 'positions', 'history', 'permissions')
 * @param {Function} props.onTabChange - Callback when user changes tabs (receives tab name)
 * @param {boolean} props.canManagePositions - Whether user can manage positions (controls Positions tab visibility)
 */
export default function DepthChartDetailHeader({
  depthChart,
  activeTab,
  onTabChange,
  canManagePositions
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{depthChart.name}</h2>
          {depthChart.description && (
            <p className="text-gray-600 mt-1">{depthChart.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Version {depthChart.version}</span>
          <span>Created by {depthChart.Creator?.first_name} {depthChart.Creator?.last_name}</span>
          {depthChart.effective_date && (
            <span>Effective {new Date(depthChart.effective_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === 'chart' ? 'tab-active' : ''}`}
          onClick={() => onTabChange('chart')}
        >
          <Layers className="h-4 w-4 mr-2" />
          Chart
        </button>
        {canManagePositions && (
          <button
            className={`tab ${activeTab === 'positions' ? 'tab-active' : ''}`}
            onClick={() => onTabChange('positions')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Positions
          </button>
        )}
        <button
          className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          <History className="h-4 w-4 mr-2" />
          History
        </button>
        <button
          className={`tab ${activeTab === 'permissions' ? 'tab-active' : ''}`}
          onClick={() => onTabChange('permissions')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Permissions
        </button>
      </div>
    </div>
  );
}
