import { roomApi } from "@/shared/api";
import { ScreenShareResponseSchema } from "@/shared/schemas";
import { z } from "zod";
import type { ScreenShareResponse } from "./types";

export function startScreenShare(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/screen-share/start`, {
    userId,
    method: "POST",
  });
}

export function stopScreenShare(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/screen-share/stop`, {
    userId,
    method: "POST",
  });
}

export function forceStopScreenShare(
  roomId: number,
  userId: string,
  targetUserId: number,
) {
  const qs = new URLSearchParams({ targetUserId: String(targetUserId) });
  return roomApi<void>(
    `/rooms/${roomId}/screen-share/force-stop?${qs}`,
    { userId, method: "POST" },
  );
}

export function listActiveScreenShares(roomId: number, userId: string) {
  return roomApi<ScreenShareResponse[]>(
    `/rooms/${roomId}/screen-share/active`,
    { userId, schema: z.array(ScreenShareResponseSchema) },
  );
}
