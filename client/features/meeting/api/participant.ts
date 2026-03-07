import { roomApi } from "@/shared/api";
import { RoomParticipantResponseSchema } from "@/shared/schemas";
import { pageSchema } from "@/shared/schemas/pagination.schema";
import { pageableToParams } from "@/shared/types";
import { z } from "zod";
import type {
  RoomParticipantResponse,
  ParticipantRoleUpdateRequest,
  Page,
  Pageable,
} from "./types";

const PageParticipantSchema = pageSchema(RoomParticipantResponseSchema);

export function listParticipants(roomId: number, userId: string) {
  return roomApi<RoomParticipantResponse[]>(
    `/rooms/${roomId}/participants`,
    { userId, schema: z.array(RoomParticipantResponseSchema) },
  );
}

export function listParticipantHistory(roomId: number, userId: string, pageable?: Pageable) {
  return roomApi<Page<RoomParticipantResponse>>(
    `/rooms/${roomId}/participants/history${pageableToParams(pageable)}`,
    { userId, schema: PageParticipantSchema },
  );
}

export function muteParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/participants/${targetUserId}/mute`,
    { userId, method: "POST" },
  );
}

export function unmuteParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/participants/${targetUserId}/unmute`,
    { userId, method: "POST" },
  );
}

export function kickParticipant(roomId: number, targetUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/participants/${targetUserId}/kick`,
    { userId, method: "POST" },
  );
}

export function updateParticipantRole(
  roomId: number,
  targetUserId: number,
  userId: string,
  data: ParticipantRoleUpdateRequest,
) {
  return roomApi<void>(
    `/rooms/${roomId}/participants/${targetUserId}/role`,
    { userId, method: "PATCH", body: JSON.stringify(data) },
  );
}

export function muteAll(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/mute-all`, { userId, method: "POST" });
}

export function unmuteAll(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/unmute-all`, { userId, method: "POST" });
}

export function disableVideoAll(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/disable-video-all`, {
    userId,
    method: "POST",
  });
}
