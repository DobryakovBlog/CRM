import { fromZonedTime } from "date-fns-tz";

export type Interval = { start: Date; end: Date };

export type WorkingBlock = {
  weekday: number; // 0 = Sunday ... 6 = Saturday
  startMinute: number;
  endMinute: number;
};

export type AvailabilityInput = {
  date: string; // local calendar date, YYYY-MM-DD
  timezone: string; // IANA zone of the salon, e.g. Europe/Lisbon
  durationMinutes: number;
  workingHours: WorkingBlock[];
  busy: Interval[]; // existing bookings and time off
  now: Date;
  stepMinutes?: number;
  minLeadMinutes?: number; // how soon before the start a client may still book
};

const MINUTE = 60_000;

/** Weekday (0..6) of a YYYY-MM-DD calendar date, independent of timezone. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** The calendar date after a YYYY-MM-DD date. */
export function nextDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

/** Converts a local date + minutes since local midnight (0..1440) into an absolute instant. */
export function localMinuteToDate(date: string, minute: number, timezone: string): Date {
  if (minute >= 24 * 60) return localMinuteToDate(nextDate(date), minute - 24 * 60, timezone);
  const h = String(Math.floor(minute / 60)).padStart(2, "0");
  const m = String(minute % 60).padStart(2, "0");
  return fromZonedTime(`${date}T${h}:${m}:00`, timezone);
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/** Start times a staff member can take a service of the given duration on a date. */
export function availableSlots(input: AvailabilityInput): Date[] {
  const step = input.stepMinutes ?? 15;
  const lead = input.minLeadMinutes ?? 60;
  const earliest = new Date(input.now.getTime() + lead * MINUTE);
  const weekday = weekdayOf(input.date);
  const slots: Date[] = [];

  const blocks = input.workingHours
    .filter((b) => b.weekday === weekday)
    .sort((a, b) => a.startMinute - b.startMinute);

  for (const block of blocks) {
    for (
      let minute = block.startMinute;
      minute + input.durationMinutes <= block.endMinute;
      minute += step
    ) {
      const start = localMinuteToDate(input.date, minute, input.timezone);
      const end = new Date(start.getTime() + input.durationMinutes * MINUTE);
      if (start < earliest) continue;
      if (input.busy.some((b) => overlaps({ start, end }, b))) continue;
      slots.push(start);
    }
  }
  return slots;
}
