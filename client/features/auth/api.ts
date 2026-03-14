import { pageQs } from "@/shared/utils/api";

const AUTH_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

async function authFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "요청에 실패했습니다",
      status: res.status,
    }));
    throw error;
  }

  const text = await res.text();
  if (!text) return {} as T;

  const json = JSON.parse(text);
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success && json.error) throw json.error;
    return json.data as T;
  }
  return json as T;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tokenType: string;
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

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
}

export interface InvitationResponse {
  email: string;
  companyName: string;
  role: "USER" | "ADMIN" | "MANAGER";
}

export interface CompanyInfoDto {
  id: number;
  name: string;
}

export interface TeamInfoDto {
  id: number;
  name: string;
  color?: string;
}

export interface JobTitleResponse {
  id: number;
  name: string;
  isDefault: boolean;
}

export interface UserResponseDto {
  id: number;
  email: string;
  name: string;
  employeeId?: string;
  roles: string[];
  status: string;
  company?: CompanyInfoDto;
  jobTitle?: JobTitleResponse;
  teams: TeamInfoDto[];
  profileImageId?: number;
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

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageResponse<T = unknown> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return authFetch("/v1/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function guestLogin(data: GuestLoginRequest): Promise<void> {
  return authFetch("/v1/login/guest", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(): Promise<void> {
  return authFetch("/v1/logout", {
    method: "POST",
  });
}

export function refreshToken(data?: RefreshRequest): Promise<TokenResponse> {
  return authFetch("/v1/refresh", {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
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

  return authFetch("/v1/register/company", {
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

  return authFetch("/v1/register/join", {
    method: "POST",
    headers: {},
    body: formData,
  });
}

export function validateInvitation(
  email: string,
  code: string,
): Promise<InvitationResponse> {
  const params = new URLSearchParams({ email, code });
  return authFetch(`/v1/invitations/validate?${params}`);
}

export function getMe(): Promise<UserResponseDto> {
  return authFetch("/v1/member/me");
}

export function updateProfile(
  data: UserProfileUpdateRequest,
  profileImage?: File,
): Promise<UserResponseDto> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return authFetch("/v1/member/me", {
    method: "PATCH",
    headers: {},
    body: formData,
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
  return authFetch("/v1/member/me/profile-image", {
    method: "DELETE",
  });
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

export function delegateLeader(
  teamId: number,
  userId: number,
): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}/delegate/${userId}`, {
    method: "POST",
  });
}

export function dissolveTeam(teamId: number): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}`, {
    method: "DELETE",
  });
}

export function cancelTeamRequest(teamId: number): Promise<void> {
  return authFetch(`/v1/member/teams/${teamId}/cancel`, {
    method: "DELETE",
  });
}

export function getAllEmployees(
  pageable: Pageable,
): Promise<PageResponse<UserResponseDto>> {
  return authFetch(`/v1/manager/employees${pageQs(pageable)}`);
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
  return authFetch(`/v1/manager/job-titles/${id}`, {
    method: "DELETE",
  });
}

export function inviteMember(data: InvitationRequest): Promise<number> {
  return authFetch("/v1/manager/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function approveTeam(teamId: number): Promise<void> {
  return authFetch(`/v1/manager/teams/${teamId}/approve`, {
    method: "POST",
  });
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

export function assignLeader(
  teamId: number,
  userId: number,
): Promise<void> {
  return authFetch(`/v1/manager/teams/${teamId}/leader/${userId}`, {
    method: "POST",
  });
}

export function inviteGuest(data: GuestInviteRequestDto): Promise<void> {
  return authFetch("/v1/guests/invite", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function joinMeetingAsGuest(uuid: string): Promise<void> {
  return authFetch(`/v1/guests/join/${uuid}`);
}
