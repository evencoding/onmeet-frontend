import { Calendar, FileText, ClipboardList, Clock, TrendingUp, LayoutGrid, Plus, MoreVertical, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function Sidebar() {
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
      hasMenu: true,
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
    <div className="w-full md:w-72 bg-background border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
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
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors group",
              item.isActive
                ? "bg-secondary text-primary"
                : "text-foreground hover:bg-secondary/50"
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
      <div className="px-3 py-4 border-t border-border">
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
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group",
                team.hasCheckmark
                  ? "bg-secondary text-primary"
                  : "text-foreground hover:bg-secondary/50"
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
      <div className="px-3 py-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors group">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-foreground">김지롱</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-muted-foreground">활동 중</span>
            </div>
          </div>
          <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary rounded">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </button>
      </div>
    </div>
  );
}
