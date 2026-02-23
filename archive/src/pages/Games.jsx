import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Filter
} from 'lucide-react';
import { gamesService } from '../services/games';
import { Spinner, Chip, Button } from '@heroui/react';

const Games = () => {
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState('');

  // Fetch all games (with high limit to get all)
  const { data: gamesData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['games', seasonFilter],
    queryFn: () => gamesService.getAllGames({ season: seasonFilter || undefined, limit: 200 })
  });

  const games = gamesData?.data || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Split games into upcoming and past
  const upcomingGames = games
    .filter(game => {
      const gameDate = new Date(game.game_date || game.gameDate);
      return gameDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.game_date || a.gameDate);
      const dateB = new Date(b.game_date || b.gameDate);
      return dateA - dateB; // Ascending - nearest first
    });

  const pastGames = games
    .filter(game => {
      const gameDate = new Date(game.game_date || game.gameDate);
      return gameDate < today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.game_date || a.gameDate);
      const dateB = new Date(b.game_date || b.gameDate);
      return dateB - dateA; // Descending - most recent first
    });

  // Display limits
  const displayedUpcoming = showAllUpcoming ? upcomingGames : upcomingGames.slice(0, 5);
  const displayedPast = showAllPast ? pastGames : pastGames.slice(0, 10);

  // Get unique seasons for filter
  const seasons = [...new Set(games.map(g => g.season).filter(Boolean))].sort().reverse();

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    // Check for invalid date (epoch or NaN)
    if (isNaN(date.getTime()) || date.getFullYear() < 2000) return 'TBD';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr;
  };

  const getResultBadge = (game) => {
    const teamScore = game.team_score ?? game.teamScore;
    const opponentScore = game.opponent_score ?? game.opponentScore;
    const hasScore = teamScore !== null && teamScore !== undefined &&
                    opponentScore !== null && opponentScore !== undefined;

    if (!hasScore) return null;

    const result = game.result || (
      teamScore > opponentScore ? 'W' :
        teamScore < opponentScore ? 'L' : 'T'
    );

    const badgeClass =
      result === 'W' || result === 'Win' ? 'badge-success' :
        result === 'L' || result === 'Loss' ? 'badge-error' :
          'badge-ghost';

    return (
      <span className={`badge ${badgeClass}`}>
        {result} {teamScore}-{opponentScore}
      </span>
    );
  };

  const getStatusBadge = (game) => {
    if (!game.status) return null;

    const badgeClass =
      game.status === 'scheduled' ? 'badge-info' :
        game.status === 'in_progress' ? 'badge-warning' :
          game.status === 'completed' ? 'badge-success' :
            game.status === 'cancelled' ? 'badge-error' :
              'badge-ghost';

    return (
      <span className={`badge badge-sm ${badgeClass}`}>
        {game.status === 'in_progress' ? 'LIVE' : game.status}
      </span>
    );
  };

  const GameCard = ({ game, isPast = false }) => {
    const homeAway = game.home_away || game.homeAway;
    const isHome = homeAway === 'home';

    const cardContent = (
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                isHome ? 'bg-success/20 text-success' : 'bg-info/20 text-info'
              }`}>
                {isHome ? 'HOME' : 'AWAY'}
              </span>
              {getStatusBadge(game)}
            </div>

            <h3 className="font-semibold text-lg truncate">
              {isHome ? 'vs' : '@'} {game.opponent || 'TBD'}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-foreground/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(game.game_date || game.gameDate)}</span>
              </div>

              {(game.game_time || game.gameTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(game.game_time || game.gameTime)}</span>
                </div>
              )}

              {game.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{game.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {isPast && getResultBadge(game)}
          </div>
        </div>
      </div>
    );

    // Past games are clickable to view stats
    if (isPast) {
      return (
        <Link to={`/games/${game.id}`} className="card bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          {cardContent}
        </Link>
      );
    }

    return (
      <div className="card bg-background shadow-sm hover:shadow-md transition-shadow">
        {cardContent}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" />
            Games
          </h1>
          <p className="text-foreground/70 mt-1">
            View upcoming and past games
          </p>
        </div>

        <div className="flex items-center gap-2">
          {seasons.length > 0 && (
            <select
              className="select select-bordered select-sm"
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
            >
              <option value="">All Seasons</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          )}

          <Button onClick={() => refetch()} disabled={isRefetching} size="sm" variant="light">
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Upcoming</div>
          <div className="stat-value text-primary">{upcomingGames.length}</div>
          <div className="stat-desc">games scheduled</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value">{pastGames.length}</div>
          <div className="stat-desc">games played</div>
        </div>
        <div className="stat">
          <div className="stat-title">Record</div>
          <div className="stat-value text-success">
            {pastGames.filter(g => {
              const ts = g.team_score ?? g.teamScore;
              const os = g.opponent_score ?? g.opponentScore;
              return ts !== null && os !== null && ts > os;
            }).length}
            -
            {pastGames.filter(g => {
              const ts = g.team_score ?? g.teamScore;
              const os = g.opponent_score ?? g.opponentScore;
              return ts !== null && os !== null && ts < os;
            }).length}
          </div>
          <div className="stat-desc">W-L</div>
        </div>
      </div>

      {/* Upcoming Games */}
      <div className="card bg-content1">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-info" />
            Upcoming Games
            <Chip color="primary" size="sm">{upcomingGames.length}</Chip>
          </h2>

          {upcomingGames.length > 0 ? (
            <>
              <div className="grid gap-3 mt-2">
                {displayedUpcoming.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {upcomingGames.length > 5 && (
                <Button className="mt-4 self-center" onClick={() => setShowAllUpcoming(!showAllUpcoming)} size="sm" variant="light">
                  {showAllUpcoming ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show All ({upcomingGames.length - 5} more)
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-foreground/50">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No upcoming games</p>
              <p className="text-sm">Sync your schedule from PrestoSports in Team Settings</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Games */}
      <div className="card bg-content1">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-success" />
              Past Games
              <Chip size="sm" variant="flat">{pastGames.length}</Chip>
            </h2>
            {pastGames.length > 0 && (
              <span className="text-xs text-foreground/50">Click a game to view stats</span>
            )}
          </div>

          {pastGames.length > 0 ? (
            <>
              <div className="grid gap-3 mt-2">
                {displayedPast.map(game => (
                  <GameCard key={game.id} game={game} isPast />
                ))}
              </div>

              {pastGames.length > 10 && (
                <Button className="mt-4 self-center" onClick={() => setShowAllPast(!showAllPast)} size="sm" variant="light">
                  {showAllPast ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show All ({pastGames.length - 10} more)
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-foreground/50">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No past games</p>
              <p className="text-sm">Games will appear here after they&apos;re played</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
