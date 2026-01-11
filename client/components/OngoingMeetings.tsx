import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Meeting {
  id: string;
  hostName: string;
  hostAvatar: string;
  time: string;
  attendeesCount: number;
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
      hostName: "Ahsan Khan",
      hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      time: "10:30 AM",
      attendeesCount: 5,
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "User 3",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
    },
    {
      id: "2",
      hostName: "Viren Gupta",
      hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      time: "11:00 AM",
      attendeesCount: 8,
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "User 3",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
    },
    {
      id: "3",
      hostName: "Ahsan Khan",
      hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      time: "11:45 AM",
      attendeesCount: 3,
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
    },
    {
      id: "4",
      hostName: "Viren Gupta",
      hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      time: "2:00 PM",
      attendeesCount: 6,
      attendees: [
        {
          name: "User 1",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
        {
          name: "User 2",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
        },
        {
          name: "User 3",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        },
      ],
    },
  ];

  const handleJoinMeeting = (meetingId: string) => {
    navigate("/meeting");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
        <h2 className="text-xs font-bold text-foreground uppercase tracking-widest letter-spacing-wider">
          진행 중인 회의
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-gradient-to-br from-white via-white/90 to-surface-subtle border border-border/40 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm group overflow-hidden relative"
          >
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className="relative z-10">
              {/* Host Info */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={meeting.hostAvatar}
                  alt={meeting.hostName}
                  className="w-14 h-14 rounded-full object-cover shadow-md ring-1 ring-border/20"
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">
                    {meeting.hostName}
                  </h3>
                  <p className="text-xs text-text-sub font-medium">{meeting.time}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6 pb-6 border-t border-border/30 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-text-sub font-medium">참석자</span>
                  <span className="font-semibold text-foreground">{meeting.attendeesCount}명</span>
                </div>
              </div>

              {/* Attendees */}
              <div className="flex items-center gap-2 mb-6">
                {meeting.attendees.map((attendee, idx) => (
                  <img
                    key={idx}
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
                  />
                ))}
                {meeting.attendeesCount > meeting.attendees.length && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 border border-border/30">
                    +{meeting.attendeesCount - meeting.attendees.length}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleJoinMeeting(meeting.id)}
                className="w-full px-5 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group/btn"
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                상세 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
