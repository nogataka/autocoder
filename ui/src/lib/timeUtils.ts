/**
 * Time Zone Utilities
 * ====================
 *
 * Utilities for converting between UTC and local time for schedule management.
 * All times in the database are stored in UTC and displayed in the user's local timezone.
 */

/**
 * Convert "HH:MM" UTC time to user's local time.
 * @param utcTime Time string in "HH:MM" format (UTC)
 * @returns Time string in "HH:MM" format (local)
 */
export function utcToLocal(utcTime: string): string {
  const [hours, minutes] = utcTime.split(':').map(Number)
  const utcDate = new Date()
  utcDate.setUTCHours(hours, minutes, 0, 0)

  const localHours = utcDate.getHours()
  const localMinutes = utcDate.getMinutes()

  return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`
}

/**
 * Convert "HH:MM" local time to UTC for storage.
 * @param localTime Time string in "HH:MM" format (local)
 * @returns Time string in "HH:MM" format (UTC)
 */
export function localToUTC(localTime: string): string {
  const [hours, minutes] = localTime.split(':').map(Number)
  const localDate = new Date()
  localDate.setHours(hours, minutes, 0, 0)

  const utcHours = localDate.getUTCHours()
  const utcMinutes = localDate.getUTCMinutes()

  return `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`
}

/**
 * Format a duration in minutes to a human-readable string.
 * @param minutes Duration in minutes
 * @returns Formatted string (e.g., "4h", "1h 30m", "30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Format an ISO datetime string to a human-readable next run format.
 * Uses the browser's locale settings for 12/24-hour format.
 * @param isoString ISO datetime string in UTC
 * @returns Formatted string (e.g., "22:00", "10:00 PM", "Mon 22:00")
 */
export function formatNextRun(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 24) {
    // Same day or within 24 hours - just show time
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // Further out - show day and time
  return date.toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit'
  })
}

/**
 * Format an ISO datetime string to show the end time.
 * Uses the browser's locale settings for 12/24-hour format.
 * @param isoString ISO datetime string in UTC
 * @returns Formatted string (e.g., "14:00", "2:00 PM")
 */
export function formatEndTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  })
}

/**
 * Day bit values for the days_of_week bitfield.
 */
export const DAY_BITS = {
  Mon: 1,
  Tue: 2,
  Wed: 4,
  Thu: 8,
  Fri: 16,
  Sat: 32,
  Sun: 64,
} as const

/**
 * Array of days with their labels and bit values.
 */
export const DAYS = [
  { label: 'Mon', bit: 1 },
  { label: 'Tue', bit: 2 },
  { label: 'Wed', bit: 4 },
  { label: 'Thu', bit: 8 },
  { label: 'Fri', bit: 16 },
  { label: 'Sat', bit: 32 },
  { label: 'Sun', bit: 64 },
] as const

/**
 * Check if a day is active in a bitfield.
 * @param bitfield The days_of_week bitfield
 * @param dayBit The bit value for the day to check
 * @returns True if the day is active
 */
export function isDayActive(bitfield: number, dayBit: number): boolean {
  return (bitfield & dayBit) !== 0
}

/**
 * Toggle a day in a bitfield.
 * @param bitfield The current days_of_week bitfield
 * @param dayBit The bit value for the day to toggle
 * @returns New bitfield with the day toggled
 */
export function toggleDay(bitfield: number, dayBit: number): number {
  return bitfield ^ dayBit
}

/**
 * Get human-readable description of active days.
 * @param bitfield The days_of_week bitfield
 * @returns Description string (e.g., "Every day", "Weekdays", "Mon, Wed, Fri")
 */
export function formatDaysDescription(bitfield: number): string {
  if (bitfield === 127) return 'Every day'
  if (bitfield === 31) return 'Weekdays'
  if (bitfield === 96) return 'Weekends'

  const activeDays = DAYS.filter(d => isDayActive(bitfield, d.bit))
  return activeDays.map(d => d.label).join(', ')
}
