import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  startScreenShare,
  stopScreenShare,
  forceStopScreenShare,
  listActiveScreenShares,
} from "../api/screen-share";

export function useActiveScreenShares(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.activeScreenShares(roomId),
    queryFn: () => listActiveScreenShares(roomId, userId),
    enabled: !!roomId && !!userId,
    refetchInterval: 10_000,
  });
}

export function useStartScreenShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      startScreenShare(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.activeScreenShares(vars.roomId) });
    },
  });
}

export function useStopScreenShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      stopScreenShare(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.activeScreenShares(vars.roomId) });
    },
  });
}

export function useForceStopScreenShare() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; targetUserId: number }) =>
      forceStopScreenShare(args.roomId, args.userId, args.targetUserId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.activeScreenShares(vars.roomId) });
    },
  });
}
