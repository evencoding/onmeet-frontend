import { roomApi } from "@/shared/api";
import type { SendChatRequest } from "./types";

export function sendChatMessage(roomId: number, userId: string, data: SendChatRequest) {
  return roomApi<void>(`/rooms/${roomId}/chat/send`, {
    userId,
    method: "POST",
    body: JSON.stringify(data),
  });
}
