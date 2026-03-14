import { roomFetch } from "../api";
import { pageQs } from "@/shared/utils/api";
import type {
  RoomParticipantResponse,
  ParticipantRoleUpdateRequest,
  Page,
  Pageable,
} from "./types";

export function listParticipants(roomId: number, userId: string) {
  return roomFetch<RoomParticipantResponse[]>(
    `/rooms/${roomId}/participants`,
    userId,
  );
}

export function listParticipantHistory(roomId: number, userId: string, pageable?: Pageable) {
  return roomFetch<Page<RoomParticipantResponse>>(
    `/rooms/${roomId}/participants/history${pageQs(pageable)}`,
    userId,
  );
}

export function muteParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/participants/${targetUserId}/mute`,
    userId,
    { method: "POST" },
  );
}

export function unmuteParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/participants/${targetUserId}/unmute`,
    userId,
    { method: "POST" },
  );
}

export function kickParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/participants/${targetUserId}/kick`,
    userId,
    { method: "POST" },
  );
}

export function updateParticipantRole(
  roomId: number,
  targetUserId: number,
  userId: string,
  data: ParticipantRoleUpdateRequest,
) {
  return roomFetch<void>(
    `/rooms/${roomId}/participants/${targetUserId}/role`,
    userId,
    { method: "PATCH", body: JSON.stringify(data) },
  );
}

export function muteAll(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/mute-all`, userId, { method: "POST" });
}

export function unmuteAll(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/unmute-all`, userId, { method: "POST" });
}

export function disableVideoAll(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/disable-video-all`, userId, {
    method: "POST",
  });
}
