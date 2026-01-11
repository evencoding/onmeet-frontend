import { Eye } from "lucide-react";

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

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          ON MEETING
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-gradient-to-br from-white via-surface-subtle to-white border border-border/50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-xs"
          >
            {/* Host Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={meeting.hostAvatar}
                alt={meeting.hostName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {meeting.hostName}
                </h3>
                <p className="text-xs text-muted-foreground">{meeting.time}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4 pb-4 border-t border-border pt-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Participants</span>
                <span className="font-medium">{meeting.attendeesCount} members</span>
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-2 mb-4">
              {meeting.attendees.map((attendee, idx) => (
                <img
                  key={idx}
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-6 h-6 rounded-full border border-border"
                />
              ))}
              {meeting.attendeesCount > meeting.attendees.length && (
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                  +{meeting.attendeesCount - meeting.attendees.length}
                </div>
              )}
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-medium rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95">
              <Eye className="w-4 h-4" />
              View details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
