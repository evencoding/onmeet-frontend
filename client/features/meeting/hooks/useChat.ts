import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chat";
import type { SendChatRequest } from "../api/types";

export function useSendChatMessage() {
  return useMutation({
    mutationFn: (args: { roomId: number; userId: string; data: SendChatRequest }) =>
      sendChatMessage(args.roomId, args.userId, args.data),
  });
}
