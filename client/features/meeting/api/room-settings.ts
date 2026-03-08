import { roomApi } from "@/shared/api";
import { RoomSettingsResponseSchema } from "@/shared/schemas";
import type { RoomSettingsResponse, RoomSettingsUpdateRequest } from "./types";

export function getRoomSettings(roomId: number, userId: string) {
  return roomApi<RoomSettingsResponse>(`/rooms/${roomId}/settings`, {
    userId,
    schema: RoomSettingsResponseSchema,
  });
}

export function updateRoomSettings(
  roomId: number,
  userId: string,
  data: RoomSettingsUpdateRequest,
) {
  return roomApi<RoomSettingsResponse>(`/rooms/${roomId}/settings`, {
    userId,
    method: "PATCH",
    body: JSON.stringify(data),
    schema: RoomSettingsResponseSchema,
  });
}
