import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playersService } from '../services/players';
import { reportsService } from '../services/reports';
import AccessibleModal from '../components/ui/AccessibleModal';

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerReports, setSelectedPlayerReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    status: '',
    school_type: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchPlayers();
  }, [filters, pagination.page]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Only add non-empty filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          params[key] = value;
        }
      });
      
      const response = await playersService.getPlayers(params);
      setPlayers(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0
      }));
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const fetchPlayerReports = async (playerId) => {
    try {
      setReportsLoading(true);
      const response = await reportsService.getScoutingReports({ player_id: playerId });
      
      if (response.success) {
        setSelectedPlayerReports(response.data);
      }
    } catch (error) {
      console.error('Error fetching player reports:', error);
      setSelectedPlayerReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setSelectedPlayerReports([]);
    setSelectedReport(null);
    fetchPlayerReports(player.id);
  };

  const handleReportSelect = async (reportId) => {
    try {
      const response = await reportsService.getScoutingReport(reportId);
      if (response.success) {
        setSelectedReport(response.data);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const formatReportDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getToolGrades = (report) => {
    const grades = [];
    if (report.overall_grade) grades.push(`Overall: ${report.overall_grade}`);
    if (report.hitting_grade) grades.push(`Hitting: ${report.hitting_grade}`);
    if (report.pitching_grade) grades.push(`Pitching: ${report.pitching_grade}`);
    if (report.fielding_grade) grades.push(`Fielding: ${report.fielding_grade}`);
    if (report.speed_grade) grades.push(`Speed: ${report.speed_grade}`);
    return grades;
  };

  if (loading && players.length === 0) {
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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                Players
              </h1>
              <p className="text-base-content/70">
                Manage your team's player roster
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/players/create')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Player
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search players..."
                  className="input input-bordered"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                  <option value="">All Positions</option>
                  <option value="P">Pitcher</option>
                  <option value="C">Catcher</option>
                  <option value="1B">First Base</option>
                  <option value="2B">Second Base</option>
                  <option value="3B">Third Base</option>
                  <option value="SS">Shortstop</option>
                  <option value="LF">Left Field</option>
                  <option value="CF">Center Field</option>
                  <option value="RF">Right Field</option>
                  <option value="OF">Outfield</option>
                  <option value="DH">Designated Hitter</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">School Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filters.school_type}
                  onChange={(e) => handleFilterChange('school_type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="HS">High School</option>
                  <option value="COLL">College</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>School</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td className="font-medium">
                        {player.first_name} {player.last_name}
                      </td>
                      <td>
                        <div className="badge badge-outline">{player.position}</div>
                      </td>
                      <td>{player.school}</td>
                      <td>{player.city}, {player.state}</td>
                      <td>
                        <div className={`badge ${
                          player.status === 'active' ? 'badge-success' :
                          player.status === 'inactive' ? 'badge-neutral' :
                          player.status === 'graduated' ? 'badge-info' :
                          'badge-warning'
                        }`}>
                          {player.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-sm btn-outline btn-info"
                            onClick={() => navigate(`/players/${player.id}`)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handlePlayerSelect(player)}
                          >
                            Quick View
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/players/${player.id}/edit`)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    «
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn ${pagination.page === pageNum ? 'btn-active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="join-item btn"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-4 text-sm text-base-content/70">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} players
            </div>
          </div>
        </div>
      </div>

      {/* Player Quick View Modal */}
      <AccessibleModal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        title={selectedPlayer ? `Quick View - ${selectedPlayer.first_name} ${selectedPlayer.last_name}` : ''}
        size="lg"
      >
        {selectedPlayer && (
          <>
            <AccessibleModal.Header
              title={`Quick View - ${selectedPlayer.first_name} ${selectedPlayer.last_name}`}
              onClose={() => setSelectedPlayer(null)}
            />
            <AccessibleModal.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Position:</span>
                    <span className="badge badge-outline">{selectedPlayer.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">School:</span>
                    <span>{selectedPlayer.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{selectedPlayer.city}, {selectedPlayer.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`badge ${
                      selectedPlayer.status === 'active' ? 'badge-success' :
                      selectedPlayer.status === 'inactive' ? 'badge-neutral' :
                      selectedPlayer.status === 'graduated' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {selectedPlayer.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Date of Birth:</span>
                    <span>{selectedPlayer.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Height:</span>
                    <span>{selectedPlayer.height || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight:</span>
                    <span>{selectedPlayer.weight ? `${selectedPlayer.weight} lbs` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bats:</span>
                    <span>{selectedPlayer.bats || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Reports Section */}
              {selectedPlayerReports.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-lg mb-4">Scouting Reports</h4>
                  {reportsLoading ? (
                    <div className="flex justify-center">
                      <div className="loading loading-spinner loading-md"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlayerReports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => handleReportSelect(report.id)}
                          className={`w-full text-left p-3 rounded border transition ${
                            selectedReport?.id === report.id
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{report.scout_name}</span>
                            <span className="text-sm text-gray-500">{formatReportDate(report.date)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Report Details */}
              {selectedReport && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-lg mb-4">Report Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Scout:</span>
                      <span>{selectedReport.scout_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{formatReportDate(selectedReport.date)}</span>
                    </div>
                    {getToolGrades(selectedReport).length > 0 && (
                      <div>
                        <span className="font-medium">Grades:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getToolGrades(selectedReport).map((grade, idx) => (
                            <span key={idx} className="badge badge-primary">
                              {grade}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedReport.notes && (
                      <div>
                        <span className="font-medium">Notes:</span>
                        <p className="mt-2 text-sm text-gray-700">{selectedReport.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AccessibleModal.Content>
            <AccessibleModal.Footer>
              <button
                className="btn"
                onClick={() => setSelectedPlayer(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(`/players/${selectedPlayer.id}`);
                  setSelectedPlayer(null);
                }}
              >
                Full Profile
              </button>
            </AccessibleModal.Footer>
          </>
        )}
      </AccessibleModal>
    </div>
  );
};

export default Players;