import { describe, expect, it } from "vitest";
import { availableSlots, localMinuteToDate, weekdayOf } from "./availability";

const TZ = "Europe/Lisbon";
// 2026-10-05 is a Monday; Lisbon is on WEST (UTC+1) until 25 October.
const MONDAY = "2026-10-05";
const monday9to12 = [{ weekday: 1, startMinute: 9 * 60, endMinute: 12 * 60 }];
const longAgo = new Date("2026-01-01T00:00:00Z");

const iso = (d: Date[]) => d.map((x) => x.toISOString());

describe("weekdayOf", () => {
  it("returns the calendar weekday", () => {
    expect(weekdayOf(MONDAY)).toBe(1);
    expect(weekdayOf("2026-10-04")).toBe(0);
  });
});

describe("localMinuteToDate", () => {
  it("applies summer time", () => {
    expect(localMinuteToDate(MONDAY, 9 * 60, TZ).toISOString()).toBe("2026-10-05T08:00:00.000Z");
  });
  it("treats minute 1440 as the next midnight", () => {
    expect(localMinuteToDate(MONDAY, 24 * 60, TZ).toISOString()).toBe("2026-10-05T23:00:00.000Z");
  });
  it("applies winter time", () => {
    expect(localMinuteToDate("2026-11-02", 9 * 60, TZ).toISOString()).toBe("2026-11-02T09:00:00.000Z");
  });
});

describe("availableSlots", () => {
  it("fills working hours in steps, keeping the service inside the block", () => {
    const slots = availableSlots({
      date: MONDAY,
      timezone: TZ,
      durationMinutes: 60,
      workingHours: monday9to12,
      busy: [],
      now: longAgo,
      stepMinutes: 30,
    });
    expect(iso(slots)).toEqual([
      "2026-10-05T08:00:00.000Z",
      "2026-10-05T08:30:00.000Z",
      "2026-10-05T09:00:00.000Z",
      "2026-10-05T09:30:00.000Z",
      "2026-10-05T10:00:00.000Z",
    ]);
  });

  it("returns nothing on a day off", () => {
    const slots = availableSlots({
      date: "2026-10-04",
      timezone: TZ,
      durationMinutes: 30,
      workingHours: monday9to12,
      busy: [],
      now: longAgo,
    });
    expect(slots).toEqual([]);
  });

  it("skips slots that overlap existing bookings", () => {
    const slots = availableSlots({
      date: MONDAY,
      timezone: TZ,
      durationMinutes: 60,
      workingHours: monday9to12,
      busy: [
        // 10:00-10:30 local
        { start: new Date("2026-10-05T09:00:00Z"), end: new Date("2026-10-05T09:30:00Z") },
      ],
      now: longAgo,
      stepMinutes: 30,
    });
    // 9:00, 10:30 and 11:00 local fit; anything touching 10:00-10:30 does not.
    expect(iso(slots)).toEqual([
      "2026-10-05T08:00:00.000Z",
      "2026-10-05T09:30:00.000Z",
      "2026-10-05T10:00:00.000Z",
    ]);
  });

  it("respects the minimum lead time", () => {
    const slots = availableSlots({
      date: MONDAY,
      timezone: TZ,
      durationMinutes: 30,
      workingHours: monday9to12,
      busy: [],
      now: new Date("2026-10-05T09:10:00Z"), // 10:10 local
      stepMinutes: 30,
      minLeadMinutes: 60,
    });
    expect(iso(slots)).toEqual(["2026-10-05T10:30:00.000Z"]);
  });

  it("supports split shifts", () => {
    const slots = availableSlots({
      date: MONDAY,
      timezone: TZ,
      durationMinutes: 60,
      workingHours: [
        { weekday: 1, startMinute: 14 * 60, endMinute: 15 * 60 },
        { weekday: 1, startMinute: 9 * 60, endMinute: 10 * 60 },
      ],
      busy: [],
      now: longAgo,
    });
    expect(iso(slots)).toEqual(["2026-10-05T08:00:00.000Z", "2026-10-05T13:00:00.000Z"]);
  });
});
