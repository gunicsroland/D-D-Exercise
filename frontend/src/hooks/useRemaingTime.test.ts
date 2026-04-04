import { getRemainingTime } from "./useRemainingTime";

const now = new Date("2026-01-01T12:00:00Z").getTime();

it("returns 0:00 if expired", () => {
    const expiresAt = "2026-01-01T11:59:00Z";
    expect(getRemainingTime(expiresAt, now)).toBe("0:00");
});

it("formats minutes and seconds correctly", () => {
    const expiresAt = "2026-01-01T12:01:30Z";
    expect(getRemainingTime(expiresAt, now)).toBe("1:30");
});

it("pads seconds with leading zero", () => {
    const expiresAt = "2026-01-01T12:01:05Z";
    expect(getRemainingTime(expiresAt, now)).toBe("1:05");
});

it("handles exact minute correctly", () => {
    const expiresAt = "2026-01-01T12:02:00Z";
    expect(getRemainingTime(expiresAt, now)).toBe("2:00");
});