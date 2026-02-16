import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import api from '../services/api';

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

export default function CreatePlayer() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (5MB max for images)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file must be less than 5MB');
        return;
      }

      setPhotoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    // Reset file input
    const fileInput = document.getElementById('photo-upload');
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

      // Add photo file if selected
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await api.post('/players', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Player created!');
      reset();
      removePhoto();
      navigate('/players');
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to create player';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Player</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new player to your team roster.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Player Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name *</span>
                  </label>
                  <input className={`input input-bordered ${errors.first_name ? 'input-error' : ''}`} {...register('first_name')} />
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
                  <input className={`input input-bordered ${errors.last_name ? 'input-error' : ''}`} {...register('last_name')} />
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
                  <select className={`select select-bordered ${errors.school_type ? 'select-error' : ''}`} {...register('school_type')}>
                    {schoolTypes.map((type) => <option key={type} value={type}>{type}</option>)}
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
                  <select className={`select select-bordered ${errors.position ? 'select-error' : ''}`} {...register('position')}>
                    {positions.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
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
                  <input className={`input input-bordered ${errors.height ? 'input-error' : ''}`} {...register('height')} placeholder="e.g. 6'1&quot;" />
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
                  <input className={`input input-bordered ${errors.weight ? 'input-error' : ''}`} type="number" {...register('weight')} />
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
                  <input className={`input input-bordered ${errors.birth_date ? 'input-error' : ''}`} type="date" {...register('birth_date')} />
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
                  <input className={`input input-bordered ${errors.graduation_year ? 'input-error' : ''}`} type="number" {...register('graduation_year')} />
                  {errors.graduation_year && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.graduation_year.message}</span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">School</span>
                  </label>
                  <input className={`input input-bordered ${errors.school ? 'input-error' : ''}`} {...register('school')} />
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
                  <input className={`input input-bordered ${errors.city ? 'input-error' : ''}`} {...register('city')} />
                  {errors.city && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.city.message}</span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State (2-letter)</span>
                  </label>
                  <input className={`input input-bordered ${errors.state ? 'input-error' : ''}`} {...register('state')} maxLength={2} />
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
                  <input className={`input input-bordered ${errors.phone ? 'input-error' : ''}`} {...register('phone')} />
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
                  <input className={`input input-bordered ${errors.email ? 'input-error' : ''}`} type="email" {...register('email')} />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="divider">Player Photo</div>
              <div className="space-y-4">
                <p className="text-sm text-base-content/70">
            Upload a photo of the player (Max 5MB, JPEG/PNG/GIF/WebP)
                </p>

                <div className="form-control">
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input file-input-bordered file-input-primary w-full"
                  />
                </div>

                {photoPreview && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-text">Photo Preview</span>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        <X className="h-4 w-4 mr-1" />
                  Remove
                      </button>
                    </div>
                    <img
                      className="w-full max-w-xs h-48 object-cover rounded-lg border"
                      src={photoPreview}
                      alt="Player preview"
                    />
                    <p className="text-sm text-base-content/70">
                File: {photoFile?.name} ({(photoFile?.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="divider">Batting Statistics</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Batting Avg</span>
                  </label>
                  <input className={`input input-bordered ${errors.batting_avg ? 'input-error' : ''}`} type="number" step="0.001" min="0" max="1" {...register('batting_avg')} />
                  {errors.batting_avg && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.batting_avg.message}</span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Home Runs</span>
                  </label>
                  <input className={`input input-bordered ${errors.home_runs ? 'input-error' : ''}`} type="number" min="0" {...register('home_runs')} />
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
                  <input className={`input input-bordered ${errors.rbi ? 'input-error' : ''}`} type="number" min="0" {...register('rbi')} />
                  {errors.rbi && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.rbi.message}</span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stolen Bases</span>
                  </label>
                  <input className={`input input-bordered ${errors.stolen_bases ? 'input-error' : ''}`} type="number" min="0" {...register('stolen_bases')} />
                  {errors.stolen_bases && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.stolen_bases.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="divider">Pitching Statistics</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ERA</span>
                  </label>
                  <input className={`input input-bordered ${errors.era ? 'input-error' : ''}`} type="number" step="0.01" min="0" {...register('era')} />
                  {errors.era && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.era.message}</span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Wins</span>
                  </label>
                  <input className={`input input-bordered ${errors.wins ? 'input-error' : ''}`} type="number" min="0" {...register('wins')} />
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
                  <input className={`input input-bordered ${errors.losses ? 'input-error' : ''}`} type="number" min="0" {...register('losses')} />
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
                  <input className={`input input-bordered ${errors.strikeouts ? 'input-error' : ''}`} type="number" min="0" {...register('strikeouts')} />
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
                  <input className={`input input-bordered ${errors.innings_pitched ? 'input-error' : ''}`} type="number" step="0.1" min="0" {...register('innings_pitched')} />
                  {errors.innings_pitched && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.innings_pitched.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="divider">Medical & Comparison</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Has Medical Issues?</span>
                    <input type="checkbox" className="checkbox checkbox-primary" {...register('has_medical_issues')} />
                  </label>
                </div>
                {hasMedical && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Injury Details</span>
                    </label>
                    <input className={`input input-bordered ${errors.injury_details ? 'input-error' : ''}`} {...register('injury_details')} />
                    {errors.injury_details && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.injury_details.message}</span>
                      </label>
                    )}
                  </div>
                )}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Has Comparison?</span>
                    <input type="checkbox" className="checkbox checkbox-primary" {...register('has_comparison')} />
                  </label>
                </div>
                {hasComparison && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Comparison Player</span>
                    </label>
                    <input className={`input input-bordered ${errors.comparison_player ? 'input-error' : ''}`} {...register('comparison_player')} />
                    {errors.comparison_player && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.comparison_player.message}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
              <div className="form-control pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                Creating Player...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                Create Player
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
