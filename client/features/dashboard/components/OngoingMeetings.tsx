import { useState } from "react";
import { Clock, Users, Pencil, Trash2, Lock, Copy, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/features/auth/context";
import { useRooms, useScheduledRooms, useCancelSchedule } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";
import MeetingEditModal from "@/features/schedule/components/MeetingEditModal";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";

export default function OngoingMeetings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const { data: activeRoomsData, isLoading: isActiveLoading } = useRooms(userId, { status: "ACTIVE", hostUserId: user?.id });
  const { data: scheduledRoomsData, isLoading: isScheduledLoading } = useScheduledRooms(userId);
  const cancelScheduleMutation = useCancelSchedule();

  const [editTarget, setEditTarget] = useState<MeetingRoomResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MeetingRoomResponse | null>(null);

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
    navigate(`/meeting/${meeting.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cancelScheduleMutation.mutateAsync({
        roomId: deleteTarget.id,
        userId,
      });
      toast({ title: "회의가 삭제되었습니다" });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: "회의 삭제 실패", description: getErrorMessage(err, "회의 삭제에 실패했습니다"), variant: "destructive" });
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
        {meetings.map((meeting) => {
          const isHost = user?.id === meeting.hostUserId;
          const isUpcoming = meeting.displayStatus === "upcoming";

          return (
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
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 flex-1 leading-tight">
                      {meeting.title}
                    </h3>
                    {isHost && isUpcoming && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditTarget(meeting)}
                          className="p-1.5 rounded-lg dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors"
                          title="수정"
                        >
                          <Pencil className="w-4 h-4 dark:text-white/50 dark:hover:text-white/90 light:text-purple-500 light:hover:text-purple-700" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(meeting)}
                          className="p-1.5 rounded-lg dark:hover:bg-red-500/20 light:hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4 dark:text-white/50 dark:hover:text-red-400 light:text-purple-500 light:hover:text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {meeting.description && (
                    <p className="text-sm dark:text-white/60 light:text-purple-700 line-clamp-2">
                      {meeting.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {meeting.type === "SCHEDULED" && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100 light:text-blue-800">
                        예약
                      </span>
                    )}
                    {meeting.accessScope === "TEAM" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold dark:bg-cyan-500/20 dark:text-cyan-300 light:bg-cyan-100 light:text-cyan-800">
                        <Shield className="w-3 h-3" />팀
                      </span>
                    )}
                    {meeting.accessScope === "ALL" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold dark:bg-green-500/20 dark:text-green-300 light:bg-green-100 light:text-green-800">
                        <Globe className="w-3 h-3" />공개
                      </span>
                    )}
                    {meeting.locked && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold dark:bg-amber-500/20 dark:text-amber-300 light:bg-amber-100 light:text-amber-800">
                        <Lock className="w-3 h-3" />잠금
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs dark:text-white/50 light:text-purple-600">
                  <code
                    className="px-2 py-1 rounded dark:bg-purple-500/20 light:bg-purple-100 font-mono cursor-pointer hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(meeting.roomCode);
                      toast({ title: "회의 코드가 복사되었습니다" });
                    }}
                    title="클릭하여 복사"
                  >
                    <Copy className="w-3 h-3 inline mr-1" />{meeting.roomCode}
                  </code>
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
                  className={`w-full px-4 py-2.5 font-semibold rounded-xl text-sm transition-all duration-300 ${
                    meeting.displayStatus === "ongoing"
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {meeting.displayStatus === "ongoing"
                    ? "지금 바로 참여하기"
                    : "회의 시작하기"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editTarget && (
        <MeetingEditModal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          meetingId={String(editTarget.id)}
          initialTitle={editTarget.title}
          initialDescription={editTarget.description || ""}
          initialDate={new Date(editTarget.scheduledAt || editTarget.createdAt)}
          initialTime={format(new Date(editTarget.scheduledAt || editTarget.createdAt), "HH:mm")}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="dark:bg-gradient-to-br dark:from-purple-900/80 dark:via-black/90 dark:to-pink-900/60 light:bg-white rounded-2xl p-6 max-w-sm w-full dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/40 light:shadow-xl dark:backdrop-blur-xl">
            <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 mb-2">
              회의를 삭제하시겠습니까?
            </h3>
            <p className="text-sm dark:text-white/60 light:text-purple-600 mb-1">
              <span className="font-semibold dark:text-white/80 light:text-purple-800">{deleteTarget.title}</span>
            </p>
            <p className="text-xs dark:text-white/40 light:text-purple-500 mb-6">
              삭제된 회의는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={cancelScheduleMutation.isPending}
                className="flex-1 px-4 py-2.5 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-lg font-semibold hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={cancelScheduleMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
              >
                {cancelScheduleMutation.isPending ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
