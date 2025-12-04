import api from './api'

export const schedulesService = {
  // Get all schedules for the user's team
  getAllSchedules: async (params = {}) => {
    const response = await api.get('/schedules', { params })
    return response.data
  },

  // Get a single schedule by ID
  getSchedule: async (id) => {
    const response = await api.get(`/schedules/byId/${id}`)
    return response.data
  },

  // Create a new schedule
  createSchedule: async (scheduleData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scheduleData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedules', filteredData)
    return response.data
  },

  // Update a schedule
  updateSchedule: async (id, scheduleData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scheduleData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedules/byId/${id}`, filteredData)
    return response.data
  },

  // Delete a schedule
  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/byId/${id}`)
    return response.data
  },

  // Get upcoming game schedules for the team
  getUpcomingSchedules: async (limit = 10) => {
    const response = await api.get('/teams/upcoming-schedules', { params: { limit } })
    return response.data
  },

  // Get recent game schedules for the team
  getRecentSchedules: async (limit = 10) => {
    const response = await api.get('/teams/recent-schedules', { params: { limit } })
    return response.data
  },

  // Get schedule statistics
  getScheduleStats: async () => {
    const response = await api.get('/schedules/stats')
    return response.data
  }
} 