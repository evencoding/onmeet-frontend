import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  inviteToRoom,
  bulkInviteToRoom,
  cancelInvitation,
  listInvitations,
  acceptInvitation,
  declineInvitation,
} from "../api/invitation";
import type { InviteRequest, BulkInviteRequest } from "../api/types";

export function useInvitations(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.invitations(roomId),
    queryFn: () => listInvitations(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}

export function useInviteToRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data: InviteRequest }) =>
      inviteToRoom(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.invitations(vars.roomId) });
    },
  });
}

export function useBulkInviteToRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data: BulkInviteRequest }) =>
      bulkInviteToRoom(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.invitations(vars.roomId) });
    },
  });
}

export function useCancelInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; inviteeUserId: number; userId: string }) =>
      cancelInvitation(args.roomId, args.inviteeUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.invitations(vars.roomId) });
    },
  });
}

export function useAcceptInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { invitationId: number; userId: string }) =>
      acceptInvitation(args.invitationId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useDeclineInvitation() {
  return useMutation({
    mutationFn: (args: { invitationId: number; userId: string }) =>
      declineInvitation(args.invitationId, args.userId),
  });
}
