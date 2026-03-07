// ── Enums ──

export type RoomStatus = "WAITING" | "ACTIVE" | "ENDED" | "CANCELLED";
export type RoomType = "INSTANT" | "SCHEDULED" | "RECURRING";
export type AccessScope = "ALL" | "TEAM" | "INDIVIDUAL_INVITE";
export type ParticipantRole = "HOST" | "CO_HOST" | "PARTICIPANT" | "VIEWER";
export type ParticipantStatus = "WAITING" | "JOINED" | "LEFT" | "KICKED" | "DISCONNECTED";
export type DeviceType = "WEB" | "MOBILE" | "DESKTOP";
export type RecordingType = "FULL_AUDIO" | "SEGMENT" | "FULL_VIDEO" | "PARTICIPANT_AUDIO";
export type RecordingStatus = "RECORDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";

// ── Pagination ──

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface Page<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  pageable: PageableObject;
  last: boolean;
  first: boolean;
  empty: boolean;
}

// ── Request Types ──

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

// ── Response Types ──

export interface MeetingRoomResponse {
  id: number;
  roomCode: string;
  title: string;
  description: string;
  hostUserId: number;
  status: RoomStatus;
  type: RoomType;
  accessScope: AccessScope;
  teamId: number;
  maxParticipants: number;
  locked: boolean;
  scheduledAt: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  createdAt: string;
}

export interface RoomSettingsResponse {
  id: number;
  roomId: number;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenShareAllowed: boolean;
  chatEnabled: boolean;
  recordingEnabled: boolean;
  waitingRoom: boolean;
  autoMuteOnJoin: boolean;
}

export interface MeetingRoomDetailResponse extends MeetingRoomResponse {
  currentParticipantCount: number;
  settings: RoomSettingsResponse;
  tags: string[];
}

export interface RoomJoinResponse {
  token: string;
  livekitUrl: string;
  roomName: string;
  waitingRoom: boolean;
  participantName?: string;
  isHost?: boolean;
}

export interface RoomStatsResponse {
  roomId: number;
  title: string;
  status: RoomStatus;
  totalParticipants: number;
  currentParticipants: number;
  durationSeconds: number;
  totalRecordings: number;
  startedAt: string;
  endedAt: string;
}

export interface RoomParticipantResponse {
  id: number;
  roomId: number;
  userId: number;
  role: ParticipantRole;
  status: ParticipantStatus;
  joinedAt: string;
  leftAt: string;
  durationSeconds: number;
  deviceType: DeviceType;
}

export interface RoomRecordingResponse {
  id: number;
  roomId: number;
  egressId: string;
  type: RecordingType;
  status: RecordingStatus;
  s3Path: string;
  fileSizeBytes: number;
  durationSeconds: number;
  segmentIndex: number;
  participantIdentity: string;
  trackSid: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
}

export interface ScreenShareResponse {
  participantId: number;
  userId: number;
  startedAt: string;
}

export interface InvitationResponse {
  id: number;
  roomId: number;
  inviterUserId: number;
  inviteeUserId: number;
  status: InvitationStatus;
  createdAt: string;
}

export interface TimelineEntry {
  eventType: string;
  userId: number;
  description: string;
  timestamp: string;
}

export interface MonthlyStatsResponse {
  year: number;
  month: number;
  totalMeetings: number;
  totalDurationSeconds: number;
  totalParticipants: number;
}

// ── List filter params ──

export interface RoomListParams extends Pageable {
  status?: RoomStatus;
  type?: RoomType;
  accessScope?: AccessScope;
  hostUserId?: number;
}
