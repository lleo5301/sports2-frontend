/**
 * @fileoverview Player management service module providing CRUD operations,
 * statistics, and performance tracking for players.
 *
 * This service handles all player-related API calls including:
 * - Listing players with optional filtering
 * - Fetching individual player details
 * - Creating new player records
 * - Updating existing player information
 * - Deleting player records
 * - Retrieving player statistics
 * - Accessing player performance rankings
 *
 * Parameter Filtering Behavior:
 * Create, update, and performance methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/players
 * @requires ./api
 */

import api from './api'

/**
 * Player management service object containing all player-related API methods
 *
 * @namespace playersService
 */
export const playersService = {
  /**
   * Retrieves a list of all players with optional filtering parameters
   *
   * @async
   * @function getPlayers
   * @memberof playersService
   * @param {Object} [params={}] - Optional query parameters for filtering players
   * @param {string} [params.teamId] - Filter players by team ID
   * @param {string} [params.position] - Filter players by position (e.g., 'QB', 'RB', 'WR')
   * @param {string} [params.status] - Filter players by status (e.g., 'active', 'injured')
   * @param {string} [params.search] - Search term to filter players by name
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of player objects and metadata
   * @returns {Array<Object>} return.data - Array of player objects
   * @returns {string} return.data[].id - Player's unique identifier
   * @returns {string} return.data[].name - Player's full name
   * @returns {string} return.data[].position - Player's position
   * @returns {string} return.data[].jerseyNumber - Player's jersey number
   * @returns {string} return.data[].teamId - ID of player's team
   * @returns {number} [return.total] - Total count of players matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all players
   * const allPlayers = await playersService.getPlayers();
   *
   * @example
   * // Get players filtered by team and position
   * const quarterbacks = await playersService.getPlayers({
   *   teamId: 'team-123',
   *   position: 'QB',
   *   limit: 10
   * });
   */
  getPlayers: async (params = {}) => {
    const response = await api.get('/players', { params })
    return response.data
  },

  /**
   * Retrieves detailed information for a single player by ID
   *
   * @async
   * @function getPlayer
   * @memberof playersService
   * @param {string} id - The unique identifier of the player to retrieve
   * @returns {Promise<Object>} The player object with complete details
   * @returns {string} return.id - Player's unique identifier
   * @returns {string} return.name - Player's full name
   * @returns {string} return.position - Player's position
   * @returns {string} return.jerseyNumber - Player's jersey number
   * @returns {string} return.teamId - ID of player's team
   * @returns {string} [return.height] - Player's height
   * @returns {string} [return.weight] - Player's weight
   * @returns {string} [return.dateOfBirth] - Player's date of birth (ISO format)
   * @returns {string} [return.highSchool] - Player's high school
   * @returns {string} return.createdAt - ISO timestamp of player record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if player not found
   *
   * @example
   * const player = await playersService.getPlayer('player-456');
   * console.log('Player name:', player.name);
   * console.log('Position:', player.position);
   */
  getPlayer: async (id) => {
    const response = await api.get(`/players/byId/${id}`)
    return response.data
  },

  /**
   * Creates a new player record
   *
   * @async
   * @function createPlayer
   * @memberof playersService
   * @param {Object} playerData - Data for the new player
   * @param {string} playerData.name - Player's full name (required)
   * @param {string} playerData.position - Player's position (required)
   * @param {string} playerData.jerseyNumber - Player's jersey number (required)
   * @param {string} playerData.teamId - ID of player's team (required)
   * @param {string} [playerData.height] - Player's height
   * @param {string} [playerData.weight] - Player's weight
   * @param {string} [playerData.dateOfBirth] - Player's date of birth (ISO format)
   * @param {string} [playerData.highSchool] - Player's high school
   * @param {string} [playerData.email] - Player's email address
   * @param {string} [playerData.phone] - Player's phone number
   * @returns {Promise<Object>} The newly created player object
   * @returns {string} return.id - Player's unique identifier
   * @returns {string} return.name - Player's full name
   * @returns {string} return.position - Player's position
   * @returns {string} return.jerseyNumber - Player's jersey number
   * @returns {string} return.teamId - ID of player's team
   * @returns {string} return.createdAt - ISO timestamp of player record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the playerData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newPlayer = await playersService.createPlayer({
   *   name: 'John Doe',
   *   position: 'QB',
   *   jerseyNumber: '12',
   *   teamId: 'team-123',
   *   height: '6\'2"',
   *   weight: '215 lbs'
   * });
   * console.log('Created player:', newPlayer.id);
   */
  createPlayer: async (playerData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(playerData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/players', filteredData)
    return response.data
  },

  /**
   * Updates an existing player's information
   *
   * @async
   * @function updatePlayer
   * @memberof playersService
   * @param {string} id - The unique identifier of the player to update
   * @param {Object} playerData - Player fields to update (only include fields you want to change)
   * @param {string} [playerData.name] - Updated full name
   * @param {string} [playerData.position] - Updated position
   * @param {string} [playerData.jerseyNumber] - Updated jersey number
   * @param {string} [playerData.teamId] - Updated team ID
   * @param {string} [playerData.height] - Updated height
   * @param {string} [playerData.weight] - Updated weight
   * @param {string} [playerData.dateOfBirth] - Updated date of birth (ISO format)
   * @param {string} [playerData.highSchool] - Updated high school
   * @param {string} [playerData.email] - Updated email address
   * @param {string} [playerData.phone] - Updated phone number
   * @returns {Promise<Object>} The updated player object with all current data
   * @returns {string} return.id - Player's unique identifier
   * @returns {string} return.name - Updated player name
   * @returns {string} return.position - Updated position
   * @returns {string} return.jerseyNumber - Updated jersey number
   * @returns {string} return.teamId - Updated team ID
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if player not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the playerData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedPlayer = await playersService.updatePlayer('player-456', {
   *   jerseyNumber: '7',
   *   position: 'WR'
   * });
   * console.log('Updated player:', updatedPlayer.name);
   */
  updatePlayer: async (id, playerData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(playerData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/players/byId/${id}`, filteredData)
    return response.data
  },

  /**
   * Deletes a player record
   *
   * @async
   * @function deletePlayer
   * @memberof playersService
   * @param {string} id - The unique identifier of the player to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if player not found
   * @throws {Error} Throws error if player cannot be deleted (e.g., has associated game records)
   *
   * @example
   * const result = await playersService.deletePlayer('player-456');
   * console.log(result.message); // "Player deleted successfully"
   */
  deletePlayer: async (id) => {
    const response = await api.delete(`/players/byId/${id}`)
    return response.data
  },

  // Bulk delete players
  bulkDeletePlayers: async (ids) => {
    const response = await api.post('/players/bulk-delete', { ids })
    return response.data
  },

  /**
   * Retrieves comprehensive statistics for a specific player
   *
   * @async
   * @function getPlayerStats
   * @memberof playersService
   * @param {string} id - The unique identifier of the player
   * @returns {Promise<Object>} Player statistics object
   * @returns {string} return.playerId - Player's unique identifier
   * @returns {string} return.playerName - Player's full name
   * @returns {number} return.gamesPlayed - Total number of games played
   * @returns {Object} return.stats - Statistical data by category
   * @returns {number} [return.stats.passingYards] - Total passing yards (for QBs)
   * @returns {number} [return.stats.rushingYards] - Total rushing yards
   * @returns {number} [return.stats.receivingYards] - Total receiving yards
   * @returns {number} [return.stats.touchdowns] - Total touchdowns scored
   * @returns {Object} return.seasonStats - Statistics broken down by season
   *
   * @throws {Error} Throws 404 error if player not found
   *
   * @example
   * const stats = await playersService.getPlayerStats('player-456');
   * console.log('Games played:', stats.gamesPlayed);
   * console.log('Total touchdowns:', stats.stats.touchdowns);
   */
  getPlayerStats: async (id) => {
    const response = await api.get(`/players/byId/${id}/stats`)
    return response.data
  },

  /**
   * Retrieves player performance rankings with optional filtering
   *
   * @async
   * @function getPlayerPerformance
   * @memberof playersService
   * @param {Object} [params={}] - Optional query parameters for filtering performance data
   * @param {string} [params.teamId] - Filter by team ID
   * @param {string} [params.position] - Filter by position (e.g., 'QB', 'RB', 'WR')
   * @param {string} [params.season] - Filter by season year
   * @param {string} [params.metric] - Sort by specific metric (e.g., 'passingYards', 'touchdowns')
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
   * @returns {Promise<Object>} Response containing performance rankings
   * @returns {Array<Object>} return.data - Array of player performance objects
   * @returns {string} return.data[].playerId - Player's unique identifier
   * @returns {string} return.data[].playerName - Player's full name
   * @returns {string} return.data[].position - Player's position
   * @returns {number} return.data[].rank - Player's ranking position
   * @returns {Object} return.data[].metrics - Performance metrics
   * @returns {number} [return.total] - Total count of players in rankings
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the params object before sending to the API. This ensures
   *              clean query parameters and prevents invalid filter values.
   *
   * @example
   * // Get top performers by passing yards
   * const topQBs = await playersService.getPlayerPerformance({
   *   position: 'QB',
   *   metric: 'passingYards',
   *   sortOrder: 'desc',
   *   limit: 10
   * });
   * console.log('Top QB:', topQBs.data[0].playerName);
   */
  getPlayerPerformance: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/players/performance', { params: filteredParams })
    return response.data
  }
} 