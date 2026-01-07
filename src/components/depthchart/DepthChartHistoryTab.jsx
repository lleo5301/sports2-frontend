/**
 * Depth Chart History Tab Component
 *
 * Displays the history of changes made to a depth chart, including
 * timestamps, actions, descriptions, and the users who made the changes.
 */

import { Clock, History } from 'lucide-react';

/**
 * DepthChartHistoryTab - Displays depth chart history entries
 * @param {Object} props - Component props
 * @param {Array} props.history - Array of history entries with id, action, description, created_at, and User
 */
export default function DepthChartHistoryTab({ history }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Depth Chart History</h3>
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{entry.action}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{entry.description}</p>
            {entry.User && (
              <p className="text-xs text-gray-500 mt-1">
                By: {entry.User.first_name} {entry.User.last_name}
              </p>
            )}
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
