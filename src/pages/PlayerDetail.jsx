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

  const player = playerData?.data?.data
  
  // Debug logging
  console.log('PlayerDetail - id:', id)
  console.log('PlayerDetail - isLoading:', isLoading)
  console.log('PlayerDetail - error:', error)
  console.log('PlayerDetail - playerData:', playerData)
  console.log('PlayerDetail - player:', player)

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

  if (error || !player) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Player not found or error loading player details.</span>
          </div>
          <div className="mt-4">
            <Link to="/players" className="btn btn-primary">
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/players" className="btn btn-outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Players
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                {player.first_name || 'Unknown'} {player.last_name || 'Player'}
              </h1>
              <p className="text-base-content/70">
                {player.position || 'N/A'} • {player.school_type || 'N/A'} • {player.status || 'Unknown'}
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
              className="btn btn-outline btn-error"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Player
            </button>
          </div>
        </div>

        {/* Player Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Basic Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Position:</span>
                  <span className="font-medium">{player.position || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">School Type:</span>
                  <span className="font-medium">{player.school_type || 'N/A'}</span>
                </div>
                {player.height && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Height:</span>
                    <span className="font-medium">{player.height}</span>
                  </div>
                )}
                {player.weight && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Weight:</span>
                    <span className="font-medium">{player.weight} lbs</span>
                  </div>
                )}
                {player.birth_date && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Birth Date:</span>
                    <span className="font-medium">{new Date(player.birth_date).toLocaleDateString()}</span>
                  </div>
                )}
                {player.graduation_year && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Grad Year:</span>
                    <span className="font-medium">{player.graduation_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Contact Information</h2>
              <div className="space-y-3">
                {player.school && (
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{player.school}</span>
                  </div>
                )}
                {(player.city || player.state) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{[player.city, player.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {player.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{player.phone}</span>
                  </div>
                )}
                {player.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{player.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status & Medical */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Status & Medical</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Status:</span>
                  <div className={`badge ${
                    !player.status ? 'badge-neutral' :
                    player.status === 'active' ? 'badge-success' :
                    player.status === 'inactive' ? 'badge-neutral' :
                    player.status === 'graduated' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {player.status ? player.status.charAt(0).toUpperCase() + player.status.slice(1) : 'Unknown'}
                  </div>
                </div>
                {player.has_medical_issues && (
                  <div className="flex items-center text-error">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Medical Issues</span>
                  </div>
                )}
                {player.injury_details && (
                  <div className="text-sm text-base-content/70">
                    <span className="font-medium">Injury Details:</span>
                    <p className="mt-1">{player.injury_details}</p>
                  </div>
                )}
                {player.has_comparison && player.comparison_player && (
                  <div className="text-sm">
                    <span className="text-base-content/70">Comparison:</span>
                    <p className="font-medium">{player.comparison_player}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Batting Stats */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Batting Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                {player.batting_avg && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{player.batting_avg}</div>
                    <div className="text-sm text-base-content/70">Batting Average</div>
                  </div>
                )}
                {player.home_runs && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{player.home_runs}</div>
                    <div className="text-sm text-base-content/70">Home Runs</div>
                  </div>
                )}
                {player.rbi && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{player.rbi}</div>
                    <div className="text-sm text-base-content/70">RBI</div>
                  </div>
                )}
                {player.stolen_bases && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{player.stolen_bases}</div>
                    <div className="text-sm text-base-content/70">Stolen Bases</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pitching Stats */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Pitching Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                {player.era && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{player.era}</div>
                    <div className="text-sm text-base-content/70">ERA</div>
                  </div>
                )}
                {player.wins && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{player.wins}</div>
                    <div className="text-sm text-base-content/70">Wins</div>
                  </div>
                )}
                {player.losses && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-error">{player.losses}</div>
                    <div className="text-sm text-base-content/70">Losses</div>
                  </div>
                )}
                {player.strikeouts && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{player.strikeouts}</div>
                    <div className="text-sm text-base-content/70">Strikeouts</div>
                  </div>
                )}
                {player.innings_pitched && (
                  <div className="text-center p-3 bg-base-200 rounded-lg col-span-2">
                    <div className="text-2xl font-bold text-success">{player.innings_pitched}</div>
                    <div className="text-sm text-base-content/70">Innings Pitched</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scouting Reports */}
        {player.ScoutingReports && player.ScoutingReports.length > 0 && (
          <div className="card mb-8">
            <div className="card-body">
              <h2 className="card-title">Recent Scouting Reports</h2>
              <div className="space-y-4">
                {player.ScoutingReports.map((report) => (
                  <div key={report.id} className="border border-base-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-base-content">
                          Report by {report.Creator?.first_name} {report.Creator?.last_name}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {report.overall_grade && (
                        <div className="badge badge-primary">
                          Grade: {report.overall_grade}
                        </div>
                      )}
                    </div>
                    {report.notes && (
                      <p className="text-sm text-base-content/70">{report.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Player</h3>
              <p className="py-4">
                Are you sure you want to delete {player.first_name || 'Unknown'} {player.last_name || 'Player'}? This action cannot be undone.
              </p>
              <div className="modal-action">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-error"
                  disabled={deletePlayer.isLoading}
                >
                  {deletePlayer.isLoading ? 'Deleting...' : 'Delete Player'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 