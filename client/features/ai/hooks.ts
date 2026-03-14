import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMinutes,
  regenerateMinutes,
  updateMinutes,
  getTranscript,
  type UpdateMinutesRequest,
} from "./api";

export const aiKeys = {
  minutes: (roomId: number) => ["ai", "minutes", roomId] as const,
  transcript: (roomId: number) => ["ai", "transcript", roomId] as const,
};

export function useMinutes(roomId: number, userId: string) {
  return useQuery({
    queryKey: aiKeys.minutes(roomId),
    queryFn: () => getMinutes(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}

export function useTranscript(roomId: number, userId: string) {
  return useQuery({
    queryKey: aiKeys.transcript(roomId),
    queryFn: () => getTranscript(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}

export function useRegenerateMinutes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      regenerateMinutes(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: aiKeys.minutes(vars.roomId) });
    },
  });
}

export function useUpdateMinutes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      roomId: number;
      userId: string;
      data: UpdateMinutesRequest;
    }) => updateMinutes(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: aiKeys.minutes(vars.roomId) });
    },
  });
}
