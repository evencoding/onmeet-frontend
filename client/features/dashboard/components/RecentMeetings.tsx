import { MoreVertical, Search, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { useAuth } from "@/features/auth/context";
import { useRoomHistory } from "@/features/meeting/hooks";
import type { MeetingRoomResponse } from "@/features/meeting/api";

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "dark:bg-green-500/30 dark:text-green-300 light:bg-green-100/70 light:text-green-800",
  },
  ENDED: {
    label: "Closed",
    className: "dark:bg-red-500/30 dark:text-red-300 light:bg-red-100/70 light:text-red-800",
  },
  WAITING: {
    label: "Waiting",
    className: "dark:bg-yellow-500/30 dark:text-yellow-300 light:bg-yellow-100/70 light:text-yellow-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "dark:bg-gray-500/30 dark:text-gray-300 light:bg-gray-100/70 light:text-gray-800",
  },
};

export default function RecentMeetings() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const { data: historyData, isLoading } = useRoomHistory(userId);

  const meetings: MeetingRoomResponse[] = historyData ?? [];

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false,
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-white/50 light:text-purple-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회의 제목, 설명으로 검색..."
            className="w-full pl-12 pr-10 py-3 dark:bg-purple-500/10 dark:border dark:border-purple-500/30 light:bg-white light:border-2 light:border-purple-300/70 rounded-xl dark:focus:bg-purple-500/20 dark:focus:border-purple-400 light:focus:bg-white light:focus:border-purple-400 light:focus:shadow-lg light:focus:shadow-purple-200/30 dark:focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-2 light:focus:ring-purple-300/40 transition-all text-sm dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/60 -mt-0.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 dark:text-white/50 light:text-purple-600" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs dark:text-white/50 light:text-purple-600 mt-2.5">
        총 {filteredMeetings.length}개
        {searchQuery && ` (${searchQuery} 검색 결과)`}
      </p>

      {isLoading ? (
        <div className="space-y-3 mt-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dark:bg-purple-900/30 light:bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-5 dark:bg-purple-800 light:bg-purple-100 rounded w-3/4 mb-3" />
              <div className="h-4 dark:bg-purple-800 light:bg-purple-100 rounded w-full mb-2" />
              <div className="h-4 dark:bg-purple-800 light:bg-purple-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-12 dark:bg-purple-500/10 dark:border dark:border-purple-500/30 light:bg-purple-50/80 light:border-2 light:border-purple-300/50 rounded-2xl">
          <Search className="w-12 h-12 dark:text-white/20 light:text-purple-400/40 mx-auto mb-3" />
          <p className="dark:text-white/70 light:text-purple-800 mb-1 font-medium">
            {searchQuery ? "검색 결과가 없습니다" : "최근 회의가 없습니다"}
          </p>
          <p className="text-xs dark:text-white/50 light:text-purple-600">
            {searchQuery ? "다른 키워드로 다시 시도해보세요" : "새 회의를 생성해보세요"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-2.5">
          {filteredMeetings.map((meeting) => {
            const config = statusConfig[meeting.status] ?? statusConfig.ENDED;
            return (
              <div
                key={meeting.id}
                className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/40 dark:to-pink-900/20 light:bg-white light:border-2 light:border-purple-300/60 dark:border dark:border-purple-500/30 rounded-2xl p-5 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-md light:hover:shadow-purple-300/30 light:hover:border-purple-400/60 transition-all duration-300 group dark:backdrop-blur-md light:backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-bold dark:text-white/90 light:text-purple-900">
                        {meeting.title}
                      </h3>
                      <span
                        className={cn(
                          "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                          config.className,
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/20 rounded-lg">
                    <MoreVertical className="w-4 h-4 dark:text-white/40 light:text-purple-400" />
                  </button>
                </div>

                <p className="text-sm dark:text-white/60 light:text-purple-700 mb-4 line-clamp-2 leading-relaxed">
                  {meeting.description || "설명 없음"}
                </p>

                <div className="flex items-center gap-4 pt-3 border-t dark:border-purple-500/20 light:border-purple-200">
                  <span className="text-xs dark:text-white/60 light:text-purple-600 font-medium">
                    최대 {meeting.maxParticipants}명
                  </span>
                  {meeting.type && (
                    <>
                      <div className="w-px h-4 dark:bg-purple-500/20 light:bg-purple-300/30" />
                      <span className="text-xs dark:bg-purple-500/30 dark:text-purple-300 light:bg-purple-100/70 light:text-purple-800 px-2 py-1 rounded-full font-medium">
                        {meeting.type}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
