import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/context";
import { useRoomHistory } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api/types";

const AVATAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getStatusStyle(status: string) {
  switch (status) {
    case "ACTIVE":
      return { className: "dark:bg-emerald-500/30 dark:text-emerald-300 light:bg-emerald-100 light:text-emerald-700", label: "Active" };
    case "SCHEDULED":
      return { className: "dark:bg-blue-500/30 dark:text-blue-300 light:bg-blue-100 light:text-blue-700", label: "Scheduled" };
    case "ENDED":
      return { className: "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100 light:text-gray-600", label: "Ended" };
    default:
      return { className: "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100 light:text-gray-700", label: status };
  }
}

export default function AIMeetingSearch() {
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : "";
  const { data: historyData } = useRoomHistory(userId);
  const [searchTerm, setSearchTerm] = useState("");

  const meetings: MeetingRoomResponse[] = useMemo(
    () => historyData?.content ?? [],
    [historyData?.content],
  );

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return meetings.slice(0, 10);
    const term = searchTerm.toLowerCase();
    return meetings
      .filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.description?.toLowerCase().includes(term),
      )
      .slice(0, 10);
  }, [meetings, searchTerm]);

  return (
    <div className="w-80 border-l border-border/30 bg-white/40 backdrop-blur-md flex flex-col">
      <div className="px-6 py-5 border-b border-border/30">
        <h2 className="text-sm font-semibold bg-gradient-to-r from-foreground to-text-sub bg-clip-text text-transparent mb-3">
          회의 검색
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="회의명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border/50 rounded-lg bg-white/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/20">
        {filtered.length > 0 ? (
          filtered.map((meeting, idx) => {
            const status = getStatusStyle(meeting.status);
            return (
              <div
                key={meeting.id}
                className="px-4 py-5 hover:bg-white/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {meeting.title}
                    </h3>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 rounded ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(idx)} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {meeting.title?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                </div>

                {meeting.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {meeting.description}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "검색 결과가 없습니다" : "회의 기록이 없습니다"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
