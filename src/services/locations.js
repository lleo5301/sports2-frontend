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
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(locationData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/locations', filteredData);
    return response.data;
  },

  // Update a location
  updateLocation: async (id, locationData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(locationData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/locations/${id}`, filteredData);
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




