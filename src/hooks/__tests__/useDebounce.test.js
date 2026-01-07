<<<<<<< HEAD
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
=======
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce.js';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should return debounced value after delay period', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 300 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Advance timers by the delay amount
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should only trigger one update for rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Simulate rapid typing
    rerender({ value: 'a' });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: 'ab' });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: 'abc' });
    act(() => { vi.advanceTimersByTime(100); });

    // Still showing initial value
    expect(result.current).toBe('initial');

    rerender({ value: 'abcd' });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: 'abcde' });

    // Value still hasn't updated because we haven't waited full 300ms
    expect(result.current).toBe('initial');

    // Now advance 300ms from the last change
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should update to the final value only
    expect(result.current).toBe('abcde');
  });

  it('should properly clean up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Value should still be 'initial' before timeout completes
    expect(result.current).toBe('initial');

    // Unmount before the timeout completes
    unmount();

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Advance timers - this should not cause any issues since cleanup happened
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // After unmount, result.current still shows last value before unmount
    expect(result.current).toBe('initial');
  });

  it('should handle custom delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Should not update after 300ms (default delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Should update after 500ms (custom delay)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should use default delay of 300ms when delay is not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    // Should not update immediately
    expect(result.current).toBe('initial');

    // Should update after default 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle different data types', () => {
    // Test with numbers
    const { result: numResult, rerender: numRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    numRerender({ value: 42 });
    act(() => { vi.advanceTimersByTime(300); });
    expect(numResult.current).toBe(42);

    // Test with objects
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { name: 'initial' } } }
    );

    const newObj = { name: 'updated' };
    objRerender({ value: newObj });
    act(() => { vi.advanceTimersByTime(300); });
    expect(objResult.current).toEqual(newObj);

    // Test with arrays
    const { result: arrResult, rerender: arrRerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: [1, 2, 3] } }
    );

    const newArr = [4, 5, 6];
    arrRerender({ value: newArr });
    act(() => { vi.advanceTimersByTime(300); });
    expect(arrResult.current).toEqual(newArr);
  });

  it('should reset debounce timer when delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // Advance time partially
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Change the delay (this should reset the timer)
    rerender({ value: 'updated', delay: 500 });

    // Original 300ms delay should not trigger
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('initial');

    // New 500ms delay should trigger
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle empty string values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'text' } }
    );

    rerender({ value: '' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('');
  });

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: null });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe(null);

    rerender({ value: undefined });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe(undefined);
  });
});
>>>>>>> auto-claude/026-add-search-input-debouncing-to-prevent-api-request
