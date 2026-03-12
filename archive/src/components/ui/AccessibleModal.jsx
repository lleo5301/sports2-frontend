import { Button } from '@heroui/react';
import useModalAccessibility from '../../hooks/useModalAccessibility';

/**
 * AccessibleModal - A fully accessible modal component with focus trapping,
 * keyboard navigation, and proper ARIA attributes.
 *
 * Features:
 * - Focus trapping with Tab/Shift+Tab
 * - Escape key to close
 * - Backdrop click to close
 * - Body scroll lock
 * - Focus restoration on close
 * - Proper ARIA attributes for screen readers
 * - Configurable sizes (sm, md, lg, xl)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {string} props.title - Modal title (used for aria-labelledby)
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', or 'xl' (default: 'md')
 * @param {string} props.className - Additional classes for the modal box
 * @param {React.ReactNode} props.children - Modal content
 */
const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const modalRef = useModalAccessibility(isOpen, onClose);

  if (!isOpen) return null;

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Generate unique ID for aria-labelledby
  const titleId = title ? `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <div className="modal modal-open">
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        ref={modalRef}
        className={`modal-box ${sizeClass} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * ModalHeader - Header component for the modal
 * @param {Object} props
 * @param {string} props.title - The title text
 * @param {Function} props.onClose - Optional close handler to show close button
 * @param {string} props.className - Additional classes
 */
const ModalHeader = ({ title, onClose, className = '', children }) => {
  // Generate unique ID for the title
  const titleId = title ? `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {title && (
        <h3 id={titleId} className="font-bold text-lg">
          {title}
        </h3>
      )}
      {children}
      {onClose && (
        <Button type="button" onClick={onClose} className="absolute right-2 top-2 rounded-full" aria-label="Close modal" size="sm" variant="light" isIconOnly>
          ✕
        </Button>
      )}
    </div>
  );
};

/**
 * ModalContent - Content area for the modal
 * @param {Object} props
 * @param {string} props.className - Additional classes
 */
const ModalContent = ({ className = '', children }) => {
  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
};

/**
 * ModalFooter - Footer/action area for the modal
 * @param {Object} props
 * @param {string} props.className - Additional classes
 */
const ModalFooter = ({ className = '', children }) => {
  return (
    <div className={`modal-action ${className}`}>
      {children}
    </div>
  );
};

// Attach subcomponents
AccessibleModal.Header = ModalHeader;
AccessibleModal.Content = ModalContent;
AccessibleModal.Footer = ModalFooter;

export default AccessibleModal;
