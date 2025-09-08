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
    const response = await api.post('/schedule-events', eventData);
    return response.data;
  },

  // Update a schedule event
  updateScheduleEvent: async (id, eventData) => {
    const response = await api.put(`/schedule-events/${id}`, eventData);
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

