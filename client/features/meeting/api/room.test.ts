import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRoomFetch = vi.fn().mockResolvedValue({});

vi.mock("../api", () => ({
  roomFetch: (...args: unknown[]) => mockRoomFetch(...args),
}));

import {
  listRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  startRoom,
  endRoom,
  lockRoom,
  unlockRoom,
  regenerateRoomCode,
  addTag,
  removeTag,
  addFavorite,
  removeFavorite,
} from "./room";

beforeEach(() => {
  mockRoomFetch.mockClear();
});

describe("room API", () => {
  const uid = "user-1";

  describe("listRooms", () => {
    it("calls with no params", async () => {
      await listRooms(uid);
      expect(mockRoomFetch).toHaveBeenCalledWith("/rooms", uid);
    });

    it("builds query string with page and size", async () => {
      await listRooms(uid, { page: 0, size: 10 });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("page=0");
      expect(url).toContain("size=10");
    });

    it("includes status filter", async () => {
      await listRooms(uid, { status: "ACTIVE" });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("status=ACTIVE");
    });

    it("includes type filter", async () => {
      await listRooms(uid, { type: "PUBLIC" as any });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("type=PUBLIC");
    });

    it("includes accessScope filter", async () => {
      await listRooms(uid, { accessScope: "COMPANY" as any });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("accessScope=COMPANY");
    });

    it("includes hostUserId filter", async () => {
      await listRooms(uid, { hostUserId: 42 });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("hostUserId=42");
    });

    it("includes sort params", async () => {
      await listRooms(uid, { sort: ["createdAt,desc"] });
      const url = mockRoomFetch.mock.calls[0][0] as string;
      expect(url).toContain("sort=");
    });
  });

  it("createRoom posts with body", async () => {
    const data = { title: "Room 1" };
    await createRoom(uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("getRoom fetches by id", async () => {
    await getRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5", uid);
  });

  it("updateRoom patches by id", async () => {
    const data = { title: "Updated" };
    await updateRoom(5, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5", uid, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });

  it("deleteRoom sends DELETE", async () => {
    await deleteRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5", uid, { method: "DELETE" });
  });

  it("joinRoom posts with optional body", async () => {
    await joinRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/join", uid, {
      method: "POST",
      body: undefined,
    });

    mockRoomFetch.mockClear();
    const data = { password: "123" };
    await joinRoom(5, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/join", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("leaveRoom posts", async () => {
    await leaveRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/leave", uid, { method: "POST" });
  });

  it("startRoom posts", async () => {
    await startRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/start", uid, { method: "POST" });
  });

  it("endRoom posts", async () => {
    await endRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/end", uid, { method: "POST" });
  });

  it("lockRoom posts with optional body", async () => {
    await lockRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/lock", uid, {
      method: "POST",
      body: undefined,
    });
  });

  it("unlockRoom posts", async () => {
    await unlockRoom(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/unlock", uid, { method: "POST" });
  });

  it("regenerateRoomCode posts", async () => {
    await regenerateRoomCode(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/regenerate-code", uid, { method: "POST" });
  });

  it("addTag posts with body", async () => {
    const data = { tagName: "dev" };
    await addTag(5, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/tags", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("removeTag deletes with encoded tag name", async () => {
    await removeTag(5, uid, "test tag");
    expect(mockRoomFetch).toHaveBeenCalledWith(
      "/rooms/5/tags/test%20tag",
      uid,
      { method: "DELETE" },
    );
  });

  it("addFavorite posts", async () => {
    await addFavorite(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/favorite", uid, { method: "POST" });
  });

  it("removeFavorite deletes", async () => {
    await removeFavorite(5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/5/favorite", uid, { method: "DELETE" });
  });
});
