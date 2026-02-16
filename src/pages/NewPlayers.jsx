import { Button } from '@heroui/react';
import { UserPlus, Plus, Search, Filter, AlertTriangle } from 'lucide-react';

const NewPlayers = () => {
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
          <UserPlus className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">New Players</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track newly recruited players
            </p>
          </div>
        </div>
        <Button color="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Player
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card bg-background shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search new players..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="select select-bordered">
                <option>All Positions</option>
                <option>Pitcher</option>
                <option>Catcher</option>
                <option>Infield</option>
                <option>Outfield</option>
              </select>
              <Button variant="bordered">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card bg-background shadow-sm">
        <div className="card-body">
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No New Players Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start by adding newly recruited players to track their progress
            </p>
            <Button color="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add First New Player
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlayers;
