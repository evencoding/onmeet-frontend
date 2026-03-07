import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  listParticipants,
  listParticipantHistory,
  muteParticipant,
  unmuteParticipant,
  kickParticipant,
  updateParticipantRole,
  muteAll,
  unmuteAll,
  disableVideoAll,
} from "../api/participant";
import type { ParticipantRoleUpdateRequest, Pageable } from "../api/types";

export function useParticipants(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.participants(roomId),
    queryFn: () => listParticipants(roomId, userId),
    enabled: !!roomId && !!userId,
    refetchInterval: 10_000,
  });
}

export function useParticipantHistory(roomId: number, userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: roomKeys.participantHistory(roomId),
    queryFn: () => listParticipantHistory(roomId, userId, pageable),
    enabled: !!roomId && !!userId,
  });
}

export function useMuteParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; targetUserId: number; userId: string }) =>
      muteParticipant(args.roomId, args.targetUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useUnmuteParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; targetUserId: number; userId: string }) =>
      unmuteParticipant(args.roomId, args.targetUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useKickParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; targetUserId: number; userId: string }) =>
      kickParticipant(args.roomId, args.targetUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useUpdateParticipantRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      roomId: number;
      targetUserId: number;
      userId: string;
      data: ParticipantRoleUpdateRequest;
    }) => updateParticipantRole(args.roomId, args.targetUserId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useMuteAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      muteAll(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useUnmuteAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      unmuteAll(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useDisableVideoAll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      disableVideoAll(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}
