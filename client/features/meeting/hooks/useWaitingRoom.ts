import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  listWaitingRoom,
  admitWaiting,
  rejectWaiting,
  admitAllWaiting,
} from "../api/waiting-room";

export function useWaitingRoom(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.waiting(roomId),
    queryFn: () => listWaitingRoom(roomId, userId),
    enabled: !!roomId && !!userId,
    refetchInterval: 5_000,
  });
}

export function useAdmitWaiting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; targetUserId: number; userId: string }) =>
      admitWaiting(args.roomId, args.targetUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.waiting(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useRejectWaiting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; targetUserId: number; userId: string }) =>
      rejectWaiting(args.roomId, args.targetUserId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.waiting(vars.roomId) });
    },
  });
}

export function useAdmitAllWaiting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      admitAllWaiting(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.waiting(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}
