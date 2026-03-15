import { useState, useCallback, useMemo } from "react";
import { X, Zap, Edit, Check, Copy, Tag } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import RichTextEditor from "./RichTextEditor";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "@/features/auth/context";
import { useMinutes, useTranscript, useUpdateMinutes } from "@/features/ai/hooks";
import { useRecordings, useRecordingDownloadUrl } from "@/features/meeting/hooks/useRecording";

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
  const { data: recordingsData } = useRecordings(roomId, userId);
  const downloadMutation = useRecordingDownloadUrl();

  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [transcriptTab, setTranscriptTab] = useState<"full" | "raw">("full");
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

  const summary = minutesData?.summary ?? undefined;
  const keyPoints = minutesData?.keyPoints ?? undefined;
  const fullText = transcriptData?.fullText ?? undefined;

  const rawTranscript = useMemo(() => {
    if (!transcriptData?.segments || transcriptData.segments.length === 0) return undefined;
    return transcriptData.segments
      .map((seg) => `[${seg.timestamp}] ${seg.speaker}: ${seg.content}`)
      .join("\n");
  }, [transcriptData]);

  const firstRecordingUrl = useMemo(() => {
    if (recordingsData && recordingsData.length > 0 && recordingsData[0].s3Path) {
      return recordingsData[0].s3Path;
    }
    return null;
  }, [recordingsData]);

  const handleSave = useCallback((meetingId: string) => {
    updateMinutesMutation.mutate({
      roomId: Number(meetingId),
      userId,
      data: { summary: editedContent[meetingId] },
    });
    setEditingMeetingId(null);
  }, [updateMinutesMutation, userId, editedContent]);

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
                <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-950">AI 회의 요약</h3>
                <span className="dark:bg-purple-600 dark:text-white light:bg-gradient-to-r light:from-purple-600 light:to-purple-700 light:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg dark:shadow-purple-500/30 light:shadow-purple-400/40 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  AI 생성
                </span>
              </div>
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
                {rawTranscript && (
                  <button
                    onClick={() => setTranscriptTab("raw")}
                    className={`px-4 py-2 font-medium text-sm transition-all ${
                      transcriptTab === "raw"
                        ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-900 border-b-2 dark:border-purple-400 light:border-purple-600"
                        : "dark:text-white/60 light:text-purple-700 dark:hover:text-white light:hover:text-purple-900"
                    }`}
                  >
                    로우 회의록
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
                          __html: editedContent[meeting.id] || fullText || summary || "",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {transcriptTab === "raw" && rawTranscript && (
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
            <AudioPlayer
              recordingUrl={firstRecordingUrl}
              meetingId={meeting.id}
              meetingTitle={meeting.title}
              hasRecordings={!!recordingsData && recordingsData.length > 0}
              rawTranscript={rawTranscript}
              fullText={fullText}
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
