import { roomApi } from "@/shared/api";
import { RoomRecordingResponseSchema } from "@/shared/schemas";
import { z } from "zod";
import type { RoomRecordingResponse } from "./types";

export function startRecording(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/recording/start`, {
    userId,
    method: "POST",
  });
}

export function stopRecording(roomId: number, userId: string) {
  return roomApi<void>(`/rooms/${roomId}/recording/stop`, {
    userId,
    method: "POST",
  });
}

export function getRecordingStatus(roomId: number, userId: string) {
  return roomApi<RoomRecordingResponse>(
    `/rooms/${roomId}/recording/status`,
    { userId, schema: RoomRecordingResponseSchema },
  );
}

export function listRecordings(roomId: number, userId: string) {
  return roomApi<RoomRecordingResponse[]>(
    `/rooms/${roomId}/recordings`,
    { userId, schema: z.array(RoomRecordingResponseSchema) },
  );
}

export function getRecordingDownloadUrl(recordingId: number, userId: string) {
  return roomApi<string>(`/recordings/${recordingId}/download`, { userId });
}

export function deleteRecording(recordingId: number, userId: string) {
  return roomApi<void>(`/recordings/${recordingId}`, {
    userId,
    method: "DELETE",
  });
}
