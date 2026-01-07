import { useQuery } from '@tanstack/react-query';
import { playersService } from '../services/players';

/**
 * Query key factory for players-related queries
 * Ensures consistent cache keys across the application
 */
export const playersKeys = {
  all: ['players'],
  lists: () => [...playersKeys.all, 'list'],
  list: (filters) => [...playersKeys.lists(), filters],
  details: () => [...playersKeys.all, 'detail'],
  detail: (id) => [...playersKeys.details(), id],
};

/**
 * Custom hook for fetching players list with pagination and filtering
 *
 * @param {Object} options - Query options
 * @param {number} options.page - Current page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.search - Search term for player name
 * @param {string} options.position - Filter by position
 * @param {string} options.status - Filter by status (active, inactive, graduated, transferred)
 * @param {string} options.school_type - Filter by school type (HS, COLL)
 * @param {Object} queryOptions - Additional React Query options
 * @returns {Object} { data, isLoading, error, pagination }
 */
export function usePlayers({
  page = 1,
  limit = 20,
  search = '',
  position = '',
  status = '',
  school_type = ''
} = {}, queryOptions = {}) {
  // Build params object, only including non-empty values
  const params = {
    page,
    limit
  };

  // Only add filter params if they have values
  if (search && search.trim() !== '') {
    params.search = search;
  }
  if (position && position.trim() !== '') {
    params.position = position;
  }
  if (status && status.trim() !== '') {
    params.status = status;
  }
  if (school_type && school_type.trim() !== '') {
    params.school_type = school_type;
  }

  const query = useQuery({
    queryKey: playersKeys.list(params),
    queryFn: () => playersService.getPlayers(params),
    ...queryOptions
  });

  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    pagination: {
      page,
      limit,
      total: query.data?.pagination?.total || 0,
      pages: query.data?.pagination?.pages || 0
    }
  };
}

/**
 * Custom hook for fetching a single player by ID
 *
 * @param {string|number} playerId - The player ID to fetch
 * @param {Object} queryOptions - Additional React Query options
 * @returns {Object} { data, isLoading, error }
 */
export function usePlayer(playerId, queryOptions = {}) {
  const query = useQuery({
    queryKey: playersKeys.detail(playerId),
    queryFn: () => playersService.getPlayer(playerId),
    enabled: !!playerId,
    ...queryOptions
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
}
