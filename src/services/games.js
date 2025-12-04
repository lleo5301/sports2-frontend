import api from './api'

export const gamesService = {
  // Get all games for the team
  getAllGames: async (params = {}) => {
    const response = await api.get('/games', { params })
    return response.data
  },

  // Get a single game by ID
  getGame: async (id) => {
    const response = await api.get(`/games/byId/${id}`)
    return response.data
  },

  // Create a new game
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

  // Update a game
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

  // Delete a game
  deleteGame: async (id) => {
    const response = await api.delete(`/games/byId/${id}`)
    return response.data
  },

  // Get game log (recent games)
  getGameLog: async (limit = 10) => {
    const response = await api.get('/games/log', { params: { limit } })
    return response.data
  },

  // Get team game statistics
  getTeamGameStats: async () => {
    const response = await api.get('/games/team-stats')
    return response.data
  },

  // Get player game statistics
  getPlayerGameStats: async (playerId) => {
    const response = await api.get(`/games/player-stats/${playerId}`)
    return response.data
  },

  // Get upcoming games
  getUpcomingGames: async (limit = 5) => {
    const response = await api.get('/games/upcoming', { params: { limit } })
    return response.data
  },

  // Get season statistics
  getSeasonStats: async (season = null) => {
    const response = await api.get('/games/season-stats', { params: { season } })
    return response.data
  }
} 