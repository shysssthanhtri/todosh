import { endOfDay, isBefore, startOfDay } from "date-fns";

/**
 * Converts a date to end of day (23:59:59.999) in local timezone.
 * The resulting Date serializes to UTC when stored.
 */
export function toDueDateUTC(date: Date): Date {
  return endOfDay(date);
}

/**
 * Returns true if the date is before the start of today (overdue).
 */
export function isOverdue(date: Date): boolean {
  return isBefore(date, startOfDay(new Date()));
}
