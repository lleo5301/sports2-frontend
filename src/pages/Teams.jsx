import React, { useState, useEffect } from 'react';
import { teamsService } from '../services/teams';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        
        // Fetch all teams and current user's team in parallel
        const [allTeamsResponse, myTeamResponse] = await Promise.all([
          teamsService.getAllTeams(),
          teamsService.getMyTeam().catch(() => null) // Don't fail if user doesn't have a team
        ]);

        setTeams(allTeamsResponse.data || []);
        setMyTeam(myTeamResponse?.data || null);
        
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="alert alert-error">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Teams
          </h1>
          <p className="text-base-content/70">
            Manage and view all teams in the system
          </p>
        </div>

        {/* My Team Section */}
        {myTeam && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-4">My Team</h2>
            <div className="card bg-primary/10 border-primary">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{myTeam.name}</h3>
                    <p className="text-base-content/70">{myTeam.program_name}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Division: {myTeam.division}</span>
                      <span>Conference: {myTeam.conference}</span>
                      <span>Location: {myTeam.city}, {myTeam.state}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-sm btn-primary">View Details</button>
                    <button className="btn btn-sm btn-outline">Edit Team</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Teams Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-base-content mb-4">All Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="card hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <h2 className="card-title">{team.name}</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-base-content/70">Program:</span>
                      <span className="text-sm font-medium">{team.program_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-base-content/70">Division:</span>
                      <span className="text-sm font-medium">{team.division}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-base-content/70">Conference:</span>
                      <span className="text-sm font-medium">{team.conference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-base-content/70">Location:</span>
                      <span className="text-sm font-medium">{team.city}, {team.state}</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-outline">View</button>
                    {myTeam?.id === team.id && (
                      <button className="btn btn-sm btn-primary">Edit</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Team Button */}
        <div className="mt-8 text-center">
          <button className="btn btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams; 