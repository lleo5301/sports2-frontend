import { Chip, Button } from '@heroui/react';
/**
 * Assign Player Modal Component
 *
 * A large modal dialog for assigning players to depth chart positions.
 * Includes search functionality, position filtering, and toggle between
 * recommended and all available players.
 */

import { useState } from 'react';
import {
  Star,
  Users,
  UserPlus,
  Heart,
  CheckCircle
} from 'lucide-react';
import AccessibleModal from '../ui/AccessibleModal';
import { getPlayerStats, getPlayerStatus } from '../../utils/depthChartUtils';

/**
 * AssignPlayerModal - Modal for assigning players to depth chart positions
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Object} props.selectedPosition - The selected position object with id and position_name
 * @param {Array} props.availablePlayers - Array of all available players
 * @param {Array} props.recommendedPlayers - Array of recommended players for this position
 * @param {Function} props.onAssignPlayer - Callback when a player is assigned (receives playerId)
 */
export default function AssignPlayerModal({
  isOpen,
  onClose,
  selectedPosition,
  availablePlayers = [],
  recommendedPlayers = [],
  onAssignPlayer
}) {
  const [playerSearch, setPlayerSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [viewMode, setViewMode] = useState('recommended'); // 'recommended' or 'all'

  // Reset state when modal closes
  const handleClose = () => {
    setPlayerSearch('');
    setPositionFilter('');
    setViewMode('recommended');
    onClose();
  };

  // Handle player assignment
  const handleAssignPlayer = (playerId) => {
    onAssignPlayer(playerId);
    handleClose();
  };

  // Filter players based on search and position filter
  const filterPlayers = (players) => {
    return players.filter(player => {
      const matchesSearch = !playerSearch ||
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(playerSearch.toLowerCase()) ||
        player.position?.toLowerCase().includes(playerSearch.toLowerCase());

      const matchesPosition = !positionFilter || player.position === positionFilter;

      return matchesSearch && matchesPosition;
    });
  };

  const filteredRecommendedPlayers = filterPlayers(recommendedPlayers);
  const filteredAllPlayers = filterPlayers(availablePlayers);

  if (!selectedPosition) return null;

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Assign Player to ${selectedPosition.position_name}`}
      size="lg"
    >
      <AccessibleModal.Header
        title={`Assign Player to ${selectedPosition.position_name}`}
        onClose={handleClose}
      />
      <AccessibleModal.Content>
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Search Players</span>
              </label>
              <input
                type="text"
                placeholder="Search by name, position, or stats..."
                className="input input-bordered w-full"
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
              />
            </div>
            <div className="w-48">
              <label className="label">
                <span className="label-text">Filter by Position</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
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
                <option value="DH">Designated Hitter</option>
                <option value="UTIL">Utility</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${viewMode === 'recommended' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('recommended')}
            >
              <Star className="h-4 w-4 mr-1" />
              Recommended
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('all')}
            >
              <Users className="h-4 w-4 mr-1" />
              All Players
            </button>
          </div>
        </div>

        {/* Player Lists */}
        <div className="space-y-6">
          {/* Recommended Players */}
          {viewMode === 'recommended' && (
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Top Recommendations for {selectedPosition.position_name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredRecommendedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 cursor-pointer transition-all"
                    onClick={() => handleAssignPlayer(player.id)}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-lg">
                          {player.first_name} {player.last_name}
                        </h5>
                        <div className="flex items-center gap-2">
                          <Chip color="primary">{player.position}</Chip>
                          <span className="text-sm font-bold text-blue-600">
                            Score: {player.score}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                          <span>{player.school_type}</span>
                          {player.graduation_year && (
                            <span>Grad: {player.graduation_year}</span>
                          )}
                          {player.height && player.weight && (
                            <span>{player.height} • {player.weight} lbs</span>
                          )}
                        </div>
                      </div>

                      {/* Player Stats */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {player.batting_avg && (
                            <Chip size="sm" variant="bordered">
                              AVG: {player.batting_avg}
                            </Chip>
                          )}
                          {player.home_runs && (
                            <Chip size="sm" variant="bordered">
                              HR: {player.home_runs}
                            </Chip>
                          )}
                          {player.rbi && (
                            <Chip size="sm" variant="bordered">
                              RBI: {player.rbi}
                            </Chip>
                          )}
                          {player.stolen_bases && (
                            <Chip size="sm" variant="bordered">
                              SB: {player.stolen_bases}
                            </Chip>
                          )}
                          {player.era && (
                            <Chip size="sm" variant="bordered">
                              ERA: {player.era}
                            </Chip>
                          )}
                          {player.strikeouts && (
                            <Chip size="sm" variant="bordered">
                              K: {player.strikeouts}
                            </Chip>
                          )}
                        </div>
                      </div>

                      {/* Recommendation Reasons */}
                      <div className="space-y-1">
                        {player.reasons?.map((reason, index) => (
                          <div key={index} className="text-xs text-blue-700 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {reason}
                          </div>
                        ))}
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">
                          {player.has_medical_issues && (
                            <span className="text-red-500" title="Medical Issues">
                              <Heart className="h-3 w-3" />
                            </span>
                          )}
                          {player.has_comparison && (
                            <span className="text-blue-500" title="Comparison Player">
                              <Star className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <Button onClick={(e) => { e.stopPropagation(); handleAssignPlayer(player.id); }} color="primary" size="sm">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecommendedPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No recommendations available</p>
                  <p className="text-sm">Try switching to &quot;All Players&quot; view</p>
                </div>
              )}
            </div>
          )}

          {/* All Players */}
          {viewMode === 'all' && (
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                All Available Players
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredAllPlayers.map((player) => {
                  const status = getPlayerStatus(player);
                  const stats = getPlayerStats(player);

                  return (
                    <div
                      key={player.id}
                      className="card border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                      onClick={() => handleAssignPlayer(player.id)}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-lg">
                            {player.first_name} {player.last_name}
                          </h5>
                          <Chip variant="bordered">{player.position}</Chip>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-4">
                            <span>{player.school_type}</span>
                            {player.graduation_year && (
                              <span>Grad: {player.graduation_year}</span>
                            )}
                            {player.height && player.weight && (
                              <span>{player.height} • {player.weight} lbs</span>
                            )}
                          </div>
                        </div>

                        {/* Player Stats */}
                        {stats.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {stats.map((stat, statIndex) => (
                                <Chip key={statIndex} size="sm" variant="bordered">
                                  {stat}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                            {status.label}
                          </span>
                          <div className="flex items-center gap-1">
                            {player.has_medical_issues && (
                              <span className="text-red-500" title="Medical Issues">
                                <Heart className="h-3 w-3" />
                              </span>
                            )}
                            {player.has_comparison && (
                              <span className="text-blue-500" title="Comparison Player">
                                <Star className="h-3 w-3" />
                              </span>
                            )}
                            <Button onClick={(e) => { e.stopPropagation(); handleAssignPlayer(player.id); }} size="sm" variant="bordered">
                              <UserPlus className="h-3 w-3 mr-1" />
                              Assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredAllPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No players match your filters</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </AccessibleModal.Content>
      <AccessibleModal.Footer>
        <Button
          onClick={handleClose}>
          Cancel
        </Button>
      </AccessibleModal.Footer>
    </AccessibleModal>
  );
}
