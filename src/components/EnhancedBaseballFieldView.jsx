import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const EnhancedBaseballFieldView = ({ positions, assignedPlayers, onPositionClick, selectedPosition }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Helper functions
  const getAssignmentPlayer = (assignment) => assignment?.Player || assignment?.player || null;
  const getAssignmentPlayerName = (assignment) => {
    const p = getAssignmentPlayer(assignment);
    if (!p) return '';
    return `${p.first_name || ''} ${p.last_name || ''}`.trim();
  };
  const getAssignmentJerseyNumber = (assignment) => {
    const p = getAssignmentPlayer(assignment);
    return p?.jersey_number;
  };

  // Calculate realistic position coordinates based on field geometry
  const getPositionCoords = (width, height) => {
    const centerX = width / 2;
    const bottomY = height * 0.95; // Move field lower
    const fieldRadius = Math.min(width, height) * 0.4;
    const infieldRadius = fieldRadius * 0.35; // Smaller infield
    
    // Standard baseball diamond angles and distances
    const pitcherDistance = infieldRadius * 0.65;
    const infieldDistance = infieldRadius * 0.85;
    const outfieldDistance = fieldRadius * 0.75;
    
    return {
      'C': { 
        x: centerX, 
        y: bottomY - 20, 
        label: 'Catcher', 
        color: '#3B82F6' 
      },
      'P': { 
        x: centerX, 
        y: bottomY - pitcherDistance, 
        label: 'Pitcher', 
        color: '#EF4444' 
      },
      '1B': { 
        x: centerX + infieldDistance * 0.7, 
        y: bottomY - infieldDistance * 0.7, 
        label: 'First Base', 
        color: '#10B981' 
      },
      '2B': { 
        x: centerX + infieldDistance * 0.3, 
        y: bottomY - infieldDistance, 
        label: 'Second Base', 
        color: '#F59E0B' 
      },
      'SS': { 
        x: centerX - infieldDistance * 0.3, 
        y: bottomY - infieldDistance, 
        label: 'Shortstop', 
        color: '#6366F1' 
      },
      '3B': { 
        x: centerX - infieldDistance * 0.7, 
        y: bottomY - infieldDistance * 0.7, 
        label: 'Third Base', 
        color: '#8B5CF6' 
      },
      'RF': { 
        x: centerX + outfieldDistance * 0.8, 
        y: bottomY - outfieldDistance * 0.6, 
        label: 'Right Field', 
        color: '#F97316' 
      },
      'CF': { 
        x: centerX, 
        y: bottomY - outfieldDistance, 
        label: 'Center Field', 
        color: '#14B8A6' 
      },
      'LF': { 
        x: centerX - outfieldDistance * 0.8, 
        y: bottomY - outfieldDistance * 0.6, 
        label: 'Left Field', 
        color: '#EC4899' 
      },
      'DH': { 
        x: centerX + fieldRadius * 0.9, 
        y: bottomY - 40, 
        label: 'Designated Hitter', 
        color: '#84CC16' 
      }
    };
  };

  const getAssignedPlayers = (positionCode) => {
    return assignedPlayers.filter(assignment => 
      assignment.position_code === positionCode
    ).sort((a, b) => a.depth_order - b.depth_order);
  };

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setDimensions({
          width: Math.min(rect.width, 800),
          height: Math.min(rect.width * 0.75, 600)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;
    
    // Get position coordinates based on current dimensions
    const positionCoords = getPositionCoords(width, height);

    // Create field background
    const defs = svg.append("defs");
    
    // Gradients for field
    const outfieldGradient = defs.append("radialGradient")
      .attr("id", "outfieldGradient")
      .attr("cx", "50%")
      .attr("cy", "80%")
      .attr("r", "60%");
    
    outfieldGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4ADE80")
      .attr("stop-opacity", 1);
    
    outfieldGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#15803D")
      .attr("stop-opacity", 1);

    const infieldGradient = defs.append("radialGradient")
      .attr("id", "infieldGradient")
      .attr("cx", "50%")
      .attr("cy", "90%")
      .attr("r", "40%");
    
    infieldGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#F59E0B")
      .attr("stop-opacity", 1);
    
    infieldGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#D97706")
      .attr("stop-opacity", 1);

    // Calculate field dimensions
    const centerX = width / 2;
    const bottomY = height * 0.99; // push apex lower to reduce top padding
    const fieldRadius = Math.min(width, height) * 0.95; // make shape much larger

    // Apex (home plate area)
    const homeX = centerX;
    const homeY = bottomY - 8;

    // Left and right foul line endpoints (45° from horizontal)
    // Use steeper foul-line angle (≈60° from horizontal) to lift arc higher
    const angle = (60 * Math.PI) / 180; // radians
    const leftPoint = [
      homeX + fieldRadius * Math.cos(-Math.PI + angle),
      homeY + fieldRadius * Math.sin(-Math.PI + angle)
    ];
    const rightPoint = [
      homeX + fieldRadius * Math.cos(-angle),
      homeY + fieldRadius * Math.sin(-angle)
    ];

    // Draw outline path like provided icon: arc + two foul lines meeting at home
    const R = fieldRadius;
    const pathD = `M ${leftPoint[0]} ${leftPoint[1]} A ${R} ${R} 0 0 1 ${rightPoint[0]} ${rightPoint[1]} L ${homeX} ${homeY} Z`;
    svg.append('path')
      .attr('d', pathD)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 6)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');

    // Inner diamond (infield)
    const diamondDist = R * 0.35;
    const first = [homeX + diamondDist * Math.SQRT1_2, homeY - diamondDist * Math.SQRT1_2];
    const second = [homeX, homeY - diamondDist * 1.4];
    const third = [homeX - diamondDist * Math.SQRT1_2, homeY - diamondDist * Math.SQRT1_2];
    const diamondPath = `M ${homeX} ${homeY} L ${first[0]} ${first[1]} L ${second[0]} ${second[1]} L ${third[0]} ${third[1]} Z`;
    svg.append('path')
      .attr('d', diamondPath)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round');

    // Bases as small rotated squares
    const baseSize = 10;
    const addBase = ([x, y]) => {
      svg.append('rect')
        .attr('x', x - baseSize / 2)
        .attr('y', y - baseSize / 2)
        .attr('width', baseSize)
        .attr('height', baseSize)
        .attr('fill', 'white')
        .attr('stroke', '#2E2E2E')
        .attr('stroke-width', 4)
        .attr('transform', `rotate(45 ${x} ${y})`);
    };
    addBase(first);
    addBase(second);
    addBase(third);

    // Pitcher's mound
    const moundX = (homeX + second[0]) / 2;
    const moundY = (homeY + second[1]) / 2;
    svg.append('circle')
      .attr('cx', moundX)
      .attr('cy', moundY)
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4);

    // Home-plate ring
    const homeRingY = Math.min(homeY + 14, height - 18);
    svg.append('circle')
      .attr('cx', homeX)
      .attr('cy', homeRingY)
      .attr('r', 16)
      .attr('fill', 'none')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4);

    // Home plate shape
    const plateSize = 10;
    svg.append('polygon')
      .attr('points', `${homeX-plateSize},${homeY-plateSize} ${homeX+plateSize},${homeY-plateSize} ${homeX+plateSize},${homeY} ${homeX},${homeY+plateSize/1.2} ${homeX-plateSize},${homeY}`)
      .attr('fill', 'white')
      .attr('stroke', '#2E2E2E')
      .attr('stroke-width', 4);

    // Position players with enhanced styling
    Object.entries(positionCoords).forEach(([positionCode, coords]) => {
      const players = getAssignedPlayers(positionCode);
      const playerX = coords.x;
      const playerY = coords.y;
      
      // Create position group
      const positionGroup = svg.append("g")
        .attr("class", "position-group")
        .style("cursor", "pointer")
        .on("click", () => onPositionClick && onPositionClick(positionCode));

      if (players.length > 0) {
        const primaryPlayer = players[0]; // Show first string player
        const player = getAssignmentPlayer(primaryPlayer);
        const playerName = getAssignmentPlayerName(primaryPlayer);
        const jerseyNumber = getAssignmentJerseyNumber(primaryPlayer);

        // Player background circle
        positionGroup.append("circle")
          .attr("cx", playerX)
          .attr("cy", playerY)
          .attr("r", 35)
          .attr("fill", "rgba(255, 255, 255, 0.95)")
          .attr("stroke", coords.color)
          .attr("stroke-width", 3)
          .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))");

        // Player photo placeholder (circular)
        positionGroup.append("circle")
          .attr("cx", playerX)
          .attr("cy", playerY - 8)
          .attr("r", 18)
          .attr("fill", "#E5E7EB")
          .attr("stroke", coords.color)
          .attr("stroke-width", 2);

        // Player initials or photo
        const initials = playerName.split(' ').map(n => n[0]).join('').substring(0, 2);
        positionGroup.append("text")
          .attr("x", playerX)
          .attr("y", playerY - 4)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", coords.color)
          .text(initials);

        // Player name
        const displayName = playerName.length > 12 ? 
          playerName.split(' ').map(n => n.substring(0, 1) + '.').join(' ') : 
          playerName;
        
        positionGroup.append("text")
          .attr("x", playerX)
          .attr("y", playerY + 18)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .attr("fill", "#1F2937")
          .text(displayName);

        // Jersey number
        if (jerseyNumber) {
          positionGroup.append("text")
            .attr("x", playerX)
            .attr("y", playerY + 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("fill", "#6B7280")
            .text(`#${jerseyNumber}`);
        }

        // Position code
        positionGroup.append("text")
          .attr("x", playerX + 30)
          .attr("y", playerY - 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", coords.color)
          .text(positionCode);

        // Depth indicator (if multiple players)
        if (players.length > 1) {
          positionGroup.append("circle")
            .attr("cx", playerX + 25)
            .attr("cy", playerY + 20)
            .attr("r", 8)
            .attr("fill", "#EF4444")
            .attr("stroke", "white")
            .attr("stroke-width", 1);
          
          positionGroup.append("text")
            .attr("x", playerX + 25)
            .attr("y", playerY + 24)
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text(players.length);
        }

        // Hover effect
        positionGroup
          .on("mouseenter", function() {
            d3.select(this).select("circle")
              .transition()
              .duration(200)
              .attr("r", 40)
              .attr("stroke-width", 4);
          })
          .on("mouseleave", function() {
            d3.select(this).select("circle")
              .transition()
              .duration(200)
              .attr("r", 35)
              .attr("stroke-width", 3);
          });

      } else {
        // Empty position
        positionGroup.append("circle")
          .attr("cx", playerX)
          .attr("cy", playerY)
          .attr("r", 25)
          .attr("fill", "rgba(255, 255, 255, 0.8)")
          .attr("stroke", "#9CA3AF")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5");

        positionGroup.append("text")
          .attr("x", playerX)
          .attr("y", playerY - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("fill", "#6B7280")
          .text(positionCode);

        positionGroup.append("text")
          .attr("x", playerX)
          .attr("y", playerY + 8)
          .attr("text-anchor", "middle")
          .attr("font-size", "8px")
          .attr("fill", "#9CA3AF")
          .text("OPEN");

        // Hover effect for empty positions
        positionGroup
          .on("mouseenter", function() {
            d3.select(this).select("circle")
              .transition()
              .duration(200)
              .attr("r", 30)
              .attr("stroke-width", 3);
          })
          .on("mouseleave", function() {
            d3.select(this).select("circle")
              .transition()
              .duration(200)
              .attr("r", 25)
              .attr("stroke-width", 2);
          });
      }

      // Selection highlight
      if (selectedPosition === positionCode) {
        positionGroup.append("circle")
          .attr("cx", playerX)
          .attr("cy", playerY)
          .attr("r", 45)
          .attr("fill", "none")
          .attr("stroke", "#3B82F6")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "8,4")
          .style("pointer-events", "none");
      }
    });

  }, [dimensions, assignedPlayers, selectedPosition, onPositionClick]);

  return (
    <div className="w-full">
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
          Enhanced Baseball Field View
        </h3>
        
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)'
            }}
          />
        </div>

        {/* Field Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(getPositionCoords(dimensions.width, dimensions.height)).map(([positionCode, coords]) => {
            const players = getAssignedPlayers(positionCode);
            
            return (
              <div
                key={positionCode}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedPosition === positionCode
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => onPositionClick && onPositionClick(positionCode)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: coords.color }}
                    />
                    <span className="font-bold text-sm text-gray-800">
                      {positionCode}
                    </span>
                  </div>
                  {players.length > 0 && (
                    <span className="badge badge-sm badge-primary">
                      {players.length}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {coords.label}
                </div>
                {players.length > 0 && (
                  <div className="text-xs font-medium text-blue-600">
                    {getAssignmentPlayerName(players[0])}
                    {getAssignmentJerseyNumber(players[0]) && 
                      ` #${getAssignmentJerseyNumber(players[0])}`
                    }
                  </div>
                )}
                {players.length === 0 && (
                  <div className="text-xs text-gray-400">Open Position</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Field Statistics */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-lg mb-3 text-gray-800">Field Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="stat bg-white p-3 rounded-lg border border-gray-200">
              <div className="stat-title text-xs text-gray-600">Total Positions</div>
              <div className="stat-value text-xl font-bold text-gray-800">
                {Object.keys(getPositionCoords(dimensions.width, dimensions.height)).length}
              </div>
            </div>
            <div className="stat bg-white p-3 rounded-lg border border-gray-200">
              <div className="stat-title text-xs text-gray-600">Filled Positions</div>
              <div className="stat-value text-xl font-bold text-green-600">
                {Object.keys(getPositionCoords(dimensions.width, dimensions.height)).filter(pos => 
                  getAssignedPlayers(pos).length > 0
                ).length}
              </div>
            </div>
            <div className="stat bg-white p-3 rounded-lg border border-gray-200">
              <div className="stat-title text-xs text-gray-600">Total Players</div>
              <div className="stat-value text-xl font-bold text-blue-600">
                {assignedPlayers.length}
              </div>
            </div>
            <div className="stat bg-white p-3 rounded-lg border border-gray-200">
              <div className="stat-title text-xs text-gray-600">Coverage</div>
              <div className="stat-value text-xl font-bold text-purple-600">
                {Math.round((Object.keys(getPositionCoords(dimensions.width, dimensions.height)).filter(pos => 
                  getAssignedPlayers(pos).length > 0
                ).length / Object.keys(getPositionCoords(dimensions.width, dimensions.height)).length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBaseballFieldView;
