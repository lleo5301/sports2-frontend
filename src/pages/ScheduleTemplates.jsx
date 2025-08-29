import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Save,
  X,
  Eye,
  Star,
  Calendar
} from 'lucide-react'
import scheduleTemplateService from '../services/scheduleTemplates'
import { teamsService } from '../services/teams'
import toast from 'react-hot-toast'

// Base template data with all schedule types
const getBaseTemplate = () => ({
  sections: [
    {
      id: 'general',
      type: 'general',
      title: 'General Schedule',
      activities: []
    },
    {
      id: 'position_players',
      type: 'position_players',
      title: 'Position Players Schedule',
      activities: []
    },
    {
      id: 'pitchers',
      type: 'pitchers',
      title: 'Pitchers Schedule',
      activities: []
    },
    {
      id: 'grinder_performance',
      type: 'grinder_performance',
      title: 'Grinder - Performance',
      activities: []
    },
    {
      id: 'grinder_hitting',
      type: 'grinder_hitting',
      title: 'Grinder - Hitting',
      activities: []
    },
    {
      id: 'grinder_defensive',
      type: 'grinder_defensive',
      title: 'Grinder - Defensive',
      activities: []
    },
    {
      id: 'bullpen',
      type: 'bullpen',
      title: 'Bullpen Schedule',
      activities: []
    },
    {
      id: 'live_bp',
      type: 'live_bp',
      title: 'Live BP Schedule',
      activities: []
    }
  ]
})

const scheduleTypes = [
  { id: 'general', name: 'General Schedule', color: 'bg-blue-100 text-blue-800' },
  { id: 'position_players', name: 'Position Players', color: 'bg-green-100 text-green-800' },
  { id: 'pitchers', name: 'Pitchers', color: 'bg-red-100 text-red-800' },
  { id: 'grinder_performance', name: 'Grinder - Performance', color: 'bg-purple-100 text-purple-800' },
  { id: 'grinder_hitting', name: 'Grinder - Hitting', color: 'bg-orange-100 text-orange-800' },
  { id: 'grinder_defensive', name: 'Grinder - Defensive', color: 'bg-teal-100 text-teal-800' },
  { id: 'bullpen', name: 'Bullpen Schedule', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'live_bp', name: 'Live BP Schedule', color: 'bg-pink-100 text-pink-800' }
]

const getScheduleTypeInfo = (type) => {
  return scheduleTypes.find(t => t.id === type) || scheduleTypes[0]
}

export default function ScheduleTemplates({ onLoadTemplate }) {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    template_data: getBaseTemplate()
  })

  const queryClient = useQueryClient()

  // Fetch available teams
  const { data: teamsResponse, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getAllTeams
  })

  const teams = teamsResponse?.data || teamsResponse || []

  // Fetch templates
  const { data: templatesResponse, isLoading, error: templatesError } = useQuery({
    queryKey: ['schedule-templates'],
    queryFn: () => scheduleTemplateService.getTemplates(),
    retry: 3,
    onError: (error) => {
      console.error('Error fetching templates:', error);
      toast.error(error.response?.data?.error || 'Failed to load templates');
    }
  })

  const templates = templatesResponse?.data || []

  // Mutations
  const createTemplateMutation = useMutation({
    mutationFn: (data) => scheduleTemplateService.createTemplate(data),
    onSuccess: () => {
      toast.success('Template created successfully!')
      queryClient.invalidateQueries(['schedule-templates'])
      setShowCreateModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create template')
    }
  })

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => scheduleTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      toast.success('Template updated successfully!')
      queryClient.invalidateQueries(['schedule-templates'])
      setShowEditModal(false)
      setSelectedTemplate(null)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update template')
    }
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => scheduleTemplateService.deleteTemplate(id),
    onSuccess: () => {
      toast.success('Template deleted successfully!')
      queryClient.invalidateQueries(['schedule-templates'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete template')
    }
  })

  const duplicateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => scheduleTemplateService.duplicateTemplate(id, data),
    onSuccess: () => {
      toast.success('Template duplicated successfully!')
      queryClient.invalidateQueries(['schedule-templates'])
      setShowDuplicateModal(false)
      setSelectedTemplate(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to duplicate template')
    }
  })

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      template_data: getBaseTemplate()
    })
  }

  const handleCreateBaseTemplate = () => {
    setTemplateForm({
      name: 'Base Schedule Template',
      description: 'Complete schedule template with all section types',
      template_data: getBaseTemplate()
    })
    setShowCreateModal(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setTemplateForm({
      name: template.name,
      description: template.description || '',
      template_data: template.template_data
    })
    setShowEditModal(true)
  }

  const handleDuplicateTemplate = (template) => {
    setSelectedTemplate(template)
    setShowDuplicateModal(true)
  }

  const handleLoadTemplate = (template) => {
    // Store template data in localStorage to pass to TeamSchedule
    localStorage.setItem('loadedTemplate', JSON.stringify({
      name: template.name,
      template_data: template.template_data
    }))
    
    toast.success(`Loading template: ${template.name}`)
    
    // Navigate to team schedule page
    navigate('/team-schedule')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!templateForm.name.trim()) {
      toast.error('Template name is required')
      return
    }

    const data = {
      ...templateForm,
      template_data: templateForm.template_data
    }

    if (showEditModal && selectedTemplate) {
      updateTemplateMutation.mutate({ id: selectedTemplate.id, data })
    } else {
      createTemplateMutation.mutate(data)
    }
  }

  const handleDuplicateSubmit = (e) => {
    e.preventDefault()
    if (!templateForm.name.trim()) {
      toast.error('Template name is required')
      return
    }

    duplicateTemplateMutation.mutate({
      id: selectedTemplate.id,
      data: {
        name: templateForm.name,
        description: templateForm.description
      }
    })
  }

  const handleExportPDF = (template) => {
    // This would integrate with a PDF generation library
    toast.success(`PDF export for "${template.name}" would be implemented here`)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (templatesError) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Failed to Load Templates</h3>
              <div className="text-sm">
                {templatesError.response?.data?.error || templatesError.message || 'Unable to connect to the server'}
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-sm btn-outline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                Schedule Templates
              </h1>
              <p className="text-base-content/70">
                Create and manage reusable schedule templates for your team practices and games.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateBaseTemplate}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Base Template
              </button>
                          <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              New Template
            </button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="card-title text-lg">{template.name}</h3>
                    {template.is_default && (
                      <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                      ⋮
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                      <li>
                        <button onClick={() => handleLoadTemplate(template)}>
                          <Eye className="h-4 w-4" />
                          Load Template
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="h-4 w-4" />
                          Duplicate
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleExportPDF(template)}>
                          <Download className="h-4 w-4" />
                          Export PDF
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this template?')) {
                              deleteTemplateMutation.mutate(template.id)
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-base-content/70 mt-2">{template.description}</p>
                )}

                <div className="mt-4">
                  <div className="text-xs text-base-content/50 mb-2">
                    {template.template_data?.sections?.length || 0} sections
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.template_data?.sections?.slice(0, 3).map((section, index) => {
                      const typeInfo = getScheduleTypeInfo(section.type)
                      return (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}
                        >
                          {section.title}
                        </span>
                      )
                    })}
                    {template.template_data?.sections?.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        +{template.template_data.sections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-actions justify-between items-center mt-4">
                  <div className="text-xs text-base-content/50">
                    Created by {template.Creator?.first_name} {template.Creator?.last_name}
                  </div>
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="btn btn-primary btn-sm"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-base-content/30" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No Templates Yet</h3>
            <p className="text-base-content/70 mb-4">
              Create your first schedule template to get started with reusable schedules.
            </p>
            <button
              onClick={handleCreateBaseTemplate}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Base Template
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {showEditModal ? 'Edit Template' : 'Create New Template'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="e.g., Practice Schedule Template"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content mb-1">
                      Description
                    </label>
                    <textarea
                      className="textarea w-full"
                      rows="3"
                      placeholder="Describe what this template is for..."
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Template Sections ({templateForm.template_data.sections.length})
                    </label>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {templateForm.template_data.sections.map((section, index) => {
                        const typeInfo = getScheduleTypeInfo(section.type)
                        return (
                          <div key={section.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium mr-3 ${typeInfo.color}`}>
                                {typeInfo.name}
                              </span>
                              <span className="font-medium">{section.title}</span>
                            </div>
                            <div className="text-sm text-base-content/70">
                              {section.activities?.length || 0} activities
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setSelectedTemplate(null)
                      resetForm()
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTemplateMutation.isLoading || updateTemplateMutation.isLoading}
                    className="btn btn-primary"
                  >
                    {createTemplateMutation.isLoading || updateTemplateMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        {showEditModal ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {showEditModal ? 'Update Template' : 'Create Template'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Duplicate Modal */}
        {showDuplicateModal && selectedTemplate && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Duplicate Template</h3>

              <form onSubmit={handleDuplicateSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-1">
                      New Template Name *
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="e.g., Practice Schedule Template (Copy)"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content mb-1">
                      Description
                    </label>
                    <textarea
                      className="textarea w-full"
                      rows="2"
                      placeholder="Describe this duplicate template..."
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDuplicateModal(false)
                      setSelectedTemplate(null)
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={duplicateTemplateMutation.isLoading}
                    className="btn btn-primary"
                  >
                    {duplicateTemplateMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm"></div>
                        Duplicating...
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Template
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
