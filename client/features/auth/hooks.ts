import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as loginApi,
  signupCompany as signupCompanyApi,
  registerEmployee as registerEmployeeApi,
  logout as logoutApi,
  getMe,
  validateInvitation as validateInvitationApi,
  guestLogin as guestLoginApi,
  type LoginRequest,
  type CompanySignupRequest,
  type JoinRequest,
  type GuestLoginRequest,
  type UserResponseDto,
} from "@/features/auth/api";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useMe() {
  return useQuery<UserResponseDto>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useGuestLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GuestLoginRequest) => guestLoginApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useCompanySignup() {
  return useMutation({
    mutationFn: ({
      data,
      profileImage,
    }: {
      data: CompanySignupRequest;
      profileImage?: File;
    }) => signupCompanyApi(data, profileImage),
  });
}

export function useEmployeeSignup() {
  return useMutation({
    mutationFn: ({
      data,
      profileImage,
    }: {
      data: JoinRequest;
      profileImage?: File;
    }) => registerEmployeeApi(data, profileImage),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useValidateInvitation(email: string, code: string) {
  return useQuery({
    queryKey: ["invitation", email, code],
    queryFn: () => validateInvitationApi(email, code),
    enabled: !!email && !!code,
    retry: false,
  });
}
