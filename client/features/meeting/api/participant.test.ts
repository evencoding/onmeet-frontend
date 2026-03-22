import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRoomFetch = vi.fn().mockResolvedValue({});

vi.mock("../api", () => ({
  roomFetch: (...args: unknown[]) => mockRoomFetch(...args),
}));

import {
  listParticipants,
  listParticipantHistory,
  muteParticipant,
  unmuteParticipant,
  kickParticipant,
  updateParticipantRole,
  muteAll,
  unmuteAll,
  disableVideoAll,
} from "./participant";

beforeEach(() => {
  mockRoomFetch.mockClear();
});

describe("participant API", () => {
  const uid = "user-1";

  it("listParticipants fetches participants", async () => {
    await listParticipants(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/participants", uid);
  });

  it("listParticipantHistory with pagination", async () => {
    await listParticipantHistory(10, uid, { page: 0, size: 20 });
    const url = mockRoomFetch.mock.calls[0][0] as string;
    expect(url).toContain("/rooms/10/participants/history");
    expect(url).toContain("page=0");
    expect(url).toContain("size=20");
  });

  it("listParticipantHistory without pagination", async () => {
    await listParticipantHistory(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/participants/history", uid);
  });

  it("muteParticipant posts", async () => {
    await muteParticipant(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/10/participants/5/mute", uid, { method: "POST" },
    );
  });

  it("unmuteParticipant posts", async () => {
    await unmuteParticipant(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/10/participants/5/unmute", uid, { method: "POST" },
    );
  });

  it("kickParticipant posts", async () => {
    await kickParticipant(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/10/participants/5/kick", uid, { method: "POST" },
    );
  });

  it("updateParticipantRole patches with body", async () => {
    const data = { role: "MODERATOR" };
    await updateParticipantRole(10, 5, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/10/participants/5/role", uid,
      { method: "PATCH", body: JSON.stringify(data) },
    );
  });

  it("muteAll posts", async () => {
    await muteAll(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/mute-all", uid, { method: "POST" });
  });

  it("unmuteAll posts", async () => {
    await unmuteAll(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/unmute-all", uid, { method: "POST" });
  });

  it("disableVideoAll posts", async () => {
    await disableVideoAll(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/10/disable-video-all", uid, { method: "POST" },
    );
  });
});
