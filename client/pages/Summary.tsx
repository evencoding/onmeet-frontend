import Layout from "@/components/Layout";
import { Clock, Search, X, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  participants: number;
  description: string;
  status: "scheduled" | "in_progress" | "completed";
  summary?: string;
  key_points?: string[];
  attendees: {
    name: string;
    avatar: string;
  }[];
  notes?: string;
  hasTranscript?: boolean;
}

export default function Summary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "in_progress" | "completed">("all");
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [showTranscriptFilter, setShowTranscriptFilter] = useState(false);
  const [showVoiceRecordingFilter, setShowVoiceRecordingFilter] = useState(false);

  // Sample meetings data with status and summaries
  const allMeetings: Meeting[] = [
    {
      id: "1",
      title: "팀 스탠드업",
      date: new Date(2024, 0, 15),
      time: "10:00 AM",
      duration: "30분",
      participants: 5,
      description: "매주 월요일 정기 스탠드업 미팅",
      status: "completed",
      summary:
        "팀의 주간 진행 상황과 계획을 공유하는 회의였습니다. 각 팀원의 현재 진행 중인 업무와 다가오는 작업을 논의했습니다.",
      key_points: [
        "프로젝트 진도율 90% 달성",
        "신규 기능 개발 시작",
        "버그 수정 완료",
      ],
      attendees: [
        {
          name: "Akbar",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
        {
          name: "Riska",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
      ],
      notes: "주간 목표 검토 및 진도 확인",
      hasTranscript: true,
    },
    {
      id: "2",
      title: "프로젝트 리뷰",
      date: new Date(2024, 0, 16),
      time: "2:00 PM",
      duration: "1시간",
      participants: 8,
      description: "Q1 프로젝트 진행 상황 리뷰",
      status: "completed",
      summary:
        "Q1 분기 프로젝트의 진행 상황을 점검하고 향후 계획을 수립한 회의입니다. 목표 달성도와 리스크 요소를 분석했습니다.",
      key_points: [
        "목표 달성도 85%",
        "리스크 3개 식별",
        "다음 분기 계획 수립 완료",
      ],
      attendees: [
        {
          name: "Ameesh",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
        {
          name: "Jonathan",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
      notes: "Q1 프로젝트 진행 상황 논의",
      hasTranscript: true,
    },
    {
      id: "3",
      title: "디자인 피드백",
      date: new Date(2024, 0, 18),
      time: "3:30 PM",
      duration: "45분",
      participants: 4,
      description: "신규 UI 디자인 피드백 세션",
      status: "completed",
      summary:
        "신규 UI 디자인안에 대한 팀의 피드백과 개선사항을 논의한 회의입니다. 사용자 경험 개선에 집중했습니다.",
      key_points: [
        "UI 개선안 5개 제안",
        "사용성 테스트 일정 확정",
        "다음 주 리뷰 예정",
      ],
      attendees: [
        {
          name: "Natalia",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
      notes: "신규 UI 디자인 검토",
      hasTranscript: false,
    },
    {
      id: "4",
      title: "클라이언트 미팅",
      date: new Date(2024, 0, 20),
      time: "11:00 AM",
      duration: "1.5시간",
      participants: 6,
      description: "월간 클라이언트 진행 상황 보고",
      status: "in_progress",
      summary:
        "클라이언트와의 월간 진행 상황 보고 회의입니다. 프로젝트 진행 상황을 설명하고 피드백을 받았습니다.",
      key_points: [
        "프로젝트 진도 100% 달성",
        "클라이언트 만족도 95%",
        "계약 갱신 확정",
      ],
      attendees: [
        {
          name: "Aila",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        },
      ],
      notes: "월간 진행 상황 보고",
      hasTranscript: true,
    },
    {
      id: "5",
      title: "1:1 미팅",
      date: new Date(2024, 0, 22),
      time: "4:00 PM",
      duration: "30분",
      participants: 2,
      description: "월간 성과 평가 및 피드백",
      status: "scheduled",
      summary:
        "팀원과의 월간 1:1 미팅으로 성과를 평가하고 향후 계획을 논의했습니다.",
      key_points: [
        "월간 목표 100% 달성",
        "OKR 다음 월 설정",
        "경력 개발 계획 수립",
      ],
      attendees: [
        {
          name: "Manager",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        },
      ],
    },
  ];

  const filteredMeetings = allMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || meeting.status === activeTab;

    const matchesTranscript = !showTranscriptFilter || meeting.hasTranscript;

    const matchesVoiceRecording = !showVoiceRecordingFilter || (meeting.status === "completed");

    return matchesSearch && matchesTab && matchesTranscript && matchesVoiceRecording;
  });

  const expandedMeeting = allMeetings.find((m) => m.id === expandedMeetingId);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예정된 회의";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료된 회의";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100 light:text-blue-700";
      case "in_progress":
        return "dark:bg-green-500/20 dark:text-green-300 light:bg-green-100 light:text-green-700";
      case "completed":
        return "dark:bg-gray-500/20 dark:text-gray-300 light:bg-gray-100 light:text-gray-700";
      default:
        return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700";
    }
  };

  const renderExpandedCard = (meeting: Meeting) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold dark:text-white/90 light:text-purple-900 mb-3">
            {meeting.title}
          </h2>
          <p className="dark:text-white/60 light:text-purple-700">{meeting.description}</p>
        </div>
        <button
          onClick={() => setExpandedMeetingId(null)}
          className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
        </button>
      </div>

      {/* Status Badge */}
      <div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}>
          {getStatusLabel(meeting.status)}
        </span>
      </div>

      {/* Meeting Details Grid */}
      <div className="grid grid-cols-2 gap-6 pb-6 border-b dark:border-purple-500/20 light:border-purple-300/40">
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-700 font-semibold uppercase mb-2">
            회의 날짜
          </p>
          <p className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
            {format(meeting.date, "yyyy년 MMM dd, yyyy", { locale: ko })}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-700 font-semibold uppercase mb-2">
            시간
          </p>
          <p className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
            {meeting.time}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-700 font-semibold uppercase mb-2">
            소요 시간
          </p>
          <p className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
            {meeting.duration}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-700 font-semibold uppercase mb-2">
            참석자
          </p>
          <p className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
            {meeting.participants}명
          </p>
        </div>
      </div>

      {/* Notes */}
      {meeting.notes && (
        <div>
          <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900 mb-3">
            회의 메모
          </h3>
          <p className="dark:text-white/70 light:text-purple-800 dark:bg-purple-500/10 light:bg-purple-100/30 dark:border dark:border-purple-500/20 light:border light:border-purple-300/40 rounded-xl p-4">
            {meeting.notes}
          </p>
        </div>
      )}

      {/* Summary Section */}
      {meeting.summary && (
        <div>
          <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900 mb-3">
            회의 요약
          </h3>
          <p className="dark:text-white/70 light:text-purple-800 dark:bg-purple-500/10 light:bg-purple-100/30 dark:border dark:border-purple-500/20 light:border light:border-purple-300/40 rounded-xl p-4">
            {meeting.summary}
          </p>
        </div>
      )}

      {/* Key Points */}
      {meeting.key_points && meeting.key_points.length > 0 && (
        <div>
          <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900 mb-3">
            주요 포인트
          </h3>
          <div className="space-y-2">
            {meeting.key_points.map((point, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 dark:bg-purple-500/10 light:bg-purple-100/30 dark:border dark:border-purple-500/20 light:border light:border-purple-300/40 rounded-lg"
              >
                <span className="dark:text-purple-400 light:text-purple-600 font-bold flex-shrink-0">
                  •
                </span>
                <span className="dark:text-white/70 light:text-purple-900">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {meeting.status === "completed" && (
        <div className="flex flex-wrap gap-3 pt-4">
          <button className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white rounded-lg font-medium dark:hover:bg-purple-700 light:hover:bg-purple-700 transition-all">
            🎙️ 음성녹음 재생
          </button>
          <button className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white rounded-lg font-medium dark:hover:bg-purple-700 light:hover:bg-purple-700 transition-all">
            <Download className="w-4 h-4" />
            다운로드
          </button>
          <button className="flex items-center gap-2 px-4 py-2 dark:border dark:border-purple-500/30 light:border light:border-purple-300/50 dark:text-white/90 light:text-purple-700 rounded-lg font-medium dark:hover:bg-purple-500/10 light:hover:bg-purple-100/30 transition-all">
            <Share2 className="w-4 h-4" />
            공유
          </button>
        </div>
      )}

      {/* Attendees */}
      <div>
        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900 mb-3">참석자</h3>
        <div className="flex flex-wrap gap-3">
          {meeting.attendees.map((attendee, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-500/10 light:bg-purple-100/30 dark:border dark:border-purple-500/20 light:border light:border-purple-300/40 rounded-full"
            >
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium dark:text-white/90 light:text-purple-900">
                {attendee.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimpleCard = (meeting: Meeting) => (
    <div className="text-left">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900">
          {meeting.title}
        </h3>
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(meeting.status)}`}>
          {getStatusLabel(meeting.status)}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-sm dark:text-white/60 light:text-purple-700 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
          {format(meeting.date, "MMM dd", { locale: ko })} {meeting.time}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl space-y-6">
        {/* Header */}
        {!expandedMeeting && (
          <div>
            <h1 className="text-3xl font-bold dark:text-white/90 light:text-purple-900 mb-6">
              회의 내역
            </h1>

            {/* Tabs */}
            <div className="flex gap-3 mb-6 border-b dark:border-purple-500/20 light:border-purple-300/40 pb-4">
              {[
                { id: "all" as const, label: "모든 회의" },
                { id: "scheduled" as const, label: "예정된 회의" },
                { id: "in_progress" as const, label: "진행중" },
                { id: "completed" as const, label: "완료된 회의" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white"
                      : "dark:bg-purple-500/10 light:bg-purple-100/30 dark:text-white/70 light:text-purple-700 dark:hover:bg-purple-500/20 light:hover:bg-purple-100/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {!expandedMeeting && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="회의 제목이나 내용으로 검색..."
                className="w-full px-4 py-3 pl-12 dark:border dark:border-purple-500/30 light:border light:border-purple-300/50 dark:rounded-xl light:rounded-xl dark:bg-purple-500/10 light:bg-purple-100/30 dark:focus:bg-purple-500/20 light:focus:bg-purple-100/50 dark:focus:border-purple-400 light:focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/60"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/40 light:text-purple-600" />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowTranscriptFilter(!showTranscriptFilter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showTranscriptFilter
                    ? "dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white"
                    : "dark:bg-purple-500/20 light:bg-purple-100/50 dark:text-white/70 light:text-purple-700 dark:hover:bg-purple-500/30 light:hover:bg-purple-100/70"
                }`}
              >
                📄 회의록 있음
              </button>
              <button
                onClick={() => setShowVoiceRecordingFilter(!showVoiceRecordingFilter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showVoiceRecordingFilter
                    ? "dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white"
                    : "dark:bg-purple-500/20 light:bg-purple-100/50 dark:text-white/70 light:text-purple-700 dark:hover:bg-purple-500/30 light:hover:bg-purple-100/70"
                }`}
              >
                🎙️ 음성녹음 있음
              </button>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {expandedMeeting && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-white/80 light:to-purple-50 dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {renderExpandedCard(expandedMeeting)}
          </div>
        )}

        {/* Grid View */}
        {!expandedMeeting && (
          <>
            {filteredMeetings.length === 0 ? (
              <div className="text-center py-12">
                <p className="dark:text-white/60 light:text-purple-700 mb-2">
                  회의 기록이 없습니다
                </p>
                <p className="text-xs dark:text-white/40 light:text-purple-600">
                  검색 조건을 변경하거나 다른 키워드를 시도해보세요
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setExpandedMeetingId(meeting.id)}
                    className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-white/80 light:to-purple-50 dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-2xl p-6 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-lg light:hover:shadow-purple-300/20 hover:-translate-y-1 transition-all duration-300 text-left group dark:backdrop-blur-md light:backdrop-blur-sm"
                  >
                    {renderSimpleCard(meeting)}

                    {/* Summary Preview */}
                    {meeting.summary && (
                      <p className="text-sm dark:text-white/60 light:text-purple-700 line-clamp-2 mb-4 group-hover:dark:text-white/80 group-hover:light:text-purple-900 transition-colors">
                        {meeting.summary}
                      </p>
                    )}

                    {/* Key Points Preview */}
                    {meeting.key_points && meeting.key_points.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold dark:text-purple-400 light:text-purple-600 mb-2">
                          주요 포인트
                        </p>
                        <div className="space-y-1">
                          {meeting.key_points.slice(0, 2).map((point, idx) => (
                            <p
                              key={idx}
                              className="text-xs dark:text-white/60 light:text-purple-700 flex items-start gap-2"
                            >
                              <span className="dark:text-purple-400 light:text-purple-600 flex-shrink-0">
                                •
                              </span>
                              <span className="line-clamp-1">{point}</span>
                            </p>
                          ))}
                          {meeting.key_points.length > 2 && (
                            <p className="text-xs dark:text-purple-400 light:text-purple-600 font-medium">
                              +{meeting.key_points.length - 2}개 더보기
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meeting Features */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {meeting.hasTranscript && (
                          <span className="dark:bg-green-500/20 dark:text-green-300 light:bg-green-100 light:text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            📄 회의록
                          </span>
                        )}
                        {meeting.status === "completed" && (
                          <span className="dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100 light:text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            🎙️ 음성녹음
                          </span>
                        )}
                        {meeting.summary && (
                          <span className="dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                            🤖 AI 회의록
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.attendees.map((attendee, idx) => (
                          <img
                            key={idx}
                            src={attendee.avatar}
                            alt={attendee.name}
                            title={attendee.name}
                            className="w-7 h-7 rounded-full dark:border-2 light:border-2 dark:border-purple-500/30 light:border-purple-300/50 shadow-sm object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
