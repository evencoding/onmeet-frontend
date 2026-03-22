import {
  Calendar,
  FileText,
  Clock,
  Plus,
  MoreVertical,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/context";
import { useNavigate, useLocation } from "react-router-dom";
import { routePrefetchMap } from "@/app/routePrefetchMap";
import { memo, useState } from "react";
import AddTeamModal from "@/features/team/components/AddTeamModal";
import { useProfileImage } from "@/shared/hooks/useProfileImage";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  hasMenu?: boolean;
  route: string;
}

const TEAM_COLORS = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onTeamSelect?: (teamId: string) => void;
}

export default memo(function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onTeamSelect,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  const userTeams = user?.teams ?? [];

  const navItems: NavItem[] = [
    {
      id: "today",
      label: "오늘 회의",
      icon: <Calendar className="w-5 h-5" />,
      route: "/",
    },
    {
      id: "summary",
      label: "회의 내역",
      icon: <FileText className="w-5 h-5" />,
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

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <div key={item.id} title={isCollapsed ? item.label : ""}>
              <button
                onMouseEnter={() => routePrefetchMap[item.route]?.()}
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
          </div>

          {userTeams.length > 0 ? (
            <div className="space-y-2 mb-3">
              {userTeams.map((team, idx) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(String(team.id));
                    onTeamSelect?.(String(team.id));
                    navigate(`/team/${team.id}`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    selectedTeamId === String(team.id)
                      ? "dark:bg-brand-500/10 dark:text-brand-400 light:bg-brand-50/50 light:text-brand-700"
                      : "dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-slate-800/50 light:text-muted-foreground light:hover:text-foreground light:hover:bg-slate-50",
                  )}
                  title={`${team.name} 팀 선택`}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold text-white",
                      !team.color && TEAM_COLORS[idx % TEAM_COLORS.length],
                    )}
                    style={team.color ? { backgroundColor: team.color } : undefined}
                  >
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">
                    {team.name}
                  </span>
                  {team.status === "PENDING" && (
                    <span className="text-xs text-amber-500 font-medium">대기</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 text-xs text-muted-foreground mb-3">소속된 팀이 없습니다</p>
          )}

          <button
            onClick={() => setIsAddTeamModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground dark:hover:bg-slate-800/50 light:hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">팀 추가</span>
          </button>
        </div>
      )}

      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
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
});

function ProfileAvatar({ name, profileImageUrl, size = "w-10 h-10" }: { name: string; profileImageUrl?: string | null; size?: string }) {
  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt={name}
        className={`${size} rounded-full object-cover`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm`}>
      {name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
}

function UserProfile({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { user, logout } = useAuth();
  const { data: profileImageUrl } = useProfileImage(user?.profileImageId);
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
          <ProfileAvatar name={user.name} profileImageUrl={profileImageUrl} />
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
      {/* User Info */}
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="relative flex-shrink-0">
          <ProfileAvatar name={user.name} profileImageUrl={profileImageUrl} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white dark:border-slate-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {user.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {user.email}
          </div>
          {user.company?.name && (
            <div className="text-xs text-muted-foreground/70 truncate">
              {user.company.name}
            </div>
          )}
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
