import { useEffect, useRef } from 'react';

/**
 * Custom hook for modal accessibility features
 * Handles focus trapping, escape key detection, and scroll lock
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Callback to close the modal
 * @returns {Object} - Reference to be attached to the modal container
 */
const useModalAccessibility = (isOpen, onClose) => {
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before the modal opened
    previousActiveElementRef.current = document.activeElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus the modal container or first focusable element
    const focusModal = () => {
      if (modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(focusModal, 10);

    // Handle escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    // Handle tab key for focus trapping
    const handleTab = (event) => {
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);

      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;

      // Return focus to the element that opened the modal
      if (previousActiveElementRef.current && previousActiveElementRef.current.focus) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  return modalRef;
};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - The container element
 * @returns {Array} - Array of focusable elements
 */
const getFocusableElements = (container) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const elements = container.querySelectorAll(focusableSelectors.join(','));

  // Filter out elements that are not visible
  return Array.from(elements).filter(element => {
    return element.offsetParent !== null &&
           getComputedStyle(element).visibility !== 'hidden';
  });
};

export default useModalAccessibility;
