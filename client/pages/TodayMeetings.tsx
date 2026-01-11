import Layout from "@/components/Layout";
import { Clock, MapPin, Users, Video } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  time: string;
  location: string;
  participants: number;
  attendees: string[];
  status: "ongoing" | "upcoming" | "completed";
}

export default function TodayMeetings() {
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "팀 스탠드업",
      time: "10:00 AM - 10:30 AM",
      location: "회의실 A",
      participants: 5,
      attendees: ["김마케", "이광고", "박콘텐"],
      status: "ongoing",
    },
    {
      id: "2",
      title: "클라이언트 미팅",
      time: "2:00 PM - 3:00 PM",
      location: "온라인",
      participants: 8,
      attendees: ["정상품", "최개발", "임기획"],
      status: "upcoming",
    },
    {
      id: "3",
      title: "디자인 리뷰",
      time: "3:30 PM - 4:15 PM",
      location: "회의실 B",
      participants: 4,
      attendees: ["손디자인", "황UI"],
      status: "upcoming",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">진행 중</span>;
      case "upcoming":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">예정</span>;
      case "completed":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">완료</span>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">오늘의 회의</h1>
          <p className="text-text-sub">
            {new Date().toLocaleDateString("ko-KR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {meeting.title}
                  </h3>
                  <div className="space-y-2 text-sm text-text-sub">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-500" />
                      {meeting.participants}명 참석
                    </div>
                  </div>
                </div>
                {getStatusBadge(meeting.status)}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/20">
                <div className="flex -space-x-2">
                  {meeting.attendees.map((attendee, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white"
                    >
                      {attendee.charAt(0)}
                    </div>
                  ))}
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
                  <Video className="w-4 h-4" />
                  참여
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
