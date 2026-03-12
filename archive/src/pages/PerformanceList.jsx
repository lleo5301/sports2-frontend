import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { playersService } from '../services/players';
import {
  ChevronUp,
  ChevronDown,
  Trophy,
  Users,
  Eye,
  Search
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { Spinner, Chip, Button, ButtonGroup } from '@heroui/react';

const PerformanceList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    school_type: '',
    status: 'active',
    sort_by: 'batting_avg',
    order: 'DESC',
    limit: 50
  });

  const [selectedView, setSelectedView] = useState('all'); // 'all', 'batting', 'pitching'

  // Debounce the search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  // Create filters object with debounced search for API calls
  const queryFilters = {
    ...filters,
    search: debouncedSearch
  };

  // Fetch performance data
  const {
    data: performanceData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['player-performance', queryFilters],
    queryFn: () => playersService.getPlayerPerformance(queryFilters),
    staleTime: 30000
  });

  const players = performanceData?.data || [];
  const summary = performanceData?.summary || {};

  const handleSortChange = (sortBy) => {
    const newOrder =
      filters.sort_by === sortBy && filters.order === 'DESC' ? 'ASC' : 'DESC';
    setFilters((prev) => ({
      ...prev,
      sort_by: sortBy,
      order: newOrder
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewPlayer = (playerId) => {
    navigate(`/players/${playerId}`);
  };

  const getViewPlayers = () => {
    if (selectedView === 'batting') {
      return players.filter((p) => p.position !== 'P');
    } else if (selectedView === 'pitching') {
      return players.filter((p) => p.position === 'P');
    }
    return players;
  };

  const getSortIcon = (column) => {
    if (filters.sort_by !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return filters.order === 'DESC' ? (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    );
  };

  const getPerformanceClass = (value, type) => {
    if (type === 'batting_avg') {
      const val = parseFloat(value);
      if (val >= 0.3) return 'text-green-600 font-semibold';
      if (val >= 0.25) return 'text-blue-600';
      return 'text-red-600';
    } else if (type === 'era') {
      const val = parseFloat(value);
      if (val <= 3.0) return 'text-green-600 font-semibold';
      if (val <= 4.5) return 'text-blue-600';
      return 'text-red-600';
    } else if (type === 'home_runs') {
      const val = parseInt(value);
      if (val >= 10) return 'text-green-600 font-semibold';
      if (val >= 5) return 'text-blue-600';
      return '';
    }
    return '';
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank <= 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (rank <= 5) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
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
            <span>Failed to load performance data: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  const viewPlayers = getViewPlayers();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Player Performance Rankings
            </h1>
          </div>
          <p className="text-foreground/70">
            View and analyze player performance statistics with rankings and
            comparisons
          </p>
        </div>

        {/* Summary Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          data-testid="summary-cards"
        >
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="card-body text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/80 text-sm font-medium">
                    Total Players
                  </h3>
                  <p className="text-2xl font-bold">
                    {summary.total_players || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-500 to-green-600">
            <div className="card-body text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/80 text-sm font-medium">
                    Team Batting Avg
                  </h3>
                  <p className="text-2xl font-bold">
                    {(summary.team_batting_avg || 0).toFixed(3)}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-500 to-purple-600">
            <div className="card-body text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/80 text-sm font-medium">
                    Team ERA
                  </h3>
                  <p className="text-2xl font-bold">
                    {(summary.team_era || 0).toFixed(2)}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="card-body text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white/80 text-sm font-medium">
                    Active Players
                  </h3>
                  <p className="text-2xl font-bold">
                    {players.filter((p) => p.status === 'active').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="card mb-8" data-testid="filters-section">
          <div className="card-body">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search players by name, school, city, state..."
                  className="input input-bordered w-full pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/70">
                  View:
                </span>
              </div>

              {/* Position Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/70">
                  Position:
                </span>
                <select
                  className="select select-bordered select-sm"
                  value={filters.position}
                  onChange={(e) =>
                    handleFilterChange('position', e.target.value)
                  }
                >
                  <option value="">All Positions</option>
                  <option value="P">Pitcher</option>
                  <option value="C">Catcher</option>
                  <option value="1B">First Base</option>
                  <option value="2B">Second Base</option>
                  <option value="3B">Third Base</option>
                  <option value="SS">Shortstop</option>
                  <option value="LF">Left Field</option>
                  <option value="CF">Center Field</option>
                  <option value="RF">Right Field</option>
                  <option value="OF">Outfield</option>
                  <option value="DH">Designated Hitter</option>
                </select>
              </div>

              {/* School Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/70">
                  School:
                </span>
                <select
                  className="select select-bordered select-sm"
                  value={filters.school_type}
                  onChange={(e) =>
                    handleFilterChange('school_type', e.target.value)
                  }
                >
                  <option value="">All Schools</option>
                  <option value="HS">High School</option>
                  <option value="COLL">College</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/70">
                  Status:
                </span>
                <select
                  className="select select-bordered select-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="space-y-4" data-testid="performance-table">
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="text-center">Rank</th>
                  <th>Player</th>
                  <th>Pos</th>
                  <th>School</th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('batting_avg')}
                  >
                    <div className="flex items-center gap-1">
                      AVG {getSortIcon('batting_avg')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('home_runs')}
                  >
                    <div className="flex items-center gap-1">
                      HR {getSortIcon('home_runs')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('rbi')}
                  >
                    <div className="flex items-center gap-1">
                      RBI {getSortIcon('rbi')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('stolen_bases')}
                  >
                    <div className="flex items-center gap-1">
                      SB {getSortIcon('stolen_bases')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('era')}
                  >
                    <div className="flex items-center gap-1">
                      ERA {getSortIcon('era')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('wins')}
                  >
                    <div className="flex items-center gap-1">
                      W {getSortIcon('wins')}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSortChange('strikeouts')}
                  >
                    <div className="flex items-center gap-1">
                      K {getSortIcon('strikeouts')}
                    </div>
                  </th>
                  <th>Performance</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {viewPlayers.map((player) => (
                  <tr key={player.id} className="group">
                    <td className="text-center">
                      <div
                        className={`badge ${getRankClass(player.rank)} border font-semibold`}
                      >
                        #{player.rank}
                      </div>
                    </td>
                    <td className="font-bold text-ui-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                          {player.first_name?.[0] || '?'}
                          {player.last_name?.[0] || '?'}
                        </div>
                        <div>
                          <p>
                            {player.first_name} {player.last_name}
                          </p>
                          <p className="text-[10px] text-ui-secondary opacity-50 uppercase font-black tracking-tighter">
                            {player.school_type} • {player.graduation_year}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Chip
                        className="border-ui-border text-[10px] font-bold uppercase tracking-wider h-6"
                        variant="bordered"
                      >
                        {player.position}
                      </Chip>
                    </td>
                    <td className="text-ui-secondary">
                      <div>
                        <div>{player.school}</div>
                        <div className="text-xs opacity-50">
                          {player.city}, {player.state}
                        </div>
                      </div>
                    </td>
                    <td
                      className={getPerformanceClass(
                        player.display_stats.batting_avg,
                        'batting_avg'
                      )}
                    >
                      {player.display_stats.batting_avg}
                    </td>
                    <td
                      className={getPerformanceClass(
                        player.home_runs,
                        'home_runs'
                      )}
                    >
                      {player.home_runs || 0}
                    </td>
                    <td>{player.rbi || 0}</td>
                    <td>{player.stolen_bases || 0}</td>
                    <td
                      className={getPerformanceClass(
                        player.display_stats.era,
                        'era'
                      )}
                    >
                      {player.display_stats.era}
                    </td>
                    <td>{player.wins || 0}</td>
                    <td>{player.strikeouts || 0}</td>
                    <td>
                      <div className="text-sm">
                        <div className="font-semibold text-primary">
                          {player.calculated_stats.performance_score}
                        </div>
                        {player.position === 'P' && (
                          <div className="text-xs text-ui-secondary opacity-50">
                            K/9: {player.calculated_stats.k9}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end">
                        <Button
                          className="text-info hover:bg-info/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleViewPlayer(player.id)}
                          title="View Profile"
                          size="sm"
                          variant="light"
                          isIconOnly
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {viewPlayers.length === 0 && (
              <div className="text-center py-20">
                <div className="flex flex-col items-center opacity-30">
                  <Trophy className="w-12 h-12 mb-4" />
                  <p className="text-lg font-bold">No performance data found</p>
                  <p className="text-sm">
                    Try adjusting your filters or add some player statistics
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceList;
