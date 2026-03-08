import type { RoomListParams } from "./api/types";

export const roomKeys = {
  all: ["rooms"] as const,

  // Room lists
  lists: () => [...roomKeys.all, "list"] as const,
  list: (params?: RoomListParams) => [...roomKeys.lists(), params] as const,
  scheduled: () => [...roomKeys.all, "scheduled"] as const,
  history: () => [...roomKeys.all, "history"] as const,
  favorites: () => [...roomKeys.all, "favorites"] as const,
  searchByTag: (tag: string) => [...roomKeys.all, "tag", tag] as const,

  // Room detail
  details: () => [...roomKeys.all, "detail"] as const,
  detail: (roomId: number) => [...roomKeys.details(), roomId] as const,
  byCode: (code: string) => [...roomKeys.all, "code", code] as const,

  // Room sub-resources
  settings: (roomId: number) => [...roomKeys.detail(roomId), "settings"] as const,
  stats: (roomId: number) => [...roomKeys.detail(roomId), "stats"] as const,
  timeline: (roomId: number) => [...roomKeys.detail(roomId), "timeline"] as const,

  // Participants
  participants: (roomId: number) => [...roomKeys.detail(roomId), "participants"] as const,
  participantHistory: (roomId: number) => [...roomKeys.detail(roomId), "participant-history"] as const,

  // Waiting room
  waiting: (roomId: number) => [...roomKeys.detail(roomId), "waiting"] as const,

  // Recordings
  recordings: (roomId: number) => [...roomKeys.detail(roomId), "recordings"] as const,
  recordingStatus: (roomId: number) => [...roomKeys.detail(roomId), "recording-status"] as const,

  // Invitations
  invitations: (roomId: number) => [...roomKeys.detail(roomId), "invitations"] as const,

  // Screen share
  activeScreenShares: (roomId: number) => [...roomKeys.detail(roomId), "screen-shares"] as const,

  // STT
  stt: (roomId: number) => [...roomKeys.detail(roomId), "stt"] as const,
  sttTranscript: (roomId: number) => [...roomKeys.detail(roomId), "stt-transcript"] as const,

  // Monthly stats
  monthlyStats: () => [...roomKeys.all, "monthly-stats"] as const,
};
