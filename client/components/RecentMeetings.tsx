import { MoreVertical, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Participant {
  avatar: string;
  name: string;
}

interface MeetingRecord {
  id: string;
  title: string;
  status: "active" | "closed" | "issue";
  description: string;
  participantCount: number;
  participants: Participant[];
  department?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700",
  },
  closed: {
    label: "Closed",
    className: "bg-red-100 text-red-700",
  },
  issue: {
    label: "Issue",
    className: "bg-yellow-100 text-yellow-700",
  },
};

export default function RecentMeetings() {
  const [searchQuery, setSearchQuery] = useState("");

  const meetings: MeetingRecord[] = [
    {
      id: "1",
      title: "3D Designer",
      status: "issue",
      description: "회의 내용이 요기 들어감",
      participantCount: 10,
      participants: [
        {
          name: "김철수",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Design",
    },
    {
      id: "2",
      title: "Chuyên Viên Kiểm Thử (Tester)",
      status: "closed",
      description:
        "Lập kế hoạch test và kịch bản test, chuẩn bị độ liễu test; Test các dự án phần mềm, phối hợp với các bộ phận khác của công ty để đảm bảo chất lượng dự án;...",
      participantCount: 100,
      participants: [
        {
          name: "박민준",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "정호준",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "QA",
    },
    {
      id: "3",
      title: "AI Engineer",
      status: "active",
      description:
        "Thâm gia phát triển các sản phẩm công ty, xuyên suốt quá trình phân tích, thiết kế chức năng, coding...; Cự thể là code trang này, và các trang con của chúng: Thu Viên PapLLuat NhanLucNganluai LawNet",
      participantCount: 60,
      participants: [
        {
          name: "조예성",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "민주",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Development",
    },
    {
      id: "4",
      title: "Front end",
      status: "active",
      description:
        "Phối hợp chặt chẽ với các nhóm thiết kế, quản lý sản phẩm và phát triển để tạo ra các giao diện trang nhà, có thể sử dụng, đẩp ứng và tương tác trên nhiều thiết bị. Biên các thiết kế UI / UX thành các nguyên mẫu, tạo ra các tương tác tuyệt vời từ cả...",
      participantCount: 10,
      participants: [
        {
          name: "김철수",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Frontend",
    },
  ];

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false,
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회의 제목, 설명 또는 팀으로 검색..."
            className="w-full pl-12 pr-10 py-3 dark:bg-purple-500/10 dark:border dark:border-purple-500/30 light:bg-white light:border-2 light:border-purple-300/70 rounded-xl dark:focus:bg-purple-500/20 dark:focus:border-purple-400 light:focus:bg-white light:focus:border-purple-400 light:focus:shadow-lg light:focus:shadow-purple-200/30 dark:focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-2 light:focus:ring-purple-300/40 transition-all text-sm dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/60 -mt-0.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs dark:text-white/50 light:text-purple-600 mt-2.5">
        총 {filteredMeetings.length}개
        {searchQuery && ` (${searchQuery} 검색 결과)`}
      </p>

      {/* Results */}
      {filteredMeetings.length === 0 ? (
        <div className="text-center py-12 dark:bg-purple-500/10 dark:border dark:border-purple-500/30 light:bg-purple-50/80 light:border-2 light:border-purple-300/50 rounded-2xl">
          <Search className="w-12 h-12 dark:text-white/20 light:text-purple-400/40 mx-auto mb-3" />
          <p className="dark:text-white/70 light:text-purple-800 mb-1 font-medium">검색 결과가 없습니다</p>
          <p className="text-xs dark:text-white/50 light:text-purple-600">
            다른 키워드로 다시 시도해보세요
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-2.5">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/40 dark:to-pink-900/20 light:bg-white light:border-2 light:border-purple-300/60 dark:border dark:border-purple-500/30 rounded-2xl p-5 dark:hover:shadow-lg dark:hover:shadow-purple-500/20 light:hover:shadow-md light:hover:shadow-purple-300/30 light:hover:border-purple-400/60 transition-all duration-300 group dark:backdrop-blur-md light:backdrop-blur-sm"
            >
              {/* Header with Title and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold dark:text-white/90 light:text-purple-900">
                      {meeting.title}
                    </h3>
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                        meeting.status === "active"
                          ? "dark:bg-green-500/30 dark:text-green-300 light:bg-green-100/70 light:text-green-800"
                          : meeting.status === "closed"
                            ? "dark:bg-red-500/30 dark:text-red-300 light:bg-red-100/70 light:text-red-800"
                            : "dark:bg-yellow-500/30 dark:text-yellow-300 light:bg-yellow-100/70 light:text-yellow-800",
                      )}
                    >
                      {statusConfig[meeting.status].label}
                    </span>
                  </div>
                </div>
                <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/20 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-white/40" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm dark:text-white/60 light:text-purple-700 mb-4 line-clamp-2 leading-relaxed">
                {meeting.description}
              </p>

              {/* Footer with Participants and Department */}
              <div className="flex items-center gap-4 pt-3 border-t dark:border-purple-500/20 light:border-purple-200">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, idx) => (
                    <img
                      key={idx}
                      src={participant.avatar}
                      alt={participant.name}
                      title={participant.name}
                      className="w-7 h-7 rounded-full border-2 dark:border-purple-500/30 light:border-purple-300/50 object-cover hover:scale-110 transition-transform duration-200"
                    />
                  ))}
                </div>
                <span className="text-xs dark:text-white/60 light:text-purple-600 font-medium">
                  {meeting.participantCount}명 참여
                </span>
                {meeting.department && (
                  <>
                    <div className="w-px h-4 dark:bg-purple-500/20 light:bg-purple-300/30" />
                    <span className="text-xs dark:bg-purple-500/30 dark:text-purple-300 light:bg-purple-100/70 light:text-purple-800 px-2 py-1 rounded-full font-medium">
                      {meeting.department}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
