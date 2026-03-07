import { roomApi } from "@/shared/api";
import {
  MeetingRoomResponseSchema,
  MeetingRoomDetailResponseSchema,
  RoomStatsResponseSchema,
  MonthlyStatsResponseSchema,
  TimelineEntrySchema,
} from "@/shared/schemas";
import { pageSchema } from "@/shared/schemas/pagination.schema";
import { pageableToParams } from "@/shared/types";
import type {
  MeetingRoomResponse,
  MeetingRoomDetailResponse,
  RoomStatsResponse,
  MonthlyStatsResponse,
  TimelineEntry,
  Page,
  Pageable,
} from "./types";
import { z } from "zod";

const PageMeetingRoomSchema = pageSchema(MeetingRoomResponseSchema);

export function getRoomByCode(roomCode: string, userId: string) {
  return roomApi<MeetingRoomDetailResponse>(
    `/rooms/code/${encodeURIComponent(roomCode)}`,
    { userId, schema: MeetingRoomDetailResponseSchema },
  );
}

export function searchRoomsByTag(tagName: string, userId: string, pageable?: Pageable) {
  return roomApi<Page<MeetingRoomResponse>>(
    `/rooms/tags/${encodeURIComponent(tagName)}${pageableToParams(pageable)}`,
    { userId, schema: PageMeetingRoomSchema },
  );
}

export function listScheduledRooms(userId: string, pageable?: Pageable) {
  return roomApi<Page<MeetingRoomResponse>>(
    `/rooms/scheduled${pageableToParams(pageable)}`,
    { userId, schema: PageMeetingRoomSchema },
  );
}

export function listRoomHistory(userId: string, pageable?: Pageable) {
  return roomApi<Page<MeetingRoomResponse>>(
    `/rooms/history${pageableToParams(pageable)}`,
    { userId, schema: PageMeetingRoomSchema },
  );
}

export function getMonthlyStats(userId: string) {
  return roomApi<MonthlyStatsResponse[]>("/rooms/history/monthly", {
    userId,
    schema: z.array(MonthlyStatsResponseSchema),
  });
}

export function listFavoriteRooms(userId: string, pageable?: Pageable) {
  return roomApi<Page<MeetingRoomResponse>>(
    `/rooms/favorites${pageableToParams(pageable)}`,
    { userId, schema: PageMeetingRoomSchema },
  );
}

export function getRoomStats(roomId: number, userId: string) {
  return roomApi<RoomStatsResponse>(`/rooms/${roomId}/stats`, {
    userId,
    schema: RoomStatsResponseSchema,
  });
}

export function getRoomTimeline(roomId: number, userId: string) {
  return roomApi<TimelineEntry[]>(`/rooms/${roomId}/timeline`, {
    userId,
    schema: z.array(TimelineEntrySchema),
  });
}
