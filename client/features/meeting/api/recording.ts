import { roomFetch } from "../api";
import type { RoomRecordingResponse } from "./types";

export function startRecording(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/recording/start`, userId, {
    method: "POST",
  });
}

export function stopRecording(roomId: number, userId: string) {
  return roomFetch<void>(`/rooms/${roomId}/recording/stop`, userId, {
    method: "POST",
  });
}

export function getRecordingStatus(roomId: number, userId: string) {
  return roomFetch<RoomRecordingResponse>(
    `/rooms/${roomId}/recording/status`,
    userId,
  );
}

export function listRecordings(roomId: number, userId: string) {
  return roomFetch<RoomRecordingResponse[]>(
    `/rooms/${roomId}/recordings`,
    userId,
  );
}

export function getRecordingDownloadUrl(recordingId: number, userId: string) {
  return roomFetch<string>(`/recordings/${recordingId}/download`, userId);
}

export function deleteRecording(recordingId: number, userId: string) {
  return roomFetch<void>(`/recordings/${recordingId}`, userId, {
    method: "DELETE",
  });
}
