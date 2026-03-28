import { Plus, MoreVertical, Clock, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/context";
import { useRooms } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";
import MeetingBookingModal from "@/features/schedule/components/MeetingBookingModal";

const teamColorPalette = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-red-500",
  "bg-yellow-500",
];

export default function TeamBoard() {
  useDocumentTitle("팀 보드 - OnMeet");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: roomsData, isLoading } = useRooms(userId);

  const allRooms: MeetingRoomResponse[] = roomsData?.content ?? [];
  const teams = user?.teams ?? [];

  const teamRoomsMap = new Map<number, MeetingRoomResponse[]>();
  for (const room of allRooms) {
    if (room.teamId) {
      const existing = teamRoomsMap.get(room.teamId) ?? [];
      existing.push(room);
      teamRoomsMap.set(room.teamId, existing);
    }
  }

  const displayTeams =
    selectedTeam === "all"
      ? teams
      : teams.filter((t) => String(t.id) === selectedTeam);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "dark:bg-green-500/30 dark:text-green-300 light:bg-green-100 light:text-green-700";
      case "WAITING":
        return "dark:bg-blue-500/30 dark:text-blue-300 light:bg-blue-100 light:text-blue-700";
      case "ENDED":
        return "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100 light:text-gray-700";
      default:
        return "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100 light:text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "진행중";
      case "WAITING":
        return "예정";
      case "ENDED":
        return "완료";
      default:
        return status;
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              팀별 회의 보드
            </h1>
            <p className="text-text-sub">
              각 팀의 회의 일정과 상태를 한눈에 확인하세요
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            회의 생성
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedTeam("all")}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm",
              selectedTeam === "all"
                ? "bg-brand-500 text-white shadow-lg"
                : "bg-white/60 text-foreground hover:bg-white border border-border/20",
            )}
          >
            모든 팀
          </button>
          {teams.map((team, index) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(String(team.id))}
              className={cn(
                "px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center gap-2",
                selectedTeam === String(team.id)
                  ? "bg-brand-500 text-white shadow-lg"
                  : "bg-white/60 text-foreground hover:bg-white border border-border/20",
              )}
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  !team.color && teamColorPalette[index % teamColorPalette.length],
                )}
                style={team.color ? { backgroundColor: team.color } : undefined}
              />
              {team.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="h-6 bg-surface-subtle rounded w-1/4" />
                <div className="h-32 bg-surface-subtle rounded-2xl" />
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 bg-surface-subtle rounded-2xl">
            <p className="text-text-sub mb-1 font-medium">
              소속된 팀이 없습니다
            </p>
            <p className="text-xs text-text-sub">
              팀에 가입하면 팀별 회의를 확인할 수 있습니다
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayTeams.map((team, index) => {
              const teamMeetings = teamRoomsMap.get(team.id) ?? [];
              return (
                <div key={team.id} className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full",
                        !team.color && teamColorPalette[index % teamColorPalette.length],
                      )}
                      style={team.color ? { backgroundColor: team.color } : undefined}
                    />
                    <h2 className="text-2xl font-bold text-foreground">
                      {team.name}
                    </h2>
                    <span className="px-2.5 py-1 bg-surface-subtle text-text-sub text-xs font-semibold rounded-full">
                      {teamMeetings.length}개 회의
                    </span>
                  </div>

                  {teamMeetings.length === 0 ? (
                    <div className="text-center py-8 bg-surface-subtle/50 rounded-xl">
                      <p className="text-sm text-text-sub">
                        이 팀의 회의가 없습니다
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {teamMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <h3 className="text-lg font-bold text-foreground flex-1">
                                  {meeting.title}
                                </h3>
                                <span
                                  className={cn(
                                    "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                                    getStatusBadge(meeting.status),
                                  )}
                                >
                                  {getStatusLabel(meeting.status)}
                                </span>
                              </div>

                              <p className="text-sm text-text-sub mb-4">
                                {meeting.description || "설명 없음"}
                              </p>

                              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-t border-border/20 pt-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-text-sub font-medium">
                                      시작
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                      {formatTime(meeting.startedAt || meeting.scheduledAt)}
                                    </p>
                                  </div>
                                </div>

                                {meeting.endedAt && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs text-text-sub font-medium">
                                        종료
                                      </p>
                                      <p className="text-sm font-semibold text-foreground">
                                        {formatTime(meeting.endedAt)}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-text-sub font-medium">
                                      참석자
                                    </p>
                                    <p className="text-sm font-semibold text-foreground">
                                      최대 {meeting.maxParticipants}명
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>

                          {meeting.status === "ACTIVE" && (
                            <button
                              onClick={() => navigate(`/meeting/${meeting.id}`)}
                              className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
                            >
                              회의 참여
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <MeetingBookingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
}
