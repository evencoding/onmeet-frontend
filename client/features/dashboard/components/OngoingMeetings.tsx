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
          <h2 className="text-xs font-bold dark:text-white/90 light:text-purple-950 uppercase tracking-widest">
            진행 중인 회의
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="dark:bg-purple-900/30 light:bg-white dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/60 rounded-2xl p-5 animate-pulse">
              <div className="h-5 dark:bg-purple-500/20 light:bg-purple-100 rounded w-3/4 mb-3" />
              <div className="h-4 dark:bg-purple-500/15 light:bg-purple-100 rounded w-1/2 mb-2" />
              <div className="h-4 dark:bg-purple-500/15 light:bg-purple-100 rounded w-2/3" />
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
          <h2 className="text-xs font-bold dark:text-white/90 light:text-purple-950 uppercase tracking-widest">
            진행 중인 회의
          </h2>
        </div>
        <div className="text-center py-12 dark:bg-purple-500/10 dark:border dark:border-purple-500/20 light:bg-purple-50/80 light:border-2 light:border-purple-300/50 rounded-2xl">
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
        <h2 className="text-xs font-bold dark:text-white/90 light:text-purple-950 uppercase tracking-widest">
          진행 중인 회의
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/40 dark:to-pink-900/20 light:bg-white dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/60 rounded-2xl overflow-hidden transition-all duration-300 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-md light:hover:shadow-purple-300/30 light:hover:border-purple-400/60 hover:-translate-y-0.5 group dark:backdrop-blur-md"
          >
            <div
              className={`h-1 ${
                meeting.displayStatus === "ongoing"
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
            />

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 flex-1 leading-tight">
                    {meeting.title}
                  </h3>
                </div>

                {meeting.description && (
                  <p className="text-sm dark:text-white/60 light:text-purple-700 line-clamp-2">
                    {meeting.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs dark:text-white/50 light:text-purple-600">시작</p>
                    <p className="font-medium dark:text-white/90 light:text-purple-900">
                      {formatTime(meeting.startedAt || meeting.scheduledAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs dark:text-white/50 light:text-purple-600">상태</p>
                  <p className={`font-medium ${meeting.displayStatus === "ongoing" ? "text-red-500" : "dark:text-purple-400 light:text-purple-600"}`}>
                    {meeting.displayStatus === "ongoing" ? "진행 중" : "예정"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 dark:text-white/50 light:text-purple-600 flex-shrink-0" />
                <span className="text-xs dark:text-white/50 light:text-purple-600">
                  최대 {meeting.maxParticipants}명
                </span>
              </div>

              <button
                onClick={() => handleJoinMeeting(meeting)}
                disabled={meeting.displayStatus === "upcoming"}
                className={`w-full px-4 py-2.5 font-semibold rounded-xl text-sm transition-all duration-300 ${
                  meeting.displayStatus === "ongoing"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95"
                    : "dark:bg-purple-500/20 dark:text-white/60 light:bg-purple-100 light:text-purple-700 cursor-not-allowed"
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
