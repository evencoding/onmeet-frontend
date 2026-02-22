import { useState } from "react";
import {
  Users,
  Settings,
  Clock,
  Calendar,
  Users2,
  MoreVertical,
  Check,
  X,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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

interface TeamDetailProps {
  teamId: string;
  teamName: string;
}

// Utility function to calculate if text should be light or dark based on background color
const getTextColorClass = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return light text for dark backgrounds, dark text for light backgrounds
  return luminance > 0.5 ? "text-gray-900" : "text-white";
};

const teamColors = [
  { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { name: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
  { name: "Green", value: "bg-green-500", hex: "#22c55e" },
  { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
  { name: "Red", value: "bg-red-500", hex: "#ef4444" },
  { name: "Cyan", value: "bg-cyan-500", hex: "#06b6d4" },
  { name: "Yellow", value: "bg-yellow-500", hex: "#eab308" },
];

// Mock data for teams
const teamsData: Record<
  string,
  {
    name: string;
    description: string;
    color: string;
    colorHex: string;
    members: TeamMember[];
    channels: Channel[];
    meetings: Meeting[];
  }
> = {
  marketing: {
    name: "Marketing",
    description: "마케팅 팀의 회의 및 협업 공간",
    color: "bg-purple-500",
    colorHex: "#a855f7",
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
  product: {
    name: "Product",
    description: "제품팀의 회의 및 협업 공간",
    color: "bg-blue-500",
    colorHex: "#3b82f6",
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
  design: {
    name: "Design",
    description: "디자인팀의 회의 및 협업 공간",
    color: "bg-pink-500",
    colorHex: "#ec4899",
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
};

// Mock employee list for adding members
const mockEmployees = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "마케팅",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "마케팅",
  },
  {
    id: "3",
    name: "박민준",
    email: "park@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "마케팅",
  },
  {
    id: "4",
    name: "정준호",
    email: "jung@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "제품",
  },
  {
    id: "5",
    name: "최수진",
    email: "choi@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "제품",
  },
  {
    id: "6",
    name: "임상현",
    email: "lim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "디자인",
  },
  {
    id: "7",
    name: "한지은",
    email: "han@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "디자인",
  },
  {
    id: "8",
    name: "유혜정",
    email: "yu@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "디자인",
  },
];

export default function TeamDetail({ teamId, teamName }: TeamDetailProps) {
  const teamData = teamsData[teamId as keyof typeof teamsData];
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedColor, setEditedColor] = useState("");
  const [editedColorHex, setEditedColorHex] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState(teamData?.members || []);

  if (!teamData) {
    return (
      <div className="text-center py-12">
        <p className="text-text-sub">팀 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedName(teamData.name);
    setEditedDescription(teamData.description);
    setEditedColor(teamData.color);
    setEditedColorHex(teamData.colorHex);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically call an API to save the changes
    console.log("Saving team changes:", { editedName, editedDescription, editedColor, editedColorHex });
  };

  const changeTeamColor = (colorValue: string, colorHex: string) => {
    setEditedColor(colorValue);
    setEditedColorHex(colorHex);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAddMember = (employee: typeof mockEmployees[0]) => {
    const isAlreadyMember = teamMembers.some((m) => m.id === employee.id);
    if (!isAlreadyMember) {
      setTeamMembers([
        ...teamMembers,
        {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          avatar: employee.avatar,
          role: "Member",
        },
      ]);
      setSearchQuery("");
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      !teamMembers.some((m) => m.id === emp.id) &&
      (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Team Header */}
      <div className={cn("bg-gradient-to-br border border-border/40 rounded-2xl p-8 dark:text-white light:text-purple-900", isEditing ? editedColor : teamData.color)}>
        {isEditing ? (
          <div className="space-y-4">
            {/* Team Name Input */}
            <div>
              <label className="text-sm font-semibold dark:text-white/80 light:text-purple-700 block mb-2">
                팀 이름
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2 border dark:border-white/30 light:border-purple-300/50 rounded-lg dark:bg-white/10 light:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white dark:text-white light:text-purple-900 font-bold text-2xl"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="text-sm font-semibold dark:text-white/80 light:text-purple-700 block mb-2">
                설명
              </label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-4 py-2 border dark:border-white/30 light:border-purple-300/50 rounded-lg dark:bg-white/10 light:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white dark:text-white light:text-purple-900 resize-none"
                rows={2}
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-semibold dark:text-white/80 light:text-purple-700 block mb-2">
                팀 색상
              </label>
              <div className="flex gap-2 flex-wrap">
                {teamColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => changeTeamColor(color.value, color.hex)}
                    className={cn(
                      "w-10 h-10 rounded-full ring-2 transition-all",
                      editedColor === color.value
                        ? "ring-white scale-110"
                        : "ring-white/30 hover:ring-white/60"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                size="sm"
                onClick={handleSave}
                className="gap-2 bg-white text-purple-900 hover:bg-white/90"
              >
                <Check className="w-4 h-4" />
                저장
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="gap-2 dark:border-white/30 dark:text-white dark:hover:bg-white/10 light:border-purple-300/50 light:text-purple-700"
              >
                <X className="w-4 h-4" />
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 dark:text-white light:text-purple-900">
                {teamData.name}
              </h1>
              <p className="dark:text-white/80 light:text-purple-700">{teamData.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="gap-2 flex items-center dark:text-white dark:border-white/30 dark:hover:bg-white/20 light:text-purple-700 light:border-purple-300/50 light:hover:bg-purple-100/30"
            >
              <Settings className="w-4 h-4" />팀 설정
            </Button>
          </div>
        )}
      </div>

      {/* Team Members Section */}
      <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/60 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-white/80 light:to-purple-50 border dark:border-purple-500/30 light:border-purple-300/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 dark:text-purple-400 light:text-purple-600" />
            <h2 className="text-lg font-bold dark:text-white light:text-purple-900">팀원</h2>
            <span className="px-2 py-1 dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/70 light:text-purple-800 text-xs font-semibold rounded-full">
              {teamMembers.length}명
            </span>
          </div>
          {!isAddingMember && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingMember(true)}
              className="gap-2 dark:border-purple-500/30 dark:text-white dark:hover:bg-purple-500/20 light:border-purple-300/50 light:text-purple-700 light:hover:bg-purple-100/30"
            >
              <Plus className="w-4 h-4" />
              멤버 추가
            </Button>
          )}
        </div>

        {/* Add Member Section */}
        {isAddingMember && (
          <div className="mb-6 p-4 dark:bg-purple-500/10 light:bg-purple-50 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 dark:text-white/40 light:text-purple-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름, 이메일, 부서로 검색"
                autoFocus
                className="w-full pl-10 pr-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
              />
            </div>

            {/* Employee List */}
            {filteredEmployees.length > 0 ? (
              <div className="border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg overflow-y-auto max-h-48 dark:bg-black/40 light:bg-white">
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => handleAddMember(employee)}
                    className="w-full flex items-center gap-3 p-3 dark:border-b dark:border-purple-500/20 light:border-b light:border-purple-300/30 transition-colors dark:hover:bg-purple-500/20 light:hover:bg-purple-100/30 text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white light:text-purple-900">
                        {employee.name}
                      </p>
                      <p className="text-xs dark:text-white/50 light:text-purple-600">
                        {employee.department} · {employee.email}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 dark:text-white/40 light:text-purple-600" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm dark:text-white/60 light:text-purple-600">
                {searchQuery ? "검색 결과가 없습니다" : "추가할 팀원이 없습니다"}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => {
                  setIsAddingMember(false);
                  setSearchQuery("");
                }}
                className="flex-1 gap-2 bg-purple-600 dark:hover:bg-purple-700 light:hover:bg-purple-700 text-white"
              >
                <Check className="w-4 h-4" />
                완료
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingMember(false);
                  setSearchQuery("");
                }}
                className="flex-1 gap-2 dark:border-purple-500/30 dark:text-white dark:hover:bg-purple-500/20 light:border-purple-300/50 light:text-purple-700 light:hover:bg-purple-100/30"
              >
                <X className="w-4 h-4" />
                취소
              </Button>
            </div>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-4 dark:hover:bg-purple-500/10 light:hover:bg-purple-100/30 rounded-xl transition-colors border dark:border-purple-500/20 light:border-purple-300/30"
            >
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium dark:text-white light:text-purple-900">{member.name}</p>
                <p className="text-xs dark:text-white/60 light:text-purple-600">{member.role}</p>
                <p className="text-xs dark:text-white/40 light:text-purple-600/70 truncate">
                  {member.email}
                </p>
              </div>
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-1 dark:text-white/40 dark:hover:text-red-400 light:text-purple-600 light:hover:text-red-600 transition-colors"
                title="제거"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Team Meetings Section */}
      <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/60 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-white/80 light:to-purple-50 border dark:border-purple-500/30 light:border-purple-300/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 dark:text-purple-400 light:text-purple-600" />
            <h2 className="text-lg font-bold dark:text-white light:text-purple-900">회의 일정</h2>
            <span className="px-2 py-1 dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/70 light:text-purple-800 text-xs font-semibold rounded-full">
              {teamData.meetings.length}개
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {teamData.meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-black/40 dark:to-pink-900/20 light:bg-white border dark:border-purple-500/30 light:border-purple-300/40 rounded-xl p-5 dark:hover:shadow-lg light:hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title and Status */}
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-base font-bold dark:text-white light:text-purple-900 flex-1">
                      {meeting.title}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                        meeting.status === "scheduled"
                          ? "dark:bg-blue-500/20 dark:text-blue-300 light:bg-blue-100/70 light:text-blue-800"
                          : meeting.status === "in_progress"
                            ? "dark:bg-green-500/20 dark:text-green-300 light:bg-green-100/70 light:text-green-800"
                            : "dark:bg-gray-500/20 dark:text-gray-300 light:bg-gray-100/70 light:text-gray-800",
                      )}
                    >
                      {meeting.status === "scheduled"
                        ? "예정"
                        : meeting.status === "in_progress"
                          ? "진행중"
                          : "완료"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm dark:text-white/80 light:text-purple-700 mb-3">
                    {meeting.description}
                  </p>

                  {/* Meeting Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                      <span className="dark:text-white/70 light:text-purple-700">{meeting.startTime}</span>
                    </div>
                    {meeting.endTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                        <span className="dark:text-white/70 light:text-purple-700">{meeting.endTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users2 className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                      <span className="dark:text-white/70 light:text-purple-700">
                        {meeting.attendeesCount}명
                      </span>
                    </div>
                  </div>

                  {/* Host Info */}
                  <div className="text-xs dark:text-white/60 light:text-purple-600 mt-3">
                    주최자:{" "}
                    <span className="font-semibold dark:text-white light:text-purple-900">
                      {meeting.hostName}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-purple-500/20 light:hover:bg-purple-100/30 rounded-lg ml-2">
                  <MoreVertical className="w-4 h-4 dark:text-white/40 light:text-purple-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
