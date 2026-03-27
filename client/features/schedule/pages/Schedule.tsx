import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import CalendarView from "@/features/schedule/components/CalendarView";
import MeetingBookingModal from "@/features/schedule/components/MeetingBookingModal";
import MeetingEditModal from "@/features/schedule/components/MeetingEditModal";
import { Clock, MapPin, Users, Pencil, Trash2, Lock, Copy } from "lucide-react";
import { format, isSameDay, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/features/auth/context";
import { useCancelSchedule, useScheduledRooms } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";
import { toCalendarMeetingViewModel, type CalendarMeetingViewModel } from "@/shared/adapters/meeting";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";

export default function Schedule() {
  useDocumentTitle("회의 일정 - OnMeet");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalDate, setBookingModalDate] = useState<Date | undefined>();

  const [editTarget, setEditTarget] = useState<CalendarMeetingViewModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarMeetingViewModel | null>(null);

  const cancelScheduleMutation = useCancelSchedule();

  const { data: scheduledData, isLoading } = useScheduledRooms(userId);

  const allMeetings: CalendarMeetingViewModel[] = useMemo(() => {
    const rooms: MeetingRoomResponse[] = scheduledData?.content ?? [];
    return rooms.map(toCalendarMeetingViewModel);
  }, [scheduledData]);

  const handleAddMeeting = (date: Date) => {
    setBookingModalDate(date);
    setIsBookingModalOpen(true);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelectedDate(today);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cancelScheduleMutation.mutateAsync({
        roomId: Number(deleteTarget.id),
        userId,
      });
      toast({ title: "회의가 삭제되었습니다" });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: "회의 삭제 실패", description: getErrorMessage(err, "회의 삭제에 실패했습니다"), variant: "destructive" });
    }
  };

  const selectedDateMeetings = allMeetings.filter((m) =>
    isSameDay(m.date, selectedDate),
  );

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold dark:text-white/90 light:text-purple-950 mb-2">일정</h1>
            <p className="dark:text-white/60 light:text-purple-700">예정된 회의를 확인하세요</p>
          </div>
          <button
            onClick={handleGoToToday}
            className="ml-auto px-4 py-2 rounded-lg dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700 dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-colors text-sm font-medium"
          >
            오늘
          </button>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-6">
          <div className="min-w-0 flex flex-col gap-4">
            <CalendarView
              onSelectDate={setSelectedDate}
              meetings={allMeetings}
              onAddMeeting={handleAddMeeting}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          <div>
            <div className="min-w-[320px] space-y-4">
              <div className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/70 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/30">
                <h2 className="text-xl font-bold dark:text-white/90 light:text-purple-950 mb-4">
                  {format(selectedDate, "MMMM dd, yyyy (EEEE)", { locale: ko })}
                  의 회의
                </h2>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse rounded-2xl p-5">
                        <div className="h-5 dark:bg-purple-800 light:bg-purple-100 rounded w-3/4 mb-3" />
                        <div className="h-4 dark:bg-purple-800 light:bg-purple-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : selectedDateMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="dark:text-white/60 light:text-purple-700 mb-2">예정된 회의가 없습니다</p>
                    <p className="text-xs dark:text-white/40 light:text-purple-600">
                      다른 날짜를 선택하거나 새로운 회의를 생성하세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateMeetings.map((meeting) => {
                      const isHost = user?.id === meeting.hostUserId;
                      return (
                        <div
                          key={meeting.id}
                          className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/60 rounded-2xl p-5 dark:hover:bg-purple-500/20 light:hover:shadow-lg light:hover:border-purple-400/70 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
                                  {meeting.title}
                                </h3>
                                {meeting.locked && (
                                  <Lock className="w-4 h-4 dark:text-amber-400 light:text-amber-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                            {isHost && meeting.roomStatus === "WAITING" && (
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

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm dark:text-white/70 light:text-purple-900">
                              <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                              <span>
                                {meeting.time} - {meeting.duration}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm dark:text-white/70 light:text-purple-900">
                              <MapPin className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                              <span>{meeting.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm dark:text-white/70 light:text-purple-900">
                              <Users className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                              <span>최대 {meeting.participants}명</span>
                            </div>

                            <code
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono dark:bg-purple-500/15 dark:text-white/50 light:bg-purple-100 light:text-purple-600 cursor-pointer hover:dark:bg-purple-500/25 hover:light:bg-purple-200 transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(meeting.roomCode);
                                toast({ title: "회의 코드가 복사되었습니다" });
                              }}
                              title="클릭하여 복사"
                            >
                              <Copy className="w-3 h-3" />{meeting.roomCode}
                            </code>
                          </div>

                          <p className="text-sm dark:text-white/60 light:text-purple-700 mb-4">
                            {meeting.description || "설명 없음"}
                          </p>

                          <button
                            onClick={() => navigate(`/meeting/${meeting.id}`)}
                            className="w-full px-4 py-2.5 dark:bg-purple-600 light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 text-white text-sm font-semibold rounded-xl dark:hover:bg-purple-700 light:hover:from-purple-700 light:hover:to-purple-800 transition-all duration-200"
                          >
                            회의 참여
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <MeetingBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          selectedDate={bookingModalDate}
        />
      )}

      {editTarget && (
        <MeetingEditModal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          meetingId={editTarget.id}
          initialTitle={editTarget.title}
          initialDescription={editTarget.description}
          initialDate={editTarget.date}
          initialTime={format(new Date(editTarget.scheduledAt), "HH:mm")}
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
    </>
  );
}
