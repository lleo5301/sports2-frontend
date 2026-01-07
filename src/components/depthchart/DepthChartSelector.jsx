/**
 * Depth Chart Selector Component
 *
 * Displays a grid of selectable depth chart cards with action buttons
 * for editing, deleting, and duplicating depth charts. Highlights the
 * currently selected chart.
 */

import { Edit, Trash2, Copy } from 'lucide-react';

/**
 * DepthChartSelector - Displays a grid of selectable depth chart cards
 * @param {Object} props - Component props
 * @param {Array} props.depthCharts - Array of depth chart objects to display
 * @param {number|null} props.selectedDepthChart - ID of the currently selected depth chart
 * @param {Function} props.onSelect - Callback when user selects a depth chart (receives chart ID)
 * @param {boolean} props.canEdit - Whether user can edit depth charts
 * @param {boolean} props.canDelete - Whether user can delete depth charts
 * @param {boolean} props.canCreate - Whether user can create depth charts (for duplicate)
 * @param {Function} props.onEdit - Callback when user clicks edit button
 * @param {Function} props.onDelete - Callback when user clicks delete button (receives chart ID)
 * @param {Function} props.onDuplicate - Callback when user clicks duplicate button (receives chart ID)
 * @param {boolean} props.isDeleting - Whether a delete operation is in progress
 * @param {boolean} props.isDuplicating - Whether a duplicate operation is in progress
 */
export default function DepthChartSelector({
  depthCharts = [],
  selectedDepthChart,
  onSelect,
  canEdit,
  canDelete,
  canCreate,
  onEdit,
  onDelete,
  onDuplicate,
  isDeleting = false,
  isDuplicating = false
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Select Depth Chart</h2>
        <div className="flex gap-2">
          {canEdit && selectedDepthChart && (
            <button
              onClick={onEdit}
              className="btn btn-outline btn-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
          )}
          {canDelete && selectedDepthChart && (
            <button
              onClick={() => onDelete(selectedDepthChart)}
              className="btn btn-outline btn-sm btn-error"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
          {canCreate && selectedDepthChart && (
            <button
              onClick={() => onDuplicate(selectedDepthChart)}
              className="btn btn-outline btn-sm"
              disabled={isDuplicating}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depthCharts.map((chart) => (
          <div
            key={chart.id}
            className={`card cursor-pointer transition-all ${
              selectedDepthChart === chart.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelect(chart.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{chart.name}</h3>
                <div className="flex items-center gap-1">
                  {chart.is_default && (
                    <span className="badge badge-primary badge-sm">Default</span>
                  )}
                  {!chart.is_active && (
                    <span className="badge badge-ghost badge-sm">Archived</span>
                  )}
                </div>
              </div>
              {chart.description && (
                <p className="text-sm text-gray-600 mb-2">{chart.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>v{chart.version}</span>
                <span>{chart.DepthChartPositions?.length || 0} positions</span>
              </div>
              {chart.effective_date && (
                <div className="text-xs text-gray-400 mt-1">
                  Effective: {new Date(chart.effective_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
