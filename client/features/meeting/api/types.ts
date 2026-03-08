// ── Re-export shared enums for backward compatibility ──
export type {
  RoomStatus,
  RoomType,
  AccessScope,
  ParticipantRole,
  ParticipantStatus,
  DeviceType,
  RecordingType,
  RecordingStatus,
  InvitationStatus,
} from "@/shared/types/enums";

// ── Re-export shared pagination for backward compatibility ──
export type {
  Pageable,
  SortObject,
  PageableObject,
  Page,
} from "@/shared/types/pagination";

// ── Re-export shared response types for backward compatibility ──
export type {
  MeetingRoomResponseDto as MeetingRoomResponse,
  MeetingRoomDetailResponseDto as MeetingRoomDetailResponse,
  RoomSettingsResponseDto as RoomSettingsResponse,
  RoomJoinResponseDto as RoomJoinResponse,
  RoomStatsResponseDto as RoomStatsResponse,
  MonthlyStatsResponseDto as MonthlyStatsResponse,
  RoomParticipantResponseDto as RoomParticipantResponse,
  RoomRecordingResponseDto as RoomRecordingResponse,
  ScreenShareResponseDto as ScreenShareResponse,
  MeetingInvitationResponseDto as InvitationResponse,
  TimelineEntryDto as TimelineEntry,
} from "@/shared/schemas/meeting.schema";

// ── Request Types (feature-local, not validated) ──

import type { RoomType, AccessScope, DeviceType, ParticipantRole } from "@/shared/types/enums";
import type { Pageable } from "@/shared/types/pagination";
import type { RoomStatus } from "@/shared/types/enums";

export interface RoomCreateRequest {
  title: string;
  description?: string;
  type?: RoomType;
  maxParticipants?: number;
  password?: string;
  scheduledAt?: string;
  accessScope?: AccessScope;
  teamId?: number;
}

export interface RoomUpdateRequest {
  title?: string;
  description?: string;
  maxParticipants?: number;
}

export interface RoomScheduleRequest {
  title: string;
  description?: string;
  scheduledAt: string;
  maxParticipants?: number;
  password?: string;
  accessScope?: AccessScope;
  teamId?: number;
}

export interface RoomJoinRequest {
  password?: string;
  deviceType?: DeviceType;
}

export interface RoomLockRequest {
  password?: string;
}

export interface RoomSettingsUpdateRequest {
  videoEnabled?: boolean;
  audioEnabled?: boolean;
  screenShareAllowed?: boolean;
  chatEnabled?: boolean;
  recordingEnabled?: boolean;
  waitingRoom?: boolean;
  autoMuteOnJoin?: boolean;
}

export interface InviteRequest {
  inviteeUserId: number;
}

export interface BulkInviteRequest {
  inviteeUserIds: number[];
}

export interface ParticipantRoleUpdateRequest {
  role: ParticipantRole;
}

export interface TagCreateRequest {
  tagName: string;
}

export interface SendChatRequest {
  content: string;
  type?: string;
  replyToMessageId?: string;
  destinationUserId?: number;
}

// ── List filter params ──

export interface RoomListParams extends Pageable {
  status?: RoomStatus;
  type?: RoomType;
  accessScope?: AccessScope;
  hostUserId?: number;
}
