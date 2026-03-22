import { useState, useCallback, useMemo } from "react";
import { X, Zap, Edit, Check, Copy, Tag, RefreshCw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import DOMPurify from "dompurify";
import RichTextEditor from "./RichTextEditor";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "@/features/auth/context";
import { useMinutes, useTranscript, useUpdateMinutes, useRegenerateMinutes } from "@/features/ai/hooks";
import type { MinutesStatus } from "@/features/ai/api";
import { useRecordings, useRecordingDownloadUrl } from "@/features/meeting/hooks/useRecording";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";

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
  tags?: string[];
}

interface MeetingExpandedCardProps {
  meeting: Meeting;
  onClose: () => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
}

interface ParsedSummary {
  summary?: string;
  keyPoints?: string[];
  [key: string]: unknown;
}

function parseSummaryJson(json: string | null | undefined): ParsedSummary | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as ParsedSummary;
  } catch {
    return { summary: json };
  }
}

function getMinutesStatusLabel(status: MinutesStatus): string {
  switch (status) {
    case "GENERATED": return "AI 생성 완료";
    case "EDITED_BY_USER": return "사용자 수정됨";
    case "REGENERATING": return "재생성 중...";
    case "FAILED": return "생성 실패";
  }
}

function getMinutesStatusColor(status: MinutesStatus): string {
  switch (status) {
    case "GENERATED":
      return "dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white";
    case "EDITED_BY_USER":
      return "dark:bg-blue-600 dark:text-white light:bg-blue-100 light:text-blue-800";
    case "REGENERATING":
      return "dark:bg-yellow-600 dark:text-white light:bg-yellow-100 light:text-yellow-800 animate-pulse";
    case "FAILED":
      return "dark:bg-red-600 dark:text-white light:bg-red-100 light:text-red-800";
  }
}

export default function MeetingExpandedCard({
  meeting,
  onClose,
  getStatusLabel,
  getStatusColor,
}: MeetingExpandedCardProps) {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const roomId = Number(meeting.id);

  const { data: minutesData, isLoading: isMinutesLoading } = useMinutes(roomId, userId);
  const { data: transcriptData, isLoading: isTranscriptLoading } = useTranscript(roomId, userId);
  const updateMinutesMutation = useUpdateMinutes();
  const regenerateMutation = useRegenerateMinutes();
  const { data: recordingsData } = useRecordings(roomId, userId);
  const downloadMutation = useRecordingDownloadUrl();

  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [transcriptTab, setTranscriptTab] = useState<"full" | "raw">("full");
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

  const parsed = useMemo(
    () => parseSummaryJson(minutesData?.userEditedSummaryJson ?? minutesData?.summaryJson),
    [minutesData],
  );

  const summary = parsed?.summary;
  const keyPoints = parsed?.keyPoints;
  const transcript = transcriptData?.transcript;

  const firstRecordingUrl = useMemo(() => {
    if (recordingsData && recordingsData.length > 0 && recordingsData[0].s3Path) {
      return recordingsData[0].s3Path;
    }
    return null;
  }, [recordingsData]);

  const handleSave = useCallback((meetingId: string) => {
    const content = editedContent[meetingId];
    if (!content) return;
    updateMinutesMutation.mutate(
      {
        roomId: Number(meetingId),
        userId,
        data: { userEditedSummaryJson: JSON.stringify({ ...parsed, summary: content }) },
      },
      {
        onSuccess: () => {
          toast({ title: "회의록이 저장되었습니다" });
        },
        onError: (err) => {
          toast({ title: "회의록 저장 실패", description: getErrorMessage(err, "회의록 저장에 실패했습니다"), variant: "destructive" });
        },
      },
    );
    setEditingMeetingId(null);
  }, [updateMinutesMutation, userId, editedContent, parsed]);

  const handleRegenerate = useCallback(() => {
    regenerateMutation.mutate(
      { roomId, userId },
      {
        onError: (err) => {
          toast({ title: "회의록 재생성 실패", description: getErrorMessage(err, "회의록 재생성에 실패했습니다"), variant: "destructive" });
        },
      },
    );
  }, [regenerateMutation, roomId, userId]);

  const handleDownload = useCallback((recordingId: number) => {
    downloadMutation.mutate(
      { recordingId, userId },
      {
        onSuccess: (url) => {
          if (url) window.open(url as string, "_blank");
        },
      },
    );
  }, [downloadMutation, userId]);

  const isRegenerating = minutesData?.status === "REGENERATING" || regenerateMutation.isPending;

  return (
    <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/30 light:border-2 light:border-purple-300/70 light:shadow-xl light:shadow-purple-300/40 dark:border dark:border-purple-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-3">
              {meeting.title}
            </h2>
            <p className="dark:text-white/60 light:text-purple-700/90 font-medium">{meeting.description}</p>
          </div>
          <button
            onClick={onClose}
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
            <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-3">일정</p>
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
            <p className="text-xs dark:text-white/60 light:text-purple-600 font-bold uppercase mb-3">태그</p>
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

        {minutesData ? (
          <div className="space-y-4">
            {/* Minutes Status + Regenerate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">AI 회의 요약</h3>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 light:shadow-purple-400/40 flex items-center gap-1.5 ${getMinutesStatusColor(minutesData.status)}`}>
                  <Zap className="w-3.5 h-3.5" />
                  {getMinutesStatusLabel(minutesData.status)}
                </span>
              </div>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900 dark:hover:bg-purple-500/30 light:hover:bg-purple-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                {isRegenerating ? "재생성 중..." : "재생성"}
              </button>
            </div>

            {/* Failed Error */}
            {minutesData.status === "FAILED" && minutesData.lastError && (
              <div className="flex items-start gap-2 p-4 dark:bg-red-500/10 dark:border dark:border-red-500/30 light:bg-red-50 light:border-2 light:border-red-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 dark:text-red-400 light:text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm dark:text-red-300 light:text-red-700">{minutesData.lastError}</p>
              </div>
            )}

            {/* Summary */}
            {summary && (
              <div className="space-y-2">
                <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30">
                  <p className="dark:text-white/80 light:text-purple-900 leading-relaxed whitespace-pre-wrap">{summary}</p>
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
            )}

            {/* Full transcript / Raw */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">전체 회의록</h3>
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
                    <><Check className="w-4 h-4" /> 저장</>
                  ) : (
                    <><Edit className="w-4 h-4" /> 수정</>
                  )}
                </button>
              </div>

              <div className="flex gap-2 border-b dark:border-purple-500/20 light:border-purple-300">
                <button
                  onClick={() => setTranscriptTab("full")}
                  className={`px-4 py-2 font-medium text-sm transition-all ${
                    transcriptTab === "full"
                      ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-900 border-b-2 dark:border-purple-400 light:border-purple-600"
                      : "dark:text-white/60 light:text-purple-700 dark:hover:text-white light:hover:text-purple-900"
                  }`}
                >
                  전체 회의록
                </button>
                {transcript && (
                  <button
                    onClick={() => setTranscriptTab("raw")}
                    className={`px-4 py-2 font-medium text-sm transition-all ${
                      transcriptTab === "raw"
                        ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-900 border-b-2 dark:border-purple-400 light:border-purple-600"
                        : "dark:text-white/60 light:text-purple-700 dark:hover:text-white light:hover:text-purple-900"
                    }`}
                  >
                    로우 트랜스크립트
                  </button>
                )}
              </div>

              {transcriptTab === "full" && (
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
                          __html: DOMPurify.sanitize(editedContent[meeting.id] || summary || ""),
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {transcriptTab === "raw" && transcript && (
                <div className="dark:bg-purple-500/10 light:bg-purple-50 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-200 rounded-xl p-6 light:shadow-md light:shadow-purple-200/30 max-h-96 overflow-y-auto">
                  <div className="dark:text-white/80 light:text-purple-900 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {transcript}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isMinutesLoading && !isTranscriptLoading ? (
          <div className="text-center py-8">
            <p className="dark:text-white/50 light:text-purple-600 text-sm">회의록이 없습니다</p>
            <p className="dark:text-white/30 light:text-purple-500 text-xs mt-1">회의가 완료되면 AI가 자동으로 회의록을 생성합니다</p>
          </div>
        ) : null}

        {meeting.status === "completed" && (
          <div className="space-y-4">
            <AudioPlayer
              recordingUrl={firstRecordingUrl}
              meetingId={meeting.id}
              meetingTitle={meeting.title}
              hasRecordings={!!recordingsData && recordingsData.length > 0}
              rawTranscript={transcript}
              fullText={transcript}
              summary={summary}
              onDownloadRecording={handleDownload}
              firstRecordingId={recordingsData?.[0]?.id}
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/summary?meeting=${meeting.id}`);
                setCopiedMeetingId(meeting.id);
                setTimeout(() => setCopiedMeetingId(null), 2000);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copiedMeetingId === meeting.id
                  ? "dark:bg-green-500/20 light:bg-green-100 dark:text-green-300 light:text-green-700"
                  : "dark:border dark:border-purple-500/30 light:border light:border-purple-300/50 dark:text-white/90 light:text-purple-700 dark:hover:bg-purple-500/10 light:hover:bg-purple-100/30"
              }`}
            >
              <Copy className="w-4 h-4" />
              {copiedMeetingId === meeting.id ? "복사됨" : "링크 공유"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
