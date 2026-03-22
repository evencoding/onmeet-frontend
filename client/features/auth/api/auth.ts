import { authFetch, buildFormData } from "./auth-fetch";
import type {
  LoginRequest,
  LoginResponse,
  GuestLoginRequest,
  CompanySignupRequest,
  JoinRequest,
  FindPasswordRequest,
  RefreshRequest,
  TokenResponse,
  InvitationResponse,
  GuestInviteRequestDto,
} from "./types";

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
  return authFetch("/v1/logout", { method: "POST" });
}

export function findPassword(data: FindPasswordRequest): Promise<void> {
  return authFetch("/v1/password/find", {
    method: "POST",
    body: JSON.stringify(data),
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
  return authFetch("/v1/register/company", {
    method: "POST",
    body: buildFormData(data, profileImage),
  });
}

export function registerEmployee(
  data: JoinRequest,
  profileImage?: File,
): Promise<number> {
  return authFetch("/v1/register/join", {
    method: "POST",
    body: buildFormData(data, profileImage),
  });
}

export function validateInvitation(
  email: string,
  code: string,
): Promise<InvitationResponse> {
  const params = new URLSearchParams({ email, code });
  return authFetch(`/v1/invitations/validate?${params}`);
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
