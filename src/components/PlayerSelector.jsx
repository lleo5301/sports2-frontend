import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, User, Search, X } from 'lucide-react';
import api from '../services/api';

const PlayerSelector = ({ 
  selectedPlayerId, 
  onPlayerSelect, 
  players = [], 
  required = false,
  label = "Player",
  placeholder = "Select a player...",
  allowCreate = true
}) => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayerData, setNewPlayerData] = useState({
    first_name: '',
    last_name: '',
    position: 'P',
    school_type: 'HS',
    school: '',
    graduation_year: new Date().getFullYear() + 1
  });

  // Filter players based on search term
  const filteredPlayers = players.filter(player => {
    const fullName = `${player.first_name} ${player.last_name}`.toLowerCase();
    const position = player.position?.toLowerCase() || '';
    const school = player.school?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || position.includes(search) || school.includes(search);
  });

  // Create new player mutation
  const createPlayerMutation = useMutation({
    mutationFn: async (playerData) => {
      const response = await api.post('/players', playerData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Player created successfully!');
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['players-for-performance']);
      queryClient.invalidateQueries(['players-for-statistics']);
      
      // Select the newly created player
      onPlayerSelect(data.data.id.toString());
      
      // Reset form and close
      setNewPlayerData({
        first_name: '',
        last_name: '',
        position: 'P',
        school_type: 'HS',
        school: '',
        graduation_year: new Date().getFullYear() + 1
      });
      setShowCreateForm(false);
      setSearchTerm('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create player');
    }
  });

  const handleCreatePlayer = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPlayerData.first_name.trim() || !newPlayerData.last_name.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    createPlayerMutation.mutate(newPlayerData);
  };

  const handleNewPlayerInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedPlayer = players.find(p => p.id.toString() === selectedPlayerId);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>

      {!showCreateForm ? (
        <div className="space-y-2">
          {/* Search and Select */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-base-content/50" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Search players or type a name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Selected Player Display */}
          {selectedPlayer && (
            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">
                    {selectedPlayer.first_name} {selectedPlayer.last_name}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {selectedPlayer.position} • {selectedPlayer.school || 'No school'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPlayerSelect('')}
                className="btn btn-ghost btn-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Player List */}
          {searchTerm && !selectedPlayer && (
            <div className="max-h-48 overflow-y-auto border rounded-lg bg-base-100">
              {filteredPlayers.length > 0 ? (
                <div className="p-2 space-y-1">
                  {filteredPlayers.map(player => (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => {
                        onPlayerSelect(player.id.toString());
                        setSearchTerm('');
                      }}
                      className="w-full text-left p-2 rounded hover:bg-base-200 flex items-center space-x-3"
                    >
                      <User className="w-4 h-4 text-base-content/50" />
                      <div>
                        <div className="font-medium">
                          {player.first_name} {player.last_name}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {player.position} • {player.school || 'No school'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-base-content/70">
                  <div className="mb-2">No players found matching "{searchTerm}"</div>
                  {allowCreate && (
                    <button
                      type="button"
                      onClick={() => {
                        const names = searchTerm.trim().split(' ');
                        if (names.length >= 2) {
                          setNewPlayerData(prev => ({
                            ...prev,
                            first_name: names[0],
                            last_name: names.slice(1).join(' ')
                          }));
                        } else if (names.length === 1) {
                          setNewPlayerData(prev => ({
                            ...prev,
                            first_name: names[0]
                          }));
                        }
                        setShowCreateForm(true);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create "{searchTerm}"
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Create New Player Button */}
          {allowCreate && !searchTerm && !selectedPlayer && (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="btn btn-outline btn-sm w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Player
            </button>
          )}
        </div>
      ) : (
        /* Create Player Form */
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Create New Player</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlayerData({
                    first_name: '',
                    last_name: '',
                    position: 'P',
                    school_type: 'HS',
                    school: '',
                    graduation_year: new Date().getFullYear() + 1
                  });
                }}
                className="btn btn-ghost btn-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name *</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={newPlayerData.first_name}
                    onChange={handleNewPlayerInputChange}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name *</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={newPlayerData.last_name}
                    onChange={handleNewPlayerInputChange}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Position *</span>
                  </label>
                  <select
                    name="position"
                    value={newPlayerData.position}
                    onChange={handleNewPlayerInputChange}
                    className="select select-bordered select-sm"
                    required
                  >
                    <option value="P">Pitcher</option>
                    <option value="C">Catcher</option>
                    <option value="1B">1st Base</option>
                    <option value="2B">2nd Base</option>
                    <option value="3B">3rd Base</option>
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
                    <span className="label-text">School Type *</span>
                  </label>
                  <select
                    name="school_type"
                    value={newPlayerData.school_type}
                    onChange={handleNewPlayerInputChange}
                    className="select select-bordered select-sm"
                    required
                  >
                    <option value="HS">High School</option>
                    <option value="COLL">College</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">School</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={newPlayerData.school}
                    onChange={handleNewPlayerInputChange}
                    className="input input-bordered input-sm"
                    placeholder="School name"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Graduation Year</span>
                  </label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={newPlayerData.graduation_year}
                    onChange={handleNewPlayerInputChange}
                    className="input input-bordered input-sm"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={createPlayerMutation.isLoading}
                >
                  {createPlayerMutation.isLoading ? (
                    <>
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Player
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSelector;



