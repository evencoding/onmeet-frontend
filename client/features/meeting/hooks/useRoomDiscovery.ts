import { useQuery } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  getRoomByCode,
  searchRoomsByTag,
  listScheduledRooms,
  listRoomHistory,
  getMonthlyStats,
  listFavoriteRooms,
  getRoomStats,
  getRoomTimeline,
} from "../api/room-discovery";
import type { Pageable } from "../api/types";

export function useRoomByCode(roomCode: string, userId: string) {
  return useQuery({
    queryKey: roomKeys.byCode(roomCode),
    queryFn: () => getRoomByCode(roomCode, userId),
    enabled: !!roomCode && !!userId,
  });
}

export function useRoomsByTag(tagName: string, userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: roomKeys.searchByTag(tagName),
    queryFn: () => searchRoomsByTag(tagName, userId, pageable),
    enabled: !!tagName && !!userId,
  });
}

export function useScheduledRooms(userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: roomKeys.scheduled(),
    queryFn: () => listScheduledRooms(userId, pageable),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useRoomHistory(userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: roomKeys.history(),
    queryFn: () => listRoomHistory(userId, pageable),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useMonthlyStats(userId: string) {
  return useQuery({
    queryKey: roomKeys.monthlyStats(),
    queryFn: () => getMonthlyStats(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

export function useFavoriteRooms(userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: roomKeys.favorites(),
    queryFn: () => listFavoriteRooms(userId, pageable),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useRoomStats(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.stats(roomId),
    queryFn: () => getRoomStats(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}

export function useRoomTimeline(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.timeline(roomId),
    queryFn: () => getRoomTimeline(roomId, userId),
    enabled: !!roomId && !!userId,
  });
}
