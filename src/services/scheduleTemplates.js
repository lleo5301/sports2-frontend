import api from './api'

const scheduleTemplateService = {
  // Get all schedule templates
  getTemplates: async (params = {}) => {
    const response = await api.get('/schedule-templates', { params })
    return response.data
  },

  // Get a specific template
  getTemplate: async (id) => {
    const response = await api.get(`/schedule-templates/${id}`)
    return response.data
  },

  // Create a new template
  createTemplate: async (templateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(templateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedule-templates', filteredData)
    return response.data
  },

  // Update a template
  updateTemplate: async (id, templateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(templateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedule-templates/${id}`, filteredData)
    return response.data
  },

  // Delete a template
  deleteTemplate: async (id) => {
    const response = await api.delete(`/schedule-templates/${id}`)
    return response.data
  },

  // Duplicate a template
  duplicateTemplate: async (id, duplicateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(duplicateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post(`/schedule-templates/${id}/duplicate`, filteredData)
    return response.data
  }
}

export default scheduleTemplateService
