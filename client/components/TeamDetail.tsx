import { Users, MessageSquare, Settings, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface TeamDetailProps {
  teamId: string;
  teamName: string;
}

// Mock data for teams
const teamsData: Record<
  string,
  {
    name: string;
    description: string;
    color: string;
    members: TeamMember[];
    channels: Channel[];
  }
> = {
  marketing: {
    name: "Marketing",
    description: "마케팅 팀의 회의 및 협업 공간",
    color: "bg-purple-500",
    members: [
      {
        id: "1",
        name: "김철수",
        email: "kim@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        role: "Team Lead",
      },
      {
        id: "2",
        name: "이영희",
        email: "lee@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        role: "Senior Manager",
      },
      {
        id: "3",
        name: "박민준",
        email: "park@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        role: "Specialist",
      },
    ],
    channels: [
      {
        id: "1",
        name: "일반",
        description: "일반 토론",
        memberCount: 12,
      },
      {
        id: "2",
        name: "캠페인",
        description: "마케팅 캠페인 논의",
        memberCount: 8,
      },
      {
        id: "3",
        name: "소셜미디어",
        description: "SNS 전략 및 콘텐츠",
        memberCount: 5,
      },
    ],
  },
  product: {
    name: "Product",
    description: "제품팀의 회의 및 협업 공간",
    color: "bg-blue-500",
    members: [
      {
        id: "4",
        name: "정준호",
        email: "jung@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        role: "Product Manager",
      },
      {
        id: "5",
        name: "최수진",
        email: "choi@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        role: "Designer",
      },
    ],
    channels: [
      {
        id: "4",
        name: "일반",
        description: "일반 토론",
        memberCount: 10,
      },
      {
        id: "5",
        name: "개발",
        description: "개발 관련 논의",
        memberCount: 7,
      },
      {
        id: "6",
        name: "디자인",
        description: "디자인 검토 및 피드백",
        memberCount: 6,
      },
    ],
  },
  design: {
    name: "Design",
    description: "디자인팀의 회의 및 협업 공간",
    color: "bg-pink-500",
    members: [
      {
        id: "6",
        name: "임상현",
        email: "lim@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        role: "Design Lead",
      },
      {
        id: "7",
        name: "한지은",
        email: "han@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        role: "UX Designer",
      },
      {
        id: "8",
        name: "유혜정",
        email: "yu@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        role: "UI Designer",
      },
    ],
    channels: [
      {
        id: "7",
        name: "일반",
        description: "일반 토론",
        memberCount: 9,
      },
      {
        id: "8",
        name: "UI 디자인",
        description: "UI 디자인 및 시스템",
        memberCount: 6,
      },
      {
        id: "9",
        name: "UX 리서치",
        description: "UX 리서치 및 분석",
        memberCount: 4,
      },
    ],
  },
};

export default function TeamDetail({ teamId, teamName }: TeamDetailProps) {
  const teamData = teamsData[teamId as keyof typeof teamsData];

  if (!teamData) {
    return (
      <div className="text-center py-12">
        <p className="text-text-sub">팀 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {teamData.name}
            </h1>
            <p className="text-text-sub">{teamData.description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex items-center"
          >
            <Settings className="w-4 h-4" />팀 설정
          </Button>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-bold text-foreground">팀원</h2>
            <span className="px-2 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-full">
              {teamData.members.length}명
            </span>
          </div>
          <Button variant="outline" size="sm">
            멤버 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamData.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface-subtle transition-colors"
            >
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-text-sub">{member.role}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Channels Section */}
      <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-bold text-foreground">채널</h2>
            <span className="px-2 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-full">
              {teamData.channels.length}개
            </span>
          </div>
          <Button variant="outline" size="sm">
            채널 추가
          </Button>
        </div>

        <div className="space-y-3">
          {teamData.channels.map((channel) => (
            <button
              key={channel.id}
              className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-surface-subtle transition-all hover:shadow-sm border border-border/0 hover:border-border/20"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                  <span className="text-lg">#</span>
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">
                  {channel.name}
                </h3>
                <p className="text-sm text-text-sub">{channel.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground">
                  {channel.memberCount}명
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Team Contact Section */}
      <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-bold text-foreground">팀 연락처</h2>
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <p className="text-sm text-foreground mb-2">
            이 팀에 관한 문의사항이나 제안이 있으시면 연락주세요.
          </p>
          <Button className="mt-3 gap-2">
            <Mail className="w-4 h-4" />
            팀에 메일 보내기
          </Button>
        </div>
      </div>
    </div>
  );
}
