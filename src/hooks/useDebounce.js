import { useState, useEffect } from 'react'

/**
 * Custom hook to debounce a value
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 *
 * // Use debouncedSearchTerm for API calls
 * useEffect(() => {
 *   fetchData(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set up the timeout to update the debounced value
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function that runs when value changes or component unmounts
    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
