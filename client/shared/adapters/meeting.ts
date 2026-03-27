/**
 * Meeting Adapter — API 응답(MeetingRoomResponse)을 UI 모델로 변환.
 *
 * 기존에 Summary.tsx, Schedule.tsx, OngoingMeetings.tsx 등
 * 각 컴포넌트에서 ad-hoc으로 수행하던 변환 로직을 한 곳에 모았다.
 *
 * 변환 로직이 한 곳에 있으면:
 * - 백엔드 스키마가 변경될 때 수정 지점이 하나
 * - 포맷팅 규칙(시간, 기간 등)이 일관적
 * - 컴포넌트가 데이터 변환 책임에서 해방
 */

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { MeetingRoomResponse, RoomStatus, RoomType, AccessScope } from "@/features/meeting/api/types";

// ── UI 모델 ──

export type MeetingDisplayStatus = "scheduled" | "in_progress" | "completed";

export interface MeetingViewModel {
  id: string;
  roomCode: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  participants: number;
  description: string;
  status: MeetingDisplayStatus;
  type: RoomType;
  accessScope: AccessScope;
  locked: boolean;
  team?: string;
  hasTranscript: boolean;
  tags: string[];
  startedAt?: string;
  endedAt?: string;
}

export interface CalendarMeetingViewModel {
  id: string;
  roomCode: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  participants: number;
  description: string;
  attendees: { name: string; avatar: string }[];
  hostUserId: number;
  roomStatus: RoomStatus;
  scheduledAt: string;
  locked: boolean;
  accessScope: AccessScope;
}

// ── 포맷터 (공통) ──

export function formatMeetingTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "h:mm a");
  } catch {
    return "";
  }
}

export function formatMeetingTimeKo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function formatMeetingDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0분";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분`;
  if (hours > 0) return `${hours}시간`;
  return `${minutes}분`;
}

export function formatMeetingDate(date: Date): string {
  return format(date, "yyyy년 MMM dd일 (eee)", { locale: ko });
}

// ── 상태 매핑 ──

export function toDisplayStatus(status: RoomStatus): MeetingDisplayStatus {
  switch (status) {
    case "WAITING":
      return "scheduled";
    case "ACTIVE":
      return "in_progress";
    case "ENDED":
    case "CANCELLED":
    default:
      return "completed";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "scheduled": return "예정된 회의";
    case "in_progress": return "진행중";
    case "completed": return "완료된 회의";
    default: return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "scheduled":
      return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40";
    case "in_progress":
      return "dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/90 light:text-green-900 light:border light:border-green-300/60 light:shadow-sm light:shadow-green-200/40";
    case "completed":
      return "dark:bg-gray-500/20 dark:text-gray-300 light:bg-gray-100/90 light:text-gray-900 light:border light:border-gray-300/60 light:shadow-sm light:shadow-gray-200/40";
    default:
      return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40";
  }
}

/** RecentMeetings에서 사용하는 API 상태별 스타일 설정 */
export const roomStatusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "dark:bg-green-500/30 dark:text-green-300 light:bg-green-100/70 light:text-green-800",
  },
  ENDED: {
    label: "Closed",
    className: "dark:bg-red-500/30 dark:text-red-300 light:bg-red-100/70 light:text-red-800",
  },
  WAITING: {
    label: "Waiting",
    className: "dark:bg-yellow-500/30 dark:text-yellow-300 light:bg-yellow-100/70 light:text-yellow-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100/70 light:text-gray-800",
  },
};

// ── Adapter 함수 ──

/** API → 대시보드/회의 목록용 ViewModel */
export function toMeetingViewModel(room: MeetingRoomResponse): MeetingViewModel {
  const dateObj = room.scheduledAt
    ? new Date(room.scheduledAt)
    : room.startedAt
      ? new Date(room.startedAt)
      : new Date(room.createdAt);

  return {
    id: String(room.id),
    roomCode: room.roomCode,
    title: room.title || "제목 없음",
    date: dateObj,
    time: formatMeetingTime(room.scheduledAt || room.startedAt || room.createdAt),
    duration: formatMeetingDuration(room.durationSeconds),
    participants: room.maxParticipants,
    description: room.description || "",
    status: toDisplayStatus(room.status),
    type: room.type,
    accessScope: room.accessScope,
    locked: room.locked,
    hasTranscript: room.status === "ENDED",
    tags: [],
    startedAt: room.startedAt,
    endedAt: room.endedAt,
  };
}

/** API → 캘린더용 ViewModel */
export function toCalendarMeetingViewModel(room: MeetingRoomResponse): CalendarMeetingViewModel {
  const scheduledDate = room.scheduledAt
    ? new Date(room.scheduledAt)
    : new Date(room.createdAt);

  return {
    id: String(room.id),
    roomCode: room.roomCode,
    title: room.title,
    date: scheduledDate,
    time: format(scheduledDate, "h:mm a"),
    duration: room.durationSeconds
      ? `${Math.round(room.durationSeconds / 60)}분`
      : "-",
    location: "온라인",
    participants: room.maxParticipants,
    description: room.description || "",
    attendees: [],
    hostUserId: room.hostUserId,
    roomStatus: room.status,
    scheduledAt: room.scheduledAt || room.createdAt,
    locked: room.locked,
    accessScope: room.accessScope,
  };
}

/** 여러 API 소스에서 온 회의 데이터를 중복 제거하며 병합 */
export function mergeAndDedup(
  ...sources: (MeetingRoomResponse[] | undefined)[]
): MeetingRoomResponse[] {
  const map = new Map<number, MeetingRoomResponse>();
  for (const source of sources) {
    if (!source) continue;
    for (const room of source) {
      if (!map.has(room.id)) map.set(room.id, room);
    }
  }
  return Array.from(map.values());
}

/**
 * 회의실의 대표 날짜를 추출. 우선순위:
 * scheduledAt > startedAt > createdAt
 */
export function getMeetingDate(room: MeetingRoomResponse): Date {
  if (room.scheduledAt) return new Date(room.scheduledAt);
  if (room.startedAt) return new Date(room.startedAt);
  return new Date(room.createdAt);
}
