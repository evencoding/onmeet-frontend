import type { RoomStatus, ParticipantStatus, RecordingStatus, NotificationType } from "./enums";

// ── Room Guards ──

export function isActiveRoom(status: RoomStatus): boolean {
  return status === "ACTIVE";
}

export function isJoinableRoom(status: RoomStatus): boolean {
  return status === "WAITING" || status === "ACTIVE";
}

export function isEndedRoom(status: RoomStatus): boolean {
  return status === "ENDED" || status === "CANCELLED";
}

// ── Participant Guards ──

export function isConnectedParticipant(status: ParticipantStatus): boolean {
  return status === "JOINED";
}

// ── Recording Guards ──

export function isRecordingActive(status: RecordingStatus): boolean {
  return status === "RECORDING";
}

// ── Notification Guards ──

const MEETING_NOTIFICATION_TYPES: NotificationType[] = [
  "MEETING_CREATED",
  "MEETING_TODAY",
  "MEETING_STARTED",
  "MEETING_REMINDER",
];

const INVITATION_NOTIFICATION_TYPES: NotificationType[] = [
  "MEETING_INVITATION",
  "INVITATION_ACCEPTED",
  "INVITATION_DECLINED",
  "INVITATION_CANCELLED",
];

export function isMeetingNotification(type: NotificationType): boolean {
  return MEETING_NOTIFICATION_TYPES.includes(type);
}

export function isInvitationNotification(type: NotificationType): boolean {
  return INVITATION_NOTIFICATION_TYPES.includes(type);
}
