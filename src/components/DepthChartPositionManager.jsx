import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Save, X, Palette, Hash } from 'lucide-react'
import api from '../services/api'

const iconOptions = [
  { value: 'Shield', label: 'Shield' },
  { value: 'Target', label: 'Target' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Users', label: 'Users' },
  { value: 'Star', label: 'Star' },
  { value: 'Award', label: 'Award' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'TrendingDown', label: 'Trending Down' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'MapPin', label: 'Map Pin' },
  { value: 'Brain', label: 'Brain' }
]

const colorOptions = [
  { value: '#EF4444', label: 'Red' },
  { value: '#F97316', label: 'Orange' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EAB308', label: 'Yellow' },
  { value: '#84CC16', label: 'Lime' },
  { value: '#22C55E', label: 'Green' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#A855F7', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#F43F5E', label: 'Rose' },
  { value: '#6B7280', label: 'Gray' }
]

export default function DepthChartPositionManager({ depthChartId, positions = [], onPositionsChange }) {
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [newPosition, setNewPosition] = useState({
    position_code: '',
    position_name: '',
    color: '#6B7280',
    icon: 'Shield',
    sort_order: positions.length + 1,
    max_players: null,
    description: ''
  })

  const addPositionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(`/depth-charts/byId/${depthChartId}/positions`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', depthChartId])
      setShowAddModal(false)
      setNewPosition({
        position_code: '',
        position_name: '',
        color: '#6B7280',
        icon: 'Shield',
        sort_order: positions.length + 1,
        max_players: null,
        description: ''
      })
      toast.success('Position added successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add position')
    }
  })

  const updatePositionMutation = useMutation({
    mutationFn: async ({ positionId, data }) => {
      const response = await api.put(`/depth-charts/positions/byId/${positionId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', depthChartId])
      setEditingPosition(null)
      toast.success('Position updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update position')
    }
  })

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId) => {
      const response = await api.delete(`/depth-charts/positions/byId/${positionId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['depth-chart', depthChartId])
      toast.success('Position deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete position')
    }
  })

  const handleAddPosition = () => {
    addPositionMutation.mutate(newPosition)
  }

  const handleUpdatePosition = () => {
    updatePositionMutation.mutate({
      positionId: editingPosition.id,
      data: editingPosition
    })
  }

  const handleDeletePosition = (positionId) => {
    if (window.confirm('Are you sure you want to delete this position? This will also remove all player assignments.')) {
      deletePositionMutation.mutate(positionId)
    }
  }

  const startEditing = (position) => {
    setEditingPosition({ ...position })
  }

  const cancelEditing = () => {
    setEditingPosition(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Position Configuration</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
          disabled={addPositionMutation.isLoading}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Position
        </button>
      </div>

      {/* Positions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((position) => (
          <div key={position.id} className="card">
            <div className="p-4">
              {editingPosition?.id === position.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: editingPosition.color }}
                      ></div>
                      <input
                        type="text"
                        className="input input-sm input-bordered w-24"
                        value={editingPosition.position_code}
                        onChange={(e) => setEditingPosition(prev => ({ ...prev, position_code: e.target.value }))}
                        placeholder="Code"
                      />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={handleUpdatePosition}
                        className="btn btn-sm btn-success"
                        disabled={updatePositionMutation.isLoading}
                      >
                        <Save className="h-3 w-3" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-sm btn-ghost"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full"
                    value={editingPosition.position_name}
                    onChange={(e) => setEditingPosition(prev => ({ ...prev, position_name: e.target.value }))}
                    placeholder="Position Name"
                  />
                  <div className="flex gap-2">
                    <select
                      className="select select-sm select-bordered flex-1"
                      value={editingPosition.color}
                      onChange={(e) => setEditingPosition(prev => ({ ...prev, color: e.target.value }))}
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-sm select-bordered flex-1"
                      value={editingPosition.icon}
                      onChange={(e) => setEditingPosition(prev => ({ ...prev, icon: e.target.value }))}
                    >
                      {iconOptions.map(icon => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="input input-sm input-bordered w-20"
                      value={editingPosition.sort_order}
                      onChange={(e) => setEditingPosition(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      placeholder="Order"
                    />
                    <input
                      type="number"
                      className="input input-sm input-bordered w-24"
                      value={editingPosition.max_players || ''}
                      onChange={(e) => setEditingPosition(prev => ({ ...prev, max_players: e.target.value ? parseInt(e.target.value) : null }))}
                      placeholder="Max Players"
                    />
                  </div>
                  <textarea
                    className="textarea textarea-sm textarea-bordered w-full"
                    value={editingPosition.description || ''}
                    onChange={(e) => setEditingPosition(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: position.color }}
                      ></div>
                      <div>
                        <h4 className="font-semibold">{position.position_name}</h4>
                        <p className="text-sm text-gray-500">{position.position_code}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(position)}
                        className="btn btn-sm btn-ghost"
                        title="Edit Position"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        className="btn btn-sm btn-ghost text-red-600 hover:text-red-700"
                        title="Delete Position"
                        disabled={deletePositionMutation.isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Palette className="h-3 w-3" />
                      <span>Icon: {position.icon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3" />
                      <span>Order: {position.sort_order}</span>
                      {position.max_players && (
                        <span>• Max: {position.max_players}</span>
                      )}
                    </div>
                    {position.description && (
                      <p className="text-xs text-gray-500">{position.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Position</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Position Code *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newPosition.position_code}
                    onChange={(e) => setNewPosition(prev => ({ ...prev, position_code: e.target.value }))}
                    placeholder="e.g., P, C, 1B"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Sort Order</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newPosition.sort_order}
                    onChange={(e) => setNewPosition(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Position Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newPosition.position_name}
                  onChange={(e) => setNewPosition(prev => ({ ...prev, position_name: e.target.value }))}
                  placeholder="e.g., Pitcher, Catcher"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Color</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newPosition.color}
                    onChange={(e) => setNewPosition(prev => ({ ...prev, color: e.target.value }))}
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Icon</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newPosition.icon}
                    onChange={(e) => setNewPosition(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Max Players</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={newPosition.max_players || ''}
                  onChange={(e) => setNewPosition(prev => ({ ...prev, max_players: e.target.value ? parseInt(e.target.value) : null }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newPosition.description}
                  onChange={(e) => setNewPosition(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddPosition}
                disabled={!newPosition.position_code || !newPosition.position_name || addPositionMutation.isLoading}
              >
                {addPositionMutation.isLoading ? 'Adding...' : 'Add Position'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 