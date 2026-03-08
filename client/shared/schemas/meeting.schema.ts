import { z } from "zod";

// ── Room ──

export const MeetingRoomResponseSchema = z.object({
  id: z.number(),
  roomCode: z.string(),
  title: z.string(),
  description: z.string(),
  hostUserId: z.number(),
  status: z.enum(["WAITING", "ACTIVE", "ENDED", "CANCELLED"]),
  type: z.enum(["INSTANT", "SCHEDULED", "RECURRING"]),
  accessScope: z.enum(["ALL", "TEAM", "INDIVIDUAL_INVITE"]),
  teamId: z.number(),
  maxParticipants: z.number(),
  locked: z.boolean(),
  scheduledAt: z.string(),
  startedAt: z.string(),
  endedAt: z.string(),
  durationSeconds: z.number(),
  createdAt: z.string(),
});
export type MeetingRoomResponseDto = z.infer<typeof MeetingRoomResponseSchema>;

export const RoomSettingsResponseSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  videoEnabled: z.boolean(),
  audioEnabled: z.boolean(),
  screenShareAllowed: z.boolean(),
  chatEnabled: z.boolean(),
  recordingEnabled: z.boolean(),
  waitingRoom: z.boolean(),
  autoMuteOnJoin: z.boolean(),
});
export type RoomSettingsResponseDto = z.infer<typeof RoomSettingsResponseSchema>;

export const MeetingRoomDetailResponseSchema = MeetingRoomResponseSchema.extend({
  currentParticipantCount: z.number(),
  settings: RoomSettingsResponseSchema,
  tags: z.array(z.string()),
});
export type MeetingRoomDetailResponseDto = z.infer<typeof MeetingRoomDetailResponseSchema>;

export const RoomJoinResponseSchema = z.object({
  token: z.string(),
  livekitUrl: z.string(),
  roomName: z.string(),
  waitingRoom: z.boolean(),
  participantName: z.string().optional(),
  isHost: z.boolean().optional(),
});
export type RoomJoinResponseDto = z.infer<typeof RoomJoinResponseSchema>;

// ── Stats ──

export const RoomStatsResponseSchema = z.object({
  roomId: z.number(),
  title: z.string(),
  status: z.enum(["WAITING", "ACTIVE", "ENDED", "CANCELLED"]),
  totalParticipants: z.number(),
  currentParticipants: z.number(),
  durationSeconds: z.number(),
  totalRecordings: z.number(),
  startedAt: z.string(),
  endedAt: z.string(),
});
export type RoomStatsResponseDto = z.infer<typeof RoomStatsResponseSchema>;

export const MonthlyStatsResponseSchema = z.object({
  year: z.number(),
  month: z.number(),
  totalMeetings: z.number(),
  totalDurationSeconds: z.number(),
  totalParticipants: z.number(),
});
export type MonthlyStatsResponseDto = z.infer<typeof MonthlyStatsResponseSchema>;

// ── Participant ──

export const RoomParticipantResponseSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  userId: z.number(),
  role: z.enum(["HOST", "CO_HOST", "PARTICIPANT", "VIEWER"]),
  status: z.enum(["WAITING", "JOINED", "LEFT", "KICKED", "DISCONNECTED"]),
  joinedAt: z.string(),
  leftAt: z.string(),
  durationSeconds: z.number(),
  deviceType: z.enum(["WEB", "MOBILE", "DESKTOP"]),
});
export type RoomParticipantResponseDto = z.infer<typeof RoomParticipantResponseSchema>;

// ── Recording ──

export const RoomRecordingResponseSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  egressId: z.string(),
  type: z.enum(["FULL_AUDIO", "SEGMENT", "FULL_VIDEO", "PARTICIPANT_AUDIO"]),
  status: z.enum(["RECORDING", "PROCESSING", "COMPLETED", "FAILED"]),
  s3Path: z.string(),
  fileSizeBytes: z.number(),
  durationSeconds: z.number(),
  segmentIndex: z.number(),
  participantIdentity: z.string(),
  trackSid: z.string(),
  startedAt: z.string(),
  endedAt: z.string(),
  createdAt: z.string(),
});
export type RoomRecordingResponseDto = z.infer<typeof RoomRecordingResponseSchema>;

// ── Screen Share ──

export const ScreenShareResponseSchema = z.object({
  participantId: z.number(),
  userId: z.number(),
  startedAt: z.string(),
});
export type ScreenShareResponseDto = z.infer<typeof ScreenShareResponseSchema>;

// ── Invitation ──

export const MeetingInvitationResponseSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  inviterUserId: z.number(),
  inviteeUserId: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "CANCELLED"]),
  createdAt: z.string(),
});
export type MeetingInvitationResponseDto = z.infer<typeof MeetingInvitationResponseSchema>;

// ── Timeline ──

export const TimelineEntrySchema = z.object({
  eventType: z.string(),
  userId: z.number(),
  description: z.string(),
  timestamp: z.string(),
});
export type TimelineEntryDto = z.infer<typeof TimelineEntrySchema>;
