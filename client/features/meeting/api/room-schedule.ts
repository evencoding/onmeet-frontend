import { roomApi } from "@/shared/api";
import { MeetingRoomResponseSchema } from "@/shared/schemas";
import type { MeetingRoomResponse, RoomScheduleRequest } from "./types";

export function scheduleRoom(userId: string, data: RoomScheduleRequest) {
  return roomApi<MeetingRoomResponse>("/rooms/schedule", {
    userId,
    method: "POST",
    body: JSON.stringify(data),
    schema: MeetingRoomResponseSchema,
  });
}

export function updateSchedule(roomId: number, userId: string, scheduledAt: string) {
  const qs = new URLSearchParams({ scheduledAt });
  return roomApi<void>(`/rooms/${roomId}/schedule?${qs}`, {
    userId,
    method: "PATCH",
  });
}

export function cancelSchedule(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/schedule`, {
    userId,
    method: "DELETE",
  });
}

export function sendReminder(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/schedule/remind`, {
    userId,
    method: "POST",
  });
}
