import { Calendar, FileText, ClipboardList, Clock, LayoutGrid, Plus, MoreVertical, Search, Menu, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  isActive?: boolean;
  hasMenu?: boolean;
}

interface Team {
  id: string;
  name: string;
  color: string;
  icon?: string;
  hasCheckmark?: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: "today",
      label: "오늘 회의",
      icon: <Calendar className="w-5 h-5" />,
      badge: 2,
      isActive: true,
    },
    {
      id: "records",
      label: "회의 기록",
      icon: <FileText className="w-5 h-5" />,
      badge: 8,
    },
    {
      id: "summary",
      label: "요약본",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      id: "schedule",
      label: "일정",
      icon: <Clock className="w-5 h-5" />,
      hasMenu: false,
    },
    {
      id: "board",
      label: "팀 보드",
      icon: <LayoutGrid className="w-5 h-5" />,
    },
  ];

  const teams: Team[] = [
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-purple-200",
      icon: "✓",
      hasCheckmark: true,
    },
    {
      id: "product",
      name: "Product",
      color: "bg-blue-200",
      icon: "📊",
    },
    {
      id: "design",
      name: "Design",
      color: "bg-pink-200",
      icon: "🎨",
    },
  ];

  return (
    <div className="w-full md:w-72 bg-gradient-to-b from-bg-DEFAULT via-white/40 to-bg-DEFAULT border-r border-border/30 flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/30 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              O
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              ONMEET
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              switch (item.id) {
                case "today":
                  navigate("/");
                  break;
                case "records":
                  navigate("/records");
                  break;
                case "summary":
                  navigate("/summary");
                  break;
                case "schedule":
                  navigate("/schedule");
                  break;
                case "board":
                  navigate("/board");
                  break;
              }
            }}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              item.isActive
                ? "bg-gradient-to-r from-brand-50 to-brand-50 text-brand-500 shadow-sm"
                : "text-foreground hover:bg-white/40"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex-shrink-0",
                  item.isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-primary text-primary-foreground text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {item.hasMenu && (
                <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Teams Section */}
      <div className="px-3 py-4 border-t border-border/30 bg-white/30">
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Teams
          </span>
          <button className="p-1 hover:bg-secondary rounded transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          {teams.map((team) => (
            <button
              key={team.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                team.hasCheckmark
                  ? "bg-gradient-to-r from-brand-50 to-brand-50 text-brand-500 shadow-sm"
                  : "text-foreground hover:bg-white/40"
              )}
            >
              <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold text-white", team.color)}>
                {team.hasCheckmark ? "✓" : team.icon}
              </div>
              <span className="text-sm font-medium flex-1 text-left">{team.name}</span>
              <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">팀 추가</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-border/30 bg-white/30">
        <UserProfile />
      </div>
    </div>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="w-full px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200"
      >
        로그인
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/40 rounded-xl transition-all duration-200 group">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-foreground">{user.name}</div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-muted-foreground">활동 중</span>
          </div>
        </div>
        <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary rounded">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border/60 bg-white/40 text-foreground text-sm font-medium rounded-xl hover:bg-white/60 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );
}
