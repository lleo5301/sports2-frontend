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
