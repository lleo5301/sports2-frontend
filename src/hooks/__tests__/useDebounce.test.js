import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns initial value immediately on first render', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('returns debounced value after default delay (300ms)', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated' })

    // Value should still be 'initial' immediately after update
    expect(result.current).toBe('initial')

    // Advance timers by 300ms
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Now the value should be updated
    expect(result.current).toBe('updated')
  })

  it('returns debounced value after custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Value should still be 'initial' immediately
    expect(result.current).toBe('initial')

    // Advance by less than the delay
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // Advance to complete the delay
    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout when value changes rapidly', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    expect(result.current).toBe('first')

    // First update
    rerender({ value: 'second' })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    // Second update before first timeout completes
    rerender({ value: 'third' })
    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    // Third update before second timeout completes
    rerender({ value: 'fourth' })

    // Value should still be 'first'
    expect(result.current).toBe('first')

    // Complete the timeout
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Should only have the last value, not intermediate ones
    expect(result.current).toBe('fourth')
  })

  it('cleans up timeout on component unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })

    // Unmount before timeout completes
    unmount()

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('handles multiple rapid updates and only applies the last one', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'v1' } }
    )

    expect(result.current).toBe('v1')

    // Simulate rapid typing
    rerender({ value: 'v2' })
    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    rerender({ value: 'v3' })
    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    rerender({ value: 'v4' })
    await act(async () => {
      vi.advanceTimersByTime(50)
    })

    rerender({ value: 'v5' })

    // Value should still be initial
    expect(result.current).toBe('v1')

    // Complete the delay from last update
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Should jump directly to final value
    expect(result.current).toBe('v5')
  })

  it('works with different data types', async () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    )

    numberRerender({ value: 42 })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(numberResult.current).toBe(42)

    // Test with objects
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { id: 1 } } }
    )

    const newObj = { id: 2, name: 'test' }
    objectRerender({ value: newObj })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(objectResult.current).toEqual(newObj)

    // Test with arrays
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: [] } }
    )

    const newArray = [1, 2, 3]
    arrayRerender({ value: newArray })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(arrayResult.current).toEqual(newArray)
  })

  it('handles empty string values', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'search term' } }
    )

    expect(result.current).toBe('search term')

    // Clear the search
    rerender({ value: '' })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('')
  })

  it('handles delay change without value change', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 300 } }
    )

    expect(result.current).toBe('test')

    // Change only the delay, not the value
    rerender({ value: 'test', delay: 500 })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Value should update after new delay
    expect(result.current).toBe('test')
  })

  it('updates immediately when delay is 0', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    await act(async () => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })

  it('does not update when value remains the same', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'same' } }
    )

    expect(result.current).toBe('same')

    // Rerender with same value
    rerender({ value: 'same' })
    vi.advanceTimersByTime(300)

    // Value should still be the same (this is expected behavior)
    expect(result.current).toBe('same')
  })
})
