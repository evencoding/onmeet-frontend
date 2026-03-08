import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  startRecording,
  stopRecording,
  getRecordingStatus,
  listRecordings,
  getRecordingDownloadUrl,
  deleteRecording,
} from "../api/recording";

export function useRecordingStatus(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.recordingStatus(roomId),
    queryFn: () => getRecordingStatus(roomId, userId),
    enabled: !!roomId && !!userId,
    refetchInterval: 5_000,
  });
}

export function useRecordings(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.recordings(roomId),
    queryFn: () => listRecordings(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}

export function useStartRecording() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      startRecording(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.recordingStatus(vars.roomId) });
    },
  });
}

export function useStopRecording() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      stopRecording(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.recordingStatus(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.recordings(vars.roomId) });
    },
  });
}

export function useRecordingDownloadUrl() {
  return useMutation({
    mutationFn: (args: { recordingId: number; userId: string }) =>
      getRecordingDownloadUrl(args.recordingId, args.userId),
  });
}

export function useDeleteRecording() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { recordingId: number; roomId: number; userId: string }) =>
      deleteRecording(args.recordingId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.recordings(vars.roomId) });
    },
  });
}
