import { Button } from '@heroui/react';
/**
 * Permissions Request Modal Component
 *
 * A modal dialog for requesting additional permissions for depth chart management.
 * Displays information about required permissions and how to contact an administrator.
 */

import AccessibleModal from '../ui/AccessibleModal';

/**
 * PermissionsRequestModal - Modal for requesting depth chart permissions
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 */
export default function PermissionsRequestModal({
  isOpen,
  onClose
}) {
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Permissions"
      size="md"
    >
      <AccessibleModal.Header
        title="Request Permissions"
        onClose={onClose}
      />
      <AccessibleModal.Content>
        <div className="space-y-4">
          <p className="text-gray-600">
            To request additional permissions for depth chart management, please contact your team administrator.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Required Permissions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• depth_chart_create - Create new depth charts</li>
              <li>• depth_chart_edit - Edit existing depth charts</li>
              <li>• depth_chart_delete - Delete depth charts</li>
              <li>• depth_chart_manage_positions - Manage position configurations</li>
              <li>• player_assign - Assign players to positions</li>
              <li>• player_unassign - Remove players from positions</li>
            </ul>
          </div>
        </div>
      </AccessibleModal.Content>
      <AccessibleModal.Footer>
        <Button
          onClick={onClose}>
          Close
        </Button>
      </AccessibleModal.Footer>
    </AccessibleModal>
  );
}
