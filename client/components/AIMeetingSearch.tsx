import { Search, MoreVertical } from "lucide-react";

interface MeetingResult {
  id: string;
  title: string;
  status: "active" | "pending" | "completed";
  attendees: {
    name: string;
    avatar: string;
  }[];
  description?: string;
  tag?: string;
}

export default function AIMeetingSearch() {
  const meetings: MeetingResult[] = [
    {
      id: 1,
      title: "3D Designer",
      status: "active",
      tag: "ACTIVE",
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
      description: "회의 내용을 요약하기",
    },
    {
      id: 2,
      title: "Chuyên Viên Kiến Thức ( Tester )",
      status: "pending",
      tag: "Closed",
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
      description: "• 테스트 사례 및 테스트 계획\n• 테스트 환경 및 도구\n• 버그 리포트 및 추적",
    },
    {
      id: 3,
      title: "AI Engineer",
      status: "active",
      tag: "Active",
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
      ],
      description: "AI 기술 및 머신러닝에 대한 토론. 우리는 대략적인 개념과 기술 세부 사항 등을 다루고 있습니다. 이것을 시청하세요 AI와 관련된 최신 대화",
    },
    {
      id: 4,
      title: "Front end",
      status: "completed",
      tag: "Active",
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
      ],
      description: "프론트 엔드 개발 관련 문제점 공유 및 개선 방안 논의. 현재 작업 중인 기능들과 향후 계획등을 다루고 있습니다",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Closed";
      case "completed":
        return "Active";
      default:
        return status;
    }
  };

  return (
    <div className="w-80 border-l border-border/30 bg-white/40 backdrop-blur-md flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">AI로 찾는 회의들</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="px-4 py-4 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {meeting.title}
                </h3>
                <span
                  className={`inline-block text-xs font-medium px-2 py-1 rounded ${getStatusColor(
                    meeting.status
                  )}`}
                >
                  {getStatusLabel(meeting.status)}
                </span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-1 mb-2">
              {meeting.attendees.map((attendee, idx) => (
                <img
                  key={idx}
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-6 h-6 rounded-full border border-border"
                />
              ))}
            </div>

            {/* Description */}
            {meeting.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {meeting.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
