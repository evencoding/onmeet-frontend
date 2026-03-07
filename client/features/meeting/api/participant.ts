import { roomFetch } from "../api";
import type {
  RoomParticipantResponse,
  ParticipantRoleUpdateRequest,
  Page,
  Pageable,
} from "./types";

function pageQs(pageable?: Pageable): string {
  if (!pageable) return "";
  const qs = new URLSearchParams();
  if (pageable.page !== undefined) qs.set("page", String(pageable.page));
  if (pageable.size !== undefined) qs.set("size", String(pageable.size));
  if (pageable.sort) pageable.sort.forEach((s) => qs.append("sort", s));
  const str = qs.toString();
  return str ? `?${str}` : "";
}

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
