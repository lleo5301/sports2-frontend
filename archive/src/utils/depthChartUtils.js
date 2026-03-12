/**
 * Depth Chart Utility Functions
 *
 * Provides utility functions for depth chart player data processing,
 * including player statistics extraction and status determination.
 */

import { statusColors } from '../constants/depthChartConstants';

/**
 * Extract and format player statistics for display
 * @param {Object} player - The player object containing statistics
 * @returns {Array<string>} Array of formatted stat strings (e.g., ["AVG: .300", "HR: 12"])
 */
export const getPlayerStats = (player) => {
  const stats = [];

  if (player.batting_avg) {
    stats.push(`AVG: ${player.batting_avg}`);
  }
  if (player.home_runs) {
    stats.push(`HR: ${player.home_runs}`);
  }
  if (player.rbi) {
    stats.push(`RBI: ${player.rbi}`);
  }
  if (player.stolen_bases) {
    stats.push(`SB: ${player.stolen_bases}`);
  }
  if (player.era) {
    stats.push(`ERA: ${player.era}`);
  }
  if (player.wins !== null && player.losses !== null) {
    stats.push(`W-L: ${player.wins}-${player.losses}`);
  }
  if (player.strikeouts) {
    stats.push(`K: ${player.strikeouts}`);
  }

  return stats;
};

/**
 * Determine player status with appropriate styling
 * @param {Object} player - The player object
 * @returns {Object} Object with label and color CSS classes for the status
 */
export const getPlayerStatus = (player) => {
  if (player.has_medical_issues) {
    return { label: 'Injured', color: statusColors.injured };
  }
  if (player.status === 'inactive') {
    return { label: 'Inactive', color: statusColors.inactive };
  }
  return { label: 'Active', color: statusColors.active };
};

// Default export for convenience
export default {
  getPlayerStats,
  getPlayerStatus
};
