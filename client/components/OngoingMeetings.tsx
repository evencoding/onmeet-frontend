import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Meeting {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  startTime: string;
  duration: number; // in minutes
  description: string;
  tags: string[];
  attendeesCount: number;
  status: "upcoming" | "ongoing" | "completed";
  attendees: {
    name: string;
    avatar: string;
  }[];
}

export default function OngoingMeetings() {
  const navigate = useNavigate();

  const meetings: Meeting[] = [
    {
      id: "1",
      title: "월간 마케팅 전략 회의",
      hostName: "김철수",
      hostAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      startTime: "10:30 AM",
      duration: 60,
      description: "Q1 마케팅 캠페인 전략 및 목표 설정",
      tags: ["마케팅", "전략"],
      status: "ongoing",
      attendeesCount: 5,
      attendees: [
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "박민준",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "최수진",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
      ],
    },
    {
      id: "2",
      title: "제품 로드맵 리뷰",
      hostName: "정준호",
      hostAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      startTime: "11:00 AM",
      duration: 90,
      description: "2024년 제품 개발 계획 및 우선순위 검토",
      tags: ["제품", "로드맵"],
      status: "ongoing",
      attendeesCount: 8,
      attendees: [
        {
          name: "한지은",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "유혜정",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "임상현",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
    },
    {
      id: "3",
      title: "디자인 시스템 회의",
      hostName: "임상현",
      hostAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      startTime: "2:00 PM",
      duration: 45,
      description: "UI 컴포넌트 표준화 및 가이드라인 논의",
      tags: ["디자인", "시스템"],
      status: "upcoming",
      attendeesCount: 4,
      attendees: [
        {
          name: "한지은",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "유혜정",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
      ],
    },
    {
      id: "4",
      title: "팀 스탠드업",
      hostName: "박민준",
      hostAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      startTime: "3:30 PM",
      duration: 30,
      description: "일일 진행 상황 공유 및 이슈 논의",
      tags: ["스탠드업"],
      status: "upcoming",
      attendeesCount: 6,
      attendees: [
        {
          name: "김철수",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "이영희",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "최수진",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
    },
  ];

  const calculateTimeRemaining = (startTime: string, duration: number) => {
    // 간단한 예시 계산 (실제 구현에서는 정확한 시간 계산 필요)
    const remainingMinutes = Math.max(0, Math.floor(Math.random() * duration));
    if (remainingMinutes === 0) return "지금 시작됐어요!";
    if (remainingMinutes < 60) return `${remainingMinutes}분 남음`;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `${hours}시간 ${mins}분 남음`;
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (meeting.status === "ongoing") {
      navigate("/meeting");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-red-100 text-red-600";
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing":
        return "진행 중";
      case "upcoming":
        return "예정";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></div>
        <h2 className="text-xs font-bold dark:text-white/90 light:text-purple-900 uppercase tracking-widest letter-spacing-wider">
          진행 중인 회의
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/50 dark:to-pink-900/20 light:bg-gradient-to-br light:from-purple-50/50 light:via-white light:to-pink-100/30 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/60 rounded-2xl overflow-hidden transition-all duration-300 dark:hover:shadow-lg dark:hover:shadow-purple-500/30 light:hover:shadow-xl light:hover:shadow-purple-400/40 light:hover:border-purple-400/80 hover:-translate-y-1 group dark:backdrop-blur-md light:backdrop-blur-md"
          >
            {/* Status bar */}
            <div
              className={`h-1 ${
                meeting.status === "ongoing"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600"
                  : "bg-gradient-to-r from-purple-500 to-purple-600"
              }`}
            />

            <div className="p-5 space-y-4">
              {/* Header with Title and Status */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold dark:text-white/90 light:text-purple-900 flex-1 leading-tight">
                    {meeting.title}
                  </h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {meeting.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs dark:bg-purple-500/30 dark:text-purple-300 light:bg-purple-300/50 light:text-purple-900 light:border light:border-purple-400/60 px-2 py-1 rounded-full font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm dark:text-white/60 light:text-purple-700 line-clamp-2">
                  {meeting.description}
                </p>
              </div>

              {/* Host Info */}
              <div className="flex items-center gap-3 pb-4 border-b-2 dark:border-purple-500/30 light:border-purple-300/80">
                <img
                  src={meeting.hostAvatar}
                  alt={meeting.hostName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium dark:text-white/90 light:text-purple-900">
                    {meeting.hostName}
                  </p>
                  <p className="text-xs dark:text-white/50 light:text-purple-600">주최자</p>
                </div>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs dark:text-white/50 light:text-purple-600">시작</p>
                    <p className="font-medium dark:text-white/90 light:text-purple-900">
                      {meeting.startTime}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs dark:text-white/50 light:text-purple-600">남은 시간</p>
                  <p className="font-medium dark:text-pink-400 light:text-pink-600">
                    {calculateTimeRemaining(meeting.startTime, meeting.duration)}
                  </p>
                </div>
              </div>

              {/* Attendees */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 dark:text-white/50 light:text-purple-600 flex-shrink-0" />
                <div className="flex items-center gap-1">
                  {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                    <img
                      key={idx}
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-6 h-6 rounded-full border-2 dark:border-purple-500/30 light:border-purple-300/50 shadow-sm"
                      title={attendee.name}
                    />
                  ))}
                  {meeting.attendeesCount > 3 && (
                    <span className="text-xs font-semibold dark:text-white/60 light:text-purple-600 ml-1">
                      +{meeting.attendeesCount - 3}명
                    </span>
                  )}
                  <span className="text-xs dark:text-white/60 light:text-purple-600 ml-auto">
                    {meeting.attendeesCount}명 참석
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleJoinMeeting(meeting)}
                disabled={meeting.status === "upcoming"}
                className={`w-full px-4 py-2.5 font-semibold rounded-xl text-sm transition-all duration-200 ${
                  meeting.status === "ongoing"
                    ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800 dark:shadow-lg dark:shadow-pink-500/30 light:shadow-md light:shadow-pink-400/30 hover:scale-105 active:scale-95"
                    : "dark:bg-purple-500/20 dark:text-white/60 light:bg-purple-300/30 light:text-purple-700 cursor-not-allowed"
                }`}
              >
                {meeting.status === "ongoing"
                  ? "지금 바로 참여하기"
                  : "예정된 회의"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
