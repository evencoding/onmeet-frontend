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
import { useTranslation } from "react-i18next";
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
  "bg-purple-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-fuchsia-500",
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

  const { t } = useTranslation();
  const userTeams = user?.teams ?? [];

  const navItems: NavItem[] = [
    {
      id: "today",
      label: t("nav.todayMeeting"),
      icon: <Calendar className="w-5 h-5" />,
      route: "/",
    },
    {
      id: "summary",
      label: t("nav.meetingHistory"),
      icon: <FileText className="w-5 h-5" />,
      route: "/summary",
    },
    {
      id: "schedule",
      label: t("nav.schedule"),
      icon: <Clock className="w-5 h-5" />,
      hasMenu: false,
      route: "/schedule",
    },
    {
      id: "mypage",
      label: t("nav.settings"),
      icon: <User className="w-5 h-5" />,
      route: "/mypage",
    },
  ];


  return (
    <div
      className={cn(
        "flex flex-col h-screen transition-all duration-300 dark:bg-purple-950/80 dark:border-r dark:border-purple-500/20 dark:backdrop-blur-md light:bg-gradient-to-b light:from-white light:via-purple-50/40 light:to-pink-50/30 light:border-r light:border-purple-200/60 light:shadow-lg light:shadow-purple-100/40",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-col items-center justify-between dark:border-b dark:border-purple-500/20 light:border-b light:border-purple-200/40",
          isCollapsed ? "px-2 py-4" : "px-6 py-5",
        )}
      >
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:opacity-80 transition-opacity"
              title="메인 화면으로 이동"
            >
              <img
                src="/icons/brand-logo-transparent.png"
                alt="ONMEET"
                className="h-8 w-auto dark:brightness-0 dark:invert"
              />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-80 transition-opacity"
              title="메인 화면으로 이동"
            >
              <img
                src="/icons/brand-icon-transparent.png"
                alt="ONMEET"
                className="w-8 h-8 dark:brightness-0 dark:invert"
              />
            </button>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
              title={isCollapsed ? "사이드바 확대" : "사이드바 축소"}
              aria-label={isCollapsed ? "사이드바 확대" : "사이드바 축소"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 dark:text-white/50 light:text-purple-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 dark:text-white/50 light:text-purple-600" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <div key={item.id} title={isCollapsed ? item.label : ""}>
              <button
                onMouseEnter={() => routePrefetchMap[item.route]?.()}
                onClick={() => navigate(item.route)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 group",
                  isCollapsed
                    ? "justify-center p-3"
                    : "justify-between px-4 py-3",
                  isActive
                    ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-gradient-to-r light:from-purple-100/80 light:to-pink-50/40 light:text-purple-900 light:shadow-sm light:shadow-purple-200/30 light:border light:border-purple-200/50"
                    : "dark:text-white/60 dark:hover:text-white/90 dark:hover:bg-purple-500/10 light:text-purple-700 light:hover:text-purple-900 light:hover:bg-purple-50/80",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "dark:text-purple-400 light:text-purple-700" : "dark:text-white/50 light:text-purple-600",
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
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
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
        <div className="px-3 py-4 dark:border-t dark:border-purple-500/20 light:border-t light:border-purple-200/40">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold dark:text-white/40 light:text-purple-600 uppercase tracking-wider">
              {t("nav.teams")}
            </span>
          </div>

          {userTeams.length > 0 ? (
            <div className="space-y-1 mb-3">
              {userTeams.map((team, idx) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(String(team.id));
                    onTeamSelect?.(String(team.id));
                    navigate(`/team/${team.id}`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                    selectedTeamId === String(team.id)
                      ? "dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-900"
                      : "dark:text-white/60 dark:hover:text-white/90 dark:hover:bg-purple-500/10 light:text-purple-700 light:hover:text-purple-900 light:hover:bg-purple-50",
                  )}
                  title={`${team.name} 팀 선택`}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold text-white",
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
                    <span className="text-xs text-amber-400 font-medium">대기</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 text-xs dark:text-white/40 light:text-purple-600 mb-3">{t("nav.noTeam")}</p>
          )}

          <button
            onClick={() => setIsAddTeamModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 dark:text-white/50 dark:hover:text-white/80 dark:hover:bg-purple-500/10 light:text-purple-600 light:hover:text-purple-900 light:hover:bg-purple-50 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">{t("nav.addTeam")}</span>
          </button>
        </div>
      )}

      {isAddTeamModalOpen && (
        <AddTeamModal
          isOpen={isAddTeamModalOpen}
          onClose={() => setIsAddTeamModalOpen(false)}
        />
      )}

      {/* User Profile */}
      <div
        className={cn(
          "dark:border-t dark:border-purple-500/20 light:border-t light:border-purple-200/40",
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
          "om-btn-primary text-sm",
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
          className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
          title="로그아웃"
          aria-label="로그아웃"
        >
          <LogOut className="w-4 h-4 dark:text-white/50 light:text-purple-600 hover:text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="relative flex-shrink-0">
          <ProfileAvatar name={user.name} profileImageUrl={profileImageUrl} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 dark:border-purple-950 light:border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold dark:text-white/90 light:text-purple-950 truncate">
            {user.name}
          </div>
          <div className="text-xs dark:text-white/50 light:text-purple-600 truncate">
            {user.email}
          </div>
          {user.company?.name && (
            <div className="text-xs dark:text-white/40 light:text-purple-500 truncate">
              {user.company.name}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 dark:border dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-white/70 dark:hover:bg-purple-500/20 light:border-2 light:border-purple-300/50 light:bg-gradient-to-r light:from-purple-50 light:to-pink-50/50 light:text-purple-700 light:hover:from-purple-100 light:hover:to-pink-100/50 light:shadow-sm light:shadow-purple-200/20 text-sm font-medium rounded-xl transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );
}
