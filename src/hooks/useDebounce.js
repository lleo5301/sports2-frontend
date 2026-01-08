import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * Returns a debounced version of the value that only updates after the specified delay of inactivity.
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=300] - The delay in milliseconds before updating the debounced value
 * @returns {*} The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   if (debouncedSearchTerm) {
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear the timeout if value or delay changes
    // This prevents the debounced value from updating if the value changes again
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
