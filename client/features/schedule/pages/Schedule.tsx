import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import CalendarView from "@/features/schedule/components/CalendarView";
import MeetingBookingModal from "@/features/schedule/components/MeetingBookingModal";
import { Clock, MapPin, Users } from "lucide-react";
import { format, isSameDay, startOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/features/auth/context";
import { useScheduledRooms } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";

interface CalendarMeeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  participants: number;
  description: string;
  attendees: { name: string; avatar: string }[];
}

export default function Schedule() {
  useDocumentTitle("회의 일정 - OnMeet");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalDate, setBookingModalDate] = useState<Date | undefined>();

  const { data: scheduledData, isLoading } = useScheduledRooms(userId);

  const allMeetings: CalendarMeeting[] = useMemo(() => {
    const rooms: MeetingRoomResponse[] = scheduledData ?? [];
    return rooms.map((room) => {
      const scheduledDate = room.scheduledAt ? new Date(room.scheduledAt) : new Date(room.createdAt);
      return {
        id: String(room.id),
        title: room.title,
        date: scheduledDate,
        time: format(scheduledDate, "h:mm a"),
        duration: room.durationSeconds ? `${Math.round(room.durationSeconds / 60)}분` : "-",
        location: "온라인",
        participants: room.maxParticipants,
        description: room.description || "",
        attendees: [],
      };
    });
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
                    {selectedDateMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/60 rounded-2xl p-5 dark:hover:bg-purple-500/20 light:hover:shadow-lg light:hover:border-purple-400/70 transition-all duration-300"
                      >
                        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 mb-3">
                          {meeting.title}
                        </h3>

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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MeetingBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={bookingModalDate}
      />
    </>
  );
}
