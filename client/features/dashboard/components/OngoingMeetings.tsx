import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import { useRooms, useScheduledRooms } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";

export default function OngoingMeetings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const { data: activeRoomsData, isLoading: isActiveLoading } = useRooms(userId, { status: "ACTIVE" });
  const { data: scheduledRoomsData, isLoading: isScheduledLoading } = useScheduledRooms(userId);

  const isLoading = isActiveLoading || isScheduledLoading;

  const activeRooms: MeetingRoomResponse[] = activeRoomsData?.content ?? [];
  const scheduledRooms: MeetingRoomResponse[] = scheduledRoomsData?.content ?? [];

  const meetings = [
    ...activeRooms.map((r) => ({ ...r, displayStatus: "ongoing" as const })),
    ...scheduledRooms
      .filter((r) => r.status === "WAITING")
      .map((r) => ({ ...r, displayStatus: "upcoming" as const })),
  ].slice(0, 4);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const handleJoinMeeting = (meeting: MeetingRoomResponse & { displayStatus: string }) => {
    if (meeting.displayStatus === "ongoing") {
      navigate(`/meeting/${meeting.id}`);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">
            진행 중인 회의
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="dark:bg-slate-800/40 light:bg-white rounded-xl p-5 animate-pulse">
              <div className="h-5 dark:bg-slate-700 light:bg-purple-100 rounded w-3/4 mb-3" />
              <div className="h-4 dark:bg-slate-700 light:bg-purple-100 rounded w-1/2 mb-2" />
              <div className="h-4 dark:bg-slate-700 light:bg-purple-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">
            진행 중인 회의
          </h2>
        </div>
        <div className="text-center py-12 dark:bg-slate-800/20 light:bg-purple-50/50 rounded-xl">
          <p className="dark:text-white/60 light:text-purple-700 mb-1 font-medium">현재 진행 중인 회의가 없습니다</p>
          <p className="text-xs dark:text-white/40 light:text-purple-600">새 회의를 생성해보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
        <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">
          진행 중인 회의
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="dark:bg-slate-800/40 light:bg-white dark:border dark:border-border/20 light:border light:border-border/40 rounded-xl overflow-hidden transition-all duration-300 dark:hover:shadow-hover light:hover:shadow-hover hover:-translate-y-0.5 group dark:backdrop-blur-sm"
          >
            <div
              className={`h-1 ${
                meeting.displayStatus === "ongoing"
                  ? "bg-red-500"
                  : "bg-brand-500"
              }`}
            />

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-foreground flex-1 leading-tight">
                    {meeting.title}
                  </h3>
                </div>

                {meeting.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meeting.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">시작</p>
                    <p className="font-medium text-foreground">
                      {formatTime(meeting.startedAt || meeting.scheduledAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">상태</p>
                  <p className={`font-medium ${meeting.displayStatus === "ongoing" ? "text-red-500" : "text-brand-500"}`}>
                    {meeting.displayStatus === "ongoing" ? "진행 중" : "예정"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">
                  최대 {meeting.maxParticipants}명
                </span>
              </div>

              <button
                onClick={() => handleJoinMeeting(meeting)}
                disabled={meeting.displayStatus === "upcoming"}
                className={`w-full px-4 py-2.5 font-semibold rounded-lg text-sm transition-all duration-200 ${
                  meeting.displayStatus === "ongoing"
                    ? "bg-red-500 text-white hover:bg-red-600 dark:shadow-lg dark:shadow-red-500/30 light:shadow-md light:shadow-red-400/30 hover:scale-105 active:scale-95"
                    : "dark:bg-slate-800/50 dark:text-muted-foreground light:bg-slate-100 light:text-muted-foreground cursor-not-allowed"
                }`}
              >
                {meeting.displayStatus === "ongoing"
                  ? "지금 바로 참여하기"
                  : "예정된 회의"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
