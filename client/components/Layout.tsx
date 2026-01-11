import Sidebar from "./Sidebar";
import MeetingHeader from "./MeetingHeader";
import AIMeetingSearch from "./AIMeetingSearch";
import RecentMeetings from "./RecentMeetings";
import { Menu } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  showAIPanel?: boolean;
  showRecentPanel?: boolean;
}

export default function Layout({ children, showAIPanel = false, showRecentPanel = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("marketing");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile, visible on md and above */}
      <div className="hidden md:block md:w-72">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MeetingHeader />

        {/* Content area with right panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>

          {/* Right panel - AI Meeting Search or Recent Meetings */}
          {showAIPanel && (
            <div className="hidden lg:block">
              <AIMeetingSearch />
            </div>
          )}

          {showRecentPanel && (
            <div className="hidden lg:flex lg:w-96 border-l border-border/30 bg-white/40 backdrop-blur-md flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30 bg-white/50">
                <h2 className="text-lg font-bold text-foreground">최근 회의 기록</h2>
                <p className="text-xs text-text-sub mt-1">최근에 열린 회의들</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <RecentMeetings />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
