import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import PlayerSelector from '../components/PlayerSelector';
import {
  ArrowLeft,
  Save,
  User,
  BarChart3,
  Target,
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Spinner, Button } from '@heroui/react';

const CreatePlayerPerformanceEntry = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preSelectedPlayerId = searchParams.get('player');
  const editEntryId = searchParams.get('edit');
  const isEditMode = Boolean(editEntryId);

  const [performanceData, setPerformanceData] = useState({
    player_id: preSelectedPlayerId || '',
    game_date: new Date().toISOString().split('T')[0],
    opponent: '',
    // Batting Stats
    at_bats: '',
    hits: '',
    batting_avg: '',
    home_runs: '',
    rbi: '',
    runs: '',
    doubles: '',
    triples: '',
    walks: '',
    strikeouts: '',
    stolen_bases: '',
    // Pitching Stats (if applicable)
    innings_pitched: '',
    earned_runs: '',
    era: '',
    wins: '',
    losses: '',
    saves: '',
    strikeouts_pitched: '',
    walks_allowed: '',
    hits_allowed: '',
    // Fielding Stats
    fielding_percentage: '',
    errors: '',
    assists: '',
    putouts: '',
    // Notes
    performance_notes: '',
    coach_notes: ''
  });

  // Fetch available players
  const { data: playersData = {} } = useQuery({
    queryKey: ['players-for-performance'],
    queryFn: async () => {
      const response = await api.get('/players', { params: { status: 'active', limit: 100 } });
      return response.data;
    },
    staleTime: 300000 // 5 minutes
  });

  const players = useMemo(() => playersData.data || [], [playersData.data]);

  // Fetch existing performance data for edit mode
  const { data: existingPerformanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performance-entry', editEntryId],
    queryFn: () => api.get(`/performance/${editEntryId}`).then(res => res.data),
    enabled: isEditMode
  });

  // Pre-select player if coming from player page
  useEffect(() => {
    if (preSelectedPlayerId && players.length > 0) {
      const selectedPlayer = players.find(p => p.id === parseInt(preSelectedPlayerId));
      if (selectedPlayer) {
        setPerformanceData(prev => ({
          ...prev,
          player_id: preSelectedPlayerId
        }));
      }
    }
  }, [preSelectedPlayerId, players]);

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (isEditMode && existingPerformanceData?.data) {
      const data = existingPerformanceData.data;
      setPerformanceData(prev => ({
        ...prev,
        ...data,
        game_date: data.game_date ? data.game_date.split('T')[0] : prev.game_date
      }));
    }
  }, [isEditMode, existingPerformanceData]);

  // Create/Update performance entry mutation
  const savePerformanceMutation = useMutation({
    mutationFn: async (data) => {
      // Calculate batting average if at_bats and hits are provided
      if (data.at_bats && data.hits) {
        data.batting_avg = (parseFloat(data.hits) / parseFloat(data.at_bats)).toFixed(3);
      }

      // Calculate ERA if innings_pitched and earned_runs are provided
      if (data.innings_pitched && data.earned_runs) {
        data.era = ((parseFloat(data.earned_runs) * 9) / parseFloat(data.innings_pitched)).toFixed(2);
      }

      if (isEditMode) {
        return await api.put(`/performance/${editEntryId}`, data);
      } else {
        return await api.post('/performance', data);
      }
    },
    onSuccess: (data) => {
      toast.success(isEditMode ? 'Performance data updated successfully!' : 'Performance data saved successfully!');
      queryClient.invalidateQueries(['players']);
      queryClient.invalidateQueries(['performance']);
      navigate('/players');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'save'} performance data`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!performanceData.player_id) {
      toast.error('Please select a player');
      return;
    }
    if (!performanceData.game_date) {
      toast.error('Please enter a game date');
      return;
    }
    savePerformanceMutation.mutate(performanceData);
  };

  const handleInputChange = (field, value) => {
    setPerformanceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedPlayer = players.find(p => p.id === parseInt(performanceData.player_id));

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => navigate('/players')} className="mb-4" size="sm" variant="light">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Players
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEditMode ? 'Edit Performance Data' : 'Add Performance Data'}
          </h1>
          <p className="text-foreground/70">
            {isEditMode ? 'Update player performance statistics' : 'Enter player performance statistics for a game'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerSelector
                  selectedPlayerId={performanceData.player_id}
                  onPlayerSelect={(playerId) => handleInputChange('player_id', playerId)}
                  players={players}
                  required={true}
                  label="Player"
                  placeholder="Select a player..."
                  allowCreate={true}
                />

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Game Date *</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={performanceData.game_date}
                    onChange={(e) => handleInputChange('game_date', e.target.value)}
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Opponent</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="e.g., State University"
                    value={performanceData.opponent}
                    onChange={(e) => handleInputChange('opponent', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Batting Statistics */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <BarChart3 className="w-5 h-5 mr-2" />
                Batting Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">At Bats</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.at_bats}
                    onChange={(e) => handleInputChange('at_bats', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hits</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.hits}
                    onChange={(e) => handleInputChange('hits', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Home Runs</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.home_runs}
                    onChange={(e) => handleInputChange('home_runs', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">RBI</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.rbi}
                    onChange={(e) => handleInputChange('rbi', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Runs</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.runs}
                    onChange={(e) => handleInputChange('runs', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Doubles</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.doubles}
                    onChange={(e) => handleInputChange('doubles', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Triples</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.triples}
                    onChange={(e) => handleInputChange('triples', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Walks</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.walks}
                    onChange={(e) => handleInputChange('walks', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Strikeouts</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.strikeouts}
                    onChange={(e) => handleInputChange('strikeouts', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stolen Bases</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.stolen_bases}
                    onChange={(e) => handleInputChange('stolen_bases', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Batting Avg</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    className="input input-bordered"
                    placeholder="0.000"
                    value={performanceData.batting_avg}
                    onChange={(e) => handleInputChange('batting_avg', e.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt">Auto-calculated from hits/at-bats</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pitching Statistics */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Target className="w-5 h-5 mr-2" />
                Pitching Statistics
                <span className="text-sm font-normal text-foreground/60">(if applicable)</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Innings Pitched</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input input-bordered"
                    placeholder="0.0"
                    value={performanceData.innings_pitched}
                    onChange={(e) => handleInputChange('innings_pitched', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Earned Runs</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.earned_runs}
                    onChange={(e) => handleInputChange('earned_runs', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Strikeouts</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.strikeouts_pitched}
                    onChange={(e) => handleInputChange('strikeouts_pitched', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Walks Allowed</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.walks_allowed}
                    onChange={(e) => handleInputChange('walks_allowed', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hits Allowed</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.hits_allowed}
                    onChange={(e) => handleInputChange('hits_allowed', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Wins</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.wins}
                    onChange={(e) => handleInputChange('wins', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Losses</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.losses}
                    onChange={(e) => handleInputChange('losses', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Saves</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.saves}
                    onChange={(e) => handleInputChange('saves', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ERA</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered"
                    placeholder="0.00"
                    value={performanceData.era}
                    onChange={(e) => handleInputChange('era', e.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt">Auto-calculated from ER/IP</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Fielding Statistics */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <Award className="w-5 h-5 mr-2" />
                Fielding Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Putouts</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.putouts}
                    onChange={(e) => handleInputChange('putouts', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Assists</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.assists}
                    onChange={(e) => handleInputChange('assists', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Errors</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                    value={performanceData.errors}
                    onChange={(e) => handleInputChange('errors', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fielding %</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    className="input input-bordered"
                    placeholder="1.000"
                    value={performanceData.fielding_percentage}
                    onChange={(e) => handleInputChange('fielding_percentage', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">
                <TrendingUp className="w-5 h-5 mr-2" />
                Notes & Analysis
              </h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Performance Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Notable plays, highlights, areas of improvement..."
                    value={performanceData.performance_notes}
                    onChange={(e) => handleInputChange('performance_notes', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Coach Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Coaching observations, development focus areas..."
                    value={performanceData.coach_notes}
                    onChange={(e) => handleInputChange('coach_notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={() => navigate('/players')} variant="bordered">
              Cancel
            </Button>
            <Button type="submit" disabled={savePerformanceMutation.isLoading} color="primary">
              {savePerformanceMutation.isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Performance Data' : 'Save Performance Data'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlayerPerformanceEntry;
