import { useState } from "react";
import Layout from "@/components/Layout";
import CalendarView from "@/components/CalendarView";
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
          <h1 className="text-3xl font-bold text-foreground mb-2">일정</h1>
          <p className="text-text-sub mb-4">예정된 회의를 확인하세요</p>
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors text-sm font-medium"
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
            />
          </div>

          {/* Meetings List - Conditionally Shown */}
          {isRightPanelOpen && (
            <div className="w-full space-y-4">
              <div className="bg-white/40 backdrop-blur-md border border-border/30 rounded-3xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {format(selectedDate, "MMMM dd, yyyy (EEEE)", { locale: ko })}
                  의 회의
                </h2>

                {selectedDateMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-text-sub mb-2">예정된 회의가 없습니다</p>
                    <p className="text-xs text-muted-foreground">
                      다른 날짜를 선택하거나 새로운 회의를 생성하세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                      >
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {meeting.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Clock className="w-4 h-4 text-brand-500" />
                            <span>
                              {meeting.time} - {meeting.duration}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="w-4 h-4 text-brand-500" />
                            <span>{meeting.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Users className="w-4 h-4 text-brand-500" />
                            <span>{meeting.participants}명 참석</span>
                          </div>
                        </div>

                        <p className="text-sm text-text-sub mb-4">
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
                              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            />
                          ))}
                        </div>

                        {/* Action Button */}
                        <button className="w-full px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
                          회의 참여
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Meetings Summary */}
              <div className="bg-gradient-to-r from-brand-50 to-brand-50 border border-brand-200 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  앞으로의 회의
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {allMeetings.slice(0, 4).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white/60 rounded-xl p-3 border border-border/30 hover:shadow-md transition-all"
                    >
                      <p className="text-sm font-semibold text-foreground truncate">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-text-sub">
                        {format(meeting.date, "M월 d일", { locale: ko })}
                      </p>
                      <p className="text-xs text-brand-600 font-medium">
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
    </Layout>
  );
}
