import { GraduationCap, MapPin, Calendar, Award, AlertTriangle } from 'lucide-react';

const HSPrefList = () => {
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
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">HS Pref List</h1>
            <p className="text-gray-600 dark:text-gray-400">
              High School player preference rankings and evaluations
            </p>
          </div>
        </div>
        <button className="btn btn-primary">
          Update HS Rankings
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <select className="select select-bordered w-full">
                <option>All Graduation Years</option>
                <option>Class of 2024</option>
                <option>Class of 2025</option>
                <option>Class of 2026</option>
                <option>Class of 2027</option>
              </select>
            </div>
            <div className="flex-1">
              <select className="select select-bordered w-full">
                <option>All States</option>
                <option>Texas</option>
                <option>California</option>
                <option>Florida</option>
                <option>Georgia</option>
              </select>
            </div>
            <div className="flex-1">
              <select className="select select-bordered w-full">
                <option>All Positions</option>
                <option>Pitcher</option>
                <option>Catcher</option>
                <option>Infield</option>
                <option>Outfield</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total HS Players</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <GraduationCap className="w-8 h-8 text-primary/60" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Class of 2025</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500/60" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Texas Players</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <MapPin className="w-8 h-8 text-green-500/60" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Prospects</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              HS Preference List
            </h3>
            <p className="text-gray-500 mb-4">
              High school player rankings and detailed scouting reports will be displayed here
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-primary">
                Import HS Players
              </button>
              <button className="btn btn-outline">
                View Scouting Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSPrefList;
