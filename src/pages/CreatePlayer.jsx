import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../services/api'

const positions = [
  'P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'OF', 'DH'
]
const schoolTypes = ['HS', 'COLL']

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
  comparison_player: z.string().max(100).optional().or(z.literal('')),
})

export default function CreatePlayer() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
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
  })

  const hasMedical = watch('has_medical_issues')
  const hasComparison = watch('has_comparison')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Clean up NaN/empty values
      const cleaned = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, (typeof v === 'number' && isNaN(v)) || v === '' ? undefined : v])
      )
      await api.post('/players', cleaned)
      toast.success('Player created!')
      reset()
      navigate('/players')
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to create player'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Player</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new player to your team roster.
        </p>
      </div>
      <form className="card p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name *</label>
            <input className="input mt-1" {...register('first_name')} />
            {errors.first_name && <p className="text-red-600 text-sm">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name *</label>
            <input className="input mt-1" {...register('last_name')} />
            {errors.last_name && <p className="text-red-600 text-sm">{errors.last_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">School Type *</label>
            <select className="input mt-1" {...register('school_type')}>
              {schoolTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.school_type && <p className="text-red-600 text-sm">{errors.school_type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Position *</label>
            <select className="input mt-1" {...register('position')}>
              {positions.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
            {errors.position && <p className="text-red-600 text-sm">{errors.position.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Height</label>
            <input className="input mt-1" {...register('height')} placeholder="e.g. 6'1\"" />
            {errors.height && <p className="text-red-600 text-sm">{errors.height.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Weight (lbs)</label>
            <input className="input mt-1" type="number" {...register('weight')} />
            {errors.weight && <p className="text-red-600 text-sm">{errors.weight.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Birth Date</label>
            <input className="input mt-1" type="date" {...register('birth_date')} />
            {errors.birth_date && <p className="text-red-600 text-sm">{errors.birth_date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Graduation Year</label>
            <input className="input mt-1" type="number" {...register('graduation_year')} />
            {errors.graduation_year && <p className="text-red-600 text-sm">{errors.graduation_year.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">School</label>
            <input className="input mt-1" {...register('school')} />
            {errors.school && <p className="text-red-600 text-sm">{errors.school.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input className="input mt-1" {...register('city')} />
            {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">State (2-letter)</label>
            <input className="input mt-1" {...register('state')} maxLength={2} />
            {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input className="input mt-1" {...register('phone')} />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input className="input mt-1" type="email" {...register('email')} />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>
        </div>
        <hr />
        <h2 className="text-lg font-semibold">Batting Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Batting Avg</label>
            <input className="input mt-1" type="number" step="0.001" min="0" max="1" {...register('batting_avg')} />
            {errors.batting_avg && <p className="text-red-600 text-sm">{errors.batting_avg.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Home Runs</label>
            <input className="input mt-1" type="number" min="0" {...register('home_runs')} />
            {errors.home_runs && <p className="text-red-600 text-sm">{errors.home_runs.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">RBI</label>
            <input className="input mt-1" type="number" min="0" {...register('rbi')} />
            {errors.rbi && <p className="text-red-600 text-sm">{errors.rbi.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Stolen Bases</label>
            <input className="input mt-1" type="number" min="0" {...register('stolen_bases')} />
            {errors.stolen_bases && <p className="text-red-600 text-sm">{errors.stolen_bases.message}</p>}
          </div>
        </div>
        <hr />
        <h2 className="text-lg font-semibold">Pitching Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">ERA</label>
            <input className="input mt-1" type="number" step="0.01" min="0" {...register('era')} />
            {errors.era && <p className="text-red-600 text-sm">{errors.era.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Wins</label>
            <input className="input mt-1" type="number" min="0" {...register('wins')} />
            {errors.wins && <p className="text-red-600 text-sm">{errors.wins.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Losses</label>
            <input className="input mt-1" type="number" min="0" {...register('losses')} />
            {errors.losses && <p className="text-red-600 text-sm">{errors.losses.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Strikeouts</label>
            <input className="input mt-1" type="number" min="0" {...register('strikeouts')} />
            {errors.strikeouts && <p className="text-red-600 text-sm">{errors.strikeouts.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Innings Pitched</label>
            <input className="input mt-1" type="number" step="0.1" min="0" {...register('innings_pitched')} />
            {errors.innings_pitched && <p className="text-red-600 text-sm">{errors.innings_pitched.message}</p>}
          </div>
        </div>
        <hr />
        <h2 className="text-lg font-semibold">Medical & Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="has_medical_issues" {...register('has_medical_issues')} />
            <label htmlFor="has_medical_issues" className="text-sm font-medium">Has Medical Issues?</label>
          </div>
          {hasMedical && (
            <div>
              <label className="block text-sm font-medium">Injury Details</label>
              <input className="input mt-1" {...register('injury_details')} />
              {errors.injury_details && <p className="text-red-600 text-sm">{errors.injury_details.message}</p>}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="has_comparison" {...register('has_comparison')} />
            <label htmlFor="has_comparison" className="text-sm font-medium">Has Comparison?</label>
          </div>
          {hasComparison && (
            <div>
              <label className="block text-sm font-medium">Comparison Player</label>
              <input className="input mt-1" {...register('comparison_player')} />
              {errors.comparison_player && <p className="text-red-600 text-sm">{errors.comparison_player.message}</p>}
            </div>
          )}
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? 'Saving...' : 'Create Player'}
          </button>
        </div>
      </form>
    </div>
  )
} 