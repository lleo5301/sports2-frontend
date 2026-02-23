import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, User, Search, X, Users } from 'lucide-react';
import api from '../services/api';
import { Spinner, Checkbox, Chip, Button } from '@heroui/react';

const MultiPlayerSelector = ({
  selectedPlayerIds = [],
  onPlayersChange,
  players = [],
  label = 'Player Selection',
  allowCreate = true,
  positionFilter = '',
  onPositionFilterChange
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

  // Filter players based on search term and position filter
  const filteredPlayers = players.filter(player => {
    const fullName = `${player.first_name} ${player.last_name}`.toLowerCase();
    const position = player.position?.toLowerCase() || '';
    const school = player.school?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = !searchTerm || fullName.includes(search) || position.includes(search) || school.includes(search);
    const matchesPosition = !positionFilter || player.position === positionFilter;

    return matchesSearch && matchesPosition;
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

      // Add the newly created player to selection
      const newPlayerId = data.data.id.toString();
      onPlayersChange([...selectedPlayerIds, newPlayerId]);

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

  const handlePlayerToggle = (playerId) => {
    const playerIdStr = playerId.toString();
    if (selectedPlayerIds.includes(playerIdStr)) {
      onPlayersChange(selectedPlayerIds.filter(id => id !== playerIdStr));
    } else {
      onPlayersChange([...selectedPlayerIds, playerIdStr]);
    }
  };

  const selectedPlayers = players.filter(p => selectedPlayerIds.includes(p.id.toString()));

  return (
    <div className="card bg-background shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">
          <Users className="w-5 h-5 mr-2" />
          {label}
        </h2>

        {/* Position Filter */}
        {onPositionFilterChange && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Position Filter</span>
              </label>
              <select
                className="select select-bordered"
                value={positionFilter}
                onChange={(e) => onPositionFilterChange(e.target.value)}
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
                <span className="label-text">Selected Players</span>
              </label>
              <div className="text-sm text-foreground/70 mt-2">
                {selectedPlayerIds.length} player(s) selected
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="form-control mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/50" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Search players or type a name to create new..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Selected Players Summary */}
        {selectedPlayers.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Selected Players:</div>
            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map(player => (
                <Chip key={player.id} className="gap-2" color="primary">
                  {player.first_name} {player.last_name}
                  <Button type="button" onClick={() => handlePlayerToggle(player.id)} size="sm" variant="light">
                    <X className="w-3 h-3" />
                  </Button>
                </Chip>
              ))}
            </div>
          </div>
        )}

        {!showCreateForm ? (
          <>
            {/* Player List */}
            <div className="max-h-64 overflow-y-auto border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredPlayers.map(player => (
                  <label key={player.id} className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-2 rounded hover:bg-content1">
                      <Checkbox isSelected={selectedPlayerIds.includes(player.id.toString())} onChange={() => handlePlayerToggle(player.id)} color="primary" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {player.first_name} {player.last_name}
                        </div>
                        <div className="text-sm text-foreground/70">
                          {player.position} • {player.school || 'No school'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}

                {/* No players found / Create new option */}
                {filteredPlayers.length === 0 && searchTerm && (
                  <div className="col-span-2 p-4 text-center text-foreground/70">
                    <div className="mb-2">No players found matching &quot;{searchTerm}&quot;</div>
                    {allowCreate && (
                      <Button type="button" onClick={() => { const names = searchTerm.trim().split(' '); if (names.length >= 2) { setNewPlayerData(prev => ({ ...prev, first_name: names[0], last_name: names.slice(1).join(' ') })); } else if (names.length === 1) { setNewPlayerData(prev => ({ ...prev, first_name: names[0] })); } setShowCreateForm(true); }} color="primary" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Create &quot;{searchTerm}&quot;
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Create New Player Button */}
            {allowCreate && (
              <div className="mt-4">
                <Button type="button" onClick={() => setShowCreateForm(true)} size="sm" variant="bordered">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Player
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Create Player Form */
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Create New Player</h3>
              <Button type="button" onClick={() => { setShowCreateForm(false); setNewPlayerData({ first_name: '', last_name: '', position: 'P', school_type: 'HS', school: '', graduation_year: new Date().getFullYear() + 1 }); }} size="sm" variant="light">
                <X className="w-4 h-4" />
              </Button>
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
                <Button type="button" onClick={() => setShowCreateForm(false)} size="sm" variant="light">
                  Cancel
                </Button>
                <Button type="submit" disabled={createPlayerMutation.isLoading} color="primary" size="sm">
                  {createPlayerMutation.isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Player
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPlayerSelector;
