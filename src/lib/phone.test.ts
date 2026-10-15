import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("accepts real Portuguese and foreign numbers", () => {
    expect(normalizePhone("912 000 111")).toBe("+351912000111");
    expect(normalizePhone("+351 212 000 111")).toBe("+351212000111");
    expect(normalizePhone("+44 7400 555018")).toBe("+447400555018");
    expect(normalizePhone("7400 555018", "GB")).toBe("+447400555018");
    expect(normalizePhone("+380 67 205 3891")).toBe("+380672053891");
  });

  it("rejects missing, impossible and made-up numbers", () => {
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("999999999")).toBeNull();
    expect(normalizePhone("911111111")).toBeNull();
    expect(normalizePhone("912345678")).toBeNull();
    expect(normalizePhone("+351 812 000 111")).toBeNull();
  });

  it("formats stored numbers for display", () => {
    expect(formatPhone("+351912000111")).toBe("+351 912 000 111");
    expect(formatPhone("old 123")).toBe("old 123");
  });
});
