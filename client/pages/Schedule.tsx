import { useState } from "react";
import Layout from "@/components/Layout";
import CalendarView from "@/components/CalendarView";
import MeetingBookingModal from "@/components/MeetingBookingModal";
import { Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  participants: number;
  description: string;
  attendees: {
    name: string;
    avatar: string;
  }[];
}

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalDate, setBookingModalDate] = useState<Date | undefined>();

  const handleAddMeeting = (date: Date) => {
    setBookingModalDate(date);
    setIsBookingModalOpen(true);
  };

  // Sample meetings data - updated to current month for visibility
  const allMeetings: Meeting[] = [
    {
      id: "1",
      title: "팀 스탠드업",
      date: new Date(2026, 0, 13),
      time: "10:00 AM",
      duration: "30분",
      location: "회의실 A",
      participants: 5,
      description: "매주 화요일 정기 스탠드업 미팅",
      attendees: [
        {
          name: "김철수",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "2",
      title: "프로젝트 리뷰",
      date: new Date(2026, 0, 15),
      time: "2:00 PM",
      duration: "1시간",
      location: "온라인",
      participants: 8,
      description: "Q1 프로젝트 진행 상황 리뷰",
      attendees: [
        {
          name: "박민준",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
        {
          name: "정준호",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "3",
      title: "디자인 피드백",
      date: new Date(2026, 0, 17),
      time: "3:30 PM",
      duration: "45분",
      location: "회의실 B",
      participants: 4,
      description: "신규 UI 디자인 피드백 세션",
      attendees: [
        {
          name: "최수진",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "4",
      title: "클라이언트 미팅",
      date: new Date(2026, 0, 19),
      time: "11:00 AM",
      duration: "1.5시간",
      location: "온라인",
      participants: 6,
      description: "월간 클라이언트 진행 상황 보고",
      attendees: [
        {
          name: "임상현",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "5",
      title: "1:1 미팅",
      date: new Date(2026, 0, 21),
      time: "4:00 PM",
      duration: "30분",
      location: "회의실 C",
      participants: 2,
      description: "월간 성과 평가 및 피드백",
      attendees: [
        {
          name: "한지은",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "6",
      title: "마케팅 전략 회의",
      date: new Date(2026, 0, 14),
      time: "9:00 AM",
      duration: "1시간",
      location: "회의실 D",
      participants: 7,
      description: "Q1 마케팅 캠페인 전략 논의",
      attendees: [
        {
          name: "유혜정",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
        {
          name: "한지은",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "7",
      title: "기술 리뷰",
      date: new Date(2026, 0, 16),
      time: "1:00 PM",
      duration: "1.5시간",
      location: "온라인",
      participants: 9,
      description: "신규 기술 스택 검토 및 도입 계획",
      attendees: [
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
        {
          name: "박민준",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
    {
      id: "8",
      title: "팀 빌딩 이벤트",
      date: new Date(2026, 0, 20),
      time: "5:00 PM",
      duration: "2시간",
      location: "카페",
      participants: 12,
      description: "팀 워크 강화 및 네트워킹 세션",
      attendees: [
        {
          name: "김철수",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
        {
          name: "최수진",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
      ],
    },
  ];

  const selectedDateMeetings = allMeetings.filter((m) =>
    isSameDay(m.date, selectedDate),
  );

  return (
    <Layout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold dark:text-white/90 light:text-purple-950 mb-2">일정</h1>
          <p className="dark:text-white/60 light:text-purple-700 mb-4">예정된 회의를 확인하세요</p>
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700 dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-colors text-sm font-medium"
            title={isRightPanelOpen ? "상세보기 닫기" : "상세보기 열기"}
          >
            {isRightPanelOpen ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>상세보기 닫기</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>상세보기 열기</span>
              </>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div
          className={`grid gap-6 transition-all duration-300 ${
            isRightPanelOpen ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Calendar */}
          <div className="w-full flex flex-col gap-4">
            <CalendarView
              onSelectDate={setSelectedDate}
              meetings={allMeetings}
              onAddMeeting={handleAddMeeting}
            />
          </div>

          {/* Meetings List - Conditionally Shown */}
          {isRightPanelOpen && (
            <div className="w-full space-y-4">
              <div className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/70 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/30">
                <h2 className="text-xl font-bold dark:text-white/90 light:text-purple-950 mb-4">
                  {format(selectedDate, "MMMM dd, yyyy (EEEE)", { locale: ko })}
                  의 회의
                </h2>

                {selectedDateMeetings.length === 0 ? (
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
                            <span>{meeting.participants}명 참석</span>
                          </div>
                        </div>

                        <p className="text-sm dark:text-white/60 light:text-purple-700 mb-4">
                          {meeting.description}
                        </p>

                        {/* Attendees */}
                        <div className="flex items-center gap-2 mb-4">
                          {meeting.attendees.map((attendee, idx) => (
                            <img
                              key={idx}
                              src={attendee.avatar}
                              alt={attendee.name}
                              title={attendee.name}
                              className="w-8 h-8 rounded-full dark:border-2 dark:border-purple-500/30 light:border-2 light:border-purple-300 shadow-sm"
                            />
                          ))}
                        </div>

                        {/* Action Button */}
                        <button className="w-full px-4 py-2.5 dark:bg-purple-600 light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 text-white text-sm font-semibold rounded-xl dark:hover:bg-purple-700 light:hover:from-purple-700 light:hover:to-purple-800 transition-all duration-200">
                          회의 참여
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Meetings Summary */}
              <div className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-purple-50/50 light:via-white light:to-pink-100/30 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/70 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/30">
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 mb-4">
                  앞으로의 회의
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {allMeetings.slice(0, 4).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="dark:bg-purple-500/10 light:bg-white/70 rounded-xl p-3 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200/60 dark:hover:bg-purple-500/20 light:hover:shadow-md transition-all"
                    >
                      <p className="text-sm font-semibold dark:text-white/90 light:text-purple-950 truncate">
                        {meeting.title}
                      </p>
                      <p className="text-xs dark:text-white/60 light:text-purple-700">
                        {format(meeting.date, "M월 d일", { locale: ko })}
                      </p>
                      <p className="text-xs dark:text-purple-400 light:text-purple-600 font-medium">
                        {meeting.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Booking Modal */}
      <MeetingBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={bookingModalDate}
      />
    </Layout>
  );
}
