import { roomFetch } from "../api";
import type { RoomParticipantResponse } from "./types";

export function listWaitingRoom(roomId: number, userId: string) {
  return roomFetch<RoomParticipantResponse[]>(
    `/rooms/${roomId}/waiting`,
    userId,
  );
}

export function admitWaiting(roomId: number, targetUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/waiting/${targetUserId}/admit`,
    userId,
    { method: "POST" },
  );
}

export function rejectWaiting(roomId: number, targetUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/waiting/${targetUserId}/reject`,
    userId,
    { method: "POST" },
  );
}

export function admitAllWaiting(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/waiting/admit-all`, userId, {
    method: "POST",
  });
}
