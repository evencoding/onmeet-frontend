import { roomFetch } from "../api";
import type { Page } from "@/shared/utils/api";
import type {
  MeetingRoomResponse,
  RoomStatsResponse,
  MonthlyStatsResponse,
  TimelineEntry,
} from "./types";

export function getRoomByCode(roomCode: string, userId: string) {
  return roomFetch<MeetingRoomResponse>(
    `/rooms/code/${encodeURIComponent(roomCode)}`,
    userId,
  );
}

export function searchRoomsByTag(tagName: string, userId: string) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/tags/${encodeURIComponent(tagName)}`,
    userId,
  );
}

export function listScheduledRooms(userId: string) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/scheduled`,
    userId,
  );
}

export function listRoomHistory(userId: string) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/history`,
    userId,
  );
}

export function getMonthlyStats(userId: string) {
  return roomFetch<MonthlyStatsResponse[]>("/rooms/history/monthly", userId);
}

export function listFavoriteRooms(userId: string) {
  return roomFetch<Page<MeetingRoomResponse>>(
    `/rooms/favorites`,
    userId,
  );
}

export function getRoomStats(roomId: number, userId: string) {
  return roomFetch<RoomStatsResponse>(`/rooms/${roomId}/stats`, userId);
}

export function getRoomTimeline(roomId: number, userId: string) {
  return roomFetch<TimelineEntry[]>(`/rooms/${roomId}/timeline`, userId);
}
