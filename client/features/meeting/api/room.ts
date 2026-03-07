import { roomFetch } from "../api";
import type {
  MeetingRoomResponse,
  MeetingRoomDetailResponse,
  RoomCreateRequest,
  RoomUpdateRequest,
  RoomJoinRequest,
  RoomJoinResponse,
  RoomLockRequest,
  TagCreateRequest,
  RoomListParams,
  Page,
} from "./types";

function toQueryString(params?: RoomListParams): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  if (params.sort) params.sort.forEach((s) => qs.append("sort", s));
  if (params.status) qs.set("status", params.status);
  if (params.type) qs.set("type", params.type);
  if (params.accessScope) qs.set("accessScope", params.accessScope);
  if (params.hostUserId !== undefined) qs.set("hostUserId", String(params.hostUserId));
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export function listRooms(userId: string, params?: RoomListParams) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms${toQueryString(params)}`,
    userId,
  );
}

export function createRoom(userId: string, data: RoomCreateRequest) {
  return roomFetch<MeetingRoomResponse>("/rooms", userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getRoom(roomId: number, userId: string) {
  return roomFetch<MeetingRoomDetailResponse>(`/rooms/${roomId}`, userId);
}

export function updateRoom(roomId: number, userId: string, data: RoomUpdateRequest) {
  return roomFetch<MeetingRoomResponse>(`/rooms/${roomId}`, userId, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteRoom(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}`, userId, { method: "DELETE" });
}

export function joinRoom(roomId: number, userId: string, data?: RoomJoinRequest) {
  return roomFetch<RoomJoinResponse>(`/rooms/${roomId}/join`, userId, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function leaveRoom(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/leave`, userId, { method: "POST" });
}

export function startRoom(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/start`, userId, { method: "POST" });
}

export function endRoom(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/end`, userId, { method: "POST" });
}

export function lockRoom(roomId: number, userId: string, data?: RoomLockRequest) {
  return roomFetch<void>(`/rooms/${roomId}/lock`, userId, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function unlockRoom(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/unlock`, userId, { method: "POST" });
}

export function regenerateRoomCode(roomId: number, userId: string) {
  return roomFetch<MeetingRoomResponse>(`/rooms/${roomId}/regenerate-code`, userId, {
    method: "POST",
  });
}

export function addTag(roomId: number, userId: string, data: TagCreateRequest) {
  return roomFetch<void>(`/rooms/${roomId}/tags`, userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function removeTag(roomId: number, userId: string, tagName: string) {
  return roomFetch<void>(`/rooms/${roomId}/tags/${encodeURIComponent(tagName)}`, userId, {
    method: "DELETE",
  });
}

export function addFavorite(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/favorite`, userId, { method: "POST" });
}

export function removeFavorite(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/favorite`, userId, { method: "DELETE" });
}
