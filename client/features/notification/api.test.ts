import { describe, it, expect } from "vitest";
import { getUnreadTotal, type UnreadCountResponse } from "./api";

describe("getUnreadTotal", () => {
  it("returns 0 for empty object", () => {
    expect(getUnreadTotal({})).toBe(0);
  });

  it("sums single category", () => {
    const data: UnreadCountResponse = { MEETING: 5 };
    expect(getUnreadTotal(data)).toBe(5);
  });

  it("sums multiple categories", () => {
    const data: UnreadCountResponse = {
      MEETING: 3,
      TEAM: 2,
      SYSTEM: 1,
    };
    expect(getUnreadTotal(data)).toBe(6);
  });

  it("handles all zero values", () => {
    const data: UnreadCountResponse = {
      MEETING: 0,
      TEAM: 0,
      SYSTEM: 0,
    };
    expect(getUnreadTotal(data)).toBe(0);
  });

  it("handles large numbers", () => {
    const data: UnreadCountResponse = {
      MEETING: 1000,
      TEAM: 500,
      NOTICE: 250,
    };
    expect(getUnreadTotal(data)).toBe(1750);
  });
});
