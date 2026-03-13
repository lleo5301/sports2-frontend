import { GRADE_SCALE } from '@/lib/scouting-api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GradeSelectProps {
  value?: number | null
  onValueChange: (value: number | undefined) => void
  placeholder?: string
}

export function GradeSelect({
  value,
  onValueChange,
  placeholder = 'Grade',
}: GradeSelectProps) {
  return (
    <Select
      value={value != null ? String(value) : ''}
      onValueChange={(v) => onValueChange(v ? Number(v) : undefined)}
    >
      <SelectTrigger className='w-20'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {GRADE_SCALE.map((g) => (
          <SelectItem key={g} value={String(g)}>
            {g}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
