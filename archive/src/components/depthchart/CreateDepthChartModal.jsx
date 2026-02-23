/**
 * Create Depth Chart Modal Component
 *
 * A modal dialog for creating new depth charts with fields for name,
 * description, effective date, notes, and default status.
 */

import AccessibleModal from '../ui/AccessibleModal';
import { Checkbox, Button } from '@heroui/react';

/**
 * CreateDepthChartModal - Modal for creating a new depth chart
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.formData - Form data object with name, description, effective_date, notes, is_default
 * @param {Function} props.onFormChange - Callback to update form data
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {boolean} props.isLoading - Whether the form is submitting
 */
export default function CreateDepthChartModal({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isLoading
}) {
  const handleFieldChange = (field, value) => {
    onFormChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Depth Chart"
      size="md"
    >
      <AccessibleModal.Header
        title="Create New Depth Chart"
        onClose={onClose}
      />
      <AccessibleModal.Content>
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g., Spring Training 2024"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Effective Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.effective_date}
              onChange={(e) => handleFieldChange('effective_date', e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Optional notes"
              rows={2}
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Set as default depth chart</span>
              <Checkbox isSelected={formData.is_default} onValueChange={(val) => handleFieldChange('is_default', val)} color="primary" />
            </label>
          </div>
        </div>
      </AccessibleModal.Content>
      <AccessibleModal.Footer>
        <Button
          onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!formData.name || isLoading} color="primary">
          {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </AccessibleModal.Footer>
    </AccessibleModal>
  );
}
