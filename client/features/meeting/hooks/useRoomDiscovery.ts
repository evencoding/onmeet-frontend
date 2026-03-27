import { useQuery } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  getRoomByCode,
  searchRoomsByTag,
  listMyRooms,
  listScheduledRooms,
  listRoomHistory,
  getMonthlyStats,
  listFavoriteRooms,
  getRoomStats,
  getRoomTimeline,
} from "../api/room-discovery";

export function useRoomByCode(roomCode: string, userId: string) {
  return useQuery({
    queryKey: roomKeys.byCode(roomCode),
    queryFn: () => getRoomByCode(roomCode, userId),
    enabled: !!roomCode && !!userId,
  });
}

export function useRoomsByTag(tagName: string, userId: string) {
  return useQuery({
    queryKey: roomKeys.searchByTag(tagName),
    queryFn: () => searchRoomsByTag(tagName, userId),
    enabled: !!tagName && !!userId,
  });
}

export function useMyRooms(userId: string, status?: string) {
  return useQuery({
    queryKey: [...roomKeys.lists(), "my", status],
    queryFn: () => listMyRooms(userId, status),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useScheduledRooms(userId: string) {
  return useQuery({
    queryKey: roomKeys.scheduled(),
    queryFn: () => listScheduledRooms(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useRoomHistory(userId: string) {
  return useQuery({
    queryKey: roomKeys.history(),
    queryFn: () => listRoomHistory(userId),
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

export function useFavoriteRooms(userId: string) {
  return useQuery({
    queryKey: roomKeys.favorites(),
    queryFn: () => listFavoriteRooms(userId),
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
