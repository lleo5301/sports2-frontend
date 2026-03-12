/**
 * Locale-aware date formatting.
 * Uses the user's locale with MM/dd/yyyy (or locale-equivalent) and HH:mm (24h) format.
 */

type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

/**
 * Format date only — MM/dd/yyyy (locale order).
 * Use for date-only values (e.g. game dates, schedule dates).
 */
export function formatDate(value: DateInput | null | undefined): string {
  if (value == null) return ''
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, dateOptions)
}

/**
 * Format date and time — MM/dd/yyyy HH:mm (locale order, 24h).
 * Use for timestamps (e.g. last synced, created_at).
 */
export function formatDateTime(value: DateInput | null | undefined): string {
  if (value == null) return ''
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, dateTimeOptions)
}

/**
 * Format date short — MMM d (locale month + day).
 * Use for compact lists (e.g. dashboard game cards).
 */
export function formatDateShort(value: DateInput | null | undefined): string {
  if (value == null) return ''
  const d = toDate(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
