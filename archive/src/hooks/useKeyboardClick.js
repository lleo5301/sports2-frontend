import { useCallback } from 'react';

/**
 * Custom hook for keyboard accessibility on clickable elements.
 * Provides keyboard event handling for elements that should be clickable via Enter or Space keys.
 *
 * @param {Function} onClick - The callback function to trigger on click/keyboard activation
 * @returns {Object} Accessibility props including onKeyDown handler, tabIndex, and role
 *
 * @example
 * const clickableProps = useKeyboardClick(() => navigate('/player/123'));
 * return <div {...clickableProps} onClick={() => navigate('/player/123')}>Player Card</div>
 */
export function useKeyboardClick(onClick) {
  const handleKeyDown = useCallback((event) => {
    // Trigger onClick callback on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      // Prevent default behavior for Space key to avoid page scroll
      event.preventDefault();

      if (onClick) {
        onClick(event);
      }
    }
  }, [onClick]);

  return {
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: 'button'
  };
}
