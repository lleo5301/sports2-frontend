import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Users, Target, FileText, BarChart3, Plus, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading, error } = useQuery('dashboard-stats', async () => {
    const response = await api.get('/players/stats/summary')
    return response.data
  }, {
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const quickActions = [
    {
      name: 'Create Player',
      href: '/players/create',
      icon: Plus,
      description: 'Add a new player to the system',
      color: 'bg-blue-500'
    },
    {
      name: 'View Players',
      href: '/players',
      icon: Users,
      description: 'Browse and manage all players',
      color: 'bg-green-500'
    },
    {
      name: 'Recruiting Board',
      href: '/recruiting',
      icon: Target,
      description: 'View recruiting targets and prospects',
      color: 'bg-purple-500'
    },
    {
      name: 'Daily Report',
      href: '/daily-reports',
      icon: FileText,
      description: 'Create or view daily practice/game reports',
      color: 'bg-orange-500'
    },
    {
      name: 'Depth Chart',
      href: '/depth-chart',
      icon: BarChart3,
      description: 'View team depth chart and positions',
      color: 'bg-red-500'
    },
    {
      name: 'Search Players',
      href: '/players',
      icon: Search,
      description: 'Search for specific players',
      color: 'bg-indigo-500'
    }
  ]

  // Update the stats display to handle errors gracefully
  const displayStats = (field, defaultValue = 0) => {
    if (isLoading) return '...'
    if (error) return defaultValue
    return stats?.[field] ?? defaultValue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.first_name}! Here's what's happening with your team.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Players
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayStats('total_players', 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Recruits
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayStats('active_recruits', 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recent Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayStats('recent_reports', 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Team Average
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {displayStats('team_avg', '.000')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="card">
          <div className="card-content">
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first player or report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 