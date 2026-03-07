// ── Meeting ──

export type RoomStatus = "WAITING" | "ACTIVE" | "ENDED" | "CANCELLED";
export type RoomType = "INSTANT" | "SCHEDULED" | "RECURRING";
export type AccessScope = "ALL" | "TEAM" | "INDIVIDUAL_INVITE";
export type ParticipantRole = "HOST" | "CO_HOST" | "PARTICIPANT" | "VIEWER";
export type ParticipantStatus = "WAITING" | "JOINED" | "LEFT" | "KICKED" | "DISCONNECTED";
export type DeviceType = "WEB" | "MOBILE" | "DESKTOP";
export type RecordingType = "FULL_AUDIO" | "SEGMENT" | "FULL_VIDEO" | "PARTICIPANT_AUDIO";
export type RecordingStatus = "RECORDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";

// ── Notification ──

export type NotificationType =
  | "MEETING_CREATED"
  | "MEETING_TODAY"
  | "MEETING_STARTED"
  | "TEAM_MEMBER_ADDED"
  | "SYSTEM"
  | "EVENT"
  | "MEETING_INVITATION"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "INVITATION_CANCELLED"
  | "PARTICIPANT_KICKED"
  | "WAITING_ROOM_ADMITTED"
  | "WAITING_ROOM_REJECTED"
  | "PARTICIPANT_JOINED_NOTIFY"
  | "SCHEDULE_CREATED"
  | "SCHEDULE_CHANGED"
  | "SCHEDULE_CANCELLED"
  | "MEETING_REMINDER";

export type ResourceType = "MEETING" | "MINUTES" | "TEAM" | "NOTICE" | "EVENT";

// ── Auth ──

export type UserRole = "USER" | "ADMIN" | "MANAGER";
