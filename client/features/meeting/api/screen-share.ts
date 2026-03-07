import { roomFetch } from "../api";
import type { ScreenShareResponse } from "./types";

export function startScreenShare(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/screen-share/start`, userId, {
    method: "POST",
  });
}

export function stopScreenShare(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/screen-share/stop`, userId, {
    method: "POST",
  });
}

export function forceStopScreenShare(
  roomId: number,
  userId: string,
  targetUserId: number,
) {
  const qs = new URLSearchParams({ targetUserId: String(targetUserId) });
  return roomFetch<void>(
    `/rooms/${roomId}/screen-share/force-stop?${qs}`,
    userId,
    { method: "POST" },
  );
}

export function listActiveScreenShares(roomId: number, userId: string) {
  return roomFetch<ScreenShareResponse[]>(
    `/rooms/${roomId}/screen-share/active`,
    userId,
  );
}
