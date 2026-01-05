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
