import { roomFetch } from "../api";
import type { RoomSettingsResponse, RoomSettingsUpdateRequest } from "./types";

export function getRoomSettings(roomId: number, userId: string) {
  return roomFetch<RoomSettingsResponse>(`/rooms/${roomId}/settings`, userId);
}

export function updateRoomSettings(
  roomId: number,
  userId: string,
  data: RoomSettingsUpdateRequest,
) {
  return roomFetch<RoomSettingsResponse>(`/rooms/${roomId}/settings`, userId, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
