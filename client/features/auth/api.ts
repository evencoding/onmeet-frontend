import { authApi } from "@/shared/api";
import {
  UserResponseSchema,
  LoginResponseSchema,
  TokenResponseSchema,
  InvitationValidationResponseSchema,
  JobTitleResponseSchema,
} from "@/shared/schemas";
import { pageableToParams } from "@/shared/types";

// ── Re-export shared types for backward compatibility ──
export type { UserResponseDto } from "@/shared/schemas/auth.schema";
export type { Pageable, PageResponse } from "@/shared/types/pagination";

// ── Request Types (feature-local, not validated) ──

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GuestLoginRequest {
  name: string;
  meetingId?: string;
}

export interface CompanySignupRequest {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

export interface JoinRequest {
  email: string;
  code: string;
  password: string;
  name: string;
  employeeId?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfileUpdateRequest {
  name?: string;
  employeeId?: string;
  jobTitleId?: number;
}

export interface WithdrawRequest {
  password: string;
  reason?: string;
}

export interface TeamRequest {
  name: string;
  description?: string;
  color?: string;
  memberIds?: number[];
  leaderId?: number;
}

export interface JobTitleRequest {
  name: string;
  isDefault: boolean;
}

export interface InvitationRequest {
  email: string;
  role: "USER" | "ADMIN" | "MANAGER";
}

export interface TeamRejectRequest {
  reason?: string;
}

export interface GuestInviteRequestDto {
  guestEmail: string;
  roomId: string;
  roomName: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ── Backward-compat re-exports for inline types that were exported before ──

export type { LoginResponseDto as LoginResponse } from "@/shared/schemas/auth.schema";
export type { TokenResponseDto as TokenResponse } from "@/shared/schemas/auth.schema";
export type {
  InvitationValidationResponseDto as InvitationResponse,
} from "@/shared/schemas/auth.schema";
export type { CompanyInfoDto } from "@/shared/schemas/auth.schema";
export type { TeamInfoDto } from "@/shared/schemas/auth.schema";
export type { JobTitleResponseDto as JobTitleResponse } from "@/shared/schemas/auth.schema";

// ── API Functions ──

import type { LoginResponseDto, TokenResponseDto, InvitationValidationResponseDto, UserResponseDto, JobTitleResponseDto } from "@/shared/schemas/auth.schema";
import type { Pageable, PageResponse } from "@/shared/types/pagination";

export function login(data: LoginRequest) {
  return authApi<LoginResponseDto>("/v1/login", {
    method: "POST",
    body: JSON.stringify(data),
    schema: LoginResponseSchema,
  });
}

export function guestLogin(data: GuestLoginRequest): Promise<void> {
  return authApi("/v1/login/guest", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(): Promise<void> {
  return authApi("/v1/logout", {
    method: "POST",
  });
}

export function refreshToken(data?: RefreshRequest) {
  return authApi<TokenResponseDto>("/v1/refresh", {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    schema: TokenResponseSchema,
  });
}

export function signupCompany(
  data: CompanySignupRequest,
  profileImage?: File,
): Promise<number> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return authApi("/v1/register/company", {
    method: "POST",
    headers: {},
    body: formData,
  });
}

export function registerEmployee(
  data: JoinRequest,
  profileImage?: File,
): Promise<number> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return authApi("/v1/register/join", {
    method: "POST",
    headers: {},
    body: formData,
  });
}

export function validateInvitation(email: string, code: string) {
  const params = new URLSearchParams({ email, code });
  return authApi<InvitationValidationResponseDto>(`/v1/invitations/validate?${params}`, {
    schema: InvitationValidationResponseSchema,
  });
}

export function getMe() {
  return authApi<UserResponseDto>("/v1/member/me", {
    schema: UserResponseSchema,
  });
}

export function updateProfile(
  data: UserProfileUpdateRequest,
  profileImage?: File,
) {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return authApi<UserResponseDto>("/v1/member/me", {
    method: "PATCH",
    headers: {},
    body: formData,
  });
}

export function withdraw(data: WithdrawRequest): Promise<void> {
  return authApi("/v1/member/me", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}

export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return authApi("/v1/member/me/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteMyProfileImage() {
  return authApi<UserResponseDto>("/v1/member/me/profile-image", {
    method: "DELETE",
  });
}

export function getMemberInfo(memberId: number) {
  return authApi<UserResponseDto>(`/v1/member/${memberId}`, {
    schema: UserResponseSchema,
  });
}

export function getJobTitles() {
  return authApi<JobTitleResponseDto[]>("/v1/member/job-titles");
}

export function createTeam(data: TeamRequest): Promise<number> {
  return authApi("/v1/member/teams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function delegateLeader(
  teamId: number,
  userId: number,
): Promise<void> {
  return authApi(`/v1/member/teams/${teamId}/delegate/${userId}`, {
    method: "POST",
  });
}

export function dissolveTeam(teamId: number): Promise<void> {
  return authApi(`/v1/member/teams/${teamId}`, {
    method: "DELETE",
  });
}

export function cancelTeamRequest(teamId: number): Promise<void> {
  return authApi(`/v1/member/teams/${teamId}/cancel`, {
    method: "DELETE",
  });
}

export function getAllEmployees(pageable: Pageable) {
  return authApi<PageResponse<UserResponseDto>>(
    `/v1/manager/employees${pageableToParams(pageable)}`,
  );
}

export function deactivateUser(userId: number) {
  return authApi<UserResponseDto>(`/v1/manager/employees/${userId}/deactivate`, {
    method: "PUT",
  });
}

export function activateUser(userId: number) {
  return authApi<UserResponseDto>(`/v1/manager/employees/${userId}/activate`, {
    method: "PUT",
  });
}

export function resetProfileImage(userId: number): Promise<void> {
  return authApi(`/v1/manager/employees/${userId}/profile-image`, {
    method: "DELETE",
  });
}

export function createJobTitle(data: JobTitleRequest) {
  return authApi<JobTitleResponseDto>("/v1/manager/job-titles", {
    method: "POST",
    body: JSON.stringify(data),
    schema: JobTitleResponseSchema,
  });
}

export function updateJobTitle(id: number, data: JobTitleRequest) {
  return authApi<JobTitleResponseDto>(`/v1/manager/job-titles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    schema: JobTitleResponseSchema,
  });
}

export function deleteJobTitle(id: number): Promise<void> {
  return authApi(`/v1/manager/job-titles/${id}`, {
    method: "DELETE",
  });
}

export function inviteMember(data: InvitationRequest): Promise<number> {
  return authApi("/v1/manager/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function approveTeam(teamId: number): Promise<void> {
  return authApi(`/v1/manager/teams/${teamId}/approve`, {
    method: "POST",
  });
}

export function rejectTeam(
  teamId: number,
  data?: TeamRejectRequest,
): Promise<void> {
  return authApi(`/v1/manager/teams/${teamId}/reject`, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function assignLeader(
  teamId: number,
  userId: number,
): Promise<void> {
  return authApi(`/v1/manager/teams/${teamId}/leader/${userId}`, {
    method: "POST",
  });
}

export function inviteGuest(data: GuestInviteRequestDto): Promise<void> {
  return authApi("/v1/guests/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function joinMeetingAsGuest(uuid: string): Promise<void> {
  return authApi(`/v1/guests/join/${uuid}`);
}
