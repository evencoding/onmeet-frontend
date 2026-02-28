import { MoreVertical, Bell, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "meeting" | "team" | "message" | "system";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "새로운 회의 초대",
    message: "정호준님이 '제품 로드맵 리뷰' 회의에 초대했습니다",
    timestamp: "5분 전",
    isRead: false,
    type: "meeting",
  },
  {
    id: "2",
    title: "팀 멤버 추가",
    message: "마케팅 팀에 새로운 멤버가 추가되었습니다",
    timestamp: "1시간 전",
    isRead: false,
    type: "team",
  },
  {
    id: "3",
    title: "새로운 메시지",
    message: "김철수님이 마케팅 채널에 메시지를 보냈습니다",
    timestamp: "2시간 전",
    isRead: true,
    type: "message",
  },
  {
    id: "4",
    title: "회의 완료",
    message: "'SNS 콘텐츠 회의'가 완료되었습니다",
    timestamp: "3시간 전",
    isRead: true,
    type: "system",
  },
];

export default function MeetingHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Update dropdown position when it opens
  useEffect(() => {
    if (isDropdownOpen && bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // mt-2 equivalent
        right: window.innerWidth - rect.right,
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellButtonRef.current && !bellButtonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen && bellButtonRef.current) {
        const rect = bellButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    if (isDropdownOpen) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isDropdownOpen]);

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "dark:border-l-blue-500 light:border-l-blue-500";
      case "team":
        return "dark:border-l-purple-500 light:border-l-purple-500";
      case "message":
        return "dark:border-l-pink-500 light:border-l-pink-500";
      case "system":
        return "dark:border-l-green-500 light:border-l-green-500";
      default:
        return "dark:border-l-purple-500 light:border-l-purple-500";
    }
  };

  return (
    <div className="px-6 py-4 border-b dark:border-purple-500/20 dark:bg-purple-500/10 dark:backdrop-blur-md light:border-b-2 light:border-purple-200 light:bg-white light:shadow-sm light:shadow-purple-100/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
          C
        </div>
        <div>
          <div className="text-sm font-medium dark:text-white/90 light:text-purple-900">Chloe Choi</div>
          <div className="text-xs dark:text-white/50 light:text-purple-600">staff-and</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification Bell */}
        <div>
          <button
            ref={bellButtonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/50 dark:hover:text-white/80 light:text-purple-600 light:hover:text-purple-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown - Portal */}
          {isDropdownOpen &&
            createPortal(
              <div
                className="fixed w-96 dark:bg-black/80 light:bg-white dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300 rounded-2xl shadow-2xl dark:shadow-purple-900/50 light:shadow-lg light:shadow-purple-300/30 dark:backdrop-blur-md light:backdrop-blur-sm z-[999999]"
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                }}
              >
                {/* Header */}
                <div className="px-4 py-3 dark:border-b dark:border-purple-500/20 light:border-b-2 light:border-purple-200 light:bg-purple-50/50 flex items-center justify-between">
                  <h3 className="font-semibold dark:text-white light:text-purple-900">알림</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-1 dark:bg-red-500/20 dark:text-red-300 light:bg-red-100/70 light:text-red-800 rounded-full">
                      {unreadCount}개 미읽음
                    </span>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-l-4 transition-colors text-left flex items-start justify-between group ${getNotificationColor(
                          notification.type
                        )} ${
                          notification.isRead
                            ? "dark:bg-black/30 light:bg-purple-50/60"
                            : "dark:bg-purple-500/10 light:bg-purple-100/50 light:border-b light:border-purple-200/40"
                        } hover:dark:bg-purple-500/20 hover:light:bg-purple-100/60`}
                      >
                        <button
                          onClick={() => {
                            handleNotificationClick(notification.id);
                          }}
                          className="flex-1 text-left"
                        >
                          <p className="font-medium text-sm dark:text-white light:text-purple-900 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs dark:text-white/60 light:text-purple-700 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs dark:text-white/40 light:text-purple-600">
                            {notification.timestamp}
                          </p>
                        </button>
                        <div className="flex items-start gap-2 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                          )}
                          <button
                            onClick={() => {
                              setNotifications(notifications.filter((n) => n.id !== notification.id));
                            }}
                            className="p-1 dark:text-white/40 dark:hover:text-red-400 light:text-purple-600 light:hover:text-red-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                            title="알림 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm dark:text-white/50 light:text-purple-600">
                      알림이 없습니다
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}
        </div>

        <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/50 dark:hover:text-white/80 light:text-purple-600 light:hover:text-purple-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
