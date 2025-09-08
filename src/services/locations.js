import api from './api';

const locationsService = {
  // Get all locations
  getLocations: async (params = {}) => {
    const response = await api.get('/locations', { params });
    return response.data;
  },

  // Get a specific location
  getLocation: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  // Create a new location
  createLocation: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response.data;
  },

  // Update a location
  updateLocation: async (id, locationData) => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response.data;
  },

  // Delete a location
  deleteLocation: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },

  // Get location types for dropdown
  getLocationTypes: () => [
    { value: 'field', label: 'Field' },
    { value: 'gym', label: 'Gym' },
    { value: 'facility', label: 'Facility' },
    { value: 'stadium', label: 'Stadium' },
    { value: 'practice_field', label: 'Practice Field' },
    { value: 'batting_cage', label: 'Batting Cage' },
    { value: 'weight_room', label: 'Weight Room' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'other', label: 'Other' }
  ]
};

export default locationsService;

