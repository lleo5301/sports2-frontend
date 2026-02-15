import React from 'react';
import { ArrowRightLeft, Building2, Search, Filter, TrendingUp, AlertTriangle } from 'lucide-react';

const CollegePortal = () => {
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
          <ArrowRightLeft className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">College Portal/Transfers</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track college players and transfer portal activity
            </p>
          </div>
        </div>
        <button className="btn btn-primary">
          Add Transfer
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Active Transfers</h3>
                <p className="text-2xl font-bold">23</p>
              </div>
              <ArrowRightLeft className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">College Players</h3>
                <p className="text-2xl font-bold">67</p>
              </div>
              <Building2 className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-teal-500 to-teal-600">
          <div className="card-body text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white/80 text-sm font-medium">Rising Prospects</h3>
                <p className="text-2xl font-bold">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search college players and transfers..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="select select-bordered">
                <option>All Status</option>
                <option>In Transfer Portal</option>
                <option>Committed</option>
                <option>Available</option>
              </select>
              <select className="select select-bordered">
                <option>All Divisions</option>
                <option>Division I</option>
                <option>Division II</option>
                <option>Division III</option>
                <option>NAIA</option>
                <option>Junior College</option>
              </select>
              <button className="btn btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Portal Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Recent Transfer Activity</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <ArrowRightLeft className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Player Name</p>
                      <p className="text-sm text-gray-600">Position • Previous School</p>
                    </div>
                  </div>
                  <span className="badge badge-primary">New</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Top College Prospects</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Player Name</p>
                      <p className="text-sm text-gray-600">Position • Current School</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-success">Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="text-center py-12">
            <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              College Portal & Transfers
            </h3>
            <p className="text-gray-500 mb-4">
              Track college players, transfer portal activity, and recruitment opportunities
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-primary">
                Monitor Transfer Portal
              </button>
              <button className="btn btn-outline">
                Import College Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegePortal;
