import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

vi.mock("../api/room", () => ({
  listRooms: vi.fn(),
  createRoom: vi.fn(),
  getRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
  joinRoom: vi.fn(),
  leaveRoom: vi.fn(),
  startRoom: vi.fn(),
  endRoom: vi.fn(),
  lockRoom: vi.fn(),
  unlockRoom: vi.fn(),
  regenerateRoomCode: vi.fn(),
  addTag: vi.fn(),
  removeTag: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}));

import {
  useRooms,
  useRoom,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useJoinRoom,
  useLeaveRoom,
  useStartRoom,
  useEndRoom,
  useLockRoom,
  useUnlockRoom,
  useRegenerateRoomCode,
  useAddTag,
  useRemoveTag,
  useAddFavorite,
  useRemoveFavorite,
} from "./useRoom";

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
} from "../api/room";

import { roomKeys } from "../query-keys";

const mockedListRooms = vi.mocked(listRooms);
const mockedGetRoom = vi.mocked(getRoom);
const mockedCreateRoom = vi.mocked(createRoom);
const mockedUpdateRoom = vi.mocked(updateRoom);
const mockedDeleteRoom = vi.mocked(deleteRoom);
const mockedJoinRoom = vi.mocked(joinRoom);
const mockedLeaveRoom = vi.mocked(leaveRoom);
const mockedStartRoom = vi.mocked(startRoom);
const mockedEndRoom = vi.mocked(endRoom);
const mockedLockRoom = vi.mocked(lockRoom);
const mockedUnlockRoom = vi.mocked(unlockRoom);
const mockedRegenerateRoomCode = vi.mocked(regenerateRoomCode);
const mockedAddTag = vi.mocked(addTag);
const mockedRemoveTag = vi.mocked(removeTag);
const mockedAddFavorite = vi.mocked(addFavorite);
const mockedRemoveFavorite = vi.mocked(removeFavorite);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

describe("useRooms", () => {
  it("fetches room list with userId and params", async () => {
    const rooms = { content: [{ id: 1, title: "Room A" }], totalElements: 1 };
    mockedListRooms.mockResolvedValue(rooms as any);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRooms("user-1", { page: 0, size: 10 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedListRooms).toHaveBeenCalledWith("user-1", { page: 0, size: 10 });
    expect(result.current.data).toEqual(rooms);
  });

  it("is disabled when userId is empty", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRooms(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedListRooms).not.toHaveBeenCalled();
  });
});

describe("useRoom", () => {
  it("fetches a single room by id", async () => {
    const room = { id: 5, title: "My Room" };
    mockedGetRoom.mockResolvedValue(room as any);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRoom(5, "user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetRoom).toHaveBeenCalledWith(5, "user-1");
    expect(result.current.data).toEqual(room);
  });

  it("is disabled when roomId is 0", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRoom(0, "user-1"), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedGetRoom).not.toHaveBeenCalled();
  });

  it("is disabled when roomId is negative", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRoom(-1, "user-1"), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is disabled when userId is empty", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRoom(1, ""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

describe("useCreateRoom", () => {
  it("calls createRoom and invalidates lists", async () => {
    const created = { id: 10, title: "New Room" };
    mockedCreateRoom.mockResolvedValue(created as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        userId: "user-1",
        data: { title: "New Room" },
      });
    });

    expect(mockedCreateRoom).toHaveBeenCalledWith("user-1", { title: "New Room" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.lists() });
  });
});

describe("useUpdateRoom", () => {
  it("calls updateRoom and invalidates detail + lists", async () => {
    mockedUpdateRoom.mockResolvedValue({ id: 5 } as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: 5,
        userId: "user-1",
        data: { title: "Updated" },
      });
    });

    expect(mockedUpdateRoom).toHaveBeenCalledWith(5, "user-1", { title: "Updated" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(5) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.lists() });
  });
});

describe("useDeleteRoom", () => {
  it("calls deleteRoom and invalidates lists", async () => {
    mockedDeleteRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 3, userId: "user-1" });
    });

    expect(mockedDeleteRoom).toHaveBeenCalledWith(3, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.lists() });
  });
});

describe("useJoinRoom", () => {
  it("calls joinRoom with Number-coerced roomId", async () => {
    const joinRes = { token: "tok", livekitUrl: "url", roomName: "r", waitingRoom: false };
    mockedJoinRoom.mockResolvedValue(joinRes as any);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useJoinRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: "42",
        userId: "user-1",
        data: { password: "abc" },
      });
    });

    expect(mockedJoinRoom).toHaveBeenCalledWith(42, "user-1", { password: "abc" });
  });
});

describe("useLeaveRoom", () => {
  it("calls leaveRoom and invalidates participants cache", async () => {
    mockedLeaveRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useLeaveRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 7, userId: "user-1" });
    });

    expect(mockedLeaveRoom).toHaveBeenCalledWith(7, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(7) });
  });
});

describe("useStartRoom", () => {
  it("calls startRoom and invalidates detail + lists", async () => {
    mockedStartRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useStartRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 8, userId: "user-1" });
    });

    expect(mockedStartRoom).toHaveBeenCalledWith(8, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(8) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.lists() });
  });
});

describe("useEndRoom", () => {
  it("calls endRoom and invalidates detail + lists", async () => {
    mockedEndRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEndRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 9, userId: "user-1" });
    });

    expect(mockedEndRoom).toHaveBeenCalledWith(9, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(9) });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.lists() });
  });
});

describe("useLockRoom", () => {
  it("calls lockRoom and invalidates detail", async () => {
    mockedLockRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useLockRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: 10,
        userId: "user-1",
        data: { password: "secret" },
      });
    });

    expect(mockedLockRoom).toHaveBeenCalledWith(10, "user-1", { password: "secret" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(10) });
  });
});

describe("useUnlockRoom", () => {
  it("calls unlockRoom and invalidates detail", async () => {
    mockedUnlockRoom.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUnlockRoom(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 11, userId: "user-1" });
    });

    expect(mockedUnlockRoom).toHaveBeenCalledWith(11, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(11) });
  });
});

describe("useRegenerateRoomCode", () => {
  it("calls regenerateRoomCode and invalidates detail", async () => {
    mockedRegenerateRoomCode.mockResolvedValue({ id: 12 } as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRegenerateRoomCode(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 12, userId: "user-1" });
    });

    expect(mockedRegenerateRoomCode).toHaveBeenCalledWith(12, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(12) });
  });
});

describe("useAddTag", () => {
  it("calls addTag and invalidates detail", async () => {
    mockedAddTag.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddTag(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: 13,
        userId: "user-1",
        data: { tagName: "important" },
      });
    });

    expect(mockedAddTag).toHaveBeenCalledWith(13, "user-1", { tagName: "important" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(13) });
  });
});

describe("useRemoveTag", () => {
  it("calls removeTag and invalidates detail", async () => {
    mockedRemoveTag.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRemoveTag(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: 14,
        userId: "user-1",
        tagName: "obsolete",
      });
    });

    expect(mockedRemoveTag).toHaveBeenCalledWith(14, "user-1", "obsolete");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.detail(14) });
  });
});

describe("useAddFavorite", () => {
  it("calls addFavorite and invalidates favorites cache", async () => {
    mockedAddFavorite.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddFavorite(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 15, userId: "user-1" });
    });

    expect(mockedAddFavorite).toHaveBeenCalledWith(15, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.favorites() });
  });
});

describe("useRemoveFavorite", () => {
  it("calls removeFavorite and invalidates favorites cache", async () => {
    mockedRemoveFavorite.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRemoveFavorite(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 16, userId: "user-1" });
    });

    expect(mockedRemoveFavorite).toHaveBeenCalledWith(16, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.favorites() });
  });
});
