import api from './api'

export const teamsService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await api.get('/teams')
    return response.data
  },

  // Get a single team by ID
  getTeam: async (id) => {
    const response = await api.get(`/teams/byId/${id}`)
    return response.data
  },

  // Get current user's team
  getMyTeam: async () => {
    const response = await api.get('/teams/me')
    return response.data
  },

  // Create a new team
  createTeam: async (teamData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(teamData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/teams', filteredData)
    return response.data
  },

  // Update current user's team
  updateMyTeam: async (teamData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(teamData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put('/teams/me', filteredData)
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