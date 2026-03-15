export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceToken?: string;
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
  status?: string;
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
  isPasswordReset: boolean;
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
  emails: string[];
}

export interface FindPasswordRequest {
  email: string;
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

export type { Pageable, PageResponse } from "@/shared/utils/api";
