import Layout from "@/components/Layout";
import { Plus, MoreVertical, Clock, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Meeting {
  id: string;
  title: string;
  status: "scheduled" | "in_progress" | "completed";
  startTime: string;
  endTime?: string;
  attendeesCount: number;
  hostName: string;
  description: string;
  team: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  meetings: Meeting[];
}

export default function TeamBoard() {
  const [selectedTeam, setSelectedTeam] = useState("all");

  const teams: Team[] = [
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-purple-500",
      meetings: [
        {
          id: "m1",
          title: "월간 캠페인 전략 회의",
          status: "scheduled",
          startTime: "2024-01-15 10:00 AM",
          attendeesCount: 5,
          hostName: "김철수",
          description: "Q1 마케팅 캠페인 전략 논의",
          team: "marketing",
        },
        {
          id: "m2",
          title: "SNS 콘텐츠 회의",
          status: "in_progress",
          startTime: "2024-01-14 2:00 PM",
          endTime: "2024-01-14 3:00 PM",
          attendeesCount: 3,
          hostName: "이영희",
          description: "이번주 SNS 콘텐츠 계획",
          team: "marketing",
        },
        {
          id: "m3",
          title: "광고 성과 분석",
          status: "completed",
          startTime: "2024-01-13 11:00 AM",
          endTime: "2024-01-13 12:00 PM",
          attendeesCount: 4,
          hostName: "박민준",
          description: "지난주 광고 캠페인 성과 분석",
          team: "marketing",
        },
      ],
    },
    {
      id: "product",
      name: "Product",
      color: "bg-blue-500",
      meetings: [
        {
          id: "p1",
          title: "제품 로드맵 리뷰",
          status: "scheduled",
          startTime: "2024-01-16 9:00 AM",
          attendeesCount: 8,
          hostName: "정호준",
          description: "2024년 제품 개발 계획 리뷰",
          team: "product",
        },
        {
          id: "p2",
          title: "기능 스펙 논의",
          status: "in_progress",
          startTime: "2024-01-14 10:30 AM",
          endTime: "2024-01-14 11:30 AM",
          attendeesCount: 6,
          hostName: "최수진",
          description: "새로운 기능 스펙 정의",
          team: "product",
        },
        {
          id: "p3",
          title: "버그 리뷰 회의",
          status: "completed",
          startTime: "2024-01-12 3:00 PM",
          endTime: "2024-01-12 4:00 PM",
          attendeesCount: 5,
          hostName: "조예성",
          description: "주간 버그 리포트 검토",
          team: "product",
        },
      ],
    },
    {
      id: "design",
      name: "Design",
      color: "bg-pink-500",
      meetings: [
        {
          id: "d1",
          title: "UI 디자인 리뷰",
          status: "scheduled",
          startTime: "2024-01-17 2:00 PM",
          attendeesCount: 4,
          hostName: "임상현",
          description: "신규 UI 디자인 피드백",
          team: "design",
        },
        {
          id: "d2",
          title: "디자인 시스템 회의",
          status: "in_progress",
          startTime: "2024-01-15 11:00 AM",
          endTime: "2024-01-15 12:00 PM",
          attendeesCount: 3,
          hostName: "한지은",
          description: "디자인 시스템 업데이트 논의",
          team: "design",
        },
        {
          id: "d3",
          title: "사용자 리서치 공유",
          status: "completed",
          startTime: "2024-01-11 10:00 AM",
          endTime: "2024-01-11 11:00 AM",
          attendeesCount: 5,
          hostName: "유혜정",
          description: "사용자 조사 결과 공유",
          team: "design",
        },
      ],
    },
  ];

  const displayTeams =
    selectedTeam === "all" ? teams : teams.filter((t) => t.id === selectedTeam);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "in_progress":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예정";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              팀별 회의 보드
            </h1>
            <p className="text-text-sub">
              각 팀의 회의 일정과 상태를 한눈에 확인하세요
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
            <Plus className="w-5 h-5" />
            회의 생성
          </button>
        </div>

        {/* Team Filter */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedTeam("all")}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm",
              selectedTeam === "all"
                ? "bg-brand-500 text-white shadow-lg"
                : "bg-white/60 text-foreground hover:bg-white border border-border/20",
            )}
          >
            모든 팀
          </button>
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center gap-2",
                selectedTeam === team.id
                  ? "bg-brand-500 text-white shadow-lg"
                  : "bg-white/60 text-foreground hover:bg-white border border-border/20",
              )}
            >
              <div className={cn("w-2.5 h-2.5 rounded-full", team.color)} />
              {team.name}
            </button>
          ))}
        </div>

        {/* Team Boards */}
        <div className="space-y-8">
          {displayTeams.map((team) => (
            <div key={team.id} className="space-y-4">
              {/* Team Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-4 h-4 rounded-full", team.color)} />
                <h2 className="text-2xl font-bold text-foreground">
                  {team.name}
                </h2>
                <span className="px-2.5 py-1 bg-surface-subtle text-text-sub text-xs font-semibold rounded-full">
                  {team.meetings.length}개 회의
                </span>
              </div>

              {/* Meetings List */}
              <div className="grid grid-cols-1 gap-4">
                {team.meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Title and Status */}
                        <div className="flex items-start gap-3 mb-3">
                          <h3 className="text-lg font-bold text-foreground flex-1">
                            {meeting.title}
                          </h3>
                          <span
                            className={cn(
                              "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                              getStatusBadge(meeting.status),
                            )}
                          >
                            {getStatusLabel(meeting.status)}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-sub mb-4">
                          {meeting.description}
                        </p>

                        {/* Meeting Info Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-t border-border/20 pt-4">
                          {/* Start Time */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-text-sub font-medium">
                                시작
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {meeting.startTime}
                              </p>
                            </div>
                          </div>

                          {/* Duration */}
                          {meeting.endTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-text-sub font-medium">
                                  종료
                                </p>
                                <p className="text-sm font-semibold text-foreground">
                                  {meeting.endTime}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Attendees */}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-brand-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-text-sub font-medium">
                                참석자
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {meeting.attendeesCount}명
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Host Info */}
                        <div className="text-xs text-text-sub">
                          주최자:{" "}
                          <span className="font-semibold text-foreground">
                            {meeting.hostName}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
