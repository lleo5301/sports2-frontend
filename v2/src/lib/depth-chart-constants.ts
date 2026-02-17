/**
 * Depth Chart Constants
 */

export const defaultPositions = [
  { position_code: 'P', position_name: 'Pitcher', color: '#EF4444', icon: 'Shield', sort_order: 1 },
  { position_code: 'C', position_name: 'Catcher', color: '#3B82F6', icon: 'Shield', sort_order: 2 },
  { position_code: '1B', position_name: 'First Base', color: '#10B981', icon: 'Target', sort_order: 3 },
  { position_code: '2B', position_name: 'Second Base', color: '#F59E0B', icon: 'Target', sort_order: 4 },
  { position_code: '3B', position_name: 'Third Base', color: '#8B5CF6', icon: 'Target', sort_order: 5 },
  { position_code: 'SS', position_name: 'Shortstop', color: '#6366F1', icon: 'Target', sort_order: 6 },
  { position_code: 'LF', position_name: 'Left Field', color: '#EC4899', icon: 'Zap', sort_order: 7 },
  { position_code: 'CF', position_name: 'Center Field', color: '#14B8A6', icon: 'Zap', sort_order: 8 },
  { position_code: 'RF', position_name: 'Right Field', color: '#F97316', icon: 'Zap', sort_order: 9 },
  { position_code: 'DH', position_name: 'Designated Hitter', color: '#06B6D4', icon: 'Heart', sort_order: 10 },
]

export const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  injured: 'bg-red-100 text-red-800',
  suspended: 'bg-yellow-100 text-yellow-800',
}
