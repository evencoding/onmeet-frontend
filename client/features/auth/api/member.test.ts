import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuthFetch = vi.fn().mockResolvedValue({});
const mockBuildFormData = vi.fn().mockReturnValue(new FormData());

vi.mock("./auth-fetch", () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
  buildFormData: (...args: unknown[]) => mockBuildFormData(...args),
}));

import {
  getMe,
  updateProfile,
  withdraw,
  changePassword,
  deleteMyProfileImage,
  getMemberInfo,
  getJobTitles,
  createTeam,
  delegateLeader,
  dissolveTeam,
  cancelTeamRequest,
} from "./member";

beforeEach(() => {
  mockAuthFetch.mockClear();
  mockBuildFormData.mockClear();
});

describe("member API", () => {
  it("getMe", async () => {
    await getMe();
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/me");
  });

  it("updateProfile uses buildFormData", async () => {
    const data = { name: "New" };
    const file = new File([""], "avatar.png");
    await updateProfile(data as any, file);
    expect(mockBuildFormData).toHaveBeenCalledWith(data, file);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/me", {
      method: "PATCH",
      body: expect.any(FormData),
    });
  });

  it("withdraw", async () => {
    const data = { password: "pw" };
    await withdraw(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/me", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  });

  it("changePassword", async () => {
    const data = { oldPassword: "old", newPassword: "new" };
    await changePassword(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/me/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("deleteMyProfileImage", async () => {
    await deleteMyProfileImage();
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/me/profile-image", { method: "DELETE" });
  });

  it("getMemberInfo", async () => {
    await getMemberInfo(42);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/42");
  });

  it("getJobTitles", async () => {
    await getJobTitles();
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/job-titles");
  });

  it("createTeam", async () => {
    const data = { name: "Dev" };
    await createTeam(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/teams", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("delegateLeader", async () => {
    await delegateLeader(1, 5);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/teams/1/delegate/5", { method: "POST" });
  });

  it("dissolveTeam", async () => {
    await dissolveTeam(1);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/teams/1", { method: "DELETE" });
  });

  it("cancelTeamRequest", async () => {
    await cancelTeamRequest(1);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/member/teams/1/cancel", { method: "DELETE" });
  });
});
