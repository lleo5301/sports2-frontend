/**
 * Depth Chart Page Header Component
 *
 * Displays the main page header for the Depth Chart page, including
 * the title, description, and action buttons for creating and editing
 * depth charts.
 */

import { Plus, Edit } from 'lucide-react';

/**
 * DepthChartPageHeader - Displays the page header with title and action buttons
 * @param {Object} props - Component props
 * @param {boolean} props.canCreate - Whether user can create depth charts
 * @param {boolean} props.canEdit - Whether user can edit depth charts
 * @param {number|null} props.selectedDepthChart - ID of the currently selected depth chart
 * @param {Function} props.onCreateClick - Callback when user clicks create button
 * @param {Function} props.onEditClick - Callback when user clicks edit button
 * @param {boolean} props.isCreating - Whether a depth chart creation is in progress
 */
export default function DepthChartPageHeader({
  canCreate,
  canEdit,
  selectedDepthChart,
  onCreateClick,
  onEditClick,
  isCreating
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Depth Chart</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team&apos;s depth chart configurations and player assignments.
        </p>
      </div>
      <div className="flex gap-2">
        {canCreate && (
          <button
            onClick={onCreateClick}
            className="btn btn-primary"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Depth Chart
          </button>
        )}
        {canEdit && selectedDepthChart && (
          <button
            onClick={onEditClick}
            className="btn btn-outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
