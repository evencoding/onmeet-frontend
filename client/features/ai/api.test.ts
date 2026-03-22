import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAiFetch = vi.fn().mockResolvedValue({});

vi.mock("@/shared/utils/apiFetch", () => ({
  createServiceFetch: () => (...args: unknown[]) => mockAiFetch(...args),
}));

import { getMinutes, regenerateMinutes, updateMinutes, getTranscript } from "./api";

beforeEach(() => {
  mockAiFetch.mockClear();
});

describe("ai API", () => {
  const uid = "user-1";

  it("getMinutes fetches minutes for room", async () => {
    await getMinutes(42, uid);
    expect(mockAiFetch).toHaveBeenCalledWith("/v1/rooms/42/minutes", uid);
  });

  it("regenerateMinutes posts with optional data", async () => {
    await regenerateMinutes(42, uid);
    expect(mockAiFetch).toHaveBeenCalledWith("/v1/rooms/42/minutes/regenerate", uid, {
      method: "POST",
      body: undefined,
    });

    mockAiFetch.mockClear();
    const data = { language: "ko", style: "formal" };
    await regenerateMinutes(42, uid, data);
    expect(mockAiFetch).toHaveBeenCalledWith("/v1/rooms/42/minutes/regenerate", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("updateMinutes puts with body", async () => {
    const data = { userEditedSummaryJson: "{}" };
    await updateMinutes(42, uid, data);
    expect(mockAiFetch).toHaveBeenCalledWith("/v1/rooms/42/minutes", uid, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("getTranscript fetches transcript for room", async () => {
    await getTranscript(42, uid);
    expect(mockAiFetch).toHaveBeenCalledWith("/v1/rooms/42/transcript", uid);
  });
});
