import { roomFetch } from "../api";
import type { SendChatRequest, ChatTokenRequest, ChatTokenResponse } from "./types";

export function sendChatMessage(roomId: number, userId: string, data: SendChatRequest) {
  return roomFetch<void>(`/rooms/${roomId}/chat/send`, userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getChatToken(data: ChatTokenRequest) {
  return roomFetch<ChatTokenResponse>("/rooms/internal/chat-token", "", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
