import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEmployees,
  deactivateUser,
  activateUser,
  resetProfileImage,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle,
  inviteMember,
  approveTeam,
  rejectTeam,
  assignLeader,
  type Pageable,
  type PageResponse,
  type UserResponseDto,
  type JobTitleRequest,
  type JobTitleResponse,
  type InvitationRequest,
  type TeamRejectRequest,
} from "@/lib/authApi";
import { MEMBER_KEYS } from "./useMemberQuery";

// --- Query Keys ---

export const MANAGER_KEYS = {
  employees: (pageable: Pageable) => ["manager", "employees", pageable] as const,
  jobTitles: MEMBER_KEYS.jobTitles,
};

// --- Queries ---

export function useAllEmployees(pageable: Pageable) {
  return useQuery<PageResponse<UserResponseDto>>({
    queryKey: MANAGER_KEYS.employees(pageable),
    queryFn: () => getAllEmployees(pageable),
  });
}

// --- Mutations ---

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "employees"] });
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "employees"] });
    },
  });
}

export function useResetProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => resetProfileImage(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "employees"] });
    },
  });
}

export function useCreateJobTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobTitleRequest) => createJobTitle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGER_KEYS.jobTitles });
    },
  });
}

export function useUpdateJobTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: JobTitleRequest }) =>
      updateJobTitle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGER_KEYS.jobTitles });
    },
  });
}

export function useDeleteJobTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteJobTitle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGER_KEYS.jobTitles });
    },
  });
}

export function useInviteMember() {
  return useMutation({
    mutationFn: (data: InvitationRequest) => inviteMember(data),
  });
}

export function useApproveTeam() {
  return useMutation({
    mutationFn: (teamId: number) => approveTeam(teamId),
  });
}

export function useRejectTeam() {
  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: number;
      data?: TeamRejectRequest;
    }) => rejectTeam(teamId, data),
  });
}

export function useAssignLeader() {
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      assignLeader(teamId, userId),
  });
}
