import { Star, TrendingUp, Trophy, Users, AlertTriangle } from 'lucide-react';

const OverallPrefList = () => {
  return (
    <div className="p-6">
      {/* Coming Soon Banner */}
      <div className="alert alert-warning mb-6">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <h3 className="font-bold">Coming Soon</h3>
          <p className="text-sm">This page is under development. The data shown below is placeholder content and not connected to live data.</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Overall Pref List</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete preference ranking of all players
            </p>
          </div>
        </div>
        <button className="btn btn-primary">
          Update Rankings
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Total Players</h3>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Top Tier</h3>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Trophy className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Rising Stars</h3>
                <p className="text-2xl font-bold">18</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Preference List Table */}
      <div className="card bg-background shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preference Rankings</h2>
            <div className="flex gap-2">
              <select className="select select-bordered select-sm">
                <option>All Tiers</option>
                <option>Top Tier</option>
                <option>Second Tier</option>
                <option>Third Tier</option>
              </select>
              <select className="select select-bordered select-sm">
                <option>All Positions</option>
                <option>Pitchers</option>
                <option>Position Players</option>
              </select>
            </div>
          </div>

          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Preference List Coming Soon
            </h3>
            <p className="text-gray-500 mb-4">
              The overall preference rankings will be displayed here with detailed player evaluations
            </p>
            <button className="btn btn-primary">
              Import Player Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallPrefList;
