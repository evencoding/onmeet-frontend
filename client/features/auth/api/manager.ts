import { pageQs } from "@/shared/utils/api";
import { authFetch } from "./auth-fetch";
import type {
  Pageable,
  PageResponse,
  UserResponseDto,
  JobTitleRequest,
  JobTitleResponse,
  InvitationRequest,
  TeamRejectRequest,
  SingleInvitationRequest,
  UpdateCompanyRequest,
  CompanyResponse,
} from "./types";

export function getAllEmployees(
  pageable: Pageable,
): Promise<PageResponse<UserResponseDto>> {
  return authFetch(`/v1/members/invitable${pageQs(pageable)}`);
}

export function deactivateUser(userId: number): Promise<UserResponseDto> {
  return authFetch(`/v1/manager/employees/${userId}/deactivate`, {
    method: "PUT",
  });
}

export function activateUser(userId: number): Promise<UserResponseDto> {
  return authFetch(`/v1/manager/employees/${userId}/activate`, {
    method: "PUT",
  });
}

export function resetProfileImage(userId: number): Promise<void> {
  return authFetch(`/v1/manager/employees/${userId}/profile-image`, {
    method: "DELETE",
  });
}

export function createJobTitle(data: JobTitleRequest): Promise<JobTitleResponse> {
  return authFetch("/v1/manager/job-titles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateJobTitle(
  id: number,
  data: JobTitleRequest,
): Promise<JobTitleResponse> {
  return authFetch(`/v1/manager/job-titles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteJobTitle(id: number): Promise<void> {
  return authFetch(`/v1/manager/job-titles/${id}`, { method: "DELETE" });
}

export function inviteMember(data: InvitationRequest): Promise<number[]> {
  return authFetch("/v1/manager/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function inviteSingleMember(data: SingleInvitationRequest): Promise<number> {
  return authFetch("/v1/manager/invite/single", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCompany(data: UpdateCompanyRequest): Promise<CompanyResponse> {
  return authFetch("/v1/manager/company", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function approveTeam(teamId: number): Promise<void> {
  return authFetch(`/v1/manager/teams/${teamId}/approve`, { method: "POST" });
}

export function rejectTeam(
  teamId: number,
  data?: TeamRejectRequest,
): Promise<void> {
  return authFetch(`/v1/manager/teams/${teamId}/reject`, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function assignLeader(teamId: number, userId: number): Promise<void> {
  return authFetch(`/v1/manager/teams/${teamId}/leader/${userId}`, {
    method: "POST",
  });
}
