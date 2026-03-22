import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import type { ReactNode } from "react";

vi.mock("@/features/auth/api", () => ({
  login: vi.fn(),
  signupCompany: vi.fn(),
  registerEmployee: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  validateInvitation: vi.fn(),
  guestLogin: vi.fn(),
  findPassword: vi.fn(),
  getAllEmployees: vi.fn(),
  getJobTitles: vi.fn(),
  updateProfile: vi.fn(),
  withdraw: vi.fn(),
  changePassword: vi.fn(),
  inviteMember: vi.fn(),
  inviteSingleMember: vi.fn(),
  updateCompany: vi.fn(),
  approveTeam: vi.fn(),
  rejectTeam: vi.fn(),
  assignLeader: vi.fn(),
  delegateLeader: vi.fn(),
  activateUser: vi.fn(),
  deactivateUser: vi.fn(),
  createTeam: vi.fn(),
}));

import {
  useMe,
  useLogin,
  useGuestLogin,
  useCompanySignup,
  useEmployeeSignup,
  useLogout,
  useValidateInvitation,
  useAllEmployees,
  useJobTitles,
  useUpdateProfile,
  useWithdraw,
  useChangePasswordMutation,
  useFindPassword,
  useInviteMember,
  useInviteSingleMember,
  useUpdateCompany,
  useApproveTeam,
  useRejectTeam,
  useAssignLeader,
  useDelegateLeader,
  useActivateUser,
  useDeactivateUser,
  useCreateTeam,
  AUTH_QUERY_KEY,
  AUTH_ADMIN_KEYS,
} from "./hooks";

import {
  login,
  signupCompany,
  registerEmployee,
  logout,
  getMe,
  validateInvitation,
  guestLogin,
  findPassword,
  getAllEmployees,
  getJobTitles,
  updateProfile,
  withdraw,
  changePassword,
  inviteMember,
  inviteSingleMember,
  updateCompany,
  approveTeam,
  rejectTeam,
  assignLeader,
  delegateLeader,
  activateUser,
  deactivateUser,
  createTeam,
} from "@/features/auth/api";

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

// ── useMe ──

describe("useMe", () => {
  it("calls getMe and returns data on success", async () => {
    const user = { id: 1, name: "Alice" };
    vi.mocked(getMe).mockResolvedValue(user as any);

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMe).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(user);
  });

  it("does not retry on failure (retry: false)", async () => {
    vi.mocked(getMe).mockRejectedValue(new Error("unauthorized"));

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getMe).toHaveBeenCalledTimes(1);
  });
});

// ── useLogin ──

describe("useLogin", () => {
  it("calls loginApi with provided data", async () => {
    vi.mocked(login).mockResolvedValue({ token: "abc" } as any);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ email: "a@b.com", password: "pw" } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(login).toHaveBeenCalledWith({ email: "a@b.com", password: "pw" });
  });
});

// ── useGuestLogin ──

describe("useGuestLogin", () => {
  it("calls guestLoginApi and succeeds", async () => {
    vi.mocked(guestLogin).mockResolvedValue({ token: "guest" } as any);

    const { result } = renderHook(() => useGuestLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ nickname: "guest1" } as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(guestLogin).toHaveBeenCalledWith({ nickname: "guest1" });
  });
});

// ── useCompanySignup ──

describe("useCompanySignup", () => {
  it("calls signupCompanyApi with data and optional profileImage", async () => {
    vi.mocked(signupCompany).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCompanySignup(), {
      wrapper: createWrapper(),
    });

    const data = { companyName: "Acme" } as any;
    const file = new File(["img"], "avatar.png", { type: "image/png" });

    await act(async () => {
      result.current.mutate({ data, profileImage: file });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(signupCompany).toHaveBeenCalledWith(data, file);
  });
});

// ── useEmployeeSignup ──

describe("useEmployeeSignup", () => {
  it("calls registerEmployeeApi with data and optional profileImage", async () => {
    vi.mocked(registerEmployee).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useEmployeeSignup(), {
      wrapper: createWrapper(),
    });

    const data = { name: "Bob" } as any;

    await act(async () => {
      result.current.mutate({ data });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(registerEmployee).toHaveBeenCalledWith(data, undefined);
  });
});

// ── useLogout ──

describe("useLogout", () => {
  it("calls logoutApi and succeeds", async () => {
    vi.mocked(logout).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(logout).toHaveBeenCalledOnce();
  });
});

// ── useValidateInvitation ──

describe("useValidateInvitation", () => {
  it("calls validateInvitationApi when email and code are provided", async () => {
    vi.mocked(validateInvitation).mockResolvedValue({ valid: true } as any);

    const { result } = renderHook(
      () => useValidateInvitation("a@b.com", "ABC123"),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(validateInvitation).toHaveBeenCalledWith("a@b.com", "ABC123");
  });

  it("does not fetch when email or code is empty (enabled: false)", () => {
    const { result } = renderHook(() => useValidateInvitation("", "ABC123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(validateInvitation).not.toHaveBeenCalled();
  });
});

// ── useAllEmployees ──

describe("useAllEmployees", () => {
  it("calls getAllEmployees with pageable", async () => {
    vi.mocked(getAllEmployees).mockResolvedValue({ content: [] } as any);

    const pageable = { page: 0, size: 10 };
    const { result } = renderHook(() => useAllEmployees(pageable), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllEmployees).toHaveBeenCalledWith(pageable);
  });

  it("calls getAllEmployees with empty object when no pageable given", async () => {
    vi.mocked(getAllEmployees).mockResolvedValue({ content: [] } as any);

    const { result } = renderHook(() => useAllEmployees(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getAllEmployees).toHaveBeenCalledWith({});
  });
});

// ── useJobTitles ──

describe("useJobTitles", () => {
  it("calls getJobTitles and returns data", async () => {
    const titles = [{ id: 1, name: "Engineer" }];
    vi.mocked(getJobTitles).mockResolvedValue(titles as any);

    const { result } = renderHook(() => useJobTitles(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(titles);
  });
});

// ── useUpdateProfile ──

describe("useUpdateProfile", () => {
  it("calls updateProfile with data and optional image", async () => {
    vi.mocked(updateProfile).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });

    const data = { nickname: "NewName" } as any;

    await act(async () => {
      result.current.mutate({ data });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateProfile).toHaveBeenCalledWith(data, undefined);
  });
});

// ── useWithdraw ──

describe("useWithdraw", () => {
  it("calls withdraw with data", async () => {
    vi.mocked(withdraw).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useWithdraw(), {
      wrapper: createWrapper(),
    });

    const data = { reason: "bye" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(withdraw).toHaveBeenCalledWith(data);
  });
});

// ── useChangePasswordMutation ──

describe("useChangePasswordMutation", () => {
  it("calls changePassword with data", async () => {
    vi.mocked(changePassword).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useChangePasswordMutation(), {
      wrapper: createWrapper(),
    });

    const data = { oldPassword: "old", newPassword: "new" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(changePassword).toHaveBeenCalledWith(data);
  });
});

// ── useFindPassword ──

describe("useFindPassword", () => {
  it("calls findPasswordApi with data", async () => {
    vi.mocked(findPassword).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useFindPassword(), {
      wrapper: createWrapper(),
    });

    const data = { email: "a@b.com" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(findPassword).toHaveBeenCalledWith(data);
  });
});

// ── useInviteMember ──

describe("useInviteMember", () => {
  it("calls inviteMember with data", async () => {
    vi.mocked(inviteMember).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useInviteMember(), {
      wrapper: createWrapper(),
    });

    const data = { emails: ["a@b.com"] } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(inviteMember).toHaveBeenCalledWith(data);
  });
});

// ── useInviteSingleMember ──

describe("useInviteSingleMember", () => {
  it("calls inviteSingleMember with data", async () => {
    vi.mocked(inviteSingleMember).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useInviteSingleMember(), {
      wrapper: createWrapper(),
    });

    const data = { email: "b@c.com" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(inviteSingleMember).toHaveBeenCalledWith(data);
  });
});

// ── useUpdateCompany ──

describe("useUpdateCompany", () => {
  it("calls updateCompany with data", async () => {
    vi.mocked(updateCompany).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useUpdateCompany(), {
      wrapper: createWrapper(),
    });

    const data = { name: "New Corp" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateCompany).toHaveBeenCalledWith(data);
  });
});

// ── useApproveTeam ──

describe("useApproveTeam", () => {
  it("calls approveTeam with teamId", async () => {
    vi.mocked(approveTeam).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useApproveTeam(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(approveTeam).toHaveBeenCalledWith(42);
  });
});

// ── useRejectTeam ──

describe("useRejectTeam", () => {
  it("calls rejectTeam with teamId and optional data", async () => {
    vi.mocked(rejectTeam).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useRejectTeam(), {
      wrapper: createWrapper(),
    });

    const data = { reason: "Duplicate" } as any;

    await act(async () => {
      result.current.mutate({ teamId: 10, data });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(rejectTeam).toHaveBeenCalledWith(10, data);
  });
});

// ── useAssignLeader ──

describe("useAssignLeader", () => {
  it("calls assignLeader with teamId and userId", async () => {
    vi.mocked(assignLeader).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useAssignLeader(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ teamId: 1, userId: 99 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(assignLeader).toHaveBeenCalledWith(1, 99);
  });
});

// ── useDelegateLeader ──

describe("useDelegateLeader", () => {
  it("calls delegateLeader with teamId and userId", async () => {
    vi.mocked(delegateLeader).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useDelegateLeader(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ teamId: 2, userId: 55 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(delegateLeader).toHaveBeenCalledWith(2, 55);
  });
});

// ── useActivateUser ──

describe("useActivateUser", () => {
  it("calls activateUser with userId", async () => {
    vi.mocked(activateUser).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useActivateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(7);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(activateUser).toHaveBeenCalledWith(7);
  });
});

// ── useDeactivateUser ──

describe("useDeactivateUser", () => {
  it("calls deactivateUser with userId", async () => {
    vi.mocked(deactivateUser).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useDeactivateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(8);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deactivateUser).toHaveBeenCalledWith(8);
  });
});

// ── useCreateTeam ──

describe("useCreateTeam", () => {
  it("calls createTeam with data", async () => {
    vi.mocked(createTeam).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCreateTeam(), {
      wrapper: createWrapper(),
    });

    const data = { name: "Dev Team" } as any;

    await act(async () => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createTeam).toHaveBeenCalledWith(data);
  });
});

// ── Query Key constants ──

describe("AUTH_QUERY_KEY", () => {
  it("equals ['auth', 'me']", () => {
    expect(AUTH_QUERY_KEY).toEqual(["auth", "me"]);
  });
});

describe("AUTH_ADMIN_KEYS", () => {
  it("employees() returns correct key with pageable", () => {
    expect(AUTH_ADMIN_KEYS.employees({ page: 0, size: 20 })).toEqual([
      "auth",
      "employees",
      { page: 0, size: 20 },
    ]);
  });

  it("jobTitles() returns correct key", () => {
    expect(AUTH_ADMIN_KEYS.jobTitles()).toEqual(["auth", "job-titles"]);
  });
});
