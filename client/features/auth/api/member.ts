import { authFetch, buildFormData } from "./auth-fetch";
import type {
  UserResponseDto,
  UserProfileUpdateRequest,
  ChangePasswordRequest,
  WithdrawRequest,
  TeamRequest,
  JobTitleResponse,
} from "./types";
import { validateResponse } from "@/shared/lib/schemas";
import { UserResponseSchema } from "@/shared/lib/schemas";

export async function getMe(): Promise<UserResponseDto> {
  const data = await authFetch<UserResponseDto>("/v1/member/me");
  return validateResponse(UserResponseSchema, data, "getMe");
}

export function updateProfile(
  data: UserProfileUpdateRequest,
  profileImage?: File,
): Promise<UserResponseDto> {
  return authFetch("/v1/member/me", {
    method: "PATCH",
    body: buildFormData(data, profileImage),
  });
}

export function withdraw(data: WithdrawRequest): Promise<void> {
  return authFetch("/v1/member/me", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}

export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return authFetch("/v1/member/me/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMyProfileImage(): Promise<UserResponseDto> {
  return authFetch("/v1/member/me/profile-image", { method: "DELETE" });
}

export function getMemberInfo(memberId: number): Promise<UserResponseDto> {
  return authFetch(`/v1/member/${memberId}`);
}

export function getJobTitles(): Promise<JobTitleResponse[]> {
  return authFetch("/v1/member/job-titles");
}

export function createTeam(data: TeamRequest): Promise<number> {
  return authFetch("/v1/member/teams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function delegateLeader(teamId: number, userId: number): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}/delegate/${userId}`, {
    method: "POST",
  });
}

export function dissolveTeam(teamId: number): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}`, { method: "DELETE" });
}

export function cancelTeamRequest(teamId: number): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}/cancel`, { method: "DELETE" });
}
