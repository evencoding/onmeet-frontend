import { roomApi } from "@/shared/api";
import { RoomParticipantResponseSchema } from "@/shared/schemas";
import { z } from "zod";
import type { RoomParticipantResponse } from "./types";

export function listWaitingRoom(roomId: number, userId: string) {
  return roomApi<RoomParticipantResponse[]>(
    `/rooms/${roomId}/waiting`,
    { userId, schema: z.array(RoomParticipantResponseSchema) },
  );
}

export function admitWaiting(roomId: number, targetUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/waiting/${targetUserId}/admit`,
    { userId, method: "POST" },
  );
}

export function rejectWaiting(roomId: number, targetUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/waiting/${targetUserId}/reject`,
    { userId, method: "POST" },
  );
}

export function admitAllWaiting(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/waiting/admit-all`, {
    userId,
    method: "POST",
  });
}
