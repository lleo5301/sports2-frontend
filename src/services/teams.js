import api from './api'

export const teamsService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await api.get('/teams')
    return response.data
  },

  // Get current user's team
  getMyTeam: async () => {
    const response = await api.get('/teams/me')
    return response.data
  },

  // Update current user's team
  updateMyTeam: async (teamData) => {
    const response = await api.put('/teams/me', teamData)
    return response.data
  },

  // Get team statistics
  getTeamStats: async () => {
    const response = await api.get('/teams/stats')
    return response.data
  },

  // Get team roster
  getTeamRoster: async () => {
    const response = await api.get('/teams/roster')
    return response.data
  }
} 