import { Button } from '@heroui/react';
/**
 * Depth Chart Position Card Component
 *
 * Displays a depth chart position with its header, assigned players,
 * and ability to add new players. Contains a grid of DepthChartPlayerCard
 * components and shows an empty state when no players are assigned.
 */

import { Users, UserPlus } from 'lucide-react';
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
    <div className="card h-full">
      <div className="card-header border-b border-ui-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-3 shadow-lg"
              style={{ backgroundColor: position.color }}
            ></div>
            <h3 className="card-title">{position.position_name}</h3>
            <span className="ml-3 text-xs font-medium text-ui-secondary opacity-70">
              {position.DepthChartPlayers?.length || 0} /{' '}
              {position.max_players || '∞'}
            </span>
          </div>
          {canAssignPlayers && (
            <Button onClick={() => onAddPlayer(position)} className="text-brand hover:bg-brand/10" disabled={ position.max_players && position.DepthChartPlayers?.length >= position.max_players } size="sm" variant="light">
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="card-content pt-6">
        {/* Players */}
        {position.DepthChartPlayers && position.DepthChartPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {position.DepthChartPlayers.map((assignment) => (
              <DepthChartPlayerCard
                key={assignment.id}
                assignment={assignment}
                canUnassignPlayers={canUnassignPlayers}
                onUnassign={onUnassignPlayer}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-10 bg-content2/20 rounded-xl border border-dashed border-ui-border">
            <Users className="h-10 w-10 text-brand/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-ui-secondary">
              No players assigned
            </p>
            {canAssignPlayers && (
              <Button onClick={() => onAddPlayer(position)} className="mt-4 border-ui-border hover:bg-content2/50" size="sm" variant="bordered">
                <UserPlus className="h-4 w-4 mr-1 text-brand" />
                Assign Player
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
