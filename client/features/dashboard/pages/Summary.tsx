import { Clock, Search, FileText, Mic, Zap, Play, Lock, Copy, Globe, Shield, Timer } from "lucide-react";
import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import MeetingExpandedCard from "@/features/dashboard/components/MeetingExpandedCard";
import { useAuth } from "@/features/auth/context";
import { useMyRooms, useRoomHistory, useScheduledRooms } from "@/features/meeting/hooks/useRoomDiscovery";
import {
  toMeetingViewModel,
  mergeAndDedup,
  getStatusLabel,
  getStatusColor,
  type MeetingViewModel,
  type TeamNameMap,
} from "@/shared/adapters/meeting";
import { toast } from "@/shared/hooks/use-toast";

type Meeting = MeetingViewModel;

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

  const { data: historyData, isLoading: isHistoryLoading } = useRoomHistory(userId);
  const { data: scheduledData, isLoading: isScheduledLoading } = useScheduledRooms(userId);
  const { data: activeData, isLoading: isActiveLoading } = useMyRooms(userId, "ACTIVE");

  const isLoading = isHistoryLoading || isScheduledLoading || isActiveLoading;

  const teamMap: TeamNameMap = useMemo(() => {
    const map = new Map<number, string>();
    if (user?.teams) {
      for (const t of user.teams) map.set(t.id, t.name);
    }
    return map;
  }, [user?.teams]);

  const allMeetings: Meeting[] = useMemo(() => {
    const rooms = mergeAndDedup(
      historyData?.content,
      scheduledData?.content,
      activeData,
    );
    return rooms.map((r) => toMeetingViewModel(r, teamMap));
  }, [historyData, scheduledData, activeData, teamMap]);

  const filteredMeetings = useMemo(() => allMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || meeting.status === activeTab;

    let matchesFeature = true;
    if (featureFilter === "transcript") matchesFeature = !!meeting.hasTranscript;
    else if (featureFilter === "voiceRecording") matchesFeature = meeting.status === "completed";
    else if (featureFilter === "aiRecords") matchesFeature = meeting.status === "completed";

    return matchesSearch && matchesTab && matchesFeature;
  }), [allMeetings, searchQuery, activeTab, featureFilter]);

  const expandedMeeting = allMeetings.find((m) => m.id === expandedMeetingId);

  return (
    <>
      <div className="max-w-6xl space-y-6">

        {!expandedMeeting && (
          <div>
            <h1 className="text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-2">
              회의 내역
            </h1>
            <p className="text-sm dark:text-white/50 light:text-purple-600/80 mb-8 font-medium">
              모든 회의 기록을 한눈에 관리하고 확인하세요
            </p>

            <div className="flex gap-2 mb-8 border-b dark:border-purple-500/30 light:border-purple-200 pb-4">
              {([
                { id: "all", label: "모든 회의" },
                { id: "scheduled", label: "예정된 회의" },
                { id: "in_progress", label: "진행중" },
                { id: "completed", label: "완료된 회의" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "dark:bg-purple-600 dark:text-white light:bg-purple-600 light:text-white light:shadow-md light:shadow-purple-400/30"
                      : "dark:bg-purple-500/10 dark:text-white/70 light:bg-white light:text-purple-600 light:border light:border-purple-300/60 light:shadow-sm dark:hover:bg-purple-500/20 light:hover:bg-purple-50 light:hover:border-purple-400"
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
                onChange={(e) => setFeatureFilter(e.target.value as typeof featureFilter)}
                className="om-input text-sm appearance-none cursor-pointer font-medium"
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
                  className="om-input pl-12 font-medium"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/40 light:text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {expandedMeeting && (
          <MeetingExpandedCard
            meeting={expandedMeeting}
            onClose={() => setExpandedMeetingId(null)}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
          />
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
                    className="om-card p-6 hover:-translate-y-1 group flex flex-col"
                  >
                    <button
                      onClick={() => setExpandedMeetingId(meeting.id)}
                      className="text-left flex-1"
                    >
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
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-block px-2.5 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(meeting.status)}`}>
                            {getStatusLabel(meeting.status)}
                          </span>
                          {meeting.type === "SCHEDULED" && (
                            <span className="om-badge-blue rounded">
                              예약
                            </span>
                          )}
                          {meeting.locked && (
                            <span className="flex items-center gap-1 om-badge-amber rounded">
                              <Lock className="w-3 h-3" />잠금
                            </span>
                          )}
                          {meeting.accessScope === "TEAM" && (
                            <span className="flex items-center gap-1 om-badge-cyan rounded">
                              <Shield className="w-3 h-3" />팀
                            </span>
                          )}
                          {meeting.accessScope === "ALL" && (
                            <span className="flex items-center gap-1 om-badge-green rounded">
                              <Globe className="w-3 h-3" />공개
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm dark:text-white/60 light:text-purple-900/80 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-700" />
                            {format(meeting.date, "MMM dd", { locale: ko })} {meeting.time}
                          </div>
                          {meeting.duration && meeting.duration !== "0분" && (
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-4 h-4 dark:text-purple-400 light:text-purple-700" />
                              {meeting.duration}
                            </div>
                          )}
                        </div>

                        <code
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono dark:bg-purple-500/15 dark:text-white/50 light:bg-purple-100 light:text-purple-600 cursor-pointer hover:dark:bg-purple-500/25 hover:light:bg-purple-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(meeting.roomCode);
                            toast({ title: "회의 코드가 복사되었습니다" });
                          }}
                          title="클릭하여 복사"
                        >
                          <Copy className="w-3 h-3" />{meeting.roomCode}
                        </code>
                      </div>

                      {meeting.description && (
                        <p className="text-sm dark:text-white/60 light:text-purple-800 line-clamp-2 mb-4 group-hover:dark:text-white/80 group-hover:light:text-purple-950 transition-colors font-medium">
                          {meeting.description}
                        </p>
                      )}
                    </button>

                    {meeting.status === "completed" && (
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {meeting.hasTranscript && (
                          <span className="om-badge-green flex items-center gap-1.5">
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
