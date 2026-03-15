import { Clock, Search, X, Download, Share2, FileText, Mic, Zap, Play, Copy, Edit, Check, ChevronDown, Music, FileCode, BookOpen, Tag, Volume2 } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import RichTextEditor from "@/features/dashboard/components/RichTextEditor";
import { useAuth } from "@/features/auth/context";
import { useRooms } from "@/features/meeting/hooks/useRoom";
import { useRoomHistory, useScheduledRooms } from "@/features/meeting/hooks/useRoomDiscovery";
import { useRecordings, useRecordingDownloadUrl } from "@/features/meeting/hooks/useRecording";
import { useMinutes, useTranscript, useUpdateMinutes } from "@/features/ai/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api/types";

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
  rawTranscript?: string;
  key_points?: string[];
  attendees: {
    name: string;
    avatar: string;
  }[];
  notes?: string;
  hasTranscript?: boolean;
  tags?: string[];
}

function mapStatus(status: MeetingRoomResponse["status"]): Meeting["status"] {
  switch (status) {
    case "WAITING":
      return "scheduled";
    case "ACTIVE":
      return "in_progress";
    case "ENDED":
      return "completed";
    case "CANCELLED":
      return "completed";
    default:
      return "completed";
  }
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0분";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분`;
  if (hours > 0) return `${hours}시간`;
  return `${minutes}분`;
}

function formatTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return format(d, "h:mm a");
  } catch {
    return "";
  }
}

function mapMeetingRoomToMeeting(room: MeetingRoomResponse): Meeting {
  const dateObj = room.scheduledAt
    ? new Date(room.scheduledAt)
    : room.startedAt
      ? new Date(room.startedAt)
      : new Date(room.createdAt);

  return {
    id: String(room.id),
    title: room.title || "제목 없음",
    date: dateObj,
    time: formatTime(room.scheduledAt || room.startedAt || room.createdAt),
    duration: formatDuration(room.durationSeconds),
    participants: room.maxParticipants,
    description: room.description || "",
    status: mapStatus(room.status),
    attendees: [],
    hasTranscript: room.status === "ENDED",
    tags: [],
  };
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/30 light:to-pink-100/20 light:border-2 light:border-purple-300/70 light:shadow-lg light:shadow-purple-300/30 dark:border dark:border-purple-500/30 rounded-2xl p-6 animate-pulse"
        >
          <div className="space-y-3">
            <div className="h-5 dark:bg-purple-500/20 light:bg-purple-200/60 rounded w-3/4" />
            <div className="h-4 dark:bg-purple-500/10 light:bg-purple-100/60 rounded w-1/3" />
            <div className="h-4 dark:bg-purple-500/10 light:bg-purple-100/60 rounded w-1/2" />
            <div className="h-3 dark:bg-purple-500/10 light:bg-purple-100/60 rounded w-full" />
            <div className="h-3 dark:bg-purple-500/10 light:bg-purple-100/60 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Summary() {
  useDocumentTitle("회의 내역 - OnMeet");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "in_progress" | "completed">("all");
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [featureFilter, setFeatureFilter] = useState<"all" | "transcript" | "voiceRecording" | "aiRecords">("all");
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null);
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const [audioDuration, setAudioDuration] = useState<Record<string, number>>({ default: 240 });
  const [audioVolume, setAudioVolume] = useState<Record<string, number>>({ default: 1 });
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<Record<string, number>>({ default: 1 });
  const [transcriptTab, setTranscriptTab] = useState<Record<string, "full" | "raw">>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Fetch meetings from API ---
  const { data: historyData, isLoading: isHistoryLoading } = useRoomHistory(userId);
  const { data: scheduledData, isLoading: isScheduledLoading } = useScheduledRooms(userId);
  const { data: activeData, isLoading: isActiveLoading } = useRooms(userId, { status: "ACTIVE" });

  const isLoading = isHistoryLoading || isScheduledLoading || isActiveLoading;

  const allMeetings: Meeting[] = useMemo(() => {
    const roomMap = new Map<number, MeetingRoomResponse>();

    const historyContent = historyData ?? [];
    const scheduledContent = scheduledData ?? [];
    const activeContent = activeData?.content ?? [];

    for (const room of historyContent) {
      roomMap.set(room.id, room);
    }
    for (const room of scheduledContent) {
      if (!roomMap.has(room.id)) {
        roomMap.set(room.id, room);
      }
    }
    for (const room of activeContent) {
      if (!roomMap.has(room.id)) {
        roomMap.set(room.id, room);
      }
    }

    return Array.from(roomMap.values()).map(mapMeetingRoomToMeeting);
  }, [historyData, scheduledData, activeData]);

  // --- AI hooks (always called, rely on `enabled` inside the hooks) ---
  const expandedRoomId = expandedMeetingId ? Number(expandedMeetingId) : 0;

  const { data: minutesData, isLoading: isMinutesLoading } = useMinutes(expandedRoomId, userId);
  const { data: transcriptData, isLoading: isTranscriptLoading } = useTranscript(expandedRoomId, userId);

  const updateMinutesMutation = useUpdateMinutes();

  // --- Recordings for expanded meeting ---
  const { data: recordingsData } = useRecordings(expandedRoomId, userId);
  const downloadMutation = useRecordingDownloadUrl();

  const firstRecordingUrl = useMemo(() => {
    if (recordingsData && recordingsData.length > 0 && recordingsData[0].s3Path) {
      return recordingsData[0].s3Path;
    }
    return null;
  }, [recordingsData]);

  // --- Manage audio element ---
  useEffect(() => {
    if (audioRef.current && firstRecordingUrl) {
      audioRef.current.src = firstRecordingUrl;
    }
  }, [firstRecordingUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !expandedMeetingId) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((prev) => ({ ...prev, [expandedMeetingId]: audio.currentTime / audio.duration }));
        setAudioDuration((prev) => ({ ...prev, [expandedMeetingId]: Math.floor(audio.duration) }));
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [expandedMeetingId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !expandedMeetingId) return;
    audio.volume = audioVolume[expandedMeetingId] ?? 1;
  }, [audioVolume, expandedMeetingId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !expandedMeetingId) return;
    audio.playbackRate = audioPlaybackSpeed[expandedMeetingId] ?? 1;
  }, [audioPlaybackSpeed, expandedMeetingId]);

  // --- Derive display data for expanded meeting ---
  const expandedSummary = minutesData?.summary ?? undefined;
  const expandedKeyPoints = minutesData?.keyPoints ?? undefined;
  const expandedRawTranscript = useMemo(() => {
    if (!transcriptData?.segments || transcriptData.segments.length === 0) return undefined;
    return transcriptData.segments
      .map((seg) => `[${seg.timestamp}] ${seg.speaker}: ${seg.content}`)
      .join("\n");
  }, [transcriptData]);
  const expandedFullText = transcriptData?.fullText ?? undefined;

  const filteredMeetings = allMeetings.filter((meeting) => {
    const meetingSummary = meeting.id === expandedMeetingId ? expandedSummary : undefined;

    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meetingSummary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || meeting.status === activeTab;

    let matchesFeature = true;
    if (featureFilter === "transcript") {
      matchesFeature = !!meeting.hasTranscript;
    } else if (featureFilter === "voiceRecording") {
      matchesFeature = meeting.status === "completed";
    } else if (featureFilter === "aiRecords") {
      matchesFeature = meeting.status === "completed";
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
        return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40";
      case "in_progress":
        return "dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/90 light:text-green-900 light:border light:border-green-300/60 light:shadow-sm light:shadow-green-200/40";
      case "completed":
        return "dark:bg-gray-500/20 dark:text-gray-300 light:bg-gray-100/90 light:text-gray-900 light:border light:border-gray-300/60 light:shadow-sm light:shadow-gray-200/40";
      default:
        return "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40";
    }
  };

  const handleSave = (meetingId: string) => {
    updateMinutesMutation.mutate({
      roomId: Number(meetingId),
      userId,
      data: { summary: editedContent[meetingId] },
    });
    setEditingMeetingId(null);
  };

  const handleDownload = (recordingId: number) => {
    downloadMutation.mutate(
      { recordingId, userId },
      {
        onSuccess: (url) => {
          if (url) window.open(url as string, "_blank");
        },
      },
    );
  };

  const renderExpandedCard = (meeting: Meeting) => {
    const summary = expandedSummary;
    const keyPoints = expandedKeyPoints;
    const rawTranscript = expandedRawTranscript;
    const hasRecordings = recordingsData && recordingsData.length > 0;

    return (
      <div className="space-y-6">

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

        <div className="space-y-6 pb-6 border-b dark:border-purple-500/20 light:border-purple-300">

          <div>
            <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-3">
              일정
            </p>
            <div className="space-y-2">
              <p className="text-sm dark:text-white/90 light:text-purple-950 font-medium">
                {format(meeting.date, "yyyy년 MMM dd일 (eee)", { locale: ko })}
              </p>
              <p className="text-sm dark:text-white/80 light:text-purple-900">
                시작: <span className="font-semibold">{meeting.time}</span> • 소요시간: <span className="font-semibold">{meeting.duration}</span>
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-3">
              태그
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {meeting.tags && meeting.tags.length > 0 ? (
                meeting.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900 light:border light:border-purple-300/60 text-xs font-semibold rounded-full light:shadow-sm light:shadow-purple-200/30"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-xs dark:text-white/50 light:text-purple-600">태그가 없습니다.</p>
              )}
            </div>
            <button className="text-xs px-3 py-1.5 dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/60 light:text-purple-900 dark:hover:bg-purple-500/30 light:hover:bg-purple-100 rounded-lg transition-all font-medium">
              + 태그 추가
            </button>
          </div>
        </div>

        {isMinutesLoading || isTranscriptLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 dark:bg-purple-500/20 light:bg-purple-200/60 rounded w-1/3" />
            <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6">
              <div className="space-y-2">
                <div className="h-4 dark:bg-purple-500/15 light:bg-purple-100/60 rounded w-full" />
                <div className="h-4 dark:bg-purple-500/15 light:bg-purple-100/60 rounded w-5/6" />
                <div className="h-4 dark:bg-purple-500/15 light:bg-purple-100/60 rounded w-3/4" />
              </div>
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-4">

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
                  AI 회의 요약
                </h3>
                <span className="dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 light:shadow-purple-400/40 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  AI 생성
                </span>
              </div>
              <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30">
                <p className="dark:text-white/80 light:text-purple-900 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>

              {keyPoints && keyPoints.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-bold dark:text-white/70 light:text-purple-700 mb-2">주요 포인트</p>
                  <ul className="space-y-1">
                    {keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm dark:text-white/70 light:text-purple-800">
                        <span className="dark:text-purple-400 light:text-purple-600 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
                  전체 회의록
                </h3>
                <button
                  onClick={() => {
                    if (editingMeetingId === meeting.id) {
                      handleSave(meeting.id);
                    } else {
                      setEditingMeetingId(meeting.id);
                      setEditedContent({ ...editedContent, [meeting.id]: summary || "" });
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

              <div className="flex gap-2 border-b dark:border-purple-500/20 light:border-purple-300">
                <button
                  onClick={() => setTranscriptTab({ ...transcriptTab, [meeting.id]: "full" })}
                  className={`px-4 py-2 font-medium text-sm transition-all ${
                    (transcriptTab[meeting.id] ?? "full") === "full"
                      ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-900 border-b-2 dark:border-purple-400 light:border-purple-600"
                      : "dark:text-white/60 light:text-purple-700 dark:hover:text-white light:hover:text-purple-900"
                  }`}
                >
                  전체 회의록
                </button>
                {rawTranscript && (
                  <button
                    onClick={() => setTranscriptTab({ ...transcriptTab, [meeting.id]: "raw" })}
                    className={`px-4 py-2 font-medium text-sm transition-all ${
                      (transcriptTab[meeting.id] ?? "full") === "raw"
                        ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-900 border-b-2 dark:border-purple-400 light:border-purple-600"
                        : "dark:text-white/60 light:text-purple-700 dark:hover:text-white light:hover:text-purple-900"
                    }`}
                  >
                    로우 회의록
                  </button>
                )}
              </div>

              {(transcriptTab[meeting.id] ?? "full") === "full" && (
                <div className="space-y-2">
                  {editingMeetingId === meeting.id ? (
                    <RichTextEditor
                      value={editedContent[meeting.id] || summary || ""}
                      onChange={(val) => setEditedContent({ ...editedContent, [meeting.id]: val })}
                      placeholder="회의 내용을 입력하세요..."
                      className="min-h-96"
                    />
                  ) : (
                    <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30 max-h-96 overflow-y-auto">
                      <div
                        className="dark:text-white/80 light:text-purple-900 text-sm leading-relaxed space-y-3 prose dark:prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: editedContent[meeting.id] || expandedFullText || summary || "",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {(transcriptTab[meeting.id] ?? "full") === "raw" && rawTranscript && (
                <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30 max-h-96 overflow-y-auto">
                  <div className="dark:text-white/80 light:text-purple-900 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {rawTranscript}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {meeting.status === "completed" && (
          <div className="space-y-4">

            <div className="space-y-3">
              <p className="text-sm font-bold dark:text-white/70 light:text-purple-700">음성 녹음</p>

              {/* Hidden audio element for actual playback */}
              <audio ref={audioRef} preload="metadata" />

              <div className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-purple-900/20 dark:to-black/40 light:bg-gradient-to-br light:from-white/70 light:via-purple-50/50 light:to-white/70 dark:border dark:border-purple-500/15 light:border light:border-purple-200/60 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/20 dark:shadow-lg dark:shadow-purple-900/20 space-y-5">

                <div className="flex flex-col items-center gap-5">

                  <div className="relative w-24 h-24 flex items-center justify-center">

                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="dark:text-purple-500/15 light:text-purple-300/25"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray={`${45 * 2 * Math.PI}`}
                        strokeDashoffset={`${45 * 2 * Math.PI * (1 - (audioProgress[meeting.id] || 0))}`}
                        strokeLinecap="round"
                        className="dark:text-purple-500 light:text-purple-600 transition-all duration-200"
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "50% 50%",
                        }}
                      />
                    </svg>

                    <button
                      onClick={() => {
                        const audio = audioRef.current;
                        if (!audio) return;
                        if (audioPlayingId === meeting.id) {
                          audio.pause();
                          setAudioPlayingId(null);
                        } else {
                          audio.play();
                          setAudioPlayingId(meeting.id);
                        }
                      }}
                      className="relative z-10 flex items-center justify-center w-14 h-14 dark:bg-gradient-to-br dark:from-purple-600 dark:to-purple-700 light:bg-gradient-to-br light:from-purple-600 light:to-purple-700 text-white rounded-full shadow-lg dark:shadow-purple-500/40 light:shadow-purple-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {audioPlayingId === meeting.id ? (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-4 dark:bg-white light:bg-white rounded-sm animate-pulse"></div>
                          <div className="w-1 h-4 dark:bg-white light:bg-white rounded-sm animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs dark:text-white/50 light:text-purple-600 font-medium mb-1.5">재생 시간</p>
                    <p className="text-sm font-bold dark:text-white light:text-purple-950 font-mono tracking-wide">
                      {Math.floor(((audioProgress[meeting.id] || 0) * (audioDuration[meeting.id] || 240)) / 60)}:{String(Math.floor(((audioProgress[meeting.id] || 0) * (audioDuration[meeting.id] || 240)) % 60)).padStart(2, '0')}
                      <span className="dark:text-white/30 light:text-purple-600 mx-1.5 text-xs">/</span>
                      {Math.floor((audioDuration[meeting.id] || 240) / 60)}:{String((audioDuration[meeting.id] || 240) % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(audioProgress[meeting.id] || 0) * 100}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) / 100;
                      setAudioProgress({ ...audioProgress, [meeting.id]: val });
                      if (audioRef.current && audioRef.current.duration) {
                        audioRef.current.currentTime = val * audioRef.current.duration;
                      }
                    }}
                    className="w-full h-1.5 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t dark:border-purple-500/10 light:border-purple-200/40">

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs dark:text-white/50 light:text-purple-600 font-medium">볼륨</span>
                      <span className="text-xs dark:text-white/40 light:text-purple-600 font-semibold">
                        {Math.round((audioVolume[meeting.id] ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round((audioVolume[meeting.id] ?? 1) * 100)}
                      onChange={(e) => setAudioVolume({ ...audioVolume, [meeting.id]: parseInt(e.target.value) / 100 })}
                      className="w-full h-1 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs dark:text-white/50 light:text-purple-600 font-medium block">속도</label>
                    <select
                      value={audioPlaybackSpeed[meeting.id] || 1}
                      onChange={(e) => setAudioPlaybackSpeed({ ...audioPlaybackSpeed, [meeting.id]: parseFloat(e.target.value) })}
                      className="w-full px-2.5 py-1 dark:bg-purple-500/15 light:bg-purple-100/50 dark:text-white light:text-purple-900 dark:border dark:border-purple-500/20 light:border light:border-purple-300/50 rounded-md text-xs font-medium focus:outline-none dark:focus:border-purple-400 light:focus:border-purple-500 transition-all"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">

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
                    <button
                      onClick={() => {
                        if (recordingsData && recordingsData.length > 0) {
                          handleDownload(recordingsData[0].id);
                        }
                        setShowDownloadMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
                    >
                      <Music className="w-4 h-4" />
                      음성 파일
                    </button>
                    <button
                      onClick={() => {
                        if (rawTranscript) {
                          const blob = new Blob([rawTranscript], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${meeting.title}-raw-transcript.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                        setShowDownloadMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
                    >
                      <FileCode className="w-4 h-4" />
                      로우 텍스트
                    </button>
                    <button
                      onClick={() => {
                        const fullContent = expandedFullText || summary || "";
                        if (fullContent) {
                          const blob = new Blob([fullContent], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${meeting.title}-minutes.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                        setShowDownloadMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      전체 회의록
                    </button>
                  </div>
                )}
              </div>

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
      </div>
    );
  };

  const renderSimpleCard = (meeting: Meeting) => (
    <div className="text-left space-y-2">

      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">
          {meeting.title}
        </h3>
        {meeting.team && (
          <span className="dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900 light:border light:border-purple-300/60 px-3 py-1 rounded-full text-xs font-bold light:shadow-sm light:shadow-purple-200/40">
            {meeting.team}
          </span>
        )}

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

      <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(meeting.status)}`}>
        {getStatusLabel(meeting.status)}
      </span>

      <div className="flex items-center gap-2 text-sm dark:text-white/60 light:text-purple-900/80 font-medium">
        <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-700" />
        {format(meeting.date, "MMM dd", { locale: ko })} {meeting.time}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-6xl space-y-6 light:bg-gradient-to-br light:from-purple-50 light:via-white light:to-pink-50 light:rounded-3xl light:p-8">

        {!expandedMeeting && (
          <div>
            <h1 className="text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-2">
              회의 내역
            </h1>
            <p className="text-sm dark:text-white/50 light:text-purple-600/80 mb-8 font-medium">
              모든 회의 기록을 한눈에 관리하고 확인하세요
            </p>

            <div className="flex gap-3 mb-8 border-b-2 dark:border-purple-500/30 light:border-purple-300/70 pb-4">
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

        {!expandedMeeting && (
          <div className="space-y-4">

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

        {expandedMeeting && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/30 light:border-2 light:border-purple-300/70 light:shadow-xl light:shadow-purple-300/40 dark:border dark:border-purple-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {renderExpandedCard(expandedMeeting)}
          </div>
        )}

        {!expandedMeeting && (
          <>
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredMeetings.length === 0 ? (
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
                    className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/30 light:to-pink-100/20 light:border-2 light:border-purple-300/70 light:shadow-lg light:shadow-purple-300/30 dark:border dark:border-purple-500/30 rounded-2xl p-6 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-xl light:hover:shadow-purple-400/40 light:hover:border-purple-400/80 hover:-translate-y-1 transition-all duration-300 dark:backdrop-blur-md light:backdrop-blur-md group flex flex-col"
                  >
                    <button
                      onClick={() => setExpandedMeetingId(meeting.id)}
                      className="text-left flex-1"
                    >
                      {renderSimpleCard(meeting)}

                      {meeting.description && (
                        <p className="text-sm dark:text-white/60 light:text-purple-800 line-clamp-2 mb-4 group-hover:dark:text-white/80 group-hover:light:text-purple-950 transition-colors font-medium">
                          {meeting.description}
                        </p>
                      )}
                    </button>

                    {meeting.status === "completed" && (
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {meeting.hasTranscript && (
                          <span className="dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/90 light:text-green-900 light:border light:border-green-300/60 light:shadow-sm light:shadow-green-200/40 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            회의록
                          </span>
                        )}
                        <span className="dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/90 light:text-purple-900 light:border light:border-purple-300/60 light:shadow-sm light:shadow-purple-200/40 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5" />
                          음성녹음
                        </span>
                        <span className="dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white light:shadow-lg light:shadow-purple-400/40 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          AI 회의록
                          <span className="dark:bg-purple-700 light:bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1 font-semibold">
                            작업 완료
                          </span>
                        </span>
                      </div>
                    )}

                    {meeting.status === "in_progress" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/meeting/${meeting.id}`);
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
    </>
  );
}
