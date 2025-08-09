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

  // Realistic baseball field coordinates (adjusted for better spacing)
  const positionCoords = {
    'P': { x: 400, y: 320, label: 'Pitcher', color: '#EF4444' },
    'C': { x: 400, y: 480, label: 'Catcher', color: '#3B82F6' },
    '1B': { x: 520, y: 280, label: 'First Base', color: '#10B981' },
    '2B': { x: 350, y: 240, label: 'Second Base', color: '#F59E0B' },
    '3B': { x: 280, y: 280, label: 'Third Base', color: '#8B5CF6' },
    'SS': { x: 320, y: 240, label: 'Shortstop', color: '#6366F1' },
    'LF': { x: 180, y: 180, label: 'Left Field', color: '#EC4899' },
    'CF': { x: 400, y: 120, label: 'Center Field', color: '#14B8A6' },
    'RF': { x: 620, y: 180, label: 'Right Field', color: '#F97316' },
    'DH': { x: 650, y: 400, label: 'Designated Hitter', color: '#84CC16' }
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
    
    // Scale coordinates to current dimensions
    const scaleX = width / 800;
    const scaleY = height / 600;

    // Create field background
    const defs = svg.append("defs");
    
    // Gradients for field
    const outfieldGradient = defs.append("linearGradient")
      .attr("id", "outfieldGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", width).attr("y2", height);
    
    outfieldGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#22C55E")
      .attr("stop-opacity", 0.9);
    
    outfieldGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#15803D")
      .attr("stop-opacity", 1);

    const infieldGradient = defs.append("linearGradient")
      .attr("id", "infieldGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", width).attr("y2", height);
    
    infieldGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#D97706")
      .attr("stop-opacity", 0.95);
    
    infieldGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#B45309")
      .attr("stop-opacity", 1);

    // Draw field outline (simplified diamond)
    svg.append("ellipse")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("rx", width * 0.45)
      .attr("ry", height * 0.35)
      .attr("fill", "url(#outfieldGradient)")
      .attr("stroke", "#15803D")
      .attr("stroke-width", 2);

    // Infield dirt
    svg.append("ellipse")
      .attr("cx", width / 2)
      .attr("cy", height * 0.65)
      .attr("rx", width * 0.25)
      .attr("ry", height * 0.20)
      .attr("fill", "url(#infieldGradient)")
      .attr("stroke", "#B45309")
      .attr("stroke-width", 1);

    // Home plate
    const homeX = width / 2;
    const homeY = height * 0.85;
    svg.append("polygon")
      .attr("points", `${homeX-8},${homeY-8} ${homeX+8},${homeY-8} ${homeX+8},${homeY+8} ${homeX},${homeY+15} ${homeX-8},${homeY+8}`)
      .attr("fill", "#1F2937")
      .attr("stroke", "#111827")
      .attr("stroke-width", 1);

    // Bases
    const baseSize = 6;
    // First base
    svg.append("rect")
      .attr("x", homeX + width * 0.15 - baseSize/2)
      .attr("y", homeY - height * 0.15 - baseSize/2)
      .attr("width", baseSize)
      .attr("height", baseSize)
      .attr("fill", "white")
      .attr("stroke", "#374151");

    // Second base
    svg.append("rect")
      .attr("x", homeX - baseSize/2)
      .attr("y", homeY - height * 0.25 - baseSize/2)
      .attr("width", baseSize)
      .attr("height", baseSize)
      .attr("fill", "white")
      .attr("stroke", "#374151");

    // Third base
    svg.append("rect")
      .attr("x", homeX - width * 0.15 - baseSize/2)
      .attr("y", homeY - height * 0.15 - baseSize/2)
      .attr("width", baseSize)
      .attr("height", baseSize)
      .attr("fill", "white")
      .attr("stroke", "#374151");

    // Pitcher's mound
    svg.append("circle")
      .attr("cx", homeX)
      .attr("cy", homeY - height * 0.12)
      .attr("r", 8)
      .attr("fill", "#92400E")
      .attr("stroke", "#78350F")
      .attr("stroke-width", 1);

    // Draw base lines
    const lineGenerator = d3.line();
    
    // Home to first
    svg.append("path")
      .attr("d", lineGenerator([[homeX, homeY], [homeX + width * 0.15, homeY - height * 0.15]]))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Home to third
    svg.append("path")
      .attr("d", lineGenerator([[homeX, homeY], [homeX - width * 0.15, homeY - height * 0.15]]))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Position players with enhanced styling
    Object.entries(positionCoords).forEach(([positionCode, coords]) => {
      const players = getAssignedPlayers(positionCode);
      const scaledX = coords.x * scaleX;
      const scaledY = coords.y * scaleY;
      
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
          .attr("cx", scaledX)
          .attr("cy", scaledY)
          .attr("r", 35)
          .attr("fill", "rgba(255, 255, 255, 0.95)")
          .attr("stroke", coords.color)
          .attr("stroke-width", 3)
          .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.3))");

        // Player photo placeholder (circular)
        positionGroup.append("circle")
          .attr("cx", scaledX)
          .attr("cy", scaledY - 8)
          .attr("r", 18)
          .attr("fill", "#E5E7EB")
          .attr("stroke", coords.color)
          .attr("stroke-width", 2);

        // Player initials or photo
        const initials = playerName.split(' ').map(n => n[0]).join('').substring(0, 2);
        positionGroup.append("text")
          .attr("x", scaledX)
          .attr("y", scaledY - 4)
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
          .attr("x", scaledX)
          .attr("y", scaledY + 18)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .attr("fill", "#1F2937")
          .text(displayName);

        // Jersey number
        if (jerseyNumber) {
          positionGroup.append("text")
            .attr("x", scaledX)
            .attr("y", scaledY + 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("fill", "#6B7280")
            .text(`#${jerseyNumber}`);
        }

        // Position code
        positionGroup.append("text")
          .attr("x", scaledX + 30)
          .attr("y", scaledY - 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", coords.color)
          .text(positionCode);

        // Depth indicator (if multiple players)
        if (players.length > 1) {
          positionGroup.append("circle")
            .attr("cx", scaledX + 25)
            .attr("cy", scaledY + 20)
            .attr("r", 8)
            .attr("fill", "#EF4444")
            .attr("stroke", "white")
            .attr("stroke-width", 1);
          
          positionGroup.append("text")
            .attr("x", scaledX + 25)
            .attr("y", scaledY + 24)
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
          .attr("cx", scaledX)
          .attr("cy", scaledY)
          .attr("r", 25)
          .attr("fill", "rgba(255, 255, 255, 0.8)")
          .attr("stroke", "#9CA3AF")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5");

        positionGroup.append("text")
          .attr("x", scaledX)
          .attr("y", scaledY - 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("fill", "#6B7280")
          .text(positionCode);

        positionGroup.append("text")
          .attr("x", scaledX)
          .attr("y", scaledY + 8)
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
          .attr("cx", scaledX)
          .attr("cy", scaledY)
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
          {Object.entries(positionCoords).map(([positionCode, coords]) => {
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
                {Object.keys(positionCoords).length}
              </div>
            </div>
            <div className="stat bg-white p-3 rounded-lg border border-gray-200">
              <div className="stat-title text-xs text-gray-600">Filled Positions</div>
              <div className="stat-value text-xl font-bold text-green-600">
                {Object.keys(positionCoords).filter(pos => 
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
                {Math.round((Object.keys(positionCoords).filter(pos => 
                  getAssignedPlayers(pos).length > 0
                ).length / Object.keys(positionCoords).length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBaseballFieldView;
