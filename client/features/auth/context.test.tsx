import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./context";
import type { UserResponseDto } from "./api";

// ── Mock auth hooks ──

const mockUseMe = vi.fn();
const mockUseLogin = vi.fn();
const mockUseLogout = vi.fn();

vi.mock("@/features/auth/hooks", () => ({
  AUTH_QUERY_KEY: ["auth", "me"],
  useMe: () => mockUseMe(),
  useLogin: () => mockUseLogin(),
  useLogout: () => mockUseLogout(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

const baseUser: UserResponseDto = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  roles: ["USER"],
  status: "ACTIVE",
  teams: [],
  isPasswordReset: false,
};

beforeEach(() => {
  mockUseLogin.mockReturnValue({ mutateAsync: vi.fn() });
  mockUseLogout.mockReturnValue({ mutateAsync: vi.fn() });
});

// ── Tests ──

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider",
    );
  });

  it("returns isAuthenticated=false when no user", () => {
    mockUseMe.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("returns isAuthenticated=true when user exists", () => {
    mockUseMe.mockReturnValue({ data: baseUser, isLoading: false });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(baseUser);
  });

  it("derives isManager=true for MANAGER role", () => {
    mockUseMe.mockReturnValue({
      data: { ...baseUser, roles: ["MANAGER"] },
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isManager).toBe(true);
  });

  it("derives isManager=true for ADMIN role", () => {
    mockUseMe.mockReturnValue({
      data: { ...baseUser, roles: ["ADMIN"] },
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isManager).toBe(true);
  });

  it("derives isManager=false for USER role", () => {
    mockUseMe.mockReturnValue({
      data: { ...baseUser, roles: ["USER"] },
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isManager).toBe(false);
  });

  it("derives isPasswordReset from user", () => {
    mockUseMe.mockReturnValue({
      data: { ...baseUser, isPasswordReset: true },
      isLoading: false,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPasswordReset).toBe(true);
  });
});
