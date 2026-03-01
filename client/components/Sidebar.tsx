import {
  Calendar,
  FileText,
  ClipboardList,
  Clock,
  LayoutGrid,
  Plus,
  MoreVertical,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AddTeamModal from "@/components/AddTeamModal";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  hasMenu?: boolean;
  route: string;
}

interface Team {
  id: string;
  name: string;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  description?: string;
  icon?: string;
  hasCheckmark?: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onTeamSelect?: (teamId: string) => void;
}

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onTeamSelect,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("marketing");
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "today",
      label: "오늘 회의",
      icon: <Calendar className="w-5 h-5" />,
      badge: 2,
      route: "/",
    },
    {
      id: "summary",
      label: "회의 내역",
      icon: <FileText className="w-5 h-5" />,
      badge: 8,
      route: "/summary",
    },
    {
      id: "schedule",
      label: "회의 일정",
      icon: <Clock className="w-5 h-5" />,
      hasMenu: false,
      route: "/schedule",
    },
    {
      id: "mypage",
      label: "설정",
      icon: <User className="w-5 h-5" />,
      route: "/mypage",
    },
  ];

  const teams: Team[] = [
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-blue-100",
    },
    {
      id: "product",
      name: "Product",
      color: "bg-cyan-100",
    },
    {
      id: "design",
      name: "Design",
      color: "bg-sky-100",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen transition-all duration-300 dark:bg-slate-900 dark:border-r dark:border-border/20 light:bg-white light:border-r light:border-border/40",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-col items-center justify-between dark:border-b dark:border-border/20 dark:bg-slate-900/50 light:border-b light:border-border/20 light:bg-white",
          isCollapsed ? "px-2 py-4" : "px-6 py-5",
        )}
      >
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="메인 화면으로 이동"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                O
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                ONMEET
              </span>
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold hover:opacity-80 transition-opacity"
              title="메인 화면으로 이동"
            >
              O
            </button>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title={isCollapsed ? "사이드바 확대" : "사이드바 축소"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <div key={item.id} title={isCollapsed ? item.label : ""}>
              <button
                onClick={() => navigate(item.route)}
                className={cn(
                  "w-full flex items-center rounded-lg transition-all duration-200 group",
                  isCollapsed
                    ? "justify-center p-3"
                    : "justify-between px-4 py-3",
                  isActive
                    ? "dark:bg-brand-500/10 dark:text-brand-400 light:bg-brand-50/50 light:text-brand-700"
                    : "dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-slate-800/50 light:text-muted-foreground light:hover:text-foreground light:hover:bg-slate-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && (
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
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Teams Section */}
      {!isCollapsed && (
        <div className="px-3 py-4 dark:border-t dark:border-border/20 dark:bg-slate-900/30 light:border-t light:border-border/20 light:bg-slate-50/30">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              Teams
            </span>
            <button className="p-1 dark:hover:bg-slate-800 light:hover:bg-slate-100/50 rounded transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  onTeamSelect?.(team.id);
                  navigate(`/team/${team.id}`);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  selectedTeamId === team.id
                    ? "dark:bg-brand-500/10 dark:text-brand-400 light:bg-brand-50/50 light:text-brand-700"
                    : "dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-slate-800/50 light:text-muted-foreground light:hover:text-foreground light:hover:bg-slate-50",
                )}
                title={`${team.name} 팀 선택`}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold text-white",
                    team.id === "marketing"
                      ? "bg-blue-500"
                      : team.id === "product"
                        ? "bg-cyan-500"
                        : "bg-sky-500",
                  )}
                >
                  {team.id.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium flex-1 text-left">
                  {team.name}
                </span>
                <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity dark:text-white/40 light:text-purple-600" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddTeamModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground dark:hover:bg-slate-800/50 light:hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">팀 추가</span>
          </button>
        </div>
      )}

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onTeamAdded={(team) => {
          // Handle team added - can be extended for actual API calls
          console.log("New team added:", {
            name: team.name,
            description: team.description,
            backgroundColor: team.backgroundColor,
            textColor: team.textColor,
            membersCount: team.members.length,
            members: team.members,
          });
          // You can integrate actual API call here to save the team
          // Example API call:
          // await fetch('/api/teams', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     name: team.name,
          //     description: team.description,
          //     backgroundColor: team.backgroundColor,
          //     textColor: team.textColor,
          //     memberIds: team.members.map(m => m.id),
          //   })
          // });
        }}
      />

      {/* User Profile */}
      <div
        className={cn(
          "dark:border-t dark:border-border/20 dark:bg-slate-900/30 light:border-t light:border-border/20 light:bg-slate-50/30",
          isCollapsed ? "px-2 py-4" : "px-3 py-4",
        )}
      >
        <UserProfile isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

function UserProfile({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className={cn(
          "bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-all duration-200",
          isCollapsed
            ? "w-10 h-10 p-2 flex items-center justify-center"
            : "w-full px-4 py-3",
        )}
        title={isCollapsed ? "로그인" : ""}
      >
        {isCollapsed ? "→" : "로그인"}
      </button>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-full space-y-2 flex flex-col items-center">
        <div title={user.name} className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border border-white"></div>
        </div>
        <button
          onClick={logout}
          className="p-2 dark:hover:bg-slate-800 light:hover:bg-slate-100/50 rounded transition-colors"
          title="로그아웃"
        >
          <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Company Information */}
      <div className="w-full px-4 py-4 bg-brand-500 rounded-lg text-center">
        <div className="text-base font-bold text-white">
          Acme Corporation
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 dark:border dark:border-border/30 dark:bg-slate-800/50 dark:text-muted-foreground dark:hover:bg-slate-800 light:border light:border-border/40 light:bg-slate-50 light:text-foreground light:hover:bg-slate-100 text-sm font-medium rounded-lg transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );
}
