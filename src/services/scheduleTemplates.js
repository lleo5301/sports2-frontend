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
    const response = await api.post('/schedule-templates', templateData)
    return response.data
  },

  // Update a template
  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/schedule-templates/${id}`, templateData)
    return response.data
  },

  // Delete a template
  deleteTemplate: async (id) => {
    const response = await api.delete(`/schedule-templates/${id}`)
    return response.data
  },

  // Duplicate a template
  duplicateTemplate: async (id, duplicateData) => {
    const response = await api.post(`/schedule-templates/${id}/duplicate`, duplicateData)
    return response.data
  }
}

export default scheduleTemplateService
