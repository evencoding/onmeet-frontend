import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as loginApi,
  signupCompany as signupCompanyApi,
  registerEmployee as registerEmployeeApi,
  logout as logoutApi,
  getMe,
  validateInvitation as validateInvitationApi,
  guestLogin as guestLoginApi,
  getAllEmployees,
  getJobTitles,
  updateProfile,
  withdraw,
  changePassword,
  inviteMember,
  approveTeam,
  rejectTeam,
  assignLeader,
  delegateLeader,
  activateUser,
  deactivateUser,
  createTeam,
  type LoginRequest,
  type CompanySignupRequest,
  type JoinRequest,
  type GuestLoginRequest,
  type UserResponseDto,
  type Pageable,
  type UserProfileUpdateRequest,
  type WithdrawRequest,
  type ChangePasswordRequest,
  type InvitationRequest,
  type TeamRejectRequest,
  type TeamRequest,
} from "@/features/auth/api";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

export const AUTH_ADMIN_KEYS = {
  employees: (pageable?: Pageable) => ["auth", "employees", pageable] as const,
  jobTitles: () => ["auth", "job-titles"] as const,
};

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

// ── Admin Query Hooks ──

export function useAllEmployees(pageable?: Pageable) {
  return useQuery({
    queryKey: AUTH_ADMIN_KEYS.employees(pageable),
    queryFn: () => getAllEmployees(pageable ?? {}),
    staleTime: 30_000,
  });
}

export function useJobTitles() {
  return useQuery({
    queryKey: AUTH_ADMIN_KEYS.jobTitles(),
    queryFn: getJobTitles,
    staleTime: 60_000,
  });
}

// ── Admin Mutation Hooks ──

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { data: UserProfileUpdateRequest; profileImage?: File }) =>
      updateProfile(args.data, args.profileImage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useWithdraw() {
  return useMutation({
    mutationFn: (data: WithdrawRequest) => withdraw(data),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}

export function useInviteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InvitationRequest) => inviteMember(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_ADMIN_KEYS.employees() });
    },
  });
}

export function useApproveTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (teamId: number) => approveTeam(teamId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useRejectTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { teamId: number; data?: TeamRejectRequest }) =>
      rejectTeam(args.teamId, args.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useAssignLeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { teamId: number; userId: number }) =>
      assignLeader(args.teamId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useDelegateLeader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { teamId: number; userId: number }) =>
      delegateLeader(args.teamId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_ADMIN_KEYS.employees() });
    },
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_ADMIN_KEYS.employees() });
    },
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamRequest) => createTeam(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}
