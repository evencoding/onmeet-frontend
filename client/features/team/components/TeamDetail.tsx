import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  Calendar,
  Users2,
  Play,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/context";
import { useAllEmployees } from "@/features/auth/hooks";
import { useRooms } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";
import type { UserResponseDto } from "@/features/auth/api";

interface TeamDetailProps {
  teamId: string;
  teamName: string;
}

export default function TeamDetail({ teamId, teamName }: TeamDetailProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const team = user?.teams.find((t) => String(t.id) === teamId);
  const teamColor = team?.color || "#a855f7";

  const { data: employeesData, isLoading: isEmployeesLoading } = useAllEmployees({ size: 100 });
  const { data: roomsData, isLoading: isRoomsLoading } = useRooms(userId);

  const allEmployees: UserResponseDto[] = useMemo(
    () => employeesData?.content ?? [],
    [employeesData?.content],
  );

  const teamMembers = useMemo(
    () => allEmployees.filter((emp) => emp.teams.some((t) => String(t.id) === teamId)),
    [allEmployees, teamId],
  );

  const teamMeetings: MeetingRoomResponse[] = useMemo(
    () => (roomsData?.content ?? []).filter((room) => room.teamId === Number(teamId)),
    [roomsData, teamId],
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "WAITING":
        return "bg-blue-100 text-blue-700";
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

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-text-sub">팀 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="bg-gradient-to-br rounded-2xl p-8 border border-border/40"
        style={{ backgroundColor: teamColor }}
      >
        <h1 className="text-4xl font-bold mb-2 text-white">{teamName}</h1>
      </div>

      <div className="om-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 dark:text-purple-400 light:text-purple-600" />
            <h2 className="text-lg font-bold dark:text-white light:text-purple-900">팀원</h2>
            <span className="px-2 py-1 om-badge">
              {teamMembers.length}명
            </span>
          </div>
          {/* 팀원 추가는 팀 생성 시 memberIds로 관리 (별도 추가 API 미구현) */}
        </div>

        {isEmployeesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl p-4">
                <div className="h-5 dark:bg-purple-800 light:bg-purple-100 rounded w-3/4 mb-2" />
                <div className="h-4 dark:bg-purple-800 light:bg-purple-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm dark:text-white/60 light:text-purple-600">이 팀에 멤버가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-4 dark:hover:bg-white/[0.04] light:hover:bg-purple-50 rounded-xl transition-all duration-200 border dark:border-white/[0.06] light:border-purple-200/60 light:hover:shadow-sm"
              >
                <Avatar>
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium dark:text-white light:text-purple-900">{member.name}</p>
                  <p className="text-xs dark:text-white/60 light:text-purple-600">
                    {member.jobTitle?.name ?? "-"}
                  </p>
                  <p className="text-xs dark:text-white/40 light:text-purple-500 truncate">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="om-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 dark:text-purple-400 light:text-purple-600" />
            <h2 className="text-lg font-bold dark:text-white light:text-purple-900">회의 일정</h2>
            <span className="px-2 py-1 om-badge">
              {teamMeetings.length}개
            </span>
          </div>
        </div>

        {isRoomsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl p-5">
                <div className="h-5 dark:bg-purple-800 light:bg-purple-100 rounded w-3/4 mb-3" />
                <div className="h-4 dark:bg-purple-800 light:bg-purple-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : teamMeetings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm dark:text-white/60 light:text-purple-600">이 팀의 회의가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teamMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="om-card p-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-base font-bold dark:text-white light:text-purple-900">
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

                    <p className="text-sm dark:text-white/80 light:text-purple-700 mb-3">
                      {meeting.description || "설명 없음"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                        <span className="dark:text-white/70 light:text-purple-700">
                          {formatTime(meeting.startedAt || meeting.scheduledAt)}
                        </span>
                      </div>
                      {meeting.endedAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                          <span className="dark:text-white/70 light:text-purple-700">
                            {formatTime(meeting.endedAt)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                        <span className="dark:text-white/70 light:text-purple-700">
                          최대 {meeting.maxParticipants}명
                        </span>
                      </div>
                    </div>
                  </div>

                  {meeting.status === "ACTIVE" && (
                    <button
                      onClick={() => navigate(`/meeting/${meeting.id}`)}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 ml-2 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5" />
                      참여하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
