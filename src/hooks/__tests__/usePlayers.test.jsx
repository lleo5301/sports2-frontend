import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { usePlayers, usePlayer, playersKeys } from '../usePlayers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePlayers', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.reset();
  });

  it('returns correct data shape with players list', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, name: 'Player 1', position: 'P' },
        { id: 2, name: 'Player 2', position: 'C' }
      ],
      pagination: {
        total: 2,
        pages: 1,
        page: 1,
        limit: 20
      }
    };

    mock.onGet('/players').reply(200, mockResponse);

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse.data);
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    });
    expect(result.current.error).toBe(null);
  });

  it('handles loading state correctly', async () => {
    mock.onGet('/players').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { success: true, data: [] }]), 100);
      });
    });

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('handles error state correctly', async () => {
    mock.onGet('/players').reply(500, {
      success: false,
      message: 'Server error'
    });

    const { result } = renderHook(() => usePlayers(), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.error).not.toBe(null));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('passes pagination params correctly', async () => {
    const mockResponse = {
      success: true,
      data: [],
      pagination: {
        total: 100,
        pages: 5,
        page: 3,
        limit: 20
      }
    };

    mock.onGet('/players', { params: { page: 3, limit: 20 } }).reply(200, mockResponse);

    const { result } = renderHook(() => usePlayers({ page: 3, limit: 20 }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pagination.page).toBe(3);
    expect(result.current.pagination.limit).toBe(20);
  });

  it('passes filter params correctly', async () => {
    const mockResponse = {
      success: true,
      data: [{ id: 1, name: 'John Doe', position: 'P', status: 'active' }],
      pagination: {
        total: 1,
        pages: 1,
        page: 1,
        limit: 20
      }
    };

    let capturedParams = null;
    mock.onGet('/players').reply((config) => {
      capturedParams = config.params;
      return [200, mockResponse];
    });

    const { result } = renderHook(
      () => usePlayers({
        page: 1,
        limit: 20,
        search: 'John',
        position: 'P',
        status: 'active',
        school_type: 'HS'
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(capturedParams).toEqual({
      page: 1,
      limit: 20,
      search: 'John',
      position: 'P',
      status: 'active',
      school_type: 'HS'
    });
  });

  it('filters out empty string params', async () => {
    const mockResponse = {
      success: true,
      data: [],
      pagination: {
        total: 0,
        pages: 0,
        page: 1,
        limit: 20
      }
    };

    let capturedParams = null;
    mock.onGet('/players').reply((config) => {
      capturedParams = config.params;
      return [200, mockResponse];
    });

    const { result } = renderHook(
      () => usePlayers({
        page: 1,
        limit: 20,
        search: '',
        position: '',
        status: 'active',
        school_type: ''
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(capturedParams).toEqual({
      page: 1,
      limit: 20,
      status: 'active'
    });
    expect(capturedParams.search).toBeUndefined();
    expect(capturedParams.position).toBeUndefined();
    expect(capturedParams.school_type).toBeUndefined();
  });

  it('uses correct query key pattern', () => {
    const params = {
      page: 2,
      limit: 10,
      search: 'test',
      position: 'P'
    };

    const queryKey = playersKeys.list(params);
    expect(queryKey).toEqual(['players', 'list', params]);
  });
});

describe('usePlayer', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.reset();
  });

  it('fetches single player by ID', async () => {
    const mockPlayer = {
      id: 123,
      name: 'John Doe',
      position: 'P',
      status: 'active'
    };

    mock.onGet('/players/byId/123').reply(200, mockPlayer);

    const { result } = renderHook(() => usePlayer(123), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockPlayer);
    expect(result.current.error).toBe(null);
  });

  it('returns correct data shape', async () => {
    const mockPlayer = {
      id: 456,
      name: 'Jane Smith',
      position: 'C'
    };

    mock.onGet('/players/byId/456').reply(200, mockPlayer);

    const { result } = renderHook(() => usePlayer(456), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current.data).toEqual(mockPlayer);
  });

  it('handles error state correctly', async () => {
    mock.onGet('/players/byId/999').reply(404, {
      success: false,
      message: 'Player not found'
    });

    const { result } = renderHook(() => usePlayer(999), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.error).not.toBe(null));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('does not fetch when playerId is not provided', async () => {
    const { result } = renderHook(() => usePlayer(null), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mock.history.get.length).toBe(0);
  });

  it('uses enabled option to conditionally fetch', async () => {
    const mockPlayer = { id: 789, name: 'Test Player' };
    mock.onGet('/players/byId/789').reply(200, mockPlayer);

    const { result: result1 } = renderHook(() => usePlayer(789), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result1.current.data).toEqual(mockPlayer));

    const { result: result2 } = renderHook(() => usePlayer(undefined), {
      wrapper: createWrapper()
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result2.current.isLoading).toBe(false);
    expect(result2.current.data).toBeUndefined();
  });

  it('uses correct query key pattern', () => {
    const playerId = 123;
    const queryKey = playersKeys.detail(playerId);
    expect(queryKey).toEqual(['players', 'detail', playerId]);
  });

  it('handles loading state correctly', async () => {
    mock.onGet('/players/byId/111').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { id: 111, name: 'Loading Test' }]), 100);
      });
    });

    const { result } = renderHook(() => usePlayer(111), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ id: 111, name: 'Loading Test' });
  });
});

describe('playersKeys', () => {
  it('generates correct query keys', () => {
    expect(playersKeys.all).toEqual(['players']);
    expect(playersKeys.lists()).toEqual(['players', 'list']);
    expect(playersKeys.list({ page: 1 })).toEqual(['players', 'list', { page: 1 }]);
    expect(playersKeys.details()).toEqual(['players', 'detail']);
    expect(playersKeys.detail(123)).toEqual(['players', 'detail', 123]);
  });
});
