import { useMutation } from "@tanstack/react-query";
import {
  joinRoom,
  type JoinRoomRequest,
  type JoinRoomResponse,
} from "@/features/meeting/api";

export function useJoinRoom() {
  return useMutation<
    JoinRoomResponse,
    Error,
    { roomId: string; userId: string; body?: JoinRoomRequest }
  >({
    mutationFn: ({ roomId, userId, body }) => joinRoom(roomId, userId, body),
  });
}
