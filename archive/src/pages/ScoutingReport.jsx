import { Button } from '@heroui/react';

const ScoutingReport = () => {
  const report = {
    id: 1,
    player: 'Mike Johnson',
    scout: 'John Doe',
    date: '2024-01-15',
    position: 'Pitcher',
    school: 'State University',
    overallRating: 8.5,
    status: 'Completed'
  };

  const ratings = [
    { category: 'Fastball', rating: 8, notes: 'Consistent 92-94 mph, good movement' },
    { category: 'Curveball', rating: 7, notes: 'Sharp break, needs consistency' },
    { category: 'Changeup', rating: 6, notes: 'Developing pitch, shows promise' },
    { category: 'Control', rating: 8, notes: 'Good command of all pitches' },
    { category: 'Athleticism', rating: 9, notes: 'Excellent athlete, good fielding' }
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Scouting Report: {report.player}
              </h1>
              <p className="text-foreground/70">
                {report.position} • {report.school} • {report.date}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="bordered">Edit</Button>
              <Button color="primary">Export PDF</Button>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title text-primary">Overall Rating</h2>
              <p className="text-4xl font-bold">{report.overallRating}/10</p>
              <div className="text-sm text-success">Excellent prospect</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title text-secondary">Scout</h2>
              <p className="text-2xl font-bold">{report.scout}</p>
              <div className="text-sm text-info">Head Scout</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title text-accent">Position</h2>
              <p className="text-2xl font-bold">{report.position}</p>
              <div className="text-sm text-warning">Primary position</div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title text-neutral">Status</h2>
              <p className="text-2xl font-bold">{report.status}</p>
              <div className="text-sm text-foreground/70">Ready for review</div>
            </div>
          </div>
        </div>

        {/* Player Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Player Information</h2>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{report.player}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Position:</span>
                  <span>{report.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">School:</span>
                  <span>{report.school}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Scout:</span>
                  <span>{report.scout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{report.date}</span>
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
                <Button className="w-full" color="primary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Report
                </Button>
                <Button className="w-full" color="secondary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </Button>
                <Button className="w-full" variant="bordered">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Skill Ratings</h2>
            <p className="card-description">Detailed evaluation of player skills</p>
          </div>
          <div className="card-content">
            <div className="space-y-6">
              {ratings.map((rating, index) => (
                <div key={index} className="border-b border-divider pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{rating.category}</h3>
                    <div className="text-2xl font-bold text-primary">{rating.rating}/10</div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-content2 rounded-full h-2 mr-4">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(rating.rating / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-foreground/70">{rating.rating}/10</span>
                  </div>
                  <p className="text-sm text-foreground/70">{rating.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card mt-8">
          <div className="card-header">
            <h2 className="card-title">Scout Notes</h2>
          </div>
          <div className="card-content">
            <div className="prose max-w-none">
              <p>
                Mike Johnson is an excellent pitching prospect with a strong foundation of skills.
                His fastball velocity is consistently in the 92-94 mph range with good movement,
                making it his primary weapon. The curveball shows sharp break but needs more
                consistency in command.
              </p>
              <p>
                His athleticism is outstanding, and he moves well on the mound. The changeup is
                still developing but shows promise as a third pitch. Overall control is good,
                and he demonstrates the ability to command all his pitches effectively.
              </p>
              <p>
                <strong>Recommendation:</strong> High priority recruit. Should be actively pursued
                for the upcoming season. Has the potential to contribute immediately at the collegiate level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutingReport;
