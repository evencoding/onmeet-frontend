import { roomFetch } from "../api";
import type {
  MeetingRoomResponse,
  MeetingRoomDetailResponse,
  RoomStatsResponse,
  MonthlyStatsResponse,
  TimelineEntry,
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

export function getRoomByCode(roomCode: string, userId: string) {
  return roomFetch<MeetingRoomDetailResponse>(
    `/rooms/code/${encodeURIComponent(roomCode)}`,
    userId,
  );
}

export function searchRoomsByTag(tagName: string, userId: string, pageable?: Pageable) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/tags/${encodeURIComponent(tagName)}${pageQs(pageable)}`,
    userId,
  );
}

export function listScheduledRooms(userId: string, pageable?: Pageable) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/scheduled${pageQs(pageable)}`,
    userId,
  );
}

export function listRoomHistory(userId: string, pageable?: Pageable) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/history${pageQs(pageable)}`,
    userId,
  );
}

export function getMonthlyStats(userId: string) {
  return roomFetch<MonthlyStatsResponse[]>("/rooms/history/monthly", userId);
}

export function listFavoriteRooms(userId: string, pageable?: Pageable) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/favorites${pageQs(pageable)}`,
    userId,
  );
}

export function getRoomStats(roomId: number, userId: string) {
  return roomFetch<RoomStatsResponse>(`/rooms/${roomId}/stats`, userId);
}

export function getRoomTimeline(roomId: number, userId: string) {
  return roomFetch<TimelineEntry[]>(`/rooms/${roomId}/timeline`, userId);
}
