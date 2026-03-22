import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRoomFetch = vi.fn().mockResolvedValue({});

vi.mock("../api", () => ({
  roomFetch: (...args: unknown[]) => mockRoomFetch(...args),
}));

import {
  getRoomByCode,
  searchRoomsByTag,
  listScheduledRooms,
  listRoomHistory,
  getMonthlyStats,
  listFavoriteRooms,
  getRoomStats,
  getRoomTimeline,
} from "./room-discovery";

beforeEach(() => {
  mockRoomFetch.mockClear();
});

describe("room-discovery API", () => {
  const uid = "user-1";

  it("getRoomByCode encodes room code", async () => {
    await getRoomByCode("ABC 123", uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/code/ABC%20123", uid);
  });

  it("searchRoomsByTag encodes tag name", async () => {
    await searchRoomsByTag("my tag", uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/tags/my%20tag", uid);
  });

  it("listScheduledRooms fetches scheduled", async () => {
    await listScheduledRooms(uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/scheduled", uid);
  });

  it("listRoomHistory fetches history", async () => {
    await listRoomHistory(uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/history", uid);
  });

  it("getMonthlyStats fetches monthly stats", async () => {
    await getMonthlyStats(uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/history/monthly", uid);
  });

  it("listFavoriteRooms fetches favorites", async () => {
    await listFavoriteRooms(uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/favorites", uid);
  });

  it("getRoomStats fetches room stats", async () => {
    await getRoomStats(42, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/42/stats", uid);
  });

  it("getRoomTimeline fetches timeline", async () => {
    await getRoomTimeline(42, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/42/timeline", uid);
  });
});
