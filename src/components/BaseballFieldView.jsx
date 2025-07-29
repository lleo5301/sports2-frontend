import React, { useState } from 'react';
import { Users, Target, Shield, Zap, Heart, User, Calendar } from 'lucide-react';

const BaseballFieldView = ({ positions, assignedPlayers, onPositionClick, selectedPosition }) => {
  const [hoveredPosition, setHoveredPosition] = useState(null);
  
  // Updated position coordinates to match realistic baseball field layout
  const positionCoords = {
    'P': { x: 50, y: 65, label: 'Pitcher', color: '#EF4444' },
    'C': { x: 50, y: 88, label: 'Catcher', color: '#3B82F6' },
    '1B': { x: 68, y: 58, label: 'First Base', color: '#10B981' },
    '2B': { x: 32, y: 58, label: 'Second Base', color: '#F59E0B' },
    '3B': { x: 68, y: 42, label: 'Third Base', color: '#8B5CF6' },
    'SS': { x: 32, y: 42, label: 'Shortstop', color: '#8B5CF6' },
    'LF': { x: 78, y: 35, label: 'Left Field', color: '#EC4899' },
    'CF': { x: 50, y: 25, label: 'Center Field', color: '#06B6D4' },
    'RF': { x: 22, y: 35, label: 'Right Field', color: '#F97316' },
    'DH': { x: 85, y: 50, label: 'Designated Hitter', color: '#84CC16' }
  };

  const getPositionIcon = (positionCode) => {
    switch (positionCode) {
      case 'P':
      case 'C':
        return Shield;
      case '1B':
      case '2B':
      case '3B':
      case 'SS':
        return Target;
      case 'LF':
      case 'CF':
      case 'RF':
        return Zap;
      case 'DH':
        return Heart;
      default:
        return Users;
    }
  };

  const getPositionColor = (positionCode) => {
    return positionCoords[positionCode]?.color || '#6B7280';
  };

  const getAssignedPlayers = (positionCode) => {
    return assignedPlayers.filter(assignment => 
      assignment.position_code === positionCode
    ).sort((a, b) => a.depth_order - b.depth_order);
  };

  const handlePositionClick = (positionCode) => {
    if (onPositionClick) {
      onPositionClick(positionCode);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Baseball Field View</h3>
        
        {/* Baseball Field SVG */}
        <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto">
          {/* Tooltip */}
          {hoveredPosition && (
            <div 
              className="absolute z-20 bg-white border border-gray-300 rounded-lg p-4 shadow-xl max-w-xs"
              style={{
                left: `${(positionCoords[hoveredPosition]?.x || 50) * 0.8}%`,
                top: `${(positionCoords[hoveredPosition]?.y || 50) * 0.6}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="font-bold text-sm mb-2 text-gray-800">
                {positionCoords[hoveredPosition]?.label} ({hoveredPosition})
              </div>
              {getAssignedPlayers(hoveredPosition).length > 0 ? (
                <div className="space-y-1">
                  {getAssignedPlayers(hoveredPosition).slice(0, 3).map((assignment, index) => (
                    <div key={assignment.id} className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-600">{index + 1}.</span>
                      <span className="font-medium">{assignment.player?.first_name} {assignment.player?.last_name}</span>
                      {assignment.player?.jersey_number && (
                        <span className="text-gray-500">#{assignment.player.jersey_number}</span>
                      )}
                    </div>
                  ))}
                  {getAssignedPlayers(hoveredPosition).length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{getAssignedPlayers(hoveredPosition).length - 3} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500">No players assigned</div>
              )}
            </div>
          )}
          
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))' }}
          >
            {/* Field Background */}
            <defs>
              <linearGradient id="outfieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#22C55E', stopOpacity: 0.9 }} />
                <stop offset="50%" style={{ stopColor: '#16A34A', stopOpacity: 0.95 }} />
                <stop offset="100%" style={{ stopColor: '#15803D', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="infieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#D97706', stopOpacity: 0.95 }} />
                <stop offset="100%" style={{ stopColor: '#B45309', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="moundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#92400E', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#78350F', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Outfield grass */}
            <ellipse cx="50" cy="50" rx="48" ry="38" fill="url(#outfieldGradient)" stroke="#15803D" strokeWidth="0.3" />
            
            {/* Infield dirt */}
            <ellipse cx="50" cy="50" rx="28" ry="22" fill="url(#infieldGradient)" stroke="#B45309" strokeWidth="0.3" />
            
            {/* Home plate */}
            <polygon 
              points="47,88 50,92 53,88 53,85 47,85" 
              fill="#1F2937" 
              stroke="#111827" 
              strokeWidth="0.5"
            />
            
            {/* Bases */}
            <rect x="65" y="56" width="4" height="4" fill="white" stroke="#374151" strokeWidth="0.8" />
            <rect x="31" y="56" width="4" height="4" fill="white" stroke="#374151" strokeWidth="0.8" />
            <rect x="65" y="40" width="4" height="4" fill="white" stroke="#374151" strokeWidth="0.8" />
            
            {/* Base lines */}
            <line x1="50" y1="88" x2="67" y2="58" stroke="white" strokeWidth="1.2" />
            <line x1="50" y1="88" x2="33" y2="58" stroke="white" strokeWidth="1.2" />
            <line x1="50" y1="88" x2="67" y2="42" stroke="white" strokeWidth="1.2" />
            <line x1="67" y1="58" x2="67" y2="42" stroke="white" strokeWidth="1.2" />
            <line x1="33" y1="58" x2="67" y2="58" stroke="white" strokeWidth="1.2" />
            <line x1="33" y1="58" x2="33" y2="42" stroke="white" strokeWidth="1.2" />
            <line x1="67" y1="42" x2="33" y2="42" stroke="white" strokeWidth="1.2" />
            
            {/* Pitcher's mound */}
            <circle cx="50" cy="65" r="3" fill="url(#moundGradient)" stroke="#78350F" strokeWidth="0.5" />
            <circle cx="50" cy="65" r="1.5" fill="#92400E" />
            
            {/* Position markers with enhanced styling */}
            {Object.entries(positionCoords).map(([positionCode, coords]) => {
              const IconComponent = getPositionIcon(positionCode);
              const color = getPositionColor(positionCode);
              const players = getAssignedPlayers(positionCode);
              const isSelected = selectedPosition === positionCode;
              const isHovered = hoveredPosition === positionCode;
              
              return (
                <g key={positionCode}>
                  {/* Position circle with enhanced styling */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="4"
                    fill={color}
                    stroke={isSelected ? "#1F2937" : "#FFFFFF"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onClick={() => handlePositionClick(positionCode)}
                    onMouseEnter={() => setHoveredPosition(positionCode)}
                    onMouseLeave={() => setHoveredPosition(null)}
                  />
                  
                  {/* Inner highlight */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="2"
                    fill="rgba(255,255,255,0.3)"
                    className="pointer-events-none"
                  />
                  
                  {/* Position label */}
                  <text
                    x={coords.x}
                    y={coords.y + 7}
                    textAnchor="middle"
                    fontSize="3"
                    fill="#1F2937"
                    fontWeight="bold"
                    className="pointer-events-none"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
                  >
                    {positionCode}
                  </text>
                  
                  {/* Player count indicator */}
                  {players.length > 0 && (
                    <circle
                      cx={coords.x + 5}
                      cy={coords.y - 5}
                      r="2"
                      fill="#EF4444"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Enhanced Position Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {positions.map((position) => {
            const IconComponent = getPositionIcon(position.position_code);
            const players = getAssignedPlayers(position.position_code);
            const color = getPositionColor(position.position_code);
            
            return (
              <div
                key={position.position_code}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedPosition === position.position_code
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handlePositionClick(position.position_code)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-bold text-sm text-gray-800">
                      {position.position_code}
                    </span>
                  </div>
                  {players.length > 0 && (
                    <span className="badge badge-sm badge-primary">
                      {players.length}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {position.position_name}
                </div>
                {players.length > 0 && (
                  <div className="space-y-1">
                    {players.slice(0, 2).map((assignment, index) => (
                      <div key={assignment.id} className="text-xs bg-gray-50 p-1 rounded">
                        <span className="font-semibold text-blue-600">
                          {index + 1}. {assignment.player?.first_name} {assignment.player?.last_name}
                        </span>
                        {assignment.player?.jersey_number && (
                          <span className="text-gray-500 ml-1">#{assignment.player.jersey_number}</span>
                        )}
                      </div>
                    ))}
                    {players.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{players.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Position Details */}
        {selectedPosition && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getPositionColor(selectedPosition) }}
              />
              {positionCoords[selectedPosition]?.label} ({selectedPosition})
            </h4>
            {getAssignedPlayers(selectedPosition).length > 0 ? (
              <div className="space-y-3">
                {getAssignedPlayers(selectedPosition).map((assignment, index) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-blue-600 text-lg">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {assignment.player?.first_name} {assignment.player?.last_name}
                        </span>
                        {assignment.player?.jersey_number && (
                          <span className="text-gray-500 ml-2">#{assignment.player.jersey_number}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {assignment.notes && `Notes: ${assignment.notes}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No players assigned to this position</p>
            )}
          </div>
        )}

        {/* Field Statistics */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-lg mb-4 text-gray-800">Field Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="stat bg-white p-4 rounded-lg border border-gray-200">
              <div className="stat-title text-sm text-gray-600">Total Positions</div>
              <div className="stat-value text-2xl font-bold text-gray-800">{positions.length}</div>
            </div>
            <div className="stat bg-white p-4 rounded-lg border border-gray-200">
              <div className="stat-title text-sm text-gray-600">Filled Positions</div>
              <div className="stat-value text-2xl font-bold text-green-600">
                {positions.filter(pos => getAssignedPlayers(pos.position_code).length > 0).length}
              </div>
            </div>
            <div className="stat bg-white p-4 rounded-lg border border-gray-200">
              <div className="stat-title text-sm text-gray-600">Total Players</div>
              <div className="stat-value text-2xl font-bold text-blue-600">{assignedPlayers.length}</div>
            </div>
            <div className="stat bg-white p-4 rounded-lg border border-gray-200">
              <div className="stat-title text-sm text-gray-600">Coverage</div>
              <div className="stat-value text-2xl font-bold text-purple-600">
                {positions.length > 0 ? Math.round((positions.filter(pos => getAssignedPlayers(pos.position_code).length > 0).length / positions.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseballFieldView; 