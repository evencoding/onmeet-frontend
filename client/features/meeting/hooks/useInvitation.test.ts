import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

vi.mock("../api/invitation", () => ({
  inviteToRoom: vi.fn(),
  bulkInviteToRoom: vi.fn(),
  cancelInvitation: vi.fn(),
  listInvitations: vi.fn(),
  acceptInvitation: vi.fn(),
  declineInvitation: vi.fn(),
}));

import {
  useInvitations,
  useInviteToRoom,
  useBulkInviteToRoom,
  useCancelInvitation,
  useAcceptInvitation,
  useDeclineInvitation,
} from "./useInvitation";
import {
  inviteToRoom,
  bulkInviteToRoom,
  cancelInvitation,
  listInvitations,
  acceptInvitation,
  declineInvitation,
} from "../api/invitation";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useInvitations", () => {
  it("fetches invitations when roomId and userId are provided", async () => {
    const mockData = [{ id: 1, email: "user@test.com" }] as any;
    vi.mocked(listInvitations).mockResolvedValue(mockData);

    const { result } = renderHook(() => useInvitations(1, "user-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(listInvitations).toHaveBeenCalledWith(1, "user-1");
    expect(result.current.data).toEqual(mockData);
  });

  it("does not fetch when roomId is falsy", () => {
    const { result } = renderHook(() => useInvitations(0, "user-1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(listInvitations).not.toHaveBeenCalled();
  });

  it("does not fetch when userId is falsy", () => {
    const { result } = renderHook(() => useInvitations(1, ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(listInvitations).not.toHaveBeenCalled();
  });
});

describe("useInviteToRoom", () => {
  it("calls inviteToRoom and invalidates invitations cache on success", async () => {
    const mockResponse = { id: 1, status: "PENDING" } as any;
    vi.mocked(inviteToRoom).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useInviteToRoom(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        roomId: 1,
        userId: "user-1",
        data: { inviteeEmail: "test@test.com" },
      } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(inviteToRoom).toHaveBeenCalledWith(1, "user-1", {
      inviteeEmail: "test@test.com",
    });
  });
});

describe("useBulkInviteToRoom", () => {
  it("calls bulkInviteToRoom with correct arguments", async () => {
    const mockResponse = [{ id: 1 }, { id: 2 }] as any;
    vi.mocked(bulkInviteToRoom).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBulkInviteToRoom(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        roomId: 1,
        userId: "user-1",
        data: { emails: ["a@test.com", "b@test.com"] },
      } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bulkInviteToRoom).toHaveBeenCalledWith(1, "user-1", {
      emails: ["a@test.com", "b@test.com"],
    });
  });
});

describe("useCancelInvitation", () => {
  it("calls cancelInvitation with correct arguments", async () => {
    vi.mocked(cancelInvitation).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCancelInvitation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        roomId: 1,
        inviteeUserId: 42,
        userId: "user-1",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(cancelInvitation).toHaveBeenCalledWith(1, 42, "user-1");
  });
});

describe("useAcceptInvitation", () => {
  it("calls acceptInvitation with correct arguments", async () => {
    vi.mocked(acceptInvitation).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAcceptInvitation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ invitationId: 10, userId: "user-1" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(acceptInvitation).toHaveBeenCalledWith(10, "user-1");
  });
});

describe("useDeclineInvitation", () => {
  it("calls declineInvitation with correct arguments", async () => {
    vi.mocked(declineInvitation).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeclineInvitation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ invitationId: 10, userId: "user-1" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(declineInvitation).toHaveBeenCalledWith(10, "user-1");
  });
});
