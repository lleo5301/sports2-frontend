import api from './api';

const scheduleEventsService = {
  // Get all schedule events
  getScheduleEvents: async (params = {}) => {
    const response = await api.get('/schedule-events', { params });
    return response.data;
  },

  // Get a specific schedule event
  getScheduleEvent: async (id) => {
    const response = await api.get(`/schedule-events/${id}`);
    return response.data;
  },

  // Create a new schedule event
  createScheduleEvent: async (eventData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(eventData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedule-events', filteredData);
    return response.data;
  },

  // Update a schedule event
  updateScheduleEvent: async (id, eventData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(eventData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedule-events/${id}`, filteredData);
    return response.data;
  },

  // Delete a schedule event
  deleteScheduleEvent: async (id) => {
    const response = await api.delete(`/schedule-events/${id}`);
    return response.data;
  },

  // Get event types for dropdown
  getEventTypes: () => [
    { value: 'practice', label: 'Practice' },
    { value: 'game', label: 'Game' },
    { value: 'scrimmage', label: 'Scrimmage' },
    { value: 'tournament', label: 'Tournament' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'training', label: 'Training' },
    { value: 'conditioning', label: 'Conditioning' },
    { value: 'team_building', label: 'Team Building' },
    { value: 'other', label: 'Other' }
  ],

  // Get priority levels for dropdown
  getPriorityLevels: () => [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]
};

export default scheduleEventsService;




