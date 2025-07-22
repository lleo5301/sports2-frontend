import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

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

const timeSlots = [
  '6:00', '6:15', '6:30', '6:45', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45',
  '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45', '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45',
  '3:00', '3:15', '3:30', '3:45', '4:00', '4:15', '4:30', '4:45', '5:00', '5:15', '5:30', '5:45'
]

const locations = [
  'Clubhouse', 'Weight Room', 'Field 1', 'Field 2', 'Stadium', 'Stadium Bullpen', 'Stadium Cages',
  'Conference Room', 'Press Box', 'San Palmilla', 'San Portella', 'RFL'
]

export default function TeamSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduleData, setScheduleData] = useState({
    team_name: '',
    program_name: '',
    date: selectedDate,
    motto: '',
    sections: []
  })
  const [editingSection, setEditingSection] = useState(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newSection, setNewSection] = useState({
    type: 'general',
    title: '',
    activities: []
  })
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    time: '',
    activity: '',
    location: '',
    staff: '',
    group: '',
    notes: ''
  })

  const queryClient = useQueryClient()

  // Fetch existing schedules
  const { data: schedules, isLoading } = useQuery(
    ['team-schedules'],
    () => api.get('/schedules'),
    {
      keepPreviousData: true
    }
  )

  // Save schedule mutation
  const saveScheduleMutation = useMutation(
    (scheduleData) => api.post('/schedules', scheduleData),
    {
      onSuccess: () => {
        toast.success('Schedule saved successfully!')
        queryClient.invalidateQueries(['team-schedules'])
        setScheduleData({
          team_name: '',
          program_name: '',
          date: selectedDate,
          motto: '',
          sections: []
        })
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to save schedule')
      }
    }
  )

  const handleSaveSchedule = () => {
    if (!scheduleData.team_name || !scheduleData.program_name) {
      toast.error('Please fill in team name and program name')
      return
    }
    saveScheduleMutation.mutate(scheduleData)
  }

  const addSection = () => {
    if (!newSection.title) {
      toast.error('Please enter a section title')
      return
    }
    
    setScheduleData(prev => ({
      ...prev,
      sections: [...prev.sections, { ...newSection, id: Date.now() }]
    }))
    setNewSection({ type: 'general', title: '', activities: [] })
    setShowAddSection(false)
  }

  const addActivity = (sectionId) => {
    if (!newActivity.time || !newActivity.activity) {
      toast.error('Please enter time and activity')
      return
    }

    setScheduleData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, activities: [...section.activities, { ...newActivity, id: Date.now() }] }
          : section
      )
    }))
    setNewActivity({ time: '', activity: '', location: '', staff: '', group: '', notes: '' })
    setShowAddActivity(false)
  }

  const [selectedSectionId, setSelectedSectionId] = useState(null)

  const removeActivity = (sectionId, activityId) => {
    setScheduleData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, activities: section.activities.filter(activity => activity.id !== activityId) }
          : section
      )
    }))
  }

  const removeSection = (sectionId) => {
    setScheduleData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }))
  }

  const getScheduleTypeInfo = (type) => {
    return scheduleTypes.find(t => t.id === type) || scheduleTypes[0]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Schedule Creator</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage detailed team schedules for practices, games, and training sessions.
          </p>
        </div>

        {/* Schedule Form */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="e.g., Los Angeles Angels"
                value={scheduleData.team_name}
                onChange={(e) => setScheduleData(prev => ({ ...prev, team_name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="e.g., Arizona Bridge Program"
                value={scheduleData.program_name}
                onChange={(e) => setScheduleData(prev => ({ ...prev, program_name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="input w-full"
                value={scheduleData.date}
                onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
              <input
                type="text"
                className="input w-full"
                placeholder="e.g., EXECUTION WINS"
                value={scheduleData.motto}
                onChange={(e) => setScheduleData(prev => ({ ...prev, motto: e.target.value }))}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-gray-900">Schedule Sections</h3>
              <button
                onClick={() => setShowAddSection(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Section
              </button>
            </div>

            {/* Add Section Modal */}
            {showAddSection && (
              <div className="card p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Add New Section</h4>
                  <button
                    onClick={() => setShowAddSection(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                    <select
                      className="input w-full"
                      value={newSection.type}
                      onChange={(e) => setNewSection(prev => ({ ...prev, type: e.target.value }))}
                    >
                      {scheduleTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="e.g., Position Players Schedule"
                      value={newSection.title}
                      onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowAddSection(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSection}
                    className="btn btn-primary btn-sm"
                  >
                    Add Section
                  </button>
                </div>
              </div>
            )}

            {/* Existing Sections */}
            {scheduleData.sections.map((section) => {
              const typeInfo = getScheduleTypeInfo(section.type)
              
              return (
                <div key={section.id} className="card">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeInfo.color}`}>
                          {typeInfo.name}
                        </span>
                        <h4 className="ml-3 font-semibold text-gray-900">{section.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSectionId(section.id)
                            setShowAddActivity(true)
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Activity
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="btn btn-ghost btn-sm text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Activities Table */}
                    {section.activities.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Activity</th>
                              <th>Location</th>
                              <th>Staff/Group</th>
                              <th>Notes</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.activities
                              .sort((a, b) => a.time.localeCompare(b.time))
                              .map((activity) => (
                                <tr key={activity.id}>
                                  <td className="font-medium">{activity.time}</td>
                                  <td>{activity.activity}</td>
                                  <td>{activity.location}</td>
                                  <td>{activity.staff || activity.group}</td>
                                  <td>{activity.notes}</td>
                                  <td>
                                    <button
                                      onClick={() => removeActivity(section.id, activity.id)}
                                      className="btn btn-ghost btn-sm text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-8 w-8 mx-auto mb-2" />
                        <p>No activities added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {scheduleData.sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p>No sections added yet. Click "Add Section" to get started.</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveSchedule}
              disabled={saveScheduleMutation.isLoading}
              className="btn btn-primary"
            >
              {saveScheduleMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Schedule
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Activity Modal */}
        {showAddActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Activity</h3>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    className="input w-full"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g., BREAKFAST, STRETCH, BULLPENS"
                    value={newActivity.activity}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, activity: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    className="input w-full"
                    value={newActivity.location}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff/Group</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g., PIVOT CULINARY, GROUP 1"
                    value={newActivity.staff}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, staff: e.target.value }))}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="textarea w-full"
                    rows="2"
                    placeholder="Additional notes or instructions..."
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addActivity(selectedSectionId)}
                  className="btn btn-primary"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 