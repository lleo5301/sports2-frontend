import api from './api'

export const reportsService = {
  // Get scouting reports with optional filters
  getScoutingReports: async (params = {}) => {
    const response = await api.get('/reports/scouting', { params })
    return response.data
  },

  // Get a single scouting report by ID
  getScoutingReport: async (id) => {
    const response = await api.get(`/reports/scouting/${id}`)
    return response.data
  },

  // Create a new scouting report
  createScoutingReport: async (reportData) => {
    const response = await api.post('/reports/scouting', reportData)
    return response.data
  },

  // Update a scouting report
  updateScoutingReport: async (id, reportData) => {
    const response = await api.put(`/reports/scouting/${id}`, reportData)
    return response.data
  },

  // Delete a scouting report
  deleteScoutingReport: async (id) => {
    const response = await api.delete(`/reports/scouting/${id}`)
    return response.data
  },

  // Get daily reports
  getDailyReports: async (params = {}) => {
    const response = await api.get('/reports/daily', { params })
    return response.data
  },

  // Create a daily report
  createDailyReport: async (reportData) => {
    const response = await api.post('/reports/daily', reportData)
    return response.data
  },

  // Get report statistics
  getReportStats: async () => {
    const response = await api.get('/reports/stats')
    return response.data
  }
} 