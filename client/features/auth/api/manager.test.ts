import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuthFetch = vi.fn().mockResolvedValue({});

vi.mock("./auth-fetch", () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import {
  getAllEmployees,
  deactivateUser,
  activateUser,
  resetProfileImage,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle,
  inviteMember,
  inviteSingleMember,
  updateCompany,
  approveTeam,
  rejectTeam,
  assignLeader,
} from "./manager";

beforeEach(() => {
  mockAuthFetch.mockClear();
});

describe("manager API", () => {
  it("getAllEmployees with pagination", async () => {
    await getAllEmployees({ page: 0, size: 10 });
    const url = mockAuthFetch.mock.calls[0][0] as string;
    expect(url).toContain("/v1/manager/employees");
    expect(url).toContain("page=0");
    expect(url).toContain("size=10");
  });

  it("deactivateUser", async () => {
    await deactivateUser(5);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/employees/5/deactivate", { method: "PUT" });
  });

  it("activateUser", async () => {
    await activateUser(5);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/employees/5/activate", { method: "PUT" });
  });

  it("resetProfileImage", async () => {
    await resetProfileImage(5);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/employees/5/profile-image", { method: "DELETE" });
  });

  it("createJobTitle", async () => {
    const data = { name: "Engineer" };
    await createJobTitle(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/job-titles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("updateJobTitle", async () => {
    const data = { name: "Senior" };
    await updateJobTitle(3, data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/job-titles/3", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("deleteJobTitle", async () => {
    await deleteJobTitle(3);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/job-titles/3", { method: "DELETE" });
  });

  it("inviteMember", async () => {
    const data = { emails: ["a@b.com"] };
    await inviteMember(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("inviteSingleMember", async () => {
    const data = { email: "a@b.com" };
    await inviteSingleMember(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/invite/single", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("updateCompany", async () => {
    const data = { name: "Acme Inc" };
    await updateCompany(data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/company", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });

  it("approveTeam", async () => {
    await approveTeam(7);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/teams/7/approve", { method: "POST" });
  });

  it("rejectTeam with optional body", async () => {
    await rejectTeam(7);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/teams/7/reject", {
      method: "POST",
      body: undefined,
    });

    mockAuthFetch.mockClear();
    const data = { reason: "Not needed" };
    await rejectTeam(7, data as any);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/teams/7/reject", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("assignLeader", async () => {
    await assignLeader(7, 3);
    expect(mockAuthFetch).toHaveBeenCalledWith("/v1/manager/teams/7/leader/3", { method: "POST" });
  });
});
