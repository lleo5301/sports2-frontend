import EnhancedBaseballFieldView from './EnhancedBaseballFieldView';

const BaseballFieldDemo = () => {
  // Sample data to demonstrate the enhanced field view
  const demoPositions = [
    { position_code: 'P', position_name: 'Pitcher', color: '#EF4444' },
    { position_code: 'C', position_name: 'Catcher', color: '#3B82F6' },
    { position_code: '1B', position_name: 'First Base', color: '#10B981' },
    { position_code: '2B', position_name: 'Second Base', color: '#F59E0B' },
    { position_code: '3B', position_name: 'Third Base', color: '#8B5CF6' },
    { position_code: 'SS', position_name: 'Shortstop', color: '#6366F1' },
    { position_code: 'LF', position_name: 'Left Field', color: '#EC4899' },
    { position_code: 'CF', position_name: 'Center Field', color: '#14B8A6' },
    { position_code: 'RF', position_name: 'Right Field', color: '#F97316' },
    { position_code: 'DH', position_name: 'Designated Hitter', color: '#84CC16' }
  ];

  const demoPlayers = [
    {
      id: 1,
      position_code: 'P',
      depth_order: 1,
      Player: {
        first_name: 'Jake',
        last_name: 'Martinez',
        jersey_number: 22
      }
    },
    {
      id: 2,
      position_code: 'C',
      depth_order: 1,
      Player: {
        first_name: 'Mike',
        last_name: 'Johnson',
        jersey_number: 8
      }
    },
    {
      id: 3,
      position_code: '1B',
      depth_order: 1,
      Player: {
        first_name: 'Chris',
        last_name: 'Davis',
        jersey_number: 19
      }
    },
    {
      id: 4,
      position_code: '2B',
      depth_order: 1,
      Player: {
        first_name: 'Tony',
        last_name: 'Garcia',
        jersey_number: 4
      }
    },
    {
      id: 5,
      position_code: '3B',
      depth_order: 1,
      Player: {
        first_name: 'Alex',
        last_name: 'Rodriguez',
        jersey_number: 13
      }
    },
    {
      id: 6,
      position_code: 'SS',
      depth_order: 1,
      Player: {
        first_name: 'Carlos',
        last_name: 'Hernandez',
        jersey_number: 2
      }
    },
    {
      id: 7,
      position_code: 'LF',
      depth_order: 1,
      Player: {
        first_name: 'Ryan',
        last_name: 'Thompson',
        jersey_number: 17
      }
    },
    {
      id: 8,
      position_code: 'CF',
      depth_order: 1,
      Player: {
        first_name: 'Kevin',
        last_name: 'Williams',
        jersey_number: 24
      }
    },
    {
      id: 9,
      position_code: 'RF',
      depth_order: 1,
      Player: {
        first_name: 'Josh',
        last_name: 'Brown',
        jersey_number: 11
      }
    },
    {
      id: 10,
      position_code: 'DH',
      depth_order: 1,
      Player: {
        first_name: 'David',
        last_name: 'Miller',
        jersey_number: 31
      }
    },
    // Add some backup players
    {
      id: 11,
      position_code: 'P',
      depth_order: 2,
      Player: {
        first_name: 'Tom',
        last_name: 'Wilson',
        jersey_number: 45
      }
    },
    {
      id: 12,
      position_code: 'C',
      depth_order: 2,
      Player: {
        first_name: 'Sam',
        last_name: 'Anderson',
        jersey_number: 12
      }
    }
  ];

  const handlePositionClick = (positionCode) => {
    // In a real app, this would open the player assignment modal
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enhanced Baseball Field Demo
        </h2>
        <p className="text-gray-600">
          This enhanced field view shows players positioned on their corresponding field positions,
          similar to professional depth chart visualizations. Click on any position to interact.
        </p>
      </div>

      <EnhancedBaseballFieldView
        positions={demoPositions}
        assignedPlayers={demoPlayers}
        onPositionClick={handlePositionClick}
        selectedPosition={null}
      />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Player photos/initials displayed on field positions</li>
          <li>• Player names and jersey numbers shown</li>
          <li>• Depth indicators for multiple players per position</li>
          <li>• Interactive hover effects and click handlers</li>
          <li>• Responsive design that scales to different screen sizes</li>
          <li>• Professional-grade field visualization using D3.js</li>
          <li>• Empty positions clearly marked as &quot;OPEN&quot;</li>
          <li>• Color-coded positions with legend</li>
        </ul>
      </div>
    </div>
  );
};

export default BaseballFieldDemo;
