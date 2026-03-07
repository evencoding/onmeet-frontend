import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  scheduleRoom,
  updateSchedule,
  cancelSchedule,
  sendReminder,
} from "../api/room-schedule";
import type { RoomScheduleRequest } from "../api/types";

export function useScheduleRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string; data: RoomScheduleRequest }) =>
      scheduleRoom(args.userId, args.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.scheduled() });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; scheduledAt: string }) =>
      updateSchedule(args.roomId, args.userId, args.scheduledAt),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.scheduled() });
    },
  });
}

export function useCancelSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      cancelSchedule(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.scheduled() });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useSendReminder() {
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      sendReminder(args.roomId, args.userId),
  });
}
