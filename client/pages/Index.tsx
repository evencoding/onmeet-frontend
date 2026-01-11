import Layout from "@/components/Layout";
import { Calendar, Clock, MapPin, Users, Video, Settings } from "lucide-react";

export default function Index() {
  const meetings = [
    {
      id: 1,
      title: "디자인 리뷰 미팅",
      time: "14:00 - 15:00",
      location: "회의실 A",
      attendees: 5,
      upcoming: true,
    },
    {
      id: 2,
      title: "팀 스탠드업",
      time: "10:00 - 10:30",
      location: "온라인",
      attendees: 12,
      upcoming: false,
    },
    {
      id: 3,
      title: "클라이언트 프레젠테이션",
      time: "15:30 - 16:30",
      location: "회의실 B",
      attendees: 8,
      upcoming: true,
    },
  ];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            오늘의 회의
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("ko-KR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Meeting Cards */}
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                meeting.upcoming
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-white border-border hover:bg-secondary"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {meeting.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {meeting.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {meeting.attendees}명 참석
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">오늘의 회의</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{meetings.length}</div>
          </div>
          <div className="p-6 bg-white border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">총 참석자</span>
            </div>
            <div className="text-3xl font-bold text-foreground">
              {meetings.reduce((sum, m) => sum + m.attendees, 0)}
            </div>
          </div>
          <div className="p-6 bg-white border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">예정 시간</span>
            </div>
            <div className="text-3xl font-bold text-foreground">3시간</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
