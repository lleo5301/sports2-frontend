import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports';

/**
 * Query key factory for reports-related queries
 * Ensures consistent cache keys across the application
 */
export const reportsKeys = {
  all: ['reports'],
  scoutingReports: () => [...reportsKeys.all, 'scouting'],
  scoutingReportList: (params) => [...reportsKeys.scoutingReports(), 'list', params],
  scoutingReportDetails: () => [...reportsKeys.scoutingReports(), 'detail'],
  scoutingReportDetail: (id) => [...reportsKeys.scoutingReportDetails(), id],
  playerReports: () => [...reportsKeys.all, 'player-reports'],
  playerReport: (playerId) => [...reportsKeys.playerReports(), playerId],
};

/**
 * Custom hook for fetching scouting reports list with pagination
 *
 * @param {Object} options - Query options
 * @param {number} options.page - Current page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {Object} queryOptions - Additional React Query options
 * @returns {Object} { data, isLoading, error, pagination, stats }
 */
export function useScoutingReports({
  page = 1,
  limit = 20
} = {}, queryOptions = {}) {
  const params = {
    page,
    limit
  };

  const query = useQuery({
    queryKey: reportsKeys.scoutingReportList(params),
    queryFn: () => reportsService.getScoutingReports(params),
    ...queryOptions
  });

  // Compute stats from response data
  const reports = query.data?.data || [];
  const totalReports = query.data?.pagination?.total || 0;
  const inProgress = reports.filter(r => r.status === 'in_progress').length;
  const completedReports = reports.filter(r => r.overall_grade);
  const averageRating = completedReports.length > 0
    ? completedReports.reduce((sum, r) => sum + (r.overall_grade || 0), 0) / completedReports.length
    : 0;

  return {
    data: reports,
    isLoading: query.isLoading,
    error: query.error,
    pagination: {
      page,
      limit,
      total: totalReports,
      pages: query.data?.pagination?.pages || 0
    },
    stats: {
      totalReports,
      inProgress,
      averageRating: Math.round(averageRating * 10) / 10
    }
  };
}

/**
 * Custom hook for fetching a single scouting report by ID
 *
 * @param {string|number} reportId - The report ID to fetch
 * @param {Object} queryOptions - Additional React Query options
 * @returns {Object} { data, isLoading, error }
 */
export function useScoutingReport(reportId, queryOptions = {}) {
  const query = useQuery({
    queryKey: reportsKeys.scoutingReportDetail(reportId),
    queryFn: () => reportsService.getScoutingReport(reportId),
    enabled: !!reportId,
    ...queryOptions
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
}

/**
 * Custom hook for fetching scouting reports for a specific player
 *
 * @param {string|number} playerId - The player ID to fetch reports for
 * @param {Object} queryOptions - Additional React Query options
 * @returns {Object} { data, isLoading, error }
 */
export function usePlayerReports(playerId, queryOptions = {}) {
  const query = useQuery({
    queryKey: reportsKeys.playerReport(playerId),
    queryFn: () => reportsService.getScoutingReports({ player_id: playerId }),
    enabled: !!playerId,
    ...queryOptions
  });

  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
}
