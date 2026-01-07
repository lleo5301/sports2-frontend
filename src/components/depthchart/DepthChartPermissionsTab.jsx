/**
 * Depth Chart Permissions Tab Component
 *
 * Displays the current user's permissions for depth chart management,
 * showing which actions they can perform and providing a way to request
 * additional permissions.
 */

import { CheckCircle, X, Shield } from 'lucide-react';

/**
 * DepthChartPermissionsTab - Displays user permissions for depth chart management
 * @param {Object} props - Component props
 * @param {Object} props.permissions - Object containing permission flags
 * @param {boolean} props.permissions.canView - Whether user can view depth charts
 * @param {boolean} props.permissions.canCreate - Whether user can create depth charts
 * @param {boolean} props.permissions.canEdit - Whether user can edit depth charts
 * @param {boolean} props.permissions.canDelete - Whether user can delete depth charts
 * @param {boolean} props.permissions.canManagePositions - Whether user can manage positions
 * @param {boolean} props.permissions.canAssignPlayers - Whether user can assign players
 * @param {boolean} props.permissions.canUnassignPlayers - Whether user can unassign players
 * @param {Function} props.onRequestPermissions - Callback when user clicks request permissions button
 */
export default function DepthChartPermissionsTab({ permissions, onRequestPermissions }) {
  const {
    canView,
    canCreate,
    canEdit,
    canDelete,
    canManagePositions,
    canAssignPlayers,
    canUnassignPlayers
  } = permissions;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Access Permissions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium">Your Permissions</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {canView ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">View Depth Charts</span>
            </div>
            <div className="flex items-center gap-2">
              {canCreate ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Create Depth Charts</span>
            </div>
            <div className="flex items-center gap-2">
              {canEdit ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Edit Depth Charts</span>
            </div>
            <div className="flex items-center gap-2">
              {canDelete ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Delete Depth Charts</span>
            </div>
            <div className="flex items-center gap-2">
              {canManagePositions ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Manage Positions</span>
            </div>
            <div className="flex items-center gap-2">
              {canAssignPlayers ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Assign Players</span>
            </div>
            <div className="flex items-center gap-2">
              {canUnassignPlayers ? <CheckCircle className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Unassign Players</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Need More Access?</h4>
          <p className="text-sm text-gray-600 mb-4">
            Contact your team administrator to request additional permissions for depth chart management.
          </p>
          <button
            onClick={onRequestPermissions}
            className="btn btn-outline btn-sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Request Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
