/**
 * @fileoverview Game management service module providing CRUD operations,
 * statistics, and game-related queries.
 *
 * This service handles all game-related API calls including:
 * - Listing all games with optional filtering
 * - Fetching individual game details
 * - Creating new game records
 * - Updating existing game information
 * - Deleting game records
 * - Retrieving game logs and recent games
 * - Accessing team and player game statistics
 * - Fetching upcoming games
 * - Retrieving season statistics
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings, null,
 * and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/games
 * @requires ./api
 */

import api from './api'

/**
 * Game management service object containing all game-related API methods
 *
 * @namespace gamesService
 */
export const gamesService = {
  /**
   * Retrieves a list of all games with optional filtering parameters
   *
   * @async
   * @function getAllGames
   * @memberof gamesService
   * @param {Object} [params={}] - Optional query parameters for filtering games
   * @param {string} [params.teamId] - Filter games by team ID
   * @param {string} [params.opponent] - Filter games by opponent name
   * @param {string} [params.season] - Filter games by season year
   * @param {string} [params.homeAway] - Filter by home/away games ('home' or 'away')
   * @param {string} [params.status] - Filter by game status (e.g., 'scheduled', 'completed', 'cancelled')
   * @param {string} [params.startDate] - Filter games after this date (ISO format)
   * @param {string} [params.endDate] - Filter games before this date (ISO format)
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of game objects and metadata
   * @returns {Array<Object>} return.data - Array of game objects
   * @returns {string} return.data[].id - Game's unique identifier
   * @returns {string} return.data[].opponent - Opponent team name
   * @returns {string} return.data[].gameDate - Date and time of the game (ISO format)
   * @returns {string} return.data[].location - Game location/venue
   * @returns {string} return.data[].homeAway - Whether game is 'home' or 'away'
   * @returns {string} [return.data[].result] - Game result (e.g., 'Win', 'Loss', 'Tie')
   * @returns {number} [return.data[].teamScore] - Team's score
   * @returns {number} [return.data[].opponentScore] - Opponent's score
   * @returns {number} [return.total] - Total count of games matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all games
   * const allGames = await gamesService.getAllGames();
   *
   * @example
   * // Get completed home games for a season
   * const homeGames = await gamesService.getAllGames({
   *   season: '2024',
   *   homeAway: 'home',
   *   status: 'completed',
   *   limit: 20
   * });
   */
  getAllGames: async (params = {}) => {
    const response = await api.get('/games', { params })
    return response.data
  },

  /**
   * Retrieves detailed information for a single game by ID
   *
   * @async
   * @function getGame
   * @memberof gamesService
   * @param {string} id - The unique identifier of the game to retrieve
   * @returns {Promise<Object>} The game object with complete details
   * @returns {string} return.id - Game's unique identifier
   * @returns {string} return.opponent - Opponent team name
   * @returns {string} return.gameDate - Date and time of the game (ISO format)
   * @returns {string} return.location - Game location/venue
   * @returns {string} return.homeAway - Whether game is 'home' or 'away'
   * @returns {string} [return.result] - Game result (e.g., 'Win', 'Loss', 'Tie')
   * @returns {number} [return.teamScore] - Team's score
   * @returns {number} [return.opponentScore] - Opponent's score
   * @returns {string} [return.notes] - Additional notes about the game
   * @returns {Object} [return.stats] - Game statistics
   * @returns {string} return.createdAt - ISO timestamp of game record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if game not found
   *
   * @example
   * const game = await gamesService.getGame('game-789');
   * console.log('Opponent:', game.opponent);
   * console.log('Score:', `${game.teamScore} - ${game.opponentScore}`);
   */
  getGame: async (id) => {
    const response = await api.get(`/games/byId/${id}`)
    return response.data
  },

  /**
   * Retrieves complete box score statistics for a specific game
   *
   * @async
   * @function getGameStats
   * @memberof gamesService
   * @param {string} gameId - The unique identifier of the game
   * @returns {Promise<Object>} Complete box score with batting, pitching, and fielding stats
   * @returns {Object} return.game - Game details (id, opponent, date, score, result, location)
   * @returns {Array<Object>} return.batting - Batting stats for players with plate appearances
   * @returns {Array<Object>} return.pitching - Pitching stats for players who pitched
   * @returns {Array<Object>} return.fielding - Fielding stats for players with defensive activity
   * @returns {Object} return.team_totals - Aggregate team statistics
   * @returns {number} return.player_count - Number of players with recorded stats
   *
   * @throws {Error} Throws 404 error if game not found
   *
   * @example
   * const boxScore = await gamesService.getGameStats('game-123');
   * console.log(`${boxScore.game.opponent}: ${boxScore.player_count} players`);
   * boxScore.batting.forEach(b => console.log(`${b.player.name}: ${b.h}/${b.ab}`));
   */
  getGameStats: async (gameId) => {
    const response = await api.get(`/games/${gameId}/stats`)
    return response.data
  },

  /**
   * Creates a new game record
   *
   * @async
   * @function createGame
   * @memberof gamesService
   * @param {Object} gameData - Data for the new game
   * @param {string} gameData.opponent - Opponent team name (required)
   * @param {string} gameData.gameDate - Date and time of the game in ISO format (required)
   * @param {string} gameData.location - Game location/venue (required)
   * @param {string} gameData.homeAway - Whether game is 'home' or 'away' (required)
   * @param {string} [gameData.season] - Season year
   * @param {string} [gameData.status] - Game status (e.g., 'scheduled', 'completed')
   * @param {number} [gameData.teamScore] - Team's score
   * @param {number} [gameData.opponentScore] - Opponent's score
   * @param {string} [gameData.result] - Game result (e.g., 'Win', 'Loss', 'Tie')
   * @param {string} [gameData.notes] - Additional notes about the game
   * @returns {Promise<Object>} The newly created game object
   * @returns {string} return.id - Game's unique identifier
   * @returns {string} return.opponent - Opponent team name
   * @returns {string} return.gameDate - Date and time of the game (ISO format)
   * @returns {string} return.location - Game location/venue
   * @returns {string} return.homeAway - Whether game is 'home' or 'away'
   * @returns {string} return.createdAt - ISO timestamp of game record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the gameData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newGame = await gamesService.createGame({
   *   opponent: 'State University',
   *   gameDate: '2024-10-15T19:00:00Z',
   *   location: 'Home Stadium',
   *   homeAway: 'home',
   *   season: '2024'
   * });
   * console.log('Created game:', newGame.id);
   */
  createGame: async (gameData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(gameData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/games', filteredData)
    return response.data
  },

  /**
   * Updates an existing game's information
   *
   * @async
   * @function updateGame
   * @memberof gamesService
   * @param {string} id - The unique identifier of the game to update
   * @param {Object} gameData - Game fields to update (only include fields you want to change)
   * @param {string} [gameData.opponent] - Updated opponent name
   * @param {string} [gameData.gameDate] - Updated date and time (ISO format)
   * @param {string} [gameData.location] - Updated location/venue
   * @param {string} [gameData.homeAway] - Updated home/away status
   * @param {string} [gameData.season] - Updated season year
   * @param {string} [gameData.status] - Updated game status
   * @param {number} [gameData.teamScore] - Updated team score
   * @param {number} [gameData.opponentScore] - Updated opponent score
   * @param {string} [gameData.result] - Updated game result
   * @param {string} [gameData.notes] - Updated notes
   * @returns {Promise<Object>} The updated game object with all current data
   * @returns {string} return.id - Game's unique identifier
   * @returns {string} return.opponent - Updated opponent name
   * @returns {string} return.gameDate - Updated date and time
   * @returns {string} return.location - Updated location
   * @returns {string} return.homeAway - Updated home/away status
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if game not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the gameData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedGame = await gamesService.updateGame('game-789', {
   *   teamScore: 28,
   *   opponentScore: 21,
   *   result: 'Win',
   *   status: 'completed'
   * });
   * console.log('Updated game:', updatedGame.opponent);
   */
  updateGame: async (id, gameData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(gameData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/games/byId/${id}`, filteredData)
    return response.data
  },

  /**
   * Deletes a game record
   *
   * @async
   * @function deleteGame
   * @memberof gamesService
   * @param {string} id - The unique identifier of the game to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if game not found
   * @throws {Error} Throws error if game cannot be deleted (e.g., has associated statistics)
   *
   * @example
   * const result = await gamesService.deleteGame('game-789');
   * console.log(result.message); // "Game deleted successfully"
   */
  deleteGame: async (id) => {
    const response = await api.delete(`/games/byId/${id}`)
    return response.data
  },

  /**
   * Retrieves recent games as a game log
   *
   * @async
   * @function getGameLog
   * @memberof gamesService
   * @param {number} [limit=10] - Maximum number of recent games to return
   * @returns {Promise<Object>} Response containing recent games
   * @returns {Array<Object>} return.data - Array of recent game objects
   * @returns {string} return.data[].id - Game's unique identifier
   * @returns {string} return.data[].opponent - Opponent team name
   * @returns {string} return.data[].gameDate - Date and time of the game (ISO format)
   * @returns {string} return.data[].result - Game result (e.g., 'Win', 'Loss', 'Tie')
   * @returns {number} return.data[].teamScore - Team's score
   * @returns {number} return.data[].opponentScore - Opponent's score
   * @returns {string} return.data[].homeAway - Whether game is 'home' or 'away'
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get last 10 games
   * const recentGames = await gamesService.getGameLog();
   *
   * @example
   * // Get last 5 games
   * const last5Games = await gamesService.getGameLog(5);
   * last5Games.data.forEach(game => {
   *   console.log(`${game.opponent}: ${game.result} ${game.teamScore}-${game.opponentScore}`);
   * });
   */
  getGameLog: async (limit = 10) => {
    const response = await api.get('/games/log', { params: { limit } })
    return response.data
  },

  /**
   * Retrieves comprehensive game statistics for the team
   *
   * @async
   * @function getTeamGameStats
   * @memberof gamesService
   * @returns {Promise<Object>} Team game statistics object
   * @returns {number} return.totalGames - Total number of games played
   * @returns {number} return.wins - Total wins
   * @returns {number} return.losses - Total losses
   * @returns {number} return.ties - Total ties
   * @returns {number} [return.homeWins] - Wins at home
   * @returns {number} [return.awayWins] - Wins away
   * @returns {number} [return.totalPointsScored] - Total points scored across all games
   * @returns {number} [return.totalPointsAllowed] - Total points allowed across all games
   * @returns {number} [return.avgPointsScored] - Average points scored per game
   * @returns {number} [return.avgPointsAllowed] - Average points allowed per game
   * @returns {Object} [return.seasonBreakdown] - Statistics broken down by season
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const teamStats = await gamesService.getTeamGameStats();
   * console.log(`Record: ${teamStats.wins}-${teamStats.losses}-${teamStats.ties}`);
   * console.log(`Avg points per game: ${teamStats.avgPointsScored}`);
   */
  getTeamGameStats: async () => {
    const response = await api.get('/games/team-stats')
    return response.data
  },

  /**
   * Retrieves game statistics for a specific player
   *
   * @async
   * @function getPlayerGameStats
   * @memberof gamesService
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Object>} Player game statistics object
   * @returns {string} return.playerId - Player's unique identifier
   * @returns {string} return.playerName - Player's full name
   * @returns {number} return.gamesPlayed - Number of games the player participated in
   * @returns {Array<Object>} return.gameStats - Array of individual game statistics
   * @returns {string} return.gameStats[].gameId - Game's unique identifier
   * @returns {string} return.gameStats[].gameDate - Date of the game (ISO format)
   * @returns {string} return.gameStats[].opponent - Opponent team name
   * @returns {Object} return.gameStats[].stats - Player's statistics for that game
   * @returns {number} [return.gameStats[].stats.points] - Points scored
   * @returns {number} [return.gameStats[].stats.assists] - Assists
   * @returns {number} [return.gameStats[].stats.rebounds] - Rebounds (for basketball)
   * @returns {number} [return.gameStats[].stats.passingYards] - Passing yards (for football)
   * @returns {number} [return.gameStats[].stats.rushingYards] - Rushing yards (for football)
   * @returns {Object} [return.averages] - Average statistics across all games
   *
   * @throws {Error} Throws 404 error if player not found
   *
   * @example
   * const playerStats = await gamesService.getPlayerGameStats('player-456');
   * console.log(`${playerStats.playerName} played ${playerStats.gamesPlayed} games`);
   * playerStats.gameStats.forEach(game => {
   *   console.log(`${game.opponent}: ${game.stats.points} points`);
   * });
   */
  getPlayerGameStats: async (playerId) => {
    const response = await api.get(`/games/player-stats/${playerId}`)
    return response.data
  },

  /**
   * Retrieves upcoming scheduled games
   *
   * @async
   * @function getUpcomingGames
   * @memberof gamesService
   * @param {number} [limit=5] - Maximum number of upcoming games to return
   * @returns {Promise<Object>} Response containing upcoming games
   * @returns {Array<Object>} return.data - Array of upcoming game objects
   * @returns {string} return.data[].id - Game's unique identifier
   * @returns {string} return.data[].opponent - Opponent team name
   * @returns {string} return.data[].gameDate - Date and time of the game (ISO format)
   * @returns {string} return.data[].location - Game location/venue
   * @returns {string} return.data[].homeAway - Whether game is 'home' or 'away'
   * @returns {string} [return.data[].status] - Game status
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get next 5 games
   * const nextGames = await gamesService.getUpcomingGames();
   *
   * @example
   * // Get next 3 games
   * const next3Games = await gamesService.getUpcomingGames(3);
   * next3Games.data.forEach(game => {
   *   console.log(`${game.gameDate}: vs ${game.opponent} (${game.homeAway})`);
   * });
   */
  getUpcomingGames: async (limit = 5) => {
    const response = await api.get('/games/upcoming', { params: { limit } })
    return response.data
  },

  /**
   * Retrieves season statistics with optional season filter
   *
   * @async
   * @function getSeasonStats
   * @memberof gamesService
   * @param {string|null} [season=null] - Season year to retrieve stats for (null for current season)
   * @returns {Promise<Object>} Season statistics object
   * @returns {string} return.season - Season year
   * @returns {number} return.totalGames - Total games played in the season
   * @returns {number} return.wins - Total wins in the season
   * @returns {number} return.losses - Total losses in the season
   * @returns {number} return.ties - Total ties in the season
   * @returns {number} [return.pointsScored] - Total points scored in the season
   * @returns {number} [return.pointsAllowed] - Total points allowed in the season
   * @returns {number} [return.avgPointsScored] - Average points scored per game
   * @returns {number} [return.avgPointsAllowed] - Average points allowed per game
   * @returns {Object} [return.homeRecord] - Home game record (wins, losses, ties)
   * @returns {Object} [return.awayRecord] - Away game record (wins, losses, ties)
   * @returns {Array<Object>} [return.monthlyBreakdown] - Statistics broken down by month
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get current season stats
   * const currentSeasonStats = await gamesService.getSeasonStats();
   * console.log(`${currentSeasonStats.season} record: ${currentSeasonStats.wins}-${currentSeasonStats.losses}`);
   *
   * @example
   * // Get specific season stats
   * const season2023Stats = await gamesService.getSeasonStats('2023');
   * console.log(`2023 avg points: ${season2023Stats.avgPointsScored}`);
   */
  getSeasonStats: async (season = null) => {
    const response = await api.get('/games/season-stats', { params: { season } })
    return response.data
  }
}
