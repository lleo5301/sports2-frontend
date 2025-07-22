import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playersService } from '../services/players';

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
                            className="btn btn-sm btn-outline"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => navigate(`/players/${player.id}`)}
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

      {/* Player View Modal */}
      {selectedPlayer && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {selectedPlayer.first_name} {selectedPlayer.last_name}
            </h3>
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
                  <span className="font-medium">Height:</span>
                  <span>{selectedPlayer.height || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span>{selectedPlayer.weight ? `${selectedPlayer.weight} lbs` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Graduation Year:</span>
                  <span>{selectedPlayer.graduation_year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">School Type:</span>
                  <span className="badge badge-outline">{selectedPlayer.school_type}</span>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Performance Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedPlayer.batting_avg || 'N/A'}</div>
                  <div className="text-sm text-base-content/70">Batting Avg</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{selectedPlayer.home_runs || '0'}</div>
                  <div className="text-sm text-base-content/70">Home Runs</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{selectedPlayer.rbi || '0'}</div>
                  <div className="text-sm text-base-content/70">RBI</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                  <div className="text-2xl font-bold text-info">{selectedPlayer.stolen_bases || '0'}</div>
                  <div className="text-sm text-base-content/70">Stolen Bases</div>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/players/${selectedPlayer.id}/edit`)}
              >
                Edit Player
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedPlayer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players; 