import { MoreVertical, Bell, X, CheckCheck, Trash2, Check, XCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
  useNotificationSSE,
  useFcmSetup,
} from "@/features/notification/hooks";
import { getUnreadTotal, type NotificationType, type NotificationResponseDto } from "@/features/notification/api";
import { acceptInvitationByRoom, declineInvitationByRoom } from "@/features/meeting/api/invitation";
import { toast } from "@/shared/hooks/use-toast";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function getNotificationColor(type: NotificationType) {
  switch (type) {
    case "MEETING_CREATED":
    case "MEETING_TODAY":
    case "MEETING_STARTED":
    case "MEETING_INVITATION":
    case "MEETING_REMINDER":
    case "SCHEDULE_CREATED":
    case "SCHEDULE_CHANGED":
    case "SCHEDULE_CANCELLED":
      return "dark:border-l-blue-500 light:border-l-blue-500";
    case "TEAM_MEMBER_ADDED":
      return "dark:border-l-cyan-500 light:border-l-cyan-500";
    case "INVITATION_ACCEPTED":
    case "INVITATION_DECLINED":
    case "INVITATION_CANCELLED":
    case "PARTICIPANT_JOINED_NOTIFY":
      return "dark:border-l-sky-500 light:border-l-sky-500";
    case "PARTICIPANT_KICKED":
    case "WAITING_ROOM_ADMITTED":
    case "WAITING_ROOM_REJECTED":
      return "dark:border-l-amber-500 light:border-l-amber-500";
    default:
      return "dark:border-l-teal-500 light:border-l-teal-500";
  }
}

export default function MeetingHeader() {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const navigate = useNavigate();

  const { data: notificationPage } = useNotifications(userId, { page: 0, size: 20 });
  const { data: unreadData } = useUnreadCount(userId);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();
  const { connected: sseConnected } = useNotificationSSE(userId || undefined);
  useFcmSetup(userId || undefined);
  const [processingInvite, setProcessingInvite] = useState<number | null>(null);

  const handleAcceptInvitation = useCallback(async (notification: NotificationResponseDto) => {
    if (!userId || !notification.resourceId) return;
    setProcessingInvite(notification.id);
    try {
      await acceptInvitationByRoom(Number(notification.resourceId), userId);
      markAsReadMutation.mutate({ notificationId: notification.id, userId });
      toast({ title: "초대를 수락했습니다" });
      setIsDropdownOpen(false);
      navigate(`/meeting/${notification.resourceId}`);
    } catch (err) {
      console.error("Accept invitation failed:", err);
      // 백엔드 미배포 시 fallback: 바로 회의실로 이동
      toast({ title: "회의실로 이동합니다" });
      setIsDropdownOpen(false);
      navigate(`/meeting/${notification.resourceId}`);
    } finally {
      setProcessingInvite(null);
    }
  }, [userId, markAsReadMutation, navigate]);

  const handleDeclineInvitation = useCallback(async (notification: NotificationResponseDto) => {
    if (!userId || !notification.resourceId) return;
    setProcessingInvite(notification.id);
    try {
      await declineInvitationByRoom(Number(notification.resourceId), userId);
      markAsReadMutation.mutate({ notificationId: notification.id, userId });
      toast({ title: "초대를 거절했습니다" });
    } catch (err) {
      console.error("Decline invitation failed:", err);
      toast({ title: "초대 거절 실패", description: String((err as any)?.message || err), variant: "destructive" });
    } finally {
      setProcessingInvite(null);
    }
  }, [userId, markAsReadMutation]);

  const notifications = notificationPage?.content ?? [];
  const unreadCount = unreadData ? getUnreadTotal(unreadData) : 0;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDropdownOpen && bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isDropdownOpen]);

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

  const handleNotificationClick = (notificationId: number) => {
    if (!userId) return;
    markAsReadMutation.mutate({ notificationId, userId });
  };

  const handleDeleteNotification = (notificationId: number) => {
    if (!userId) return;
    deleteMutation.mutate({ notificationId, userId });
  };

  const handleMarkAllAsRead = () => {
    if (!userId) return;
    markAllAsReadMutation.mutate({ userId });
  };

  const handleDeleteAll = () => {
    if (!userId) return;
    deleteAllMutation.mutate({ userId });
  };

  return (
    <div className="px-6 py-4 border-b dark:border-purple-500/20 light:border-purple-200/60 dark:bg-purple-950/40 dark:backdrop-blur-xl light:bg-white light:shadow-[0_1px_3px_rgba(147,51,234,0.06)] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white">
          {user?.name?.charAt(0) ?? "U"}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            {user?.name ?? ""}
            {user?.jobTitle && (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {user.jobTitle.name}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{user?.company?.name ?? ""}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div>
          <button
            ref={bellButtonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 light:hover:shadow-sm rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <span
              className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${sseConnected ? "bg-green-400" : "bg-red-400"}`}
              title={sseConnected ? "실시간 알림 연결됨" : "실시간 알림 연결 끊김"}
            />
          </button>

          {isDropdownOpen &&
            createPortal(
              <div
                className="fixed w-96 dark:bg-purple-950/95 light:bg-white/95 dark:border dark:border-purple-500/20 light:border light:border-purple-200/70 rounded-2xl backdrop-blur-xl dark:shadow-2xl dark:shadow-purple-500/20 light:shadow-2xl light:shadow-purple-300/30 z-[999999]"
                style={{
                  top: "12px",
                  right: `${dropdownPosition.right}px`,
                }}
              >
                {/* Header */}
                <div className="px-4 py-3 dark:border-b dark:border-border/20 light:border-b light:border-border/20 light:bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">알림</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs px-2 py-1 dark:bg-red-500/20 dark:text-red-300 light:bg-red-100/70 light:text-red-800 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md dark:hover:bg-purple-500/20 light:hover:bg-purple-100"
                        title="모두 읽음"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDeleteAll}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md dark:hover:bg-purple-500/20 light:hover:bg-purple-100"
                        title="모두 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-l-4 transition-colors text-left flex items-start justify-between group ${getNotificationColor(
                          notification.type
                        )} ${
                          notification.read
                            ? "dark:bg-slate-800/30 light:bg-slate-50/60"
                            : "dark:bg-slate-800/50 light:bg-blue-50/40 light:border-b light:border-blue-200/40"
                        } dark:hover:bg-purple-500/15 light:hover:bg-purple-50`}
                      >
                        <button
                          onClick={() => handleNotificationClick(notification.id)}
                          className="flex-1 text-left"
                        >
                          <p className="font-medium text-sm text-foreground mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {notification.body}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </button>

                        {notification.type === "MEETING_INVITATION" && !notification.read && (
                          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAcceptInvitation(notification); }}
                              disabled={processingInvite === notification.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30 light:bg-green-600 light:text-white light:hover:bg-green-700 light:shadow-sm transition-colors disabled:opacity-50"
                              title="초대 수락"
                            >
                              <Check className="w-3.5 h-3.5" />수락
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeclineInvitation(notification); }}
                              disabled={processingInvite === notification.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 light:border light:border-red-300 light:text-red-600 light:hover:bg-red-50 light:hover:border-red-400 transition-colors disabled:opacity-50"
                              title="초대 거절"
                            >
                              <XCircle className="w-3.5 h-3.5" />거절
                            </button>
                          </div>
                        )}

                        <div className="flex items-start gap-2 ml-2">
                          {!notification.read && notification.type !== "MEETING_INVITATION" && (
                            <div className="w-2 h-2 bg-brand-500 rounded-full mt-1 flex-shrink-0"></div>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                            title="알림 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      알림이 없습니다
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}
        </div>

        <button className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 light:hover:shadow-sm rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
