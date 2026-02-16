import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import scheduleTemplateService from '../services/scheduleTemplates';
import locationsService from '../services/locations';
import scheduleEventsService from '../services/scheduleEvents';
import { teamsService } from '../services/teams';
import toast from 'react-hot-toast';
import AccessibleModal from '../components/ui/AccessibleModal';

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
});

const scheduleTypes = [
  { id: 'general', name: 'General Schedule', color: 'bg-blue-100 text-blue-800' },
  { id: 'position_players', name: 'Position Players', color: 'bg-green-100 text-green-800' },
  { id: 'pitchers', name: 'Pitchers', color: 'bg-red-100 text-red-800' },
  { id: 'grinder_performance', name: 'Grinder - Performance', color: 'bg-purple-100 text-purple-800' },
  { id: 'grinder_hitting', name: 'Grinder - Hitting', color: 'bg-orange-100 text-orange-800' },
  { id: 'grinder_defensive', name: 'Grinder - Defensive', color: 'bg-teal-100 text-teal-800' },
  { id: 'bullpen', name: 'Bullpen Schedule', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'live_bp', name: 'Live BP Schedule', color: 'bg-pink-100 text-pink-800' }
];

const getScheduleTypeInfo = (type) => {
  return scheduleTypes.find(t => t.id === type) || scheduleTypes[0];
};

export default function ScheduleTemplates({ onLoadTemplate }) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    template_data: getBaseTemplate()
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: 'practice',
    location_id: '',
    start_time: '',
    end_time: '',
    priority: 'medium',
    event_dates: [{ event_date: '', notes: '' }]
  });

  const [newLocationForm, setNewLocationForm] = useState({
    name: '',
    location_type: 'field',
    address: '',
    city: '',
    state: ''
  });

  const [showNewLocationForm, setShowNewLocationForm] = useState(false);

  const queryClient = useQueryClient();

  // Fetch available teams
  const { data: teamsResponse, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsService.getAllTeams
  });

  const teams = teamsResponse?.data || teamsResponse || [];

  // Fetch templates
  const { data: templatesResponse, isLoading, error: templatesError } = useQuery({
    queryKey: ['schedule-templates'],
    queryFn: () => scheduleTemplateService.getTemplates(),
    retry: 3,
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to load templates');
    }
  });

  const templates = templatesResponse?.data || [];

  // Fetch locations
  const { data: locationsResponse } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsService.getLocations({ is_active: true }),
    enabled: showEventModal
  });

  const locations = locationsResponse?.data || [];

  // Fetch events for selected template
  const { data: eventsResponse } = useQuery({
    queryKey: ['schedule-events', selectedTemplate?.id],
    queryFn: () => scheduleEventsService.getScheduleEvents({
      schedule_template_id: selectedTemplate?.id
    }),
    enabled: !!selectedTemplate?.id
  });

  const templateEvents = eventsResponse?.data || [];

  // Mutations
  const createTemplateMutation = useMutation({
    mutationFn: (data) => scheduleTemplateService.createTemplate(data),
    onSuccess: () => {
      toast.success('Template created successfully!');
      queryClient.invalidateQueries(['schedule-templates']);
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create template');
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => scheduleTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      toast.success('Template updated successfully!');
      queryClient.invalidateQueries(['schedule-templates']);
      setShowEditModal(false);
      setSelectedTemplate(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update template');
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => scheduleTemplateService.deleteTemplate(id),
    onSuccess: () => {
      toast.success('Template deleted successfully!');
      queryClient.invalidateQueries(['schedule-templates']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete template');
    }
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => scheduleTemplateService.duplicateTemplate(id, data),
    onSuccess: () => {
      toast.success('Template duplicated successfully!');
      queryClient.invalidateQueries(['schedule-templates']);
      setShowDuplicateModal(false);
      setSelectedTemplate(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to duplicate template');
    }
  });

  // Location mutations
  const createLocationMutation = useMutation({
    mutationFn: (data) => locationsService.createLocation(data),
    onSuccess: (response) => {
      toast.success('Location created successfully!');
      queryClient.invalidateQueries(['locations']);
      setEventForm(prev => ({ ...prev, location_id: response.data.id }));
      setShowNewLocationForm(false);
      setNewLocationForm({
        name: '',
        location_type: 'field',
        address: '',
        city: '',
        state: ''
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create location');
    }
  });

  // Event mutations
  const createEventMutation = useMutation({
    mutationFn: (data) => scheduleEventsService.createScheduleEvent(data),
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries(['schedule-events']);
      setShowEventModal(false);
      resetEventForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  });

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      template_data: getBaseTemplate()
    });
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      event_type: 'practice',
      location_id: '',
      start_time: '',
      end_time: '',
      priority: 'medium',
      event_dates: [{ event_date: '', notes: '' }]
    });
    setSelectedEvent(null);
  };

  const handleCreateBaseTemplate = () => {
    setTemplateForm({
      name: 'Base Schedule Template',
      description: 'Complete schedule template with all section types',
      template_data: getBaseTemplate()
    });
    setShowCreateModal(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description || '',
      template_data: template.template_data
    });
    setShowEditModal(true);
  };

  const handleDuplicateTemplate = (template) => {
    setSelectedTemplate(template);
    setShowDuplicateModal(true);
  };

  const handleLoadTemplate = (template) => {
    // Store template data in localStorage to pass to TeamSchedule
    localStorage.setItem('loadedTemplate', JSON.stringify({
      name: template.name,
      template_data: template.template_data
    }));

    toast.success(`Loading template: ${template.name}`);

    // Navigate to team schedule page
    navigate('/team-schedule');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!templateForm.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    const data = {
      ...templateForm,
      template_data: templateForm.template_data
    };

    if (showEditModal && selectedTemplate) {
      updateTemplateMutation.mutate({ id: selectedTemplate.id, data });
    } else {
      createTemplateMutation.mutate(data);
    }
  };

  const handleDuplicateSubmit = (e) => {
    e.preventDefault();
    if (!templateForm.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    duplicateTemplateMutation.mutate({
      id: selectedTemplate.id,
      data: {
        name: templateForm.name,
        description: templateForm.description
      }
    });
  };

  const handleExportPDF = (template) => {
    // This would integrate with a PDF generation library
    toast.success(`PDF export for "${template.name}" would be implemented here`);
  };

  const handleManageEvents = (template) => {
    setSelectedTemplate(template);
    setShowEventModal(true);
  };

  const handleAddEventDate = () => {
    setEventForm(prev => ({
      ...prev,
      event_dates: [...prev.event_dates, { event_date: '', notes: '' }]
    }));
  };

  const handleRemoveEventDate = (index) => {
    setEventForm(prev => ({
      ...prev,
      event_dates: prev.event_dates.filter((_, i) => i !== index)
    }));
  };

  const handleEventDateChange = (index, field, value) => {
    setEventForm(prev => ({
      ...prev,
      event_dates: prev.event_dates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (eventForm.event_dates.some(date => !date.event_date)) {
      toast.error('All event dates are required');
      return;
    }

    createEventMutation.mutate({
      ...eventForm,
      schedule_template_id: selectedTemplate.id
    });
  };

  const handleSubmitNewLocation = (e) => {
    e.preventDefault();
    if (!newLocationForm.name.trim()) {
      toast.error('Location name is required');
      return;
    }

    createLocationMutation.mutate(newLocationForm);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
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
    );
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
                        <button onClick={() => handleManageEvents(template)}>
                          <Calendar className="h-4 w-4" />
                          Manage Events
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
                              deleteTemplateMutation.mutate(template.id);
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
                      const typeInfo = getScheduleTypeInfo(section.type);
                      return (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}
                        >
                          {section.title}
                        </span>
                      );
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
        <AccessibleModal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedTemplate(null);
            resetForm();
          }}
          title={showEditModal ? 'Edit Template' : 'Create New Template'}
          size="lg"
        >
          <AccessibleModal.Header
            title={showEditModal ? 'Edit Template' : 'Create New Template'}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedTemplate(null);
              resetForm();
            }}
          />
          <AccessibleModal.Content>
            <form onSubmit={handleSubmit} id="template-form" className="space-y-4">
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
                    const typeInfo = getScheduleTypeInfo(section.type);
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
                    );
                  })}
                </div>
              </div>
            </form>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedTemplate(null);
                resetForm();
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="template-form"
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
          </AccessibleModal.Footer>
        </AccessibleModal>

        {/* Duplicate Modal */}
        <AccessibleModal
          isOpen={showDuplicateModal && !!selectedTemplate}
          onClose={() => {
            setShowDuplicateModal(false);
            setSelectedTemplate(null);
          }}
          title="Duplicate Template"
          size="md"
        >
          <AccessibleModal.Header
            title="Duplicate Template"
            onClose={() => {
              setShowDuplicateModal(false);
              setSelectedTemplate(null);
            }}
          />
          <AccessibleModal.Content>
            <form onSubmit={handleDuplicateSubmit} id="duplicate-form" className="space-y-4">
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
            </form>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              type="button"
              onClick={() => {
                setShowDuplicateModal(false);
                setSelectedTemplate(null);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="duplicate-form"
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
          </AccessibleModal.Footer>
        </AccessibleModal>

        {/* Event Management Modal */}
        <AccessibleModal
          isOpen={showEventModal && !!selectedTemplate}
          onClose={() => {
            setShowEventModal(false);
            setSelectedTemplate(null);
            resetEventForm();
            setShowNewLocationForm(false);
          }}
          title={selectedTemplate ? `Manage Events - ${selectedTemplate.name}` : 'Manage Events'}
          size="xl"
        >
          <AccessibleModal.Header
            title={selectedTemplate ? `Manage Events - ${selectedTemplate.name}` : 'Manage Events'}
            onClose={() => {
              setShowEventModal(false);
              setSelectedTemplate(null);
              resetEventForm();
              setShowNewLocationForm(false);
            }}
          />
          <AccessibleModal.Content>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Events */}
              <div>
                <h4 className="font-semibold mb-3">Existing Events ({templateEvents.length})</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {templateEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{event.title}</h5>
                          <p className="text-sm text-base-content/70">
                            {event.event_type} • {event.EventDates?.length || 0} dates
                          </p>
                        </div>
                        <button className="btn btn-sm btn-ghost">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {templateEvents.length === 0 && (
                    <p className="text-center text-base-content/50 py-4">
                        No events created yet
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Event Form */}
              <div>
                <h4 className="font-semibold mb-3">Add New Event</h4>
                <form onSubmit={handleSubmitEvent} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Event Title *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">
                        <span className="label-text">Event Type</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={eventForm.event_type}
                        onChange={(e) => setEventForm(prev => ({ ...prev, event_type: e.target.value }))}
                      >
                        {scheduleEventsService.getEventTypes().map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Priority</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={eventForm.priority}
                        onChange={(e) => setEventForm(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        {scheduleEventsService.getPriorityLevels().map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Selection with Add New Option */}
                  <div>
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="select select-bordered flex-1"
                        value={eventForm.location_id}
                        onChange={(e) => {
                          if (e.target.value === 'add_new') {
                            setShowNewLocationForm(true);
                          } else {
                            setEventForm(prev => ({ ...prev, location_id: e.target.value }));
                          }
                        }}
                      >
                        <option value="">Select location (optional)</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.id}>
                            {location.name} ({location.location_type})
                          </option>
                        ))}
                        <option value="add_new">+ Add New Location</option>
                      </select>
                    </div>
                  </div>

                  {/* New Location Form */}
                  {showNewLocationForm && (
                    <div className="p-4 bg-base-200 rounded-lg">
                      <h5 className="font-medium mb-3">Add New Location</h5>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Location name *"
                            value={newLocationForm.name}
                            onChange={(e) => setNewLocationForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="select select-bordered"
                            value={newLocationForm.location_type}
                            onChange={(e) => setNewLocationForm(prev => ({ ...prev, location_type: e.target.value }))}
                          >
                            {locationsService.getLocationTypes().map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Address"
                            value={newLocationForm.address}
                            onChange={(e) => setNewLocationForm(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSubmitNewLocation}
                            disabled={createLocationMutation.isLoading}
                            className="btn btn-sm btn-primary"
                          >
                            {createLocationMutation.isLoading ? (
                              <div className="loading loading-spinner loading-sm"></div>
                            ) : (
                              'Add Location'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewLocationForm(false);
                              setNewLocationForm({
                                name: '',
                                location_type: 'field',
                                address: '',
                                city: '',
                                state: ''
                              });
                            }}
                            className="btn btn-sm btn-outline"
                          >
                              Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">
                        <span className="label-text">Start Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={eventForm.start_time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">End Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered w-full"
                        value={eventForm.end_time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, end_time: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Event Dates */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label-text font-medium">Event Dates *</label>
                      <button
                        type="button"
                        onClick={handleAddEventDate}
                        className="btn btn-xs btn-outline"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                          Add Date
                      </button>
                    </div>
                    <div className="space-y-2">
                      {eventForm.event_dates.map((dateEntry, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="date"
                            className="input input-bordered flex-1"
                            value={dateEntry.event_date}
                            onChange={(e) => handleEventDateChange(index, 'event_date', e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Notes (optional)"
                            value={dateEntry.notes}
                            onChange={(e) => handleEventDateChange(index, 'notes', e.target.value)}
                          />
                          {eventForm.event_dates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEventDate(index)}
                              className="btn btn-sm btn-outline btn-error"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows="2"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={createEventMutation.isLoading}
                    className="btn btn-primary w-full"
                  >
                    {createEventMutation.isLoading ? (
                      <>
                        <div className="loading loading-spinner loading-sm mr-2"></div>
                          Creating Event...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                          Create Event
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              type="button"
              onClick={() => {
                setShowEventModal(false);
                setSelectedTemplate(null);
                resetEventForm();
                setShowNewLocationForm(false);
              }}
              className="btn btn-outline"
            >
              Close
            </button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      </div>
    </div>
  );
}
