import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Users,
  Target,
  Shield
} from 'lucide-react';
import { gamesService } from '../services/games';

const GameDetail = () => {
  const { id } = useParams();

  // Fetch complete box score with single API call
  const { data: boxScore, isLoading, error } = useQuery({
    queryKey: ['gameStats', id],
    queryFn: () => gamesService.getGameStats(id)
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getFullYear() < 2000) return 'TBD';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getResultClass = (result) => {
    if (!result) return '';
    const r = result.toUpperCase();
    if (r === 'W' || r === 'WIN') return 'text-success';
    if (r === 'L' || r === 'LOSS') return 'text-error';
    return 'text-warning';
  };

  // Format innings pitched (handles baseball thirds: 6.1, 6.2)
  const formatIP = (ip) => {
    if (ip === null || ip === undefined) return '0';
    return String(ip);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="alert alert-error">
          <span>Failed to load game statistics: {error.message}</span>
        </div>
        <Link to="/games" className="btn btn-ghost mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>
      </div>
    );
  }

  // API returns { success: true, data: { game, batting, pitching, fielding, team_totals } }
  const responseData = boxScore?.data || boxScore || {};
  const game = responseData.game || {};
  const batting = responseData.batting || [];
  const pitching = responseData.pitching || [];
  const fielding = responseData.fielding || [];
  const teamTotals = responseData.team_totals || {};

  // Extract game fields
  const teamScore = game.team_score;
  const opponentScore = game.opponent_score;
  const hasScore = teamScore !== null && teamScore !== undefined;
  const homeAway = game.home_away || 'home';
  const isHome = homeAway === 'home';
  const gameDate = game.game_date;
  const gameTime = game.game_time;
  const opponent = game.opponent || 'Unknown';
  const gameStatus = game.game_status || game.status;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/games" className="btn btn-ghost btn-sm gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </Link>

      {/* Game Header Card */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  isHome ? 'bg-success/20 text-success' : 'bg-info/20 text-info'
                }`}>
                  {isHome ? 'HOME' : 'AWAY'}
                </span>
                {gameStatus && (
                  <span className={`badge badge-sm ${
                    gameStatus === 'completed' ? 'badge-success' :
                    gameStatus === 'in_progress' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {gameStatus === 'in_progress' ? 'LIVE' : gameStatus}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">
                {isHome ? 'vs' : '@'} {opponent}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-base-content/70">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(gameDate)}</span>
                </div>

                {gameTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{gameTime}</span>
                  </div>
                )}

                {game.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{game.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Score Display */}
            {hasScore && (
              <div className="text-center md:text-right">
                <div className={`text-4xl md:text-5xl font-bold ${getResultClass(game.result)}`}>
                  {teamScore} - {opponentScore}
                </div>
                {game.result && (
                  <div className={`text-lg font-semibold mt-1 ${getResultClass(game.result)}`}>
                    {game.result === 'W' || game.result === 'Win' ? 'WIN' :
                     game.result === 'L' || game.result === 'Loss' ? 'LOSS' : 'TIE'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batting Stats */}
      {batting.length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Batting
              <span className="badge badge-ghost badge-sm">{batting.length} players</span>
            </h2>

            <div className="overflow-x-auto mt-2">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th className="text-center">AB</th>
                    <th className="text-center">R</th>
                    <th className="text-center">H</th>
                    <th className="text-center">2B</th>
                    <th className="text-center">3B</th>
                    <th className="text-center">HR</th>
                    <th className="text-center">RBI</th>
                    <th className="text-center">BB</th>
                    <th className="text-center">SO</th>
                    <th className="text-center">SB</th>
                    <th className="text-center">AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {batting.map((b, idx) => (
                    <tr key={b.player?.id || idx} className="hover">
                      <td>
                        <Link
                          to={`/players/${b.player?.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {b.player?.name || `${b.player?.first_name} ${b.player?.last_name}`}
                        </Link>
                        {b.player?.position && (
                          <span className="text-xs text-base-content/50 ml-2">{b.player.position}</span>
                        )}
                      </td>
                      <td className="text-center">{b.ab ?? b.at_bats ?? 0}</td>
                      <td className="text-center">{b.r ?? b.runs ?? 0}</td>
                      <td className="text-center">{b.h ?? b.hits ?? 0}</td>
                      <td className="text-center">{b['2b'] ?? b.doubles ?? 0}</td>
                      <td className="text-center">{b['3b'] ?? b.triples ?? 0}</td>
                      <td className="text-center">{b.hr ?? b.home_runs ?? 0}</td>
                      <td className="text-center">{b.rbi ?? 0}</td>
                      <td className="text-center">{b.bb ?? b.walks ?? 0}</td>
                      <td className="text-center">{b.so ?? b.strikeouts ?? 0}</td>
                      <td className="text-center">{b.sb ?? b.stolen_bases ?? 0}</td>
                      <td className="text-center font-medium">
                        {b.avg !== undefined ? (typeof b.avg === 'number' ? b.avg.toFixed(3) : b.avg) : '.000'}
                      </td>
                    </tr>
                  ))}
                  {/* Team Totals Row */}
                  {teamTotals.batting && (
                    <tr className="font-semibold bg-base-300">
                      <td>Team Totals</td>
                      <td className="text-center">{teamTotals.batting.ab ?? teamTotals.batting.at_bats ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.r ?? teamTotals.batting.runs ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.h ?? teamTotals.batting.hits ?? 0}</td>
                      <td className="text-center">{teamTotals.batting['2b'] ?? teamTotals.batting.doubles ?? 0}</td>
                      <td className="text-center">{teamTotals.batting['3b'] ?? teamTotals.batting.triples ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.hr ?? teamTotals.batting.home_runs ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.rbi ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.bb ?? teamTotals.batting.walks ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.so ?? teamTotals.batting.strikeouts ?? 0}</td>
                      <td className="text-center">{teamTotals.batting.sb ?? teamTotals.batting.stolen_bases ?? 0}</td>
                      <td className="text-center">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pitching Stats */}
      {pitching.length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Pitching
              <span className="badge badge-ghost badge-sm">{pitching.length} players</span>
            </h2>

            <div className="overflow-x-auto mt-2">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th className="text-center">IP</th>
                    <th className="text-center">H</th>
                    <th className="text-center">R</th>
                    <th className="text-center">ER</th>
                    <th className="text-center">BB</th>
                    <th className="text-center">SO</th>
                    <th className="text-center">PC</th>
                    <th className="text-center">ERA</th>
                    <th className="text-center">Dec</th>
                  </tr>
                </thead>
                <tbody>
                  {pitching.map((p, idx) => (
                    <tr key={p.player?.id || idx} className="hover">
                      <td>
                        <Link
                          to={`/players/${p.player?.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {p.player?.name || `${p.player?.first_name} ${p.player?.last_name}`}
                        </Link>
                      </td>
                      <td className="text-center">{formatIP(p.ip ?? p.innings_pitched)}</td>
                      <td className="text-center">{p.h ?? p.hits_allowed ?? 0}</td>
                      <td className="text-center">{p.r ?? p.runs_allowed ?? 0}</td>
                      <td className="text-center">{p.er ?? p.earned_runs ?? 0}</td>
                      <td className="text-center">{p.bb ?? p.walks ?? 0}</td>
                      <td className="text-center">{p.so ?? p.strikeouts ?? 0}</td>
                      <td className="text-center">{p.pitches ?? p.pitch_count ?? '-'}</td>
                      <td className="text-center font-medium">
                        {p.era !== undefined ? (typeof p.era === 'number' ? p.era.toFixed(2) : p.era) : '-'}
                      </td>
                      <td className="text-center">
                        {p.decision && (
                          <span className={`badge badge-sm ${
                            p.decision === 'W' ? 'badge-success' :
                            p.decision === 'L' ? 'badge-error' :
                            p.decision === 'SV' || p.decision === 'S' ? 'badge-info' :
                            p.decision === 'H' ? 'badge-warning' :
                            'badge-ghost'
                          }`}>
                            {p.decision}
                          </span>
                        )}
                        {p.win && <span className="badge badge-success badge-sm">W</span>}
                        {p.loss && <span className="badge badge-error badge-sm">L</span>}
                        {p.save && <span className="badge badge-info badge-sm">SV</span>}
                        {p.hold && <span className="badge badge-warning badge-sm">H</span>}
                      </td>
                    </tr>
                  ))}
                  {/* Team Totals Row */}
                  {teamTotals.pitching && (
                    <tr className="font-semibold bg-base-300">
                      <td>Team Totals</td>
                      <td className="text-center">{formatIP(teamTotals.pitching.ip ?? teamTotals.pitching.innings_pitched)}</td>
                      <td className="text-center">{teamTotals.pitching.h ?? teamTotals.pitching.hits_allowed ?? 0}</td>
                      <td className="text-center">{teamTotals.pitching.r ?? teamTotals.pitching.runs_allowed ?? 0}</td>
                      <td className="text-center">{teamTotals.pitching.er ?? teamTotals.pitching.earned_runs ?? 0}</td>
                      <td className="text-center">{teamTotals.pitching.bb ?? teamTotals.pitching.walks ?? 0}</td>
                      <td className="text-center">{teamTotals.pitching.so ?? teamTotals.pitching.strikeouts ?? 0}</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fielding Stats */}
      {fielding.length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Fielding
              <span className="badge badge-ghost badge-sm">{fielding.length} players</span>
            </h2>

            <div className="overflow-x-auto mt-2">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th className="text-center">POS</th>
                    <th className="text-center">PO</th>
                    <th className="text-center">A</th>
                    <th className="text-center">E</th>
                    <th className="text-center">FPCT</th>
                  </tr>
                </thead>
                <tbody>
                  {fielding.map((f, idx) => (
                    <tr key={f.player?.id || idx} className="hover">
                      <td>
                        <Link
                          to={`/players/${f.player?.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {f.player?.name || `${f.player?.first_name} ${f.player?.last_name}`}
                        </Link>
                      </td>
                      <td className="text-center">{f.player?.position || '-'}</td>
                      <td className="text-center">{f.po ?? f.putouts ?? 0}</td>
                      <td className="text-center">{f.a ?? f.assists ?? 0}</td>
                      <td className="text-center">{f.e ?? f.errors ?? 0}</td>
                      <td className="text-center font-medium">
                        {f.fpct !== undefined ? (typeof f.fpct === 'number' ? f.fpct.toFixed(3) : f.fpct) :
                         f.fielding_percentage !== undefined ? (typeof f.fielding_percentage === 'number' ? f.fielding_percentage.toFixed(3) : f.fielding_percentage) :
                         '1.000'}
                      </td>
                    </tr>
                  ))}
                  {/* Team Totals Row */}
                  {teamTotals.fielding && (
                    <tr className="font-semibold bg-base-300">
                      <td>Team Totals</td>
                      <td className="text-center">-</td>
                      <td className="text-center">{teamTotals.fielding.po ?? teamTotals.fielding.putouts ?? 0}</td>
                      <td className="text-center">{teamTotals.fielding.a ?? teamTotals.fielding.assists ?? 0}</td>
                      <td className="text-center">{teamTotals.fielding.e ?? teamTotals.fielding.errors ?? 0}</td>
                      <td className="text-center">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* No Stats Message */}
      {batting.length === 0 && pitching.length === 0 && fielding.length === 0 && (
        <div className="card bg-base-200">
          <div className="card-body text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
            <p className="font-medium text-base-content/70">No player statistics available for this game</p>
            <p className="text-sm text-base-content/50">Stats will appear here once they've been recorded</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;
