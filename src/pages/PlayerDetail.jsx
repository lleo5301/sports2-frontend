import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, GraduationCap, Target, FileText, Star, TrendingUp, AlertTriangle, User } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function PlayerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch player details
  const { data: playerData, isLoading, error } = useQuery(
    ['player', id],
    () => api.get(`/players/${id}`),
    {
      staleTime: 30000
    }
  )

  // Delete player mutation
  const deletePlayer = useMutation(
    () => api.delete(`/players/${id}`),
    {
      onSuccess: () => {
        toast.success('Player deleted successfully')
        navigate('/players')
      },
      onError: () => {
        toast.error('Failed to delete player')
      }
    }
  )

  const player = playerData?.data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading player details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="space-y-6">
        <div className="card p-8">
          <div className="text-center">
            <p className="text-red-600">Player not found or error loading player details.</p>
            <Link to="/players" className="btn btn-primary mt-4">
              Back to Players
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    deletePlayer.mutate()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Link to="/players" className="btn btn-outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {player.first_name} {player.last_name}
            </h1>
            <p className="text-sm text-gray-500">
              {player.position} • {player.school_type} • {player.status}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/players/${id}/edit`}
            className="btn btn-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Player
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Player Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Position:</span>
              <span className="font-medium">{player.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">School Type:</span>
              <span className="font-medium">{player.school_type}</span>
            </div>
            {player.height && (
              <div className="flex justify-between">
                <span className="text-gray-500">Height:</span>
                <span className="font-medium">{player.height}</span>
              </div>
            )}
            {player.weight && (
              <div className="flex justify-between">
                <span className="text-gray-500">Weight:</span>
                <span className="font-medium">{player.weight} lbs</span>
              </div>
            )}
            {player.birth_date && (
              <div className="flex justify-between">
                <span className="text-gray-500">Birth Date:</span>
                <span className="font-medium">{new Date(player.birth_date).toLocaleDateString()}</span>
              </div>
            )}
            {player.graduation_year && (
              <div className="flex justify-between">
                <span className="text-gray-500">Grad Year:</span>
                <span className="font-medium">{player.graduation_year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            {player.school && (
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{player.school}</span>
              </div>
            )}
            {(player.city || player.state) && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{[player.city, player.state].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {player.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{player.phone}</span>
              </div>
            )}
            {player.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{player.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status & Medical */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Medical</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                player.status === 'active' ? 'bg-green-100 text-green-800' :
                player.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                player.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
              </span>
            </div>
            {player.has_medical_issues && (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Medical Issues</span>
              </div>
            )}
            {player.injury_details && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Injury Details:</span>
                <p className="mt-1">{player.injury_details}</p>
              </div>
            )}
            {player.has_comparison && player.comparison_player && (
              <div className="text-sm">
                <span className="text-gray-500">Comparison:</span>
                <p className="font-medium">{player.comparison_player}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Stats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Batting Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {player.batting_avg && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{player.batting_avg}</div>
                <div className="text-sm text-gray-500">Batting Average</div>
              </div>
            )}
            {player.home_runs && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{player.home_runs}</div>
                <div className="text-sm text-gray-500">Home Runs</div>
              </div>
            )}
            {player.rbi && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{player.rbi}</div>
                <div className="text-sm text-gray-500">RBI</div>
              </div>
            )}
            {player.stolen_bases && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{player.stolen_bases}</div>
                <div className="text-sm text-gray-500">Stolen Bases</div>
              </div>
            )}
          </div>
        </div>

        {/* Pitching Stats */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pitching Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {player.era && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{player.era}</div>
                <div className="text-sm text-gray-500">ERA</div>
              </div>
            )}
            {player.wins && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{player.wins}</div>
                <div className="text-sm text-gray-500">Wins</div>
              </div>
            )}
            {player.losses && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{player.losses}</div>
                <div className="text-sm text-gray-500">Losses</div>
              </div>
            )}
            {player.strikeouts && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{player.strikeouts}</div>
                <div className="text-sm text-gray-500">Strikeouts</div>
              </div>
            )}
            {player.innings_pitched && (
              <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                <div className="text-2xl font-bold text-green-600">{player.innings_pitched}</div>
                <div className="text-sm text-gray-500">Innings Pitched</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scouting Reports */}
      {player.ScoutingReports && player.ScoutingReports.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Scouting Reports</h2>
          <div className="space-y-4">
            {player.ScoutingReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Report by {report.Creator?.first_name} {report.Creator?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {report.overall_grade && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Grade: {report.overall_grade}
                    </span>
                  )}
                </div>
                {report.notes && (
                  <p className="text-sm text-gray-600">{report.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Player</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {player.first_name} {player.last_name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-red-600 text-white hover:bg-red-700"
                disabled={deletePlayer.isLoading}
              >
                {deletePlayer.isLoading ? 'Deleting...' : 'Delete Player'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 