import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  updateNotificationSettings,
  registerFcmToken,
  unregisterFcmToken,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  type NotificationSettingDto,
  type FcmTokenRequestDto,
  type NotificationResponseDto,
  type Pageable,
} from "./api";

// ── Query Keys ──

export const notiKeys = {
  all: ["notifications"] as const,
  list: (pageable?: Pageable) => [...notiKeys.all, "list", pageable] as const,
  unreadCount: () => [...notiKeys.all, "unread-count"] as const,
  settings: (userId: number) => [...notiKeys.all, "settings", userId] as const,
};

// ── Query Hooks ──

export function useNotificationSettings(userId: number) {
  return useQuery({
    queryKey: notiKeys.settings(userId),
    queryFn: () => getNotificationSettings(userId),
    enabled: !!userId,
  });
}

export function useNotifications(userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: notiKeys.list(pageable),
    queryFn: () => getNotifications(userId, pageable),
    enabled: !!userId,
  });
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: notiKeys.unreadCount(),
    queryFn: () => getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30_000,
  });
}

// ── Mutation Hooks ──

export function useUpdateNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: number; data: NotificationSettingDto }) =>
      updateNotificationSettings(args.userId, args.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: notiKeys.settings(vars.userId) });
    },
  });
}

export function useRegisterFcmToken() {
  return useMutation({
    mutationFn: (args: { userId: string; data: FcmTokenRequestDto }) =>
      registerFcmToken(args.userId, args.data),
  });
}

export function useUnregisterFcmToken() {
  return useMutation({
    mutationFn: (args: { userId: string; token: string }) =>
      unregisterFcmToken(args.userId, args.token),
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { notificationId: number; userId: string }) =>
      markAsRead(args.notificationId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => markAllAsRead(args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { notificationId: number; userId: string }) =>
      deleteNotification(args.notificationId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.all });
    },
  });
}

export function useDeleteAllNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => deleteAllNotifications(args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.all });
    },
  });
}

// ── SSE Hook ──

const SSE_URL = "https://api.onmeet.cloud/notification/v1/sse/subscribe";

export function useNotificationSSE(
  userId: string | undefined,
  onMessage?: (notification: NotificationResponseDto) => void,
) {
  const qc = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!userId) return;

    function connect() {
      // Clean up any previous connection
      esRef.current?.close();
      clearTimeout(reconnectTimer.current);

      const url = `${SSE_URL}?userId=${encodeURIComponent(userId!)}`;
      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.addEventListener("connect", () => {
        setConnected(true);
      });

      es.addEventListener("notification", (e) => {
        try {
          const notification = JSON.parse(e.data) as NotificationResponseDto;
          onMessageRef.current?.(notification);
          qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
          qc.invalidateQueries({ queryKey: notiKeys.list() });
        } catch {
          // ignore malformed data
        }
      });

      es.addEventListener("heartbeat", () => {
        // keep-alive, no action needed
      });

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Manual reconnect after 3 seconds
        reconnectTimer.current = setTimeout(connect, 3_000);
      };
    }

    connect();

    return () => {
      esRef.current?.close();
      clearTimeout(reconnectTimer.current);
      setConnected(false);
    };
  }, [userId, qc]);

  return { connected };
}
