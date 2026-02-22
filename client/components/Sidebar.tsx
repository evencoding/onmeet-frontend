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
  color: string;
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
      id: "records",
      label: "이전 회의",
      icon: <FileText className="w-5 h-5" />,
      badge: 8,
      route: "/records",
    },
    {
      id: "summary",
      label: "Ai 회의록",
      icon: <ClipboardList className="w-5 h-5" />,
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
      label: "마이페이지",
      icon: <User className="w-5 h-5" />,
      route: "/mypage",
    },
  ];

  const teams: Team[] = [
    {
      id: "marketing",
      name: "Marketing",
      color: "bg-purple-200",
    },
    {
      id: "product",
      name: "Product",
      color: "bg-blue-200",
    },
    {
      id: "design",
      name: "Design",
      color: "bg-pink-200",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen transition-all duration-300 dark:bg-gradient-to-b dark:from-purple-950/30 dark:via-black/60 dark:to-purple-950/30 dark:border-r dark:border-purple-500/20 dark:backdrop-blur-md light:bg-white light:border-r light:border-purple-200",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-col items-center justify-between dark:border-b dark:border-purple-500/20 dark:bg-purple-500/10 dark:backdrop-blur-md light:border-b light:border-purple-200 light:bg-white",
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
              <span className="font-bold text-lg tracking-tight dark:text-foreground light:text-purple-900">
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
                  "w-full flex items-center rounded-xl transition-all duration-200 group",
                  isCollapsed
                    ? "justify-center p-3"
                    : "justify-between px-4 py-3",
                  isActive
                    ? "bg-gradient-to-r from-purple-600/30 to-purple-600/20 text-purple-300 shadow-lg shadow-purple-500/20"
                    : "text-white/70 hover:bg-purple-500/10 hover:text-white/90",
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
        <div className="px-3 py-4 dark:border-t dark:border-purple-500/20 dark:bg-purple-500/5 dark:backdrop-blur-md light:border-t light:border-purple-300/50 light:bg-purple-50/30">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold dark:text-white/60 light:text-purple-700 uppercase">
              Teams
            </span>
            <button className="p-1 dark:hover:bg-purple-500/20 light:hover:bg-purple-200/40 rounded transition-colors">
              <MoreVertical className="w-4 h-4 dark:text-white/40 light:text-purple-600" />
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  selectedTeamId === team.id
                    ? "dark:bg-gradient-to-r dark:from-purple-600/30 dark:to-purple-600/20 dark:text-purple-300 dark:shadow-lg dark:shadow-purple-500/20 light:bg-purple-100 light:text-purple-700"
                    : "dark:text-white/70 dark:hover:bg-purple-500/10 dark:hover:text-white/90 light:text-purple-600 light:hover:bg-purple-100/50 light:hover:text-purple-800",
                )}
                title={`${team.name} 팀 선택`}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-sm font-semibold dark:text-white light:text-white bg-gradient-to-br",
                    team.id === "marketing"
                      ? "from-purple-500 to-purple-600"
                      : team.id === "product"
                        ? "from-blue-500 to-blue-600"
                        : "from-pink-500 to-pink-600",
                  )}
                >
                  {team.id.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium flex-1 text-left">
                  {team.name}
                </span>
                <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddTeamModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 dark:text-white/60 dark:hover:text-white/90 dark:hover:bg-purple-500/10 light:text-purple-600 light:hover:text-purple-800 light:hover:bg-purple-100/50 rounded-xl transition-colors"
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
            color: team.color,
            membersCount: team.members.length,
            members: team.members,
          });
          // You can integrate actual API call here to save the team
        }}
      />

      {/* User Profile */}
      <div
        className={cn(
          "border-t border-purple-500/20 bg-purple-500/5 backdrop-blur-md",
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
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200",
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
          className="p-2 hover:bg-purple-500/20 rounded transition-colors"
          title="로그아웃"
        >
          <LogOut className="w-4 h-4 text-white/60" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Company Information */}
      <div className="w-full px-4 py-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-center">
        <div className="text-base font-bold text-white">
          Acme Corporation
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-500/30 bg-purple-500/10 text-white/90 text-sm font-medium rounded-xl hover:bg-purple-500/20 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );
}
