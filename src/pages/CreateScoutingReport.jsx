import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DayPicker } from 'react-day-picker';
import api from '../services/api';
import { reportsService } from '../services/reports';
import { toast } from 'react-hot-toast';
import PlayerSelector from '../components/PlayerSelector';
import {
  ArrowLeft,
  Save,
  Plus,
  User,
  Calendar,
  Target,
  FileText,
  Award,
  Zap,
  Shield,
  TrendingUp,
  Brain,
  Star,
  CheckCircle
} from 'lucide-react';
import 'react-day-picker/dist/style.css';

const CreateScoutingReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams(); // Get report ID from URL for edit mode
  const [searchParams] = useSearchParams();
  const preSelectedPlayerId = searchParams.get('player');
  const isEditMode = Boolean(id);
  const [reportDate, setReportDate] = useState(new Date());
  const [gameDate, setGameDate] = useState(null);
  const [showReportDatePicker, setShowReportDatePicker] = useState(false);
  const [showGameDatePicker, setShowGameDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    report_date: new Date().toISOString().split('T')[0],
    game_date: '',
    opponent: '',
    overall_grade: '',
    overall_notes: '',
    hitting_grade: '',
    hitting_notes: '',
    bat_speed: '',
    power_potential: '',
    plate_discipline: '',
    pitching_grade: '',
    pitching_notes: '',
    fastball_velocity: '',
    fastball_grade: '',
    breaking_ball_grade: '',
    command: '',
    fielding_grade: '',
    fielding_notes: '',
    arm_strength: '',
    arm_accuracy: '',
    range: '',
    speed_grade: '',
    speed_notes: '',
    home_to_first: '',
    intangibles_grade: '',
    intangibles_notes: '',
    work_ethic: '',
    coachability: '',
    projection: '',
    projection_notes: '',
    is_draft: false,
    is_public: false
  });

  // Fetch available players
  const { data: playersData = {} } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const response = await api.get('/players');
      return response.data;
    }
  });

  const players = playersData.data || [];

  // Pre-select player if coming from player page
  useEffect(() => {
    if (preSelectedPlayerId && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        player_id: preSelectedPlayerId
      }));
    }
  }, [preSelectedPlayerId, isEditMode]);

  // Fetch existing scouting report data for edit mode
  const { data: existingReport, isLoading: isLoadingReport } = useQuery({
    queryKey: ['scouting-report', id],
    queryFn: () => reportsService.getScoutingReport(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      const report = data.data;
      setFormData({
        player_id: report.player_id || '',
        report_date: report.report_date || new Date().toISOString().split('T')[0],
        game_date: report.game_date || '',
        opponent: report.opponent || '',
        overall_grade: report.overall_grade || '',
        overall_notes: report.overall_notes || '',
        hitting_grade: report.hitting_grade || '',
        hitting_notes: report.hitting_notes || '',
        bat_speed: report.bat_speed || '',
        power_potential: report.power_potential || '',
        plate_discipline: report.plate_discipline || '',
        pitching_grade: report.pitching_grade || '',
        pitching_notes: report.pitching_notes || '',
        fastball_velocity: report.fastball_velocity || '',
        fastball_grade: report.fastball_grade || '',
        breaking_ball_grade: report.breaking_ball_grade || '',
        command: report.command || '',
        fielding_grade: report.fielding_grade || '',
        fielding_notes: report.fielding_notes || '',
        arm_strength: report.arm_strength || '',
        arm_accuracy: report.arm_accuracy || '',
        range: report.range || '',
        speed_grade: report.speed_grade || '',
        speed_notes: report.speed_notes || '',
        home_to_first: report.home_to_first || '',
        intangibles_grade: report.intangibles_grade || '',
        intangibles_notes: report.intangibles_notes || '',
        work_ethic: report.work_ethic || '',
        coachability: report.coachability || '',
        projection: report.projection || '',
        projection_notes: report.projection_notes || '',
        is_draft: report.is_draft || false,
        is_public: report.is_public || false
      });

      if (report.report_date) {
        setReportDate(new Date(report.report_date));
      }
      if (report.game_date) {
        setGameDate(new Date(report.game_date));
      }
    }
  });

  // Create scouting report mutation
  const createReportMutation = useMutation({
    mutationFn: reportsService.createScoutingReport,
    onSuccess: (data) => {
      toast.success('Scouting report created successfully!');
      queryClient.invalidateQueries(['scouting-reports']);
      navigate('/scouting');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create scouting report');
    }
  });

  // Update scouting report mutation
  const updateReportMutation = useMutation({
    mutationFn: (data) => reportsService.updateScoutingReport(id, data),
    onSuccess: (data) => {
      toast.success('Scouting report updated successfully!');
      queryClient.invalidateQueries(['scouting-reports']);
      queryClient.invalidateQueries(['scouting-report', id]);
      navigate('/scouting');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update scouting report');
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReportDateSelect = (date) => {
    if (date) {
      setReportDate(date);
      setFormData(prev => ({
        ...prev,
        report_date: date.toISOString().split('T')[0]
      }));
      setShowReportDatePicker(false);
    }
  };

  const handleGameDateSelect = (date) => {
    if (date) {
      setGameDate(date);
      setFormData(prev => ({
        ...prev,
        game_date: date.toISOString().split('T')[0]
      }));
      setShowGameDatePicker(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.player_id) {
      toast.error('Please select a player');
      return;
    }

    if (isEditMode) {
      updateReportMutation.mutate(formData);
    } else {
      createReportMutation.mutate(formData);
    }
  };

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
  const ratingOptions = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
  const projectionOptions = ['MLB', 'AAA', 'AA', 'A+', 'A', 'A-', 'College', 'High School'];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/scouting')}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scouting
            </button>
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            {isEditMode ? 'Edit Scouting Report' : 'Create New Scouting Report'}
          </h1>
          <p className="text-base-content/70">
            Evaluate a player&apos;s performance and potential
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PlayerSelector
                  selectedPlayerId={formData.player_id}
                  onPlayerSelect={(playerId) => setFormData(prev => ({ ...prev, player_id: playerId }))}
                  players={players}
                  required={true}
                  label="Player"
                  placeholder="Select a player..."
                  allowCreate={true}
                />

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Report Date</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="input input-bordered w-full flex items-center justify-between cursor-pointer"
                      onClick={() => setShowReportDatePicker(!showReportDatePicker)}
                    >
                      <span>{reportDate.toLocaleDateString()}</span>
                      <Calendar className="w-4 h-4" />
                    </button>

                    {showReportDatePicker && (
                      <div className="absolute top-full left-0 mt-1 z-50 bg-base-100 border border-base-300 rounded-box shadow-lg">
                        <DayPicker
                          mode="single"
                          selected={reportDate}
                          onSelect={handleReportDateSelect}
                          className="react-day-picker"
                          classNames={{
                            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                            month: 'space-y-4',
                            caption: 'flex justify-center pt-1 relative items-center',
                            caption_label: 'text-sm font-medium',
                            nav: 'space-x-1 flex items-center',
                            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            nav_button_previous: 'absolute left-1',
                            nav_button_next: 'absolute right-1',
                            table: 'w-full border-collapse space-y-1',
                            head_row: 'flex',
                            head_cell: 'text-base-content/70 rounded-md w-8 font-normal text-[0.8rem]',
                            row: 'flex w-full mt-2',
                            cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                            day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-base-200 rounded-md',
                            day_selected: 'bg-primary text-primary-content hover:bg-primary hover:text-primary-content focus:bg-primary focus:text-primary-content',
                            day_today: 'bg-accent text-accent-content',
                            day_outside: 'text-base-content/30 opacity-50',
                            day_disabled: 'text-base-content/30 opacity-50',
                            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-content',
                            day_hidden: 'invisible'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Game Date</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="input input-bordered w-full flex items-center justify-between cursor-pointer"
                      onClick={() => setShowGameDatePicker(!showGameDatePicker)}
                    >
                      <span>{gameDate ? gameDate.toLocaleDateString() : 'Select game date...'}</span>
                      <Calendar className="w-4 h-4" />
                    </button>

                    {showGameDatePicker && (
                      <div className="absolute top-full left-0 mt-1 z-50 bg-base-100 border border-base-300 rounded-box shadow-lg">
                        <DayPicker
                          mode="single"
                          selected={gameDate}
                          onSelect={handleGameDateSelect}
                          className="react-day-picker"
                          classNames={{
                            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                            month: 'space-y-4',
                            caption: 'flex justify-center pt-1 relative items-center',
                            caption_label: 'text-sm font-medium',
                            nav: 'space-x-1 flex items-center',
                            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            nav_button_previous: 'absolute left-1',
                            nav_button_next: 'absolute right-1',
                            table: 'w-full border-collapse space-y-1',
                            head_row: 'flex',
                            head_cell: 'text-base-content/70 rounded-md w-8 font-normal text-[0.8rem]',
                            row: 'flex w-full mt-2',
                            cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                            day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-base-200 rounded-md',
                            day_selected: 'bg-primary text-primary-content hover:bg-primary hover:text-primary-content focus:bg-primary focus:text-primary-content',
                            day_today: 'bg-accent text-accent-content',
                            day_outside: 'text-base-content/30 opacity-50',
                            day_disabled: 'text-base-content/30 opacity-50',
                            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-content',
                            day_hidden: 'invisible'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Opponent</span>
                  </label>
                  <input
                    type="text"
                    name="opponent"
                    value={formData.opponent}
                    onChange={handleInputChange}
                    placeholder="Opponent team name"
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Star className="w-5 h-5" />
                Overall Assessment
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Overall Grade</span>
                  </label>
                  <select
                    name="overall_grade"
                    value={formData.overall_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Overall Notes</span>
                  </label>
                  <textarea
                    name="overall_notes"
                    value={formData.overall_notes}
                    onChange={handleInputChange}
                    placeholder="Overall assessment and summary..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hitting Assessment */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Hitting Assessment
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hitting Grade</span>
                  </label>
                  <select
                    name="hitting_grade"
                    value={formData.hitting_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bat Speed</span>
                  </label>
                  <select
                    name="bat_speed"
                    value={formData.bat_speed}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Power Potential</span>
                  </label>
                  <select
                    name="power_potential"
                    value={formData.power_potential}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Plate Discipline</span>
                  </label>
                  <select
                    name="plate_discipline"
                    value={formData.plate_discipline}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">
                    <span className="label-text">Hitting Notes</span>
                  </label>
                  <textarea
                    name="hitting_notes"
                    value={formData.hitting_notes}
                    onChange={handleInputChange}
                    placeholder="Detailed hitting assessment..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pitching Assessment */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Target className="w-5 h-5" />
                Pitching Assessment
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pitching Grade</span>
                  </label>
                  <select
                    name="pitching_grade"
                    value={formData.pitching_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fastball Velocity (mph)</span>
                  </label>
                  <input
                    type="number"
                    name="fastball_velocity"
                    value={formData.fastball_velocity}
                    onChange={handleInputChange}
                    placeholder="85-95"
                    min="60"
                    max="105"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fastball Grade</span>
                  </label>
                  <select
                    name="fastball_grade"
                    value={formData.fastball_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Breaking Ball Grade</span>
                  </label>
                  <select
                    name="breaking_ball_grade"
                    value={formData.breaking_ball_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Command</span>
                  </label>
                  <select
                    name="command"
                    value={formData.command}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">
                    <span className="label-text">Pitching Notes</span>
                  </label>
                  <textarea
                    name="pitching_notes"
                    value={formData.pitching_notes}
                    onChange={handleInputChange}
                    placeholder="Detailed pitching assessment..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fielding Assessment */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Fielding Assessment
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fielding Grade</span>
                  </label>
                  <select
                    name="fielding_grade"
                    value={formData.fielding_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Arm Strength</span>
                  </label>
                  <select
                    name="arm_strength"
                    value={formData.arm_strength}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Arm Accuracy</span>
                  </label>
                  <select
                    name="arm_accuracy"
                    value={formData.arm_accuracy}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Range</span>
                  </label>
                  <select
                    name="range"
                    value={formData.range}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">
                    <span className="label-text">Fielding Notes</span>
                  </label>
                  <textarea
                    name="fielding_notes"
                    value={formData.fielding_notes}
                    onChange={handleInputChange}
                    placeholder="Detailed fielding assessment..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speed Assessment */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Speed Assessment
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Speed Grade</span>
                  </label>
                  <select
                    name="speed_grade"
                    value={formData.speed_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Home to First (seconds)</span>
                  </label>
                  <input
                    type="number"
                    name="home_to_first"
                    value={formData.home_to_first}
                    onChange={handleInputChange}
                    placeholder="4.2"
                    step="0.1"
                    min="3.0"
                    max="5.0"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Speed Notes</span>
                  </label>
                  <textarea
                    name="speed_notes"
                    value={formData.speed_notes}
                    onChange={handleInputChange}
                    placeholder="Speed and baserunning assessment..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Intangibles */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Intangibles
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Intangibles Grade</span>
                  </label>
                  <select
                    name="intangibles_grade"
                    value={formData.intangibles_grade}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select grade...</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Work Ethic</span>
                  </label>
                  <select
                    name="work_ethic"
                    value={formData.work_ethic}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Coachability</span>
                  </label>
                  <select
                    name="coachability"
                    value={formData.coachability}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select rating...</option>
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">
                    <span className="label-text">Intangibles Notes</span>
                  </label>
                  <textarea
                    name="intangibles_notes"
                    value={formData.intangibles_notes}
                    onChange={handleInputChange}
                    placeholder="Character, leadership, and other intangibles..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Projection */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Award className="w-5 h-5" />
                Projection
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Projection Level</span>
                  </label>
                  <select
                    name="projection"
                    value={formData.projection}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select projection...</option>
                    {projectionOptions.map(projection => (
                      <option key={projection} value={projection}>{projection}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Projection Notes</span>
                  </label>
                  <textarea
                    name="projection_notes"
                    value={formData.projection_notes}
                    onChange={handleInputChange}
                    placeholder="Future potential and development path..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Settings
              </h2>
            </div>
            <div className="card-body">
              <div className="flex gap-6">
                <label className="label cursor-pointer">
                  <span className="label-text mr-4">Draft Report</span>
                  <input
                    type="checkbox"
                    name="is_draft"
                    checked={formData.is_draft}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                </label>

                <label className="label cursor-pointer">
                  <span className="label-text mr-4">Public Report</span>
                  <input
                    type="checkbox"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/scouting')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createReportMutation.isLoading}
            >
              {createReportMutation.isLoading ? (
                <>
                  <div className="loading loading-spinner loading-sm"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Report' : 'Create Report'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScoutingReport;
