import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuthFetch = vi.fn().mockResolvedValue({});
const mockBuildFormData = vi.fn().mockReturnValue(new FormData());

vi.mock("./auth-fetch", () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
  buildFormData: (...args: unknown[]) => mockBuildFormData(...args),
}));

import {
  login,
  guestLogin,
  logout,
  findPassword,
  refreshToken,
  signupCompany,
  registerEmployee,
  validateInvitation,
  inviteGuest,
  joinMeetingAsGuest,
} from "./auth";

beforeEach(() => {
  mockAuthFetch.mockClear();
  mockBuildFormData.mockClear();
});

describe("auth API", () => {
  it("login posts credentials", async () => {
    const data = { email: "a@b.com", password: "pw" };
    await login(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("guestLogin posts guest data", async () => {
    const data = { uuid: "abc" };
    await guestLogin(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/login/guest", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("logout posts", async () => {
    await logout();
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/logout", { method: "POST" });
  });

  it("findPassword posts email", async () => {
    const data = { email: "a@b.com" };
    await findPassword(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/password/find", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("refreshToken posts with optional body", async () => {
    await refreshToken();
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/refresh", {
      method: "POST",
      body: undefined,
    });

    mockAuthFetch.mockClear();
    const data = { refreshToken: "tok" };
    await refreshToken(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("signupCompany uses buildFormData", async () => {
    const data = { name: "Acme" };
    const file = new File([""], "logo.png");
    await signupCompany(data as any, file);
    expect(mockBuildFormData).toHaveBeenCalledWith(data, file);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/register/company", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("registerEmployee uses buildFormData", async () => {
    const data = { invitationCode: "XYZ" };
    await registerEmployee(data as any);
    expect(mockBuildFormData).toHaveBeenCalledWith(data, undefined);
  });

  it("validateInvitation encodes params", async () => {
    await validateInvitation("a@b.com", "CODE");
    const url = mockAuthFetch.mock.calls[0][0] as string;
    expect(url).toContain("/v1/invitations/validate");
    expect(url).toContain("email=");
    expect(url).toContain("code=CODE");
  });

  it("inviteGuest posts", async () => {
    const data = { roomId: 1, email: "g@b.com" };
    await inviteGuest(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/guests/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("joinMeetingAsGuest fetches with uuid", async () => {
    await joinMeetingAsGuest("uuid-123");
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/guests/join/uuid-123");
  });
});
