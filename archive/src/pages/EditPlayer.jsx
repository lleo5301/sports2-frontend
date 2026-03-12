import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X, Play } from 'lucide-react';
import api from '../services/api';
import { Spinner, Chip, Button } from '@heroui/react';

const positions = [
  'P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'OF', 'DH'
];
const schoolTypes = ['HS', 'COLL'];

const playerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  school_type: z.enum(['HS', 'COLL'], { required_error: 'School type is required' }),
  position: z.enum(positions, { required_error: 'Position is required' }),
  height: z.string().max(10).optional().or(z.literal('')),
  weight: z.coerce.number().min(100, 'Min 100').max(300, 'Max 300').optional().or(z.nan()),
  birth_date: z.string().optional().or(z.literal('')),
  graduation_year: z.coerce.number().min(2020).max(2030).optional().or(z.nan()),
  school: z.string().max(100).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().length(2, '2-letter state').optional().or(z.literal('')),
  phone: z.string().min(10).max(15).optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  batting_avg: z.coerce.number().min(0).max(1).optional().or(z.nan()),
  home_runs: z.coerce.number().min(0).optional().or(z.nan()),
  rbi: z.coerce.number().min(0).optional().or(z.nan()),
  stolen_bases: z.coerce.number().min(0).optional().or(z.nan()),
  era: z.coerce.number().min(0).optional().or(z.nan()),
  wins: z.coerce.number().min(0).optional().or(z.nan()),
  losses: z.coerce.number().min(0).optional().or(z.nan()),
  strikeouts: z.coerce.number().min(0).optional().or(z.nan()),
  innings_pitched: z.coerce.number().min(0).optional().or(z.nan()),
  has_medical_issues: z.boolean().optional(),
  injury_details: z.string().max(500).optional().or(z.literal('')),
  has_comparison: z.boolean().optional(),
  comparison_player: z.string().max(100).optional().or(z.literal(''))
});

export default function EditPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);
  const [player, setPlayer] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      school_type: 'HS',
      position: 'P',
      has_medical_issues: false,
      has_comparison: false
    }
  });

  const hasMedical = watch('has_medical_issues');
  const hasComparison = watch('has_comparison');

  // Fetch player data
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await api.get(`/players/byId/${id}`);
        const playerData = response.data.data;
        setPlayer(playerData);
        setCurrentVideo(playerData.video_url);

        // Reset form with player data
        const formData = {
          first_name: playerData.first_name || '',
          last_name: playerData.last_name || '',
          school_type: playerData.school_type || 'HS',
          position: playerData.position || 'P',
          height: playerData.height || '',
          weight: playerData.weight || '',
          birth_date: playerData.birth_date || '',
          graduation_year: playerData.graduation_year || '',
          school: playerData.school || '',
          city: playerData.city || '',
          state: playerData.state || '',
          phone: playerData.phone || '',
          email: playerData.email || '',
          batting_avg: playerData.batting_avg || '',
          home_runs: playerData.home_runs || '',
          rbi: playerData.rbi || '',
          stolen_bases: playerData.stolen_bases || '',
          era: playerData.era || '',
          wins: playerData.wins || '',
          losses: playerData.losses || '',
          strikeouts: playerData.strikeouts || '',
          innings_pitched: playerData.innings_pitched || '',
          has_medical_issues: playerData.has_medical_issues || false,
          injury_details: playerData.injury_details || '',
          has_comparison: playerData.has_comparison || false,
          comparison_player: playerData.comparison_player || ''
        };
        reset(formData);
      } catch (error) {
        // Error fetching player
        toast.error('Failed to load player data');
        navigate('/players');
      } finally {
        setIsLoadingPlayer(false);
      }
    };

    if (id) {
      fetchPlayer();
    }
  }, [id, reset, navigate]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, MOV, AVI, WebM, OGV)');
        return;
      }

      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video file must be less than 100MB');
        return;
      }

      setVideoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    // Reset file input
    const fileInput = document.getElementById('video-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Clean up NaN/empty values and append to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '' && !(typeof value === 'number' && isNaN(value))) {
          formData.append(key, value);
        }
      });

      // Add video file if selected
      if (videoFile) {
        formData.append('video', videoFile);
      }

      await api.put(`/players/byId/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Player updated successfully!');
      navigate(`/players/${id}`);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to update player';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPlayer) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="alert alert-error">
          <span>Player not found</span>
        </div>
        <Button to="/players" color="primary" as={Link}>
          Back to Players
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button to={`/players/${id}`} variant="bordered" as={Link}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Player
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Player</h1>
            <p className="text-foreground/70">
              {player.first_name} {player.last_name}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <div className="card bg-background shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name *</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.first_name ? 'input-error' : ''}`}
                  {...register('first_name')}
                />
                {errors.first_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.first_name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name *</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.last_name ? 'input-error' : ''}`}
                  {...register('last_name')}
                />
                {errors.last_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.last_name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">School Type *</span>
                </label>
                <select
                  className={`select select-bordered ${errors.school_type ? 'select-error' : ''}`}
                  {...register('school_type')}
                >
                  {schoolTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.school_type && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.school_type.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position *</span>
                </label>
                <select
                  className={`select select-bordered ${errors.position ? 'select-error' : ''}`}
                  {...register('position')}
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {errors.position && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.position.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Height</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 6'2&quot;"
                  className={`input input-bordered ${errors.height ? 'input-error' : ''}`}
                  {...register('height')}
                />
                {errors.height && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.height.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Weight (lbs)</span>
                </label>
                <input
                  type="number"
                  min="100"
                  max="300"
                  className={`input input-bordered ${errors.weight ? 'input-error' : ''}`}
                  {...register('weight')}
                />
                {errors.weight && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.weight.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Birth Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered ${errors.birth_date ? 'input-error' : ''}`}
                  {...register('birth_date')}
                />
                {errors.birth_date && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.birth_date.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Graduation Year</span>
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  className={`input input-bordered ${errors.graduation_year ? 'input-error' : ''}`}
                  {...register('graduation_year')}
                />
                {errors.graduation_year && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.graduation_year.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Upload Card */}
        <div className="card bg-background shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Player Video</h2>
            <p className="text-sm text-foreground/70">
               Upload a video showcasing the player&apos;s skills (Max 100MB, MP4/MOV/AVI/WebM/OGV)
            </p>

            {/* Current Video */}
            {currentVideo && !videoPreview && (
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">Current Video</span>
                </label>
                <div className="relative">
                  <video
                    controls
                    className="w-full max-w-md h-48 bg-black rounded-lg"
                    src={`${api.defaults.baseURL}${currentVideo}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-2 right-2">
                    <Chip color="primary">Current</Chip>
                  </div>
                </div>
              </div>
            )}

            {/* Video Upload */}
            <div className="form-control">
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="file-input file-input-bordered file-input-primary w-full"
              />
            </div>

            {/* Video Preview */}
            {videoPreview && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="label-text">New Video Preview</span>
                  <Button type="button" onClick={removeVideo} color="danger" size="sm" variant="bordered">
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                <video
                  controls
                  className="w-full max-w-md h-48 bg-black rounded-lg"
                  src={videoPreview}
                >
                  Your browser does not support the video tag.
                </video>
                <p className="text-sm text-foreground/70">
                  File: {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="card bg-background shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">School</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.school ? 'input-error' : ''}`}
                  {...register('school')}
                />
                {errors.school && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.school.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${errors.city ? 'input-error' : ''}`}
                  {...register('city')}
                />
                {errors.city && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.city.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">State</span>
                </label>
                <input
                  type="text"
                  placeholder="CA"
                  maxLength="2"
                  className={`input input-bordered ${errors.state ? 'input-error' : ''}`}
                  {...register('state')}
                />
                {errors.state && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.state.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                  {...register('phone')}
                />
                {errors.phone && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.phone.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                  {...register('email')}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batting Stats */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Batting Statistics</h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Batting Average</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    className={`input input-bordered ${errors.batting_avg ? 'input-error' : ''}`}
                    {...register('batting_avg')}
                  />
                  {errors.batting_avg && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.batting_avg.message}</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Home Runs</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.home_runs ? 'input-error' : ''}`}
                      {...register('home_runs')}
                    />
                    {errors.home_runs && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.home_runs.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">RBI</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.rbi ? 'input-error' : ''}`}
                      {...register('rbi')}
                    />
                    {errors.rbi && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.rbi.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control col-span-2">
                    <label className="label">
                      <span className="label-text">Stolen Bases</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.stolen_bases ? 'input-error' : ''}`}
                      {...register('stolen_bases')}
                    />
                    {errors.stolen_bases && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.stolen_bases.message}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pitching Stats */}
          <div className="card bg-background shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Pitching Statistics</h2>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ERA</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`input input-bordered ${errors.era ? 'input-error' : ''}`}
                    {...register('era')}
                  />
                  {errors.era && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.era.message}</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Wins</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.wins ? 'input-error' : ''}`}
                      {...register('wins')}
                    />
                    {errors.wins && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.wins.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Losses</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.losses ? 'input-error' : ''}`}
                      {...register('losses')}
                    />
                    {errors.losses && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.losses.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Strikeouts</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={`input input-bordered ${errors.strikeouts ? 'input-error' : ''}`}
                      {...register('strikeouts')}
                    />
                    {errors.strikeouts && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.strikeouts.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Innings Pitched</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className={`input input-bordered ${errors.innings_pitched ? 'input-error' : ''}`}
                      {...register('innings_pitched')}
                    />
                    {errors.innings_pitched && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.innings_pitched.message}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information Card */}
        <div className="card bg-background shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Medical Information</h2>

            <div className="form-control">
              <label className="cursor-pointer label justify-start">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-3"
                  {...register('has_medical_issues')}
                />
                <span className="label-text">Has medical issues or injury history</span>
              </label>
            </div>

            {hasMedical && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Injury Details</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-24 ${errors.injury_details ? 'textarea-error' : ''}`}
                  placeholder="Describe any medical issues or injury history..."
                  {...register('injury_details')}
                ></textarea>
                {errors.injury_details && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.injury_details.message}</span>
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Player Comparison Card */}
        <div className="card bg-background shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Player Comparison</h2>

            <div className="form-control">
              <label className="cursor-pointer label justify-start">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-3"
                  {...register('has_comparison')}
                />
                <span className="label-text">Compare to a professional player</span>
              </label>
            </div>

            {hasComparison && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Player Comparison</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Derek Jeter"
                  className={`input input-bordered ${errors.comparison_player ? 'input-error' : ''}`}
                  {...register('comparison_player')}
                />
                {errors.comparison_player && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.comparison_player.message}</span>
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button to={`/players/${id}`} variant="bordered" as={Link}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} color="primary">
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Updating Player...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Update Player
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
