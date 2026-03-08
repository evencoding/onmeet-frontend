import { roomFetch } from "../api";
import type { SendChatRequest } from "./types";

export function sendChatMessage(roomId: number, userId: string, data: SendChatRequest) {
  return roomFetch<void>(`/rooms/${roomId}/chat/send`, userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
