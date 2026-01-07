/**
 * Depth Chart Player Card Component
 *
 * Displays an individual player card within a depth chart position.
 * Shows player information, statistics, status indicators, and actions
 * like viewing details and unassigning from the position.
 */

import { Link } from 'react-router-dom';
import {
  Eye,
  UserMinus,
  Calendar,
  Heart,
  Star
} from 'lucide-react';
import { getPlayerStats, getPlayerStatus } from '../../utils/depthChartUtils';

/**
 * DepthChartPlayerCard - Individual player card for depth chart
 * @param {Object} props - Component props
 * @param {Object} props.assignment - The depth chart player assignment with id, depth_order, notes, and Player
 * @param {boolean} props.canUnassignPlayers - Whether the current user can unassign players
 * @param {Function} props.onUnassign - Callback when unassigning a player (receives assignment.id)
 */
export default function DepthChartPlayerCard({
  assignment,
  canUnassignPlayers,
  onUnassign
}) {
  const player = assignment.Player;
  const status = getPlayerStatus(player);
  const stats = getPlayerStats(player);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              {player.first_name} {player.last_name}
            </h4>
            <span className="text-sm text-gray-500">#{assignment.depth_order}</span>
          </div>
          <p className="text-sm text-gray-500">
            {player.position} • {player.school_type}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to={`/players/${player.id}`}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {canUnassignPlayers && (
            <button
              onClick={() => onUnassign(assignment.id)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Remove Player"
            >
              <UserMinus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Player Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Grad: {player.graduation_year || 'N/A'}</span>
        </div>
        {player.height && player.weight && (
          <div className="text-sm text-gray-600">
            {player.height} • {player.weight} lbs
          </div>
        )}
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {stats.map((stat, statIndex) => (
              <span
                key={statIndex}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status and Special Indicators */}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
          {status.label}
        </span>
        <div className="flex items-center space-x-1">
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
      </div>

      {/* Assignment Notes */}
      {assignment.notes && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          {assignment.notes}
        </div>
      )}
    </div>
  );
}
