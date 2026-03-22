import { describe, it, expect } from "vitest";
import { aiKeys } from "./hooks";

describe("aiKeys (query key factory)", () => {
  it("generates minutes key with roomId", () => {
    expect(aiKeys.minutes(42)).toEqual(["ai", "minutes", 42]);
  });

  it("generates transcript key with roomId", () => {
    expect(aiKeys.transcript(42)).toEqual(["ai", "transcript", 42]);
  });

  it("different roomIds produce different keys", () => {
    expect(aiKeys.minutes(1)).not.toEqual(aiKeys.minutes(2));
    expect(aiKeys.transcript(1)).not.toEqual(aiKeys.transcript(2));
  });

  it("minutes and transcript keys are distinct for same roomId", () => {
    expect(aiKeys.minutes(1)).not.toEqual(aiKeys.transcript(1));
  });

  it("keys share common ai prefix", () => {
    expect(aiKeys.minutes(1)[0]).toBe("ai");
    expect(aiKeys.transcript(1)[0]).toBe("ai");
  });
});
