import Layout from "@/components/Layout";
import { Clock, Search, X, Download, Share2, FileText, Mic, Zap, Play, Copy, Edit, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  team?: string;
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "in_progress" | "completed">("all");
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [featureFilter, setFeatureFilter] = useState<"all" | "transcript" | "voiceRecording" | "aiRecords">("all");
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null);
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

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
      team: "Marketing",
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
      team: "Product",
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
      team: "Design",
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
      team: "Marketing",
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
      team: "HR",
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

    let matchesFeature = true;
    if (featureFilter === "transcript") {
      matchesFeature = meeting.hasTranscript;
    } else if (featureFilter === "voiceRecording") {
      matchesFeature = meeting.status === "completed";
    } else if (featureFilter === "aiRecords") {
      matchesFeature = !!meeting.summary;
    }

    return matchesSearch && matchesTab && matchesFeature;
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
        return "dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100/90 light:text-blue-900 light:border light:border-blue-300/60 light:shadow-sm light:shadow-blue-200/40";
      case "in_progress":
        return "dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/90 light:text-green-900 light:border light:border-green-300/60 light:shadow-sm light:shadow-green-200/40";
      case "completed":
        return "dark:bg-gray-500/20 dark:text-gray-300 light:bg-gray-100/90 light:text-gray-900 light:border light:border-gray-300/60 light:shadow-sm light:shadow-gray-200/40";
      default:
        return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40";
    }
  };

  const renderExpandedCard = (meeting: Meeting) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-3">
            {meeting.title}
          </h2>
          <p className="dark:text-white/60 light:text-purple-700/90 font-medium">{meeting.description}</p>
        </div>
        <button
          onClick={() => setExpandedMeetingId(null)}
          className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
        </button>
      </div>

      {/* Status Badge and Team Info */}
      <div className="flex items-center gap-2">
        <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold ${getStatusColor(meeting.status)}`}>
          {getStatusLabel(meeting.status)}
        </span>
        {meeting.team && (
          <span className="dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-800 light:border light:border-purple-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
            {meeting.team}
          </span>
        )}
      </div>

      {/* Meeting Details Grid */}
      <div className="grid grid-cols-2 gap-6 pb-6 border-b dark:border-purple-500/20 light:border-purple-300">
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-2">
            회의 날짜
          </p>
          <p className="text-lg font-bold dark:text-white/90 light:text-purple-950">
            {format(meeting.date, "yyyy년 MMM dd, yyyy", { locale: ko })}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-2">
            시간
          </p>
          <p className="text-lg font-bold dark:text-white/90 light:text-purple-950">
            {meeting.time}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-2">
            소요 시간
          </p>
          <p className="text-lg font-bold dark:text-white/90 light:text-purple-950">
            {meeting.duration}
          </p>
        </div>
        <div>
          <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-2">
            참석자
          </p>
          <p className="text-lg font-bold dark:text-white/90 light:text-purple-950">
            {meeting.participants}명
          </p>
        </div>
      </div>

      {/* AI Transcript/Summary Section */}
      {meeting.summary && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
                회의록
              </h3>
              <span className="dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 light:shadow-purple-400/40 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI 생성
              </span>
            </div>
            <button
              onClick={() => {
                if (editingMeetingId === meeting.id) {
                  setEditingMeetingId(null);
                } else {
                  setEditingMeetingId(meeting.id);
                  setEditedContent({ ...editedContent, [meeting.id]: meeting.summary || "" });
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900 dark:hover:bg-purple-500/30 light:hover:bg-purple-100 rounded-lg transition-all"
            >
              {editingMeetingId === meeting.id ? (
                <>
                  <Check className="w-4 h-4" />
                  저장
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  수정
                </>
              )}
            </button>
          </div>

          {editingMeetingId === meeting.id ? (
            <textarea
              value={editedContent[meeting.id] || ""}
              onChange={(e) => setEditedContent({ ...editedContent, [meeting.id]: e.target.value })}
              className="w-full h-96 px-4 py-3 dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/70 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 dark:focus:ring-purple-500/40 light:focus:ring-purple-300/40"
              placeholder="마크다운 형식으로 회의록을 수정하세요..."
            />
          ) : (
            <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30 max-h-96 overflow-y-auto">
              <div className="prose dark:prose-invert prose-sm max-w-none dark:text-white/80 light:text-purple-900 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {editedContent[meeting.id] || meeting.summary}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Action Section */}
      {meeting.status === "completed" && (
        <div className="space-y-4">
          {/* Audio Player */}
          <div className="space-y-2">
            <p className="text-sm font-bold dark:text-white/70 light:text-purple-700">음성 녹음</p>
            <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-4 light:shadow-md light:shadow-purple-200/30">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAudioPlayingId(audioPlayingId === meeting.id ? null : meeting.id)}
                  className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white rounded-lg font-medium dark:hover:bg-purple-700 light:hover:bg-purple-700 transition-all"
                >
                  <Play className="w-4 h-4" />
                  {audioPlayingId === meeting.id ? "일시정지" : "재생"}
                </button>

                {/* Progress Bar */}
                <div className="flex-1 space-y-1">
                  <div className="h-2 dark:bg-purple-500/20 light:bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs dark:text-white/50 light:text-purple-600">
                    <span>1:25</span>
                    <span>4:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download and Share Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(showDownloadMenu === meeting.id ? null : meeting.id)}
                className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white rounded-lg font-medium dark:hover:bg-purple-700 light:hover:bg-purple-700 transition-all"
              >
                <Download className="w-4 h-4" />
                다운로드
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDownloadMenu === meeting.id && (
                <div className="absolute top-full left-0 mt-2 dark:bg-purple-900 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300 rounded-lg shadow-lg dark:shadow-purple-900/50 light:shadow-purple-300/30 py-1 z-10">
                  <button className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm">
                    🎵 음성 파일
                  </button>
                  <button className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm">
                    📄 로우 텍스트
                  </button>
                  <button className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm">
                    📋 전체 회의록
                  </button>
                </div>
              )}
            </div>

            {/* Share Button - Copy to Clipboard */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://meeting.app/transcripts/${meeting.id}`);
                setCopiedMeetingId(meeting.id);
                setTimeout(() => setCopiedMeetingId(null), 2000);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copiedMeetingId === meeting.id
                  ? "dark:bg-green-500/20 light:bg-green-100 dark:text-green-300 light:text-green-700"
                  : "dark:border dark:border-purple-500/30 light:border light:border-purple-300/50 dark:text-white/90 light:text-purple-700 dark:hover:bg-purple-500/10 light:hover:bg-purple-100/30"
              }`}
            >
              {copiedMeetingId === meeting.id ? (
                <>
                  <Check className="w-4 h-4" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  링크 공유
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Attendees */}
      <div>
        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950 mb-3">참석자</h3>
        <div className="flex flex-wrap gap-3">
          {meeting.attendees.map((attendee, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-500/10 light:bg-white/60 light:border light:border-purple-300/40 dark:border dark:border-purple-500/20 rounded-full light:shadow-md light:shadow-purple-200/30"
            >
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="w-8 h-8 rounded-full border-2 light:border-purple-300/40 dark:border-purple-500/20"
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
    <div className="text-left space-y-2">
      {/* Title with Team and Avatars */}
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
          {meeting.title}
        </h3>
        {meeting.team && (
          <span className="dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900 light:border light:border-purple-300/60 px-3 py-1 rounded-full text-xs font-bold light:shadow-sm light:shadow-purple-200/40">
            {meeting.team}
          </span>
        )}
        {/* Avatars */}
        <div className="flex items-center gap-1 ml-auto">
          {meeting.attendees.map((attendee, idx) => (
            <img
              key={idx}
              src={attendee.avatar}
              alt={attendee.name}
              title={attendee.name}
              className="w-6 h-6 rounded-full dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 object-cover light:shadow-md light:shadow-purple-200/40"
            />
          ))}
        </div>
      </div>

      {/* Status Badge */}
      <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(meeting.status)}`}>
        {getStatusLabel(meeting.status)}
      </span>

      {/* Date and Time */}
      <div className="flex items-center gap-2 text-sm dark:text-white/60 light:text-purple-900/80 font-medium">
        <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-700" />
        {format(meeting.date, "MMM dd", { locale: ko })} {meeting.time}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl space-y-6 light:bg-gradient-to-br light:from-purple-50 light:via-white light:to-blue-50 light:rounded-3xl light:p-8">
        {/* Header */}
        {!expandedMeeting && (
          <div>
            <h1 className="text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-2">
              회의 내역
            </h1>
            <p className="text-sm dark:text-white/50 light:text-purple-600/80 mb-8 font-medium">
              모든 회의 기록을 한눈에 관리하고 확인하세요
            </p>

            {/* Tabs */}
            <div className="flex gap-3 mb-8 border-b dark:border-purple-500/20 light:border-purple-300 pb-4">
              {[
                { id: "all" as const, label: "모든 회의" },
                { id: "scheduled" as const, label: "예정된 회의" },
                { id: "in_progress" as const, label: "진행중" },
                { id: "completed" as const, label: "완료된 회의" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white light:shadow-lg light:shadow-purple-300/40"
                      : "dark:bg-purple-500/10 dark:text-white/70 light:bg-white/60 light:text-purple-700 light:border light:border-purple-300/30 dark:hover:bg-purple-500/20 light:hover:bg-purple-100/70"
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
            {/* Search Bar with Filter Select */}
            <div className="flex gap-3">
              <select
                value={featureFilter}
                onChange={(e) => setFeatureFilter(e.target.value as any)}
                className="px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 dark:rounded-xl light:rounded-xl dark:bg-purple-500/10 light:bg-white/80 light:shadow-md light:shadow-purple-200/40 dark:focus:bg-purple-500/20 light:focus:bg-white light:focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all dark:text-white light:text-purple-900 text-sm appearance-none cursor-pointer font-medium"
              >
                <option value="all">모든 회의</option>
                <option value="transcript">회의록 있음</option>
                <option value="voiceRecording">음성녹음 있음</option>
                <option value="aiRecords">AI 회의록 있음</option>
              </select>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="회의 제목이나 내용으로 검색..."
                  className="w-full px-4 py-3 pl-12 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 dark:rounded-xl light:rounded-xl dark:bg-purple-500/10 light:bg-white/80 light:shadow-md light:shadow-purple-200/40 dark:focus:bg-purple-500/20 light:focus:bg-white light:focus:border-purple-400 dark:focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/70 font-medium"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/40 light:text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {expandedMeeting && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white/98 light:border-2 light:border-purple-200 light:shadow-xl light:shadow-purple-300/40 dark:border dark:border-purple-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                  <div
                    key={meeting.id}
                    className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white/95 light:border-2 light:border-purple-200 light:shadow-lg light:shadow-purple-300/30 dark:border dark:border-purple-500/30 rounded-2xl p-6 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-xl light:hover:shadow-purple-400/40 light:hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 dark:backdrop-blur-md light:backdrop-blur-sm group flex flex-col"
                  >
                    <button
                      onClick={() => setExpandedMeetingId(meeting.id)}
                      className="text-left flex-1"
                    >
                      {renderSimpleCard(meeting)}

                      {/* Summary Preview */}
                      {meeting.summary && (
                        <p className="text-sm dark:text-white/60 light:text-purple-800 line-clamp-2 mb-4 group-hover:dark:text-white/80 group-hover:light:text-purple-950 transition-colors font-medium">
                          {meeting.summary}
                        </p>
                      )}
                    </button>

                    {/* Meeting Features Chips - Only show for completed meetings */}
                    {meeting.status === "completed" && (
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {meeting.hasTranscript && (
                          <span className="dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/90 light:text-green-900 light:border light:border-green-300/60 light:shadow-sm light:shadow-green-200/40 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            회의록
                          </span>
                        )}
                        <span className="dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100/90 light:text-blue-900 light:border light:border-blue-300/60 light:shadow-sm light:shadow-blue-200/40 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5" />
                          음성녹음
                        </span>
                        {meeting.summary && (
                          <span className="dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white light:shadow-lg light:shadow-purple-400/40 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            AI 회의록
                            <span className="dark:bg-purple-700 light:bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1 font-semibold">
                              작업 완료
                            </span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Join Meeting Button - Only for in_progress meetings */}
                    {meeting.status === "in_progress" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/meeting");
                        }}
                        className="w-full mt-4 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-500 dark:to-green-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-green-500/40 light:shadow-green-400/50 hover:shadow-xl hover:shadow-green-500/50 light:hover:shadow-green-400/60"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        <span>회의 참여하기</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
