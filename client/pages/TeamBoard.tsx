import Layout from "@/components/Layout";
import { Users, Settings, Plus, Mail, Calendar } from "lucide-react";
import { useState } from "react";

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    email: string;
  }[];
}

export default function TeamBoard() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>("marketing");

  const teams: Team[] = [
    {
      id: "marketing",
      name: "Marketing",
      description: "마케팅 전략 및 캠페인 관리",
      memberCount: 5,
      color: "bg-purple-200",
      members: [
        {
          id: "1",
          name: "김마케",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
          role: "팀장",
          email: "kim.marketing@company.com",
        },
        {
          id: "2",
          name: "이광고",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
          role: "광고 매니저",
          email: "lee.ad@company.com",
        },
        {
          id: "3",
          name: "박콘텐",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
          role: "콘텐츠 마케터",
          email: "park.content@company.com",
        },
      ],
    },
    {
      id: "product",
      name: "Product",
      description: "제품 개발 및 기획",
      memberCount: 8,
      color: "bg-blue-200",
      members: [
        {
          id: "4",
          name: "정상품",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
          role: "팀장",
          email: "jung.product@company.com",
        },
        {
          id: "5",
          name: "최개발",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
          role: "개발자",
          email: "choi.dev@company.com",
        },
        {
          id: "6",
          name: "임기획",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
          role: "제품 기획자",
          email: "im.pm@company.com",
        },
      ],
    },
    {
      id: "design",
      name: "Design",
      description: "UI/UX 디자인 및 브랜드",
      memberCount: 4,
      color: "bg-pink-200",
      members: [
        {
          id: "7",
          name: "손디자인",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
          role: "팀장",
          email: "son.design@company.com",
        },
        {
          id: "8",
          name: "황UI",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
          role: "UI 디자이너",
          email: "hwang.ui@company.com",
        },
      ],
    },
  ];

  const currentTeam = teams.find((t) => t.id === selectedTeam);

  return (
    <Layout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">팀 보드</h1>
          <p className="text-text-sub">팀 멤버와 협업 정보를 관리하세요</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              팀 목록
            </h2>

            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedTeam === team.id
                    ? "border-brand-500 bg-brand-50 shadow-lg"
                    : "border-border/40 bg-white/40 hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${team.color} flex items-center justify-center`}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      selectedTeam === team.id ? "text-brand-600" : "text-foreground"
                    }`}>
                      {team.name}
                    </h3>
                    <p className="text-xs text-text-sub">{team.memberCount}명</p>
                  </div>
                </div>
              </button>
            ))}

            {/* Add Team Button */}
            <button className="w-full p-4 border-2 border-dashed border-border/50 rounded-2xl text-text-sub hover:text-brand-500 hover:border-brand-500 transition-all duration-200 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              팀 추가
            </button>
          </div>

          {/* Team Details */}
          {currentTeam ? (
            <div className="lg:col-span-3 space-y-6">
              {/* Team Header */}
              <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${currentTeam.color} flex items-center justify-center`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {currentTeam.name}
                      </h2>
                      <p className="text-text-sub">{currentTeam.description}</p>
                    </div>
                  </div>
                  <button className="p-3 hover:bg-secondary rounded-lg transition-colors">
                    <Settings className="w-6 h-6 text-foreground" />
                  </button>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-text-sub mb-1">팀 멤버</p>
                    <p className="text-2xl font-bold text-brand-500">
                      {currentTeam.members.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-sub mb-1">회의 (이번 달)</p>
                    <p className="text-2xl font-bold text-brand-500">12</p>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-white/40 backdrop-blur-md border border-border/30 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">팀 멤버</h3>

                <div className="space-y-3">
                  {currentTeam.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white/60 rounded-2xl p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {member.name}
                          </h4>
                          <p className="text-xs text-text-sub">{member.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-text-sub hover:text-foreground">
                          <Mail className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-text-sub hover:text-foreground">
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Member Button */}
                  <button className="w-full p-4 border-2 border-dashed border-border/50 rounded-2xl text-text-sub hover:text-brand-500 hover:border-brand-500 transition-all duration-200 flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    멤버 추가
                  </button>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "총 회의", value: "48", icon: "📊" },
                  { label: "이번 달 회의", value: "12", icon: "📅" },
                  { label: "평균 참석률", value: "92%", icon: "✅" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-4 text-center"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <p className="text-sm text-text-sub mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-brand-500">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-3 flex items-center justify-center py-20">
              <p className="text-text-sub">팀을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
