import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

vi.mock("../api/participant", () => ({
  listParticipants: vi.fn(),
  listParticipantHistory: vi.fn(),
  muteParticipant: vi.fn(),
  unmuteParticipant: vi.fn(),
  kickParticipant: vi.fn(),
  updateParticipantRole: vi.fn(),
  muteAll: vi.fn(),
  unmuteAll: vi.fn(),
  disableVideoAll: vi.fn(),
}));

import {
  useParticipants,
  useParticipantHistory,
  useMuteParticipant,
  useUnmuteParticipant,
  useKickParticipant,
  useUpdateParticipantRole,
  useMuteAll,
  useUnmuteAll,
  useDisableVideoAll,
} from "./useParticipant";

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
} from "../api/participant";

import { roomKeys } from "../query-keys";

const mockedListParticipants = vi.mocked(listParticipants);
const mockedListParticipantHistory = vi.mocked(listParticipantHistory);
const mockedMuteParticipant = vi.mocked(muteParticipant);
const mockedUnmuteParticipant = vi.mocked(unmuteParticipant);
const mockedKickParticipant = vi.mocked(kickParticipant);
const mockedUpdateParticipantRole = vi.mocked(updateParticipantRole);
const mockedMuteAll = vi.mocked(muteAll);
const mockedUnmuteAll = vi.mocked(unmuteAll);
const mockedDisableVideoAll = vi.mocked(disableVideoAll);

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

describe("useParticipants", () => {
  it("fetches participants for a room", async () => {
    const participants = [{ id: 1, userId: 100, role: "HOST" }];
    mockedListParticipants.mockResolvedValue(participants as any);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useParticipants(5, "user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedListParticipants).toHaveBeenCalledWith(5, "user-1");
    expect(result.current.data).toEqual(participants);
  });

  it("is disabled when roomId is 0", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useParticipants(0, "user-1"), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedListParticipants).not.toHaveBeenCalled();
  });

  it("is disabled when userId is empty", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useParticipants(5, ""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedListParticipants).not.toHaveBeenCalled();
  });
});

describe("useParticipantHistory", () => {
  it("fetches participant history for a room", async () => {
    const history = { content: [{ id: 1, status: "LEFT" }], totalElements: 1 };
    mockedListParticipantHistory.mockResolvedValue(history as any);

    const { wrapper } = createWrapper();
    const pageable = { page: 0, size: 20 };
    const { result } = renderHook(
      () => useParticipantHistory(3, "user-1", pageable),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedListParticipantHistory).toHaveBeenCalledWith(3, "user-1", pageable);
    expect(result.current.data).toEqual(history);
  });
});

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

describe("useMuteParticipant", () => {
  it("calls muteParticipant and invalidates participants cache", async () => {
    mockedMuteParticipant.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMuteParticipant(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 5, targetUserId: 100, userId: "user-1" });
    });

    expect(mockedMuteParticipant).toHaveBeenCalledWith(5, 100, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(5) });
  });
});

describe("useUnmuteParticipant", () => {
  it("calls unmuteParticipant and invalidates participants cache", async () => {
    mockedUnmuteParticipant.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUnmuteParticipant(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 5, targetUserId: 101, userId: "user-1" });
    });

    expect(mockedUnmuteParticipant).toHaveBeenCalledWith(5, 101, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(5) });
  });
});

describe("useKickParticipant", () => {
  it("calls kickParticipant and invalidates participants cache", async () => {
    mockedKickParticipant.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useKickParticipant(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 6, targetUserId: 102, userId: "user-1" });
    });

    expect(mockedKickParticipant).toHaveBeenCalledWith(6, 102, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(6) });
  });
});

describe("useUpdateParticipantRole", () => {
  it("calls updateParticipantRole and invalidates participants cache", async () => {
    mockedUpdateParticipantRole.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateParticipantRole(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        roomId: 7,
        targetUserId: 103,
        userId: "user-1",
        data: { role: "CO_HOST" },
      });
    });

    expect(mockedUpdateParticipantRole).toHaveBeenCalledWith(7, 103, "user-1", { role: "CO_HOST" });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(7) });
  });
});

describe("useMuteAll", () => {
  it("calls muteAll and invalidates participants cache", async () => {
    mockedMuteAll.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMuteAll(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 8, userId: "user-1" });
    });

    expect(mockedMuteAll).toHaveBeenCalledWith(8, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(8) });
  });
});

describe("useUnmuteAll", () => {
  it("calls unmuteAll and invalidates participants cache", async () => {
    mockedUnmuteAll.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUnmuteAll(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 9, userId: "user-1" });
    });

    expect(mockedUnmuteAll).toHaveBeenCalledWith(9, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(9) });
  });
});

describe("useDisableVideoAll", () => {
  it("calls disableVideoAll and invalidates participants cache", async () => {
    mockedDisableVideoAll.mockResolvedValue(undefined as any);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDisableVideoAll(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ roomId: 10, userId: "user-1" });
    });

    expect(mockedDisableVideoAll).toHaveBeenCalledWith(10, "user-1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roomKeys.participants(10) });
  });
});
