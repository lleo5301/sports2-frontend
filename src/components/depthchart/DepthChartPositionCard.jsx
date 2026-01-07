/**
 * Depth Chart Position Card Component
 *
 * Displays a depth chart position with its header, assigned players,
 * and ability to add new players. Contains a grid of DepthChartPlayerCard
 * components and shows an empty state when no players are assigned.
 */

import {
  Users,
  UserPlus
} from 'lucide-react';
import DepthChartPlayerCard from './DepthChartPlayerCard';

/**
 * DepthChartPositionCard - Position card wrapper for depth chart
 * @param {Object} props - Component props
 * @param {Object} props.position - The depth chart position with id, position_name, color, max_players, DepthChartPlayers
 * @param {boolean} props.canAssignPlayers - Whether the current user can assign players
 * @param {boolean} props.canUnassignPlayers - Whether the current user can unassign players
 * @param {Function} props.onAddPlayer - Callback when adding a player (receives position)
 * @param {Function} props.onUnassignPlayer - Callback when unassigning a player (receives assignmentId)
 */
export default function DepthChartPositionCard({
  position,
  canAssignPlayers,
  canUnassignPlayers,
  onAddPlayer,
  onUnassignPlayer
}) {
  return (
    <div className="card">
      <div className="p-6">
        {/* Position Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-3"
              style={{ backgroundColor: position.color }}
            ></div>
            <h3 className="text-lg font-semibold">{position.position_name}</h3>
            <span className="ml-3 text-sm text-gray-500">
              {position.DepthChartPlayers?.length || 0} players
              {position.max_players && ` / ${position.max_players} max`}
            </span>
          </div>
          {canAssignPlayers && (
            <button
              onClick={() => onAddPlayer(position)}
              className="btn btn-outline btn-sm"
              disabled={position.max_players && position.DepthChartPlayers?.length >= position.max_players}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add Player
            </button>
          )}
        </div>

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {position.DepthChartPlayers?.map((assignment) => (
            <DepthChartPlayerCard
              key={assignment.id}
              assignment={assignment}
              canUnassignPlayers={canUnassignPlayers}
              onUnassign={onUnassignPlayer}
            />
          ))}
        </div>

        {/* Empty State */}
        {(!position.DepthChartPlayers || position.DepthChartPlayers.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No players assigned to this position</p>
            {canAssignPlayers && (
              <button
                onClick={() => onAddPlayer(position)}
                className="btn btn-outline btn-sm mt-2"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add Player
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
