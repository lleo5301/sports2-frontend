import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'
import { useScoutingReports, useScoutingReport, usePlayerReports, reportsKeys } from '../useReports'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useScoutingReports', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => {
    mock.reset()
  })

  it('returns correct data shape with reports list', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, player_name: 'Player 1', status: 'completed', overall_grade: 85 },
        { id: 2, player_name: 'Player 2', status: 'in_progress', overall_grade: null }
      ],
      pagination: {
        total: 2,
        pages: 1,
        page: 1,
        limit: 20
      }
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toEqual(mockResponse.data)
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    })
    expect(result.current.error).toBe(null)
  })

  it('computes stats correctly', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, status: 'completed', overall_grade: 80 },
        { id: 2, status: 'in_progress', overall_grade: null },
        { id: 3, status: 'completed', overall_grade: 90 },
        { id: 4, status: 'in_progress', overall_grade: null }
      ],
      pagination: {
        total: 4,
        pages: 1,
        page: 1,
        limit: 20
      }
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.stats).toEqual({
      totalReports: 4,
      inProgress: 2,
      averageRating: 85 // (80 + 90) / 2 = 85
    })
  })

  it('handles loading state correctly', async () => {
    mock.onGet('/reports/scouting').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { success: true, data: [] }]), 100)
      })
    })

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('handles error state correctly', async () => {
    mock.onGet('/reports/scouting').reply(500, {
      success: false,
      message: 'Server error'
    })

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.error).not.toBe(null))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([])
  })

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
    }

    let capturedParams = null
    mock.onGet('/reports/scouting').reply((config) => {
      capturedParams = config.params
      return [200, mockResponse]
    })

    const { result } = renderHook(() => useScoutingReports({ page: 3, limit: 20 }), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(capturedParams).toEqual({
      page: 3,
      limit: 20
    })
    expect(result.current.pagination.page).toBe(3)
    expect(result.current.pagination.limit).toBe(20)
  })

  it('uses correct query key pattern', () => {
    const params = {
      page: 2,
      limit: 10
    }

    const queryKey = reportsKeys.scoutingReportList(params)
    expect(queryKey).toEqual(['reports', 'scouting', 'list', params])
  })

  it('computes stats with no completed reports', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, status: 'in_progress', overall_grade: null },
        { id: 2, status: 'in_progress', overall_grade: null }
      ],
      pagination: {
        total: 2,
        pages: 1,
        page: 1,
        limit: 20
      }
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.stats).toEqual({
      totalReports: 2,
      inProgress: 2,
      averageRating: 0
    })
  })

  it('rounds average rating to one decimal place', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, status: 'completed', overall_grade: 83 },
        { id: 2, status: 'completed', overall_grade: 87 },
        { id: 3, status: 'completed', overall_grade: 91 }
      ],
      pagination: {
        total: 3,
        pages: 1,
        page: 1,
        limit: 20
      }
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => useScoutingReports(), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // (83 + 87 + 91) / 3 = 87
    expect(result.current.stats.averageRating).toBe(87)
  })
})

describe('useScoutingReport', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => {
    mock.reset()
  })

  it('fetches single report by ID', async () => {
    const mockReport = {
      id: 123,
      player_name: 'John Doe',
      status: 'completed',
      overall_grade: 85,
      hitting_grade: 80,
      pitching_grade: 90
    }

    mock.onGet('/reports/scouting/123').reply(200, mockReport)

    const { result } = renderHook(() => useScoutingReport(123), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toEqual(mockReport)
    expect(result.current.error).toBe(null)
  })

  it('returns correct data shape', async () => {
    const mockReport = {
      id: 456,
      player_name: 'Jane Smith',
      status: 'in_progress'
    }

    mock.onGet('/reports/scouting/456').reply(200, mockReport)

    const { result } = renderHook(() => useScoutingReport(456), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current.data).toEqual(mockReport)
  })

  it('handles error state correctly', async () => {
    mock.onGet('/reports/scouting/999').reply(404, {
      success: false,
      message: 'Report not found'
    })

    const { result } = renderHook(() => useScoutingReport(999), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.error).not.toBe(null))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('does not fetch when reportId is not provided', async () => {
    const { result } = renderHook(() => useScoutingReport(null), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mock.history.get.length).toBe(0)
  })

  it('uses enabled option to conditionally fetch', async () => {
    const mockReport = { id: 789, player_name: 'Test Player' }
    mock.onGet('/reports/scouting/789').reply(200, mockReport)

    const { result: result1 } = renderHook(() => useScoutingReport(789), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result1.current.data).toEqual(mockReport))

    const { result: result2 } = renderHook(() => useScoutingReport(undefined), {
      wrapper: createWrapper()
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(result2.current.isLoading).toBe(false)
    expect(result2.current.data).toBeUndefined()
  })

  it('uses correct query key pattern', () => {
    const reportId = 123
    const queryKey = reportsKeys.scoutingReportDetail(reportId)
    expect(queryKey).toEqual(['reports', 'scouting', 'detail', reportId])
  })

  it('handles loading state correctly', async () => {
    mock.onGet('/reports/scouting/111').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { id: 111, player_name: 'Loading Test' }]), 100)
      })
    })

    const { result } = renderHook(() => useScoutingReport(111), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual({ id: 111, player_name: 'Loading Test' })
  })
})

describe('usePlayerReports', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  afterEach(() => {
    mock.reset()
  })

  it('fetches reports for a specific player', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, player_id: 123, status: 'completed', overall_grade: 85 },
        { id: 2, player_id: 123, status: 'in_progress', overall_grade: null }
      ]
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => usePlayerReports(123), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toEqual(mockResponse.data)
    expect(result.current.error).toBe(null)
  })

  it('returns correct data shape', async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, player_id: 456, status: 'completed' }
      ]
    }

    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result } = renderHook(() => usePlayerReports(456), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current.data).toEqual(mockResponse.data)
  })

  it('handles error state correctly', async () => {
    mock.onGet('/reports/scouting').reply(500, {
      success: false,
      message: 'Server error'
    })

    const { result } = renderHook(() => usePlayerReports(999), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.error).not.toBe(null))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([])
  })

  it('does not fetch when playerId is not provided', async () => {
    const { result } = renderHook(() => usePlayerReports(null), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual([])

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(mock.history.get.length).toBe(0)
  })

  it('uses enabled option to conditionally fetch', async () => {
    const mockResponse = {
      success: true,
      data: [{ id: 1, player_id: 789 }]
    }
    mock.onGet('/reports/scouting').reply(200, mockResponse)

    const { result: result1 } = renderHook(() => usePlayerReports(789), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result1.current.data).toEqual(mockResponse.data))

    const { result: result2 } = renderHook(() => usePlayerReports(undefined), {
      wrapper: createWrapper()
    })

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(result2.current.isLoading).toBe(false)
    expect(result2.current.data).toEqual([])
  })

  it('uses correct query key pattern', () => {
    const playerId = 123
    const queryKey = reportsKeys.playerReport(playerId)
    expect(queryKey).toEqual(['reports', 'player-reports', playerId])
  })

  it('handles loading state correctly', async () => {
    mock.onGet('/reports/scouting').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { success: true, data: [{ id: 1, player_id: 111 }] }]), 100)
      })
    })

    const { result } = renderHook(() => usePlayerReports(111), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual([{ id: 1, player_id: 111 }])
  })

  it('passes player_id param correctly', async () => {
    const mockResponse = {
      success: true,
      data: []
    }

    let capturedParams = null
    mock.onGet('/reports/scouting').reply((config) => {
      capturedParams = config.params
      return [200, mockResponse]
    })

    const { result } = renderHook(() => usePlayerReports(456), {
      wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(capturedParams).toEqual({
      player_id: 456
    })
  })
})

describe('reportsKeys', () => {
  it('generates correct query keys', () => {
    expect(reportsKeys.all).toEqual(['reports'])
    expect(reportsKeys.scoutingReports()).toEqual(['reports', 'scouting'])
    expect(reportsKeys.scoutingReportList({ page: 1 })).toEqual(['reports', 'scouting', 'list', { page: 1 }])
    expect(reportsKeys.scoutingReportDetails()).toEqual(['reports', 'scouting', 'detail'])
    expect(reportsKeys.scoutingReportDetail(123)).toEqual(['reports', 'scouting', 'detail', 123])
    expect(reportsKeys.playerReports()).toEqual(['reports', 'player-reports'])
    expect(reportsKeys.playerReport(456)).toEqual(['reports', 'player-reports', 456])
  })
})
