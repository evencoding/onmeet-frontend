import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  type UserProfileUpdateRequest,
  type WithdrawRequest,
  type ChangePasswordRequest,
  type TeamRequest,
  type UserResponseDto,
  type JobTitleResponse,
} from "@/lib/authApi";
import { AUTH_QUERY_KEY } from "./useAuthQuery";

export const MEMBER_KEYS = {
  me: AUTH_QUERY_KEY,
  member: (id: number) => ["member", id] as const,
  jobTitles: ["member", "job-titles"] as const,
};

export function useMember(memberId: number) {
  return useQuery<UserResponseDto>({
    queryKey: MEMBER_KEYS.member(memberId),
    queryFn: () => getMemberInfo(memberId),
    enabled: !!memberId,
  });
}

export function useJobTitles() {
  return useQuery<JobTitleResponse>({
    queryKey: MEMBER_KEYS.jobTitles,
    queryFn: getJobTitles,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      profileImage,
    }: {
      data: UserProfileUpdateRequest;
      profileImage?: File;
    }) => updateProfile(data, profileImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => withdraw(data),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useDeleteMyProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useCreateTeam() {
  return useMutation({
    mutationFn: (data: TeamRequest) => createTeam(data),
  });
}

export function useDelegateLeader() {
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      delegateLeader(teamId, userId),
  });
}

export function useDissolveTeam() {
  return useMutation({
    mutationFn: (teamId: number) => dissolveTeam(teamId),
  });
}

export function useCancelTeamRequest() {
  return useMutation({
    mutationFn: (teamId: number) => cancelTeamRequest(teamId),
  });
}
