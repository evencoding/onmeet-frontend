import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomKeys } from "../query-keys";
import {
  listRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  startRoom,
  endRoom,
  lockRoom,
  unlockRoom,
  regenerateRoomCode,
  addTag,
  removeTag,
  addFavorite,
  removeFavorite,
} from "../api/room";
import type {
  RoomCreateRequest,
  RoomUpdateRequest,
  RoomJoinRequest,
  RoomLockRequest,
  TagCreateRequest,
  RoomListParams,
} from "../api/types";

export function useRooms(userId: string, params?: RoomListParams) {
  return useQuery({
    queryKey: roomKeys.list(params),
    queryFn: () => listRooms(userId, params),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useRoom(roomId: number, userId: string) {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => getRoom(roomId, userId),
    enabled: !!roomId && !!userId,
    staleTime: 30_000,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string; data: RoomCreateRequest }) =>
      createRoom(args.userId, args.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data: RoomUpdateRequest }) =>
      updateRoom(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      deleteRoom(args.roomId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useJoinRoom() {
  return useMutation({
    mutationFn: (args: {
      roomId: number | string;
      userId: string;
      data?: RoomJoinRequest;
      body?: Record<string, unknown>;
    }) =>
      joinRoom(Number(args.roomId), args.userId, args.data ?? (args.body as RoomJoinRequest)),
  });
}

export function useLeaveRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      leaveRoom(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.participants(vars.roomId) });
    },
  });
}

export function useStartRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      startRoom(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useEndRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      endRoom(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
      qc.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useLockRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data?: RoomLockRequest }) =>
      lockRoom(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}

export function useUnlockRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      unlockRoom(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}

export function useRegenerateRoomCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      regenerateRoomCode(args.roomId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}

export function useAddTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data: TagCreateRequest }) =>
      addTag(args.roomId, args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}

export function useRemoveTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; tagName: string }) =>
      removeTag(args.roomId, args.userId, args.tagName),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roomKeys.detail(vars.roomId) });
    },
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      addFavorite(args.roomId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.favorites() });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string }) =>
      removeFavorite(args.roomId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roomKeys.favorites() });
    },
  });
}
