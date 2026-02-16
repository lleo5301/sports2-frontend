import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, GraduationCap, Target, FileText, Star, TrendingUp, AlertTriangle, User, BarChart3, Users, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import AccessibleModal from '../components/ui/AccessibleModal';

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch player details
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', id],
    queryFn: () => api.get(`/players/byId/${id}`),
    enabled: !!id
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: () => api.delete(`/players/byId/${id}`),
    onSuccess: () => {
      toast.success('Player deleted successfully');
      navigate('/players');
    },
    onError: () => {
      toast.error('Failed to delete player');
    }
  });

  const playerData = player?.data?.data;

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

  if (error || !playerData) {
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
    );
  }

  const handleDelete = () => {
    deletePlayerMutation.mutate();
  };

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
            {/* Player Photo */}
            {playerData.photo_url ? (
              <div className="avatar">
                <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={playerData.photo_url}
                    alt={`${playerData.first_name} ${playerData.last_name}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="bg-base-300 w-full h-full flex items-center justify-center text-2xl font-bold text-base-content/50">${(playerData.first_name?.[0] || '')}{(playerData.last_name?.[0] || '')}</div>`;
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20 h-20">
                  <span className="text-2xl font-bold">
                    {(playerData.first_name?.[0] || '')}{(playerData.last_name?.[0] || '')}
                  </span>
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                {playerData.jersey_number && (
                  <span className="text-4xl font-bold text-primary">#{playerData.jersey_number}</span>
                )}
                <h1 className="text-3xl font-bold text-base-content">
                  {playerData.first_name || 'Unknown'} {playerData.last_name || 'Player'}
                </h1>
              </div>
              <p className="text-base-content/70">
                {playerData.position || 'N/A'}
                {playerData.class_year && ` • ${playerData.class_year}`}
                {` • ${playerData.school_type || 'N/A'}`}
                {` • ${playerData.status || 'Unknown'}`}
              </p>
              {playerData.hometown && (
                <p className="text-sm text-base-content/60 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {playerData.hometown}
                </p>
              )}
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
                  <span className="font-medium">{playerData.position || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">School Type:</span>
                  <span className="font-medium">{playerData.school_type || 'N/A'}</span>
                </div>
                {playerData.height && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Height:</span>
                    <span className="font-medium">{playerData.height}</span>
                  </div>
                )}
                {playerData.weight && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Weight:</span>
                    <span className="font-medium">{playerData.weight} lbs</span>
                  </div>
                )}
                {playerData.birth_date && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Birth Date:</span>
                    <span className="font-medium">{new Date(playerData.birth_date).toLocaleDateString()}</span>
                  </div>
                )}
                {playerData.graduation_year && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Grad Year:</span>
                    <span className="font-medium">{playerData.graduation_year}</span>
                  </div>
                )}
                {playerData.class_year && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Class:</span>
                    <span className="font-medium">{playerData.class_year}</span>
                  </div>
                )}
                {(playerData.bats || playerData.throws) && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Bats/Throws:</span>
                    <span className="font-medium">
                      {playerData.bats || '-'}/{playerData.throws || '-'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Contact & Background</h2>
              <div className="space-y-3">
                {playerData.hometown && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{playerData.hometown}</span>
                  </div>
                )}
                {playerData.school && (
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{playerData.school}</span>
                  </div>
                )}
                {(playerData.high_school || playerData.high_school_city || playerData.high_school_state) && (
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm text-base-content/70">
                      HS: {[playerData.high_school, playerData.high_school_city, playerData.high_school_state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {playerData.previous_school && (
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm text-base-content/70">
                      Previous: {playerData.previous_school}
                    </span>
                  </div>
                )}
                {(playerData.city || playerData.state) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{[playerData.city, playerData.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {playerData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{playerData.phone}</span>
                  </div>
                )}
                {playerData.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-base-content/50 mr-2" />
                    <span className="text-sm">{playerData.email}</span>
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
                    !playerData.status ? 'badge-neutral' :
                      playerData.status === 'active' ? 'badge-success' :
                        playerData.status === 'inactive' ? 'badge-neutral' :
                          playerData.status === 'graduated' ? 'badge-info' :
                            'badge-warning'
                  }`}>
                    {playerData.status ? playerData.status.charAt(0).toUpperCase() + playerData.status.slice(1) : 'Unknown'}
                  </div>
                </div>
                {playerData.has_medical_issues && (
                  <div className="flex items-center text-error">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Medical Issues</span>
                  </div>
                )}
                {playerData.injury_details && (
                  <div className="text-sm text-base-content/70">
                    <span className="font-medium">Injury Details:</span>
                    <p className="mt-1">{playerData.injury_details}</p>
                  </div>
                )}
                {playerData.has_comparison && playerData.comparison_player && (
                  <div className="text-sm">
                    <span className="text-base-content/70">Comparison:</span>
                    <p className="font-medium">{playerData.comparison_player}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {playerData.bio && (
          <div className="card mb-8">
            <div className="card-body">
              <h2 className="card-title">About</h2>
              <p className="text-base-content/80 whitespace-pre-wrap">{playerData.bio}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Batting Stats */}
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Batting Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                {playerData.batting_avg && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{playerData.batting_avg}</div>
                    <div className="text-sm text-base-content/70">Batting Average</div>
                  </div>
                )}
                {playerData.home_runs && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{playerData.home_runs}</div>
                    <div className="text-sm text-base-content/70">Home Runs</div>
                  </div>
                )}
                {playerData.rbi && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{playerData.rbi}</div>
                    <div className="text-sm text-base-content/70">RBI</div>
                  </div>
                )}
                {playerData.stolen_bases && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{playerData.stolen_bases}</div>
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
                {playerData.era && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{playerData.era}</div>
                    <div className="text-sm text-base-content/70">ERA</div>
                  </div>
                )}
                {playerData.wins && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{playerData.wins}</div>
                    <div className="text-sm text-base-content/70">Wins</div>
                  </div>
                )}
                {playerData.losses && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-error">{playerData.losses}</div>
                    <div className="text-sm text-base-content/70">Losses</div>
                  </div>
                )}
                {playerData.strikeouts && (
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-2xl font-bold text-success">{playerData.strikeouts}</div>
                    <div className="text-sm text-base-content/70">Strikeouts</div>
                  </div>
                )}
                {playerData.innings_pitched && (
                  <div className="text-center p-3 bg-base-200 rounded-lg col-span-2">
                    <div className="text-2xl font-bold text-success">{playerData.innings_pitched}</div>
                    <div className="text-sm text-base-content/70">Innings Pitched</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="card mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <FileText className="w-5 h-5 mr-2" />
              Reports
            </h2>
            <p className="text-base-content/70 mb-6">
              Create detailed reports and analysis for {playerData.first_name} {playerData.last_name}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Performance Report */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Performance Report</h3>
                  </div>
                  <p className="text-sm text-base-content/70 mb-4">
                    Enter game performance statistics and data for this player
                  </p>
                  <Link
                    to={`/performance/entry?player=${id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Performance Data
                  </Link>
                </div>
              </div>

              {/* Scouting Report */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center mb-3">
                    <Target className="w-6 h-6 text-secondary mr-3" />
                    <h3 className="font-semibold">Scouting Report</h3>
                  </div>
                  <p className="text-sm text-base-content/70 mb-4">
                    Create detailed scouting evaluation with grades and observations
                  </p>
                  <Link
                    to={`/scouting/create?player=${id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Link>
                </div>
              </div>

              {/* Statistics Report */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-6 h-6 text-accent mr-3" />
                    <h3 className="font-semibold">Statistics Report</h3>
                  </div>
                  <p className="text-sm text-base-content/70 mb-4">
                    Generate statistical analysis and comparison reports
                  </p>
                  <Link
                    to={`/reports/create-statistics?player=${id}`}
                    className="btn btn-accent btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="divider">Quick Actions</div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/reports/create-custom?player=${id}`}
                className="btn btn-outline btn-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Custom Report
              </Link>
              <Link
                to={`/reports?player=${id}`}
                className="btn btn-ghost btn-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Player Video */}
        {playerData.video_url && (
          <div className="card mb-8">
            <div className="card-body">
              <h2 className="card-title">Player Video</h2>
              <video
                controls
                className="w-full max-w-2xl h-auto bg-black rounded-lg"
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${playerData.video_url}`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Scouting Reports */}
        {playerData.ScoutingReports && playerData.ScoutingReports.length > 0 && (
          <div className="card mb-8">
            <div className="card-body">
              <h2 className="card-title">Recent Scouting Reports</h2>
              <div className="space-y-4">
                {playerData.ScoutingReports.map((report) => (
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
        <AccessibleModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Player"
          size="md"
        >
          <AccessibleModal.Header
            title="Delete Player"
            onClose={() => setShowDeleteConfirm(false)}
          />
          <AccessibleModal.Content>
            <p className="py-4">
              Are you sure you want to delete {playerData.first_name || 'Unknown'} {playerData.last_name || 'Player'}? This action cannot be undone.
            </p>
          </AccessibleModal.Content>
          <AccessibleModal.Footer>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-error"
              disabled={deletePlayerMutation.isLoading}
            >
              {deletePlayerMutation.isLoading ? 'Deleting...' : 'Delete Player'}
            </button>
          </AccessibleModal.Footer>
        </AccessibleModal>
      </div>
    </div>
  );
}
