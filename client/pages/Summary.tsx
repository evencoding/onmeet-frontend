import Layout from "@/components/Layout";
import MeetingDetailPanel from "@/components/MeetingDetailPanel";
import { Clock, MapPin, Users, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
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
  summary?: string;
  key_points?: string[];
  attendees: {
    name: string;
    avatar: string;
  }[];
}

export default function Summary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Sample meetings data with summaries
  const allMeetings: Meeting[] = [
    {
      id: "1",
      title: "팀 스탠드업",
      date: new Date(2024, 0, 15),
      time: "10:00 AM",
      duration: "30분",
      location: "회의실 A",
      participants: 5,
      description: "매주 월요일 정기 스탠드업 미팅",
      summary: "팀의 주간 진행 상황과 계획을 공유하는 회의였습니다. 각 팀원의 현재 진행 중인 업무와 다가오는 작업을 논의했습니다.",
      key_points: ["프로젝트 진도율 90% 달성", "신규 기능 개발 시작", "버그 수정 완료"],
      attendees: [
        { name: "Akbar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "Riska", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
      ],
    },
    {
      id: "2",
      title: "프로젝트 리뷰",
      date: new Date(2024, 0, 16),
      time: "2:00 PM",
      duration: "1시간",
      location: "온라인",
      participants: 8,
      description: "Q1 프로젝트 진행 상황 리뷰",
      summary: "Q1 분기 프로젝트의 진행 상황을 점검하고 향후 계획을 수립한 회의입니다. 목표 달성도와 리스크 요소를 분석했습니다.",
      key_points: ["목표 달성도 85%", "리스크 3개 식별", "다음 분기 계획 수립 완료"],
      attendees: [
        { name: "Ameesh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
        { name: "Jonathan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
      ],
    },
    {
      id: "3",
      title: "디자인 피드백",
      date: new Date(2024, 0, 18),
      time: "3:30 PM",
      duration: "45분",
      location: "회의실 B",
      participants: 4,
      description: "신규 UI 디자인 피드백 세션",
      summary: "신규 UI 디자인안에 대한 팀의 피드백과 개선사항을 논의한 회의입니다. 사용자 경험 개선에 집중했습니다.",
      key_points: ["UI 개선안 5개 제안", "사용성 테스트 일정 확정", "다음 주 리뷰 예정"],
      attendees: [
        { name: "Natalia", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
      ],
    },
    {
      id: "4",
      title: "클라이언트 미팅",
      date: new Date(2024, 0, 20),
      time: "11:00 AM",
      duration: "1.5시간",
      location: "온라인",
      participants: 6,
      description: "월간 클라이언트 진행 상황 보고",
      summary: "클라이언트와의 월간 진행 상황 보고 회의입니다. 프로젝트 진행 상황을 설명하고 피드백을 받았습니다.",
      key_points: ["프로젝트 진도 100% 달성", "클라이언트 만족도 95%", "계약 갱신 확정"],
      attendees: [
        { name: "Aila", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
      ],
    },
    {
      id: "5",
      title: "1:1 미팅",
      date: new Date(2024, 0, 22),
      time: "4:00 PM",
      duration: "30분",
      location: "회의실 C",
      participants: 2,
      description: "월간 성과 평가 및 피드백",
      summary: "팀원과의 월간 1:1 미팅으로 성과를 평가하고 향후 계획을 논의했습니다.",
      key_points: ["월간 목표 100% 달성", "OKR 다음 월 설정", "경력 개발 계획 수립"],
      attendees: [
        { name: "Manager", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
      ],
    },
  ];

  const filteredMeetings = allMeetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">요약본</h1>
          <p className="text-text-sub">지난 회의 내용을 확인하세요</p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회의 제목이나 내용으로 검색..."
            className="w-full px-4 py-3 pl-12 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        {/* Meetings List */}
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-sub mb-2">회의 기록이 없습니다</p>
            <p className="text-xs text-muted-foreground">
              검색 조건을 변경하거나 다른 키워드를 시도해보세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {meeting.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-text-sub">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-brand-500" />
                        {format(meeting.date, "MMM dd, yyyy", { locale: ko })} {meeting.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        {meeting.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-brand-500" />
                        {meeting.participants}명
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-full">
                    완료
                  </span>
                </div>

                {/* Summary */}
                {meeting.summary && (
                  <div className="mb-4 pb-4 border-b border-border/20">
                    <p className="text-sm text-foreground leading-relaxed">
                      {meeting.summary}
                    </p>
                  </div>
                )}

                {/* Key Points */}
                {meeting.key_points && meeting.key_points.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      주요 포인트
                    </h4>
                    <ul className="space-y-1">
                      {meeting.key_points.map((point, idx) => (
                        <li key={idx} className="text-sm text-text-sub flex items-start gap-2">
                          <span className="text-brand-500 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attendees */}
                <div className="flex items-center gap-2">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
