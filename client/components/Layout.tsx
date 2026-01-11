import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-background">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-lg">ONMEET</div>
          <div className="w-10" />
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
