import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

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
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "이영희",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Design",
    },
    {
      id: "2",
      title: "Chuyên Viên Kiểm Thử (Tester)",
      status: "closed",
      description: "Lập kế hoạch test và kịch bản test, chuẩn bị độ liễu test; Test các dự án phần mềm, phối hợp với các bộ phận khác của công ty để đảm bảo chất lượng dự án;...",
      participantCount: 100,
      participants: [
        {
          name: "박민준",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "정호준",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "QA",
    },
    {
      id: "3",
      title: "AI Engineer",
      status: "active",
      description: "Thâm gia phát triển các sản phẩm công ty, xuyên suốt quá trình phân tích, thiết kế chức năng, coding...; Cự thể là code trang này, và các trang con của chúng: Thu Viên PapLLuat NhanLucNganluai LawNet",
      participantCount: 60,
      participants: [
        {
          name: "조예성",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "민주",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Development",
    },
    {
      id: "4",
      title: "Front end",
      status: "active",
      description: "Phối hợp chặt chẽ với các nhóm thiết kế, quản lý sản phẩm và phát triển để tạo ra các giao diện trang nhà, có thể sử dụng, đẩp ứng và tương tác trên nhiều thiết bị. Biên các thiết kế UI / UX thành các nguyên mẫu, tạo ra các tương tác tuyệt vời từ cả...",
      participantCount: 10,
      participants: [
        {
          name: "김철수",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
        },
        {
          name: "이영희",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
        },
      ],
      department: "Frontend",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">최근 회의</h2>
        <p className="text-xs text-text-sub">총 {meetings.length}개</p>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Header with Title and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-bold text-foreground">
                    {meeting.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                      statusConfig[meeting.status].className
                    )}
                  >
                    {statusConfig[meeting.status].label}
                  </span>
                </div>
              </div>
              <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-text-sub mb-4 line-clamp-2 leading-relaxed">
              {meeting.description}
            </p>

            {/* Footer with Participants */}
            <div className="flex items-center gap-3 pt-3 border-t border-border/20">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant, idx) => (
                  <img
                    key={idx}
                    src={participant.avatar}
                    alt={participant.name}
                    title={participant.name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover hover:scale-110 transition-transform duration-200"
                  />
                ))}
              </div>
              <span className="text-xs text-text-sub font-medium">
                {meeting.participantCount}명 참여
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
