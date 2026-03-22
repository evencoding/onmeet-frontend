import { useMemo } from "react";
import { useSSEStream } from "@/shared/hooks";
import type { UseSSEStreamReturn } from "@/shared/hooks";
import { roomKeys } from "../query-keys";

export interface STTChunk {
  speaker: string;
  text: string;
  isFinal: boolean;
  timestamp: number;
}

const VITE_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * STT streaming infrastructure hook.
 * Connects to the SSE endpoint when `enabled` is true.
 * Backend not yet implemented — this is a ready-to-use placeholder.
 */
export function useMeetingSTT(
  roomId: string,
  enabled = false,
): UseSSEStreamReturn<STTChunk> {
  const numericRoomId = Number(roomId);

  const url = useMemo(
    () => (enabled ? `${VITE_API_BASE}/video/v1/rooms/${roomId}/stt/stream` : null),
    [enabled, roomId],
  );

  return useSSEStream<STTChunk>({
    url,
    eventName: "transcript",
    throttleMs: 250,
    flushBoundary: "\n",
    reconnectMs: 3000,
    invalidateOnEnd: [roomKeys.stt(numericRoomId)],
  });
}
