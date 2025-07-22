import api from './api'

export const playersService = {
  // Get all players with optional filters
  getPlayers: async (params = {}) => {
    const response = await api.get('/players', { params })
    return response.data
  },

  // Get a single player by ID
  getPlayer: async (id) => {
    const response = await api.get(`/players/${id}`)
    return response.data
  },

  // Create a new player
  createPlayer: async (playerData) => {
    const response = await api.post('/players', playerData)
    return response.data
  },

  // Update a player
  updatePlayer: async (id, playerData) => {
    const response = await api.put(`/players/${id}`, playerData)
    return response.data
  },

  // Delete a player
  deletePlayer: async (id) => {
    const response = await api.delete(`/players/${id}`)
    return response.data
  },

  // Get player statistics
  getPlayerStats: async (id) => {
    const response = await api.get(`/players/${id}/stats`)
    return response.data
  }
} 