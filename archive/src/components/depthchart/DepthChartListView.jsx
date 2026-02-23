/**
 * Depth Chart List View Component
 *
 * Displays all positions in a list format with their assigned players.
 * Maps through positions and renders DepthChartPositionCard components
 * for each position in the depth chart.
 */

import DepthChartPositionCard from './DepthChartPositionCard';

/**
 * DepthChartListView - List view of all depth chart positions
 * @param {Object} props - Component props
 * @param {Array} props.positions - Array of depth chart positions with their assigned players
 * @param {boolean} props.canAssignPlayers - Whether the current user can assign players
 * @param {boolean} props.canUnassignPlayers - Whether the current user can unassign players
 * @param {Function} props.onAddPlayer - Callback when adding a player (receives position)
 * @param {Function} props.onUnassignPlayer - Callback when unassigning a player (receives assignmentId)
 */
export default function DepthChartListView({
  positions,
  canAssignPlayers,
  canUnassignPlayers,
  onAddPlayer,
  onUnassignPlayer
}) {
  return (
    <>
      {positions?.map((position) => (
        <DepthChartPositionCard
          key={position.id}
          position={position}
          canAssignPlayers={canAssignPlayers}
          canUnassignPlayers={canUnassignPlayers}
          onAddPlayer={onAddPlayer}
          onUnassignPlayer={onUnassignPlayer}
        />
      ))}
    </>
  );
}
