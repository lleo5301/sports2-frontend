import { z } from 'zod'
import type {
  ToolGrades,
  ScoutingReportCreateInput,
  GradeValue,
} from '@/lib/scouting-api'

/* ------------------------------------------------------------------ */
/*  Zod sub-schemas for tool_grades                                    */
/* ------------------------------------------------------------------ */

const presentFutureGrade = z
  .object({
    present: z.number().optional(),
    future: z.number().optional(),
    description: z.string().optional(),
  })
  .optional()

const gradeWithDescription = z
  .object({
    grade: z.number().optional(),
    description: z.string().optional(),
  })
  .optional()

const toolGradesSchema = z
  .object({
    body: z
      .object({
        grade: z.number().optional(),
        projection: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
    athleticism: gradeWithDescription,
    bat: z
      .object({
        hit: presentFutureGrade,
        power: presentFutureGrade,
        raw_power: presentFutureGrade,
        bat_speed: presentFutureGrade,
        contact: z.string().optional(),
        swing_decisions: z.string().optional(),
        contact_quality: z.string().optional(),
      })
      .optional(),
    field: z
      .object({
        arm_strength: presentFutureGrade,
        arm_accuracy: presentFutureGrade,
        current_position: z.string().optional(),
        defense_present: z.number().optional(),
        pop_times: z.string().optional(),
        fielding_grade: z.number().optional(),
        fielding_description: z.string().optional(),
      })
      .optional(),
    run: z
      .object({
        speed: gradeWithDescription,
        times_to_first: z.string().optional(),
        baserunning: gradeWithDescription,
        instincts: gradeWithDescription,
        compete: gradeWithDescription,
      })
      .optional(),
    pitching: z
      .object({
        fastball: presentFutureGrade,
        slider: presentFutureGrade,
        curveball: presentFutureGrade,
        changeup: presentFutureGrade,
        command: z.number().optional(),
        control: z.number().optional(),
        delivery: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  })
  .optional()

/* ------------------------------------------------------------------ */
/*  Main form schema                                                   */
/* ------------------------------------------------------------------ */

export const scoutingFormSchema = z.object({
  // Report info
  prospect_id: z.number().optional(),
  player_id: z.number().optional(),
  report_type: z.enum(['hitter', 'pitcher']).optional(),
  report_date: z.string().min(1, 'Required'),
  event_type: z.string().min(1, 'Required'),
  date_seen_start: z.string().optional(),
  date_seen_end: z.string().optional(),
  video_report: z.boolean().optional(),
  // Assessment
  player_comparison: z.string().optional(),
  impact_statement: z.string().optional(),
  role: z.number().min(1).max(9).optional(),
  round_would_take: z.string().optional(),
  dollar_amount: z.string().optional(),
  money_save: z.boolean().optional(),
  overpay: z.boolean().optional(),
  report_confidence: z.string().optional(),
  look_recommendation: z.number().optional(),
  look_recommendation_desc: z.string().optional(),
  // Tool grades (nested JSONB)
  tool_grades: toolGradesSchema,
  // Summary / notes
  summary: z.string().optional(),
  notes: z.string().optional(),
})

export type ScoutingFormValues = z.infer<typeof scoutingFormSchema>

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Remove empty nested objects recursively so we don't send `{ bat: { hit: {} } }` */
function stripEmpty(
  obj: Record<string, unknown>
): Record<string, unknown> | undefined {
  const result: Record<string, unknown> = {}
  let hasValue = false

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue
    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleaned = stripEmpty(value as Record<string, unknown>)
      if (cleaned !== undefined) {
        result[key] = cleaned
        hasValue = true
      }
    } else {
      result[key] = value
      hasValue = true
    }
  }

  return hasValue ? result : undefined
}

/** Build the full API payload from form values, populating legacy flat fields from tool_grades */
export function buildScoutingPayload(
  data: ScoutingFormValues
): ScoutingReportCreateInput {
  // Clean tool_grades
  const rawToolGrades = data.tool_grades ?? {}
  const cleanedToolGrades = stripEmpty(
    rawToolGrades as unknown as Record<string, unknown>
  ) as ToolGrades | undefined

  // Map tool_grades -> legacy flat fields for backward compat
  const legacyGrades: Record<string, GradeValue | undefined> = {}

  if (cleanedToolGrades?.bat?.hit) {
    legacyGrades.hitting_present = cleanedToolGrades.bat.hit.present
    legacyGrades.hitting_future = cleanedToolGrades.bat.hit.future
  }
  if (cleanedToolGrades?.bat?.power) {
    legacyGrades.power_present = cleanedToolGrades.bat.power.present
    legacyGrades.power_future = cleanedToolGrades.bat.power.future
  }
  if (cleanedToolGrades?.field?.arm_strength) {
    legacyGrades.arm_present = cleanedToolGrades.field.arm_strength.present
    legacyGrades.arm_future = cleanedToolGrades.field.arm_strength.future
  }
  if (cleanedToolGrades?.field?.fielding_grade != null) {
    legacyGrades.fielding_present = cleanedToolGrades.field.fielding_grade
  }
  if (cleanedToolGrades?.field?.defense_present != null) {
    legacyGrades.fielding_present = cleanedToolGrades.field.defense_present
  }
  if (cleanedToolGrades?.run?.speed?.grade != null) {
    legacyGrades.speed_present = cleanedToolGrades.run.speed.grade
  }
  if (cleanedToolGrades?.pitching?.fastball) {
    legacyGrades.pitching_present = cleanedToolGrades.pitching.fastball.present
    legacyGrades.pitching_future = cleanedToolGrades.pitching.fastball.future
  }

  // Strip undefined legacy values
  const filteredLegacy: Record<string, GradeValue> = {}
  for (const [k, v] of Object.entries(legacyGrades)) {
    if (v !== undefined && v !== null) filteredLegacy[k] = v
  }

  const payload: ScoutingReportCreateInput = {
    report_date: data.report_date,
    event_type: data.event_type,
    // New expanded fields
    ...(data.prospect_id != null && { prospect_id: data.prospect_id }),
    ...(data.player_id != null && { player_id: data.player_id }),
    ...(data.report_type && { report_type: data.report_type }),
    ...(data.date_seen_start && { date_seen_start: data.date_seen_start }),
    ...(data.date_seen_end && { date_seen_end: data.date_seen_end }),
    ...(data.video_report != null && { video_report: data.video_report }),
    ...(data.player_comparison && {
      player_comparison: data.player_comparison,
      mlb_comparison: data.player_comparison, // legacy alias
    }),
    ...(data.impact_statement && { impact_statement: data.impact_statement }),
    ...(data.role != null && { role: data.role }),
    ...(data.round_would_take && { round_would_take: data.round_would_take }),
    ...(data.dollar_amount && { dollar_amount: data.dollar_amount }),
    ...(data.money_save != null && { money_save: data.money_save }),
    ...(data.overpay != null && { overpay: data.overpay }),
    ...(data.report_confidence && {
      report_confidence: data.report_confidence,
    }),
    ...(data.look_recommendation != null && {
      look_recommendation: data.look_recommendation,
    }),
    ...(data.look_recommendation_desc && {
      look_recommendation_desc: data.look_recommendation_desc,
    }),
    ...(data.summary && { summary: data.summary }),
    ...(data.notes && { notes: data.notes }),
    // Tool grades
    ...(cleanedToolGrades && { tool_grades: cleanedToolGrades }),
    // Legacy flat grade fields from tool_grades
    ...filteredLegacy,
  }

  return payload
}
