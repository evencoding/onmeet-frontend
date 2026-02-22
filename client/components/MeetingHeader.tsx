import { MoreVertical, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
    <div className="px-6 py-4 border-b dark:border-purple-500/20 dark:bg-purple-500/10 dark:backdrop-blur-md light:border-purple-200 light:bg-white/50 light:backdrop-blur-sm flex items-center justify-between">
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
        <div className="relative">
          <button
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

          {/* Notification Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 dark:bg-black/80 light:bg-white border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl shadow-2xl dark:backdrop-blur-md light:backdrop-blur-sm z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b dark:border-purple-500/20 light:border-purple-300/30 flex items-center justify-between">
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
                    <button
                      key={notification.id}
                      onClick={() => {
                        handleNotificationClick(notification.id);
                      }}
                      className={`w-full px-4 py-3 border-l-4 transition-colors text-left ${getNotificationColor(
                        notification.type
                      )} ${
                        notification.isRead
                          ? "dark:bg-black/30 light:bg-purple-50/50"
                          : "dark:bg-purple-500/10 light:bg-purple-100/30"
                      } hover:dark:bg-purple-500/20 hover:light:bg-purple-100/40`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm dark:text-white light:text-purple-900 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs dark:text-white/60 light:text-purple-700 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs dark:text-white/40 light:text-purple-600">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm dark:text-white/50 light:text-purple-600">
                    알림이 없습니다
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t dark:border-purple-500/20 light:border-purple-300/30">
                  <button className="w-full text-center text-sm font-medium dark:text-purple-400 light:text-purple-600 hover:dark:text-purple-300 hover:light:text-purple-700 transition-colors">
                    모든 알림 보기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/50 dark:hover:text-white/80 light:text-purple-600 light:hover:text-purple-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
