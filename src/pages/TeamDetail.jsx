import React from 'react';

const TeamDetail = () => {
  const team = {
    id: 1,
    name: 'State University Tigers',
    division: 'NCAA D1',
    location: 'State City, ST',
    coach: 'Mike Johnson',
    players: 28,
    record: '25-15',
    conference: 'Big Conference'
  };

  const players = [
    { id: 1, name: 'John Smith', position: 'Pitcher', year: 'Senior', avg: '.342', hr: 15 },
    { id: 2, name: 'David Wilson', position: 'Catcher', year: 'Junior', avg: '.298', hr: 8 },
    { id: 3, name: 'Chris Brown', position: 'First Base', year: 'Sophomore', avg: '.315', hr: 22 },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                {team.name}
              </h1>
              <p className="text-base-content/70">
                {team.division} • {team.location}
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn btn-outline">Edit Team</button>
              <button className="btn btn-primary">Add Player</button>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-primary">Record</h2>
              <p className="text-3xl font-bold">{team.record}</p>
              <div className="text-sm text-success">+5 games over .500</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-secondary">Players</h2>
              <p className="text-3xl font-bold">{team.players}</p>
              <div className="text-sm text-info">Active roster</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-accent">Conference</h2>
              <p className="text-3xl font-bold">{team.conference}</p>
              <div className="text-sm text-warning">3rd place</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-neutral">Head Coach</h2>
              <p className="text-3xl font-bold">{team.coach}</p>
              <div className="text-sm text-base-content/70">5th season</div>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Team Information</h2>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Division:</span>
                  <span>{team.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Location:</span>
                  <span>{team.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Conference:</span>
                  <span>{team.conference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Head Coach:</span>
                  <span>{team.coach}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Season Record:</span>
                  <span>{team.record}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <button className="btn btn-primary w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Player
                </button>
                <button className="btn btn-secondary w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create Report
                </button>
                <button className="btn btn-outline w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Roster</h2>
            <p className="card-description">Current team roster</p>
          </div>
          <div className="card-content">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Year</th>
                    <th>AVG</th>
                    <th>HR</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td className="font-medium">{player.name}</td>
                      <td>
                        <div className="badge badge-outline">{player.position}</div>
                      </td>
                      <td>{player.year}</td>
                      <td>
                        <div className="text-success font-semibold">{player.avg}</div>
                      </td>
                      <td>{player.hr}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail; 