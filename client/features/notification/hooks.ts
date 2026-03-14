import { useEffect, useRef, useCallback, useState } from "react";
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
  lists: () => [...notiKeys.all, "list"] as const,
  list: (pageable?: Pageable) => [...notiKeys.lists(), pageable] as const,
  unreadCount: () => [...notiKeys.all, "unread-count"] as const,
  settings: (userId: number) => [...notiKeys.all, "settings", userId] as const,
};

// ── Query Hooks ──

export function useNotificationSettings(userId: number) {
  return useQuery({
    queryKey: notiKeys.settings(userId),
    queryFn: () => getNotificationSettings(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useNotifications(userId: string, pageable?: Pageable) {
  return useQuery({
    queryKey: notiKeys.list(pageable),
    queryFn: () => getNotifications(userId, pageable),
    enabled: !!userId,
    staleTime: 30_000,
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
      qc.invalidateQueries({ queryKey: notiKeys.lists() });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => markAllAsRead(args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.lists() });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { notificationId: number; userId: string }) =>
      deleteNotification(args.notificationId, args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.lists() });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
    },
  });
}

export function useDeleteAllNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => deleteAllNotifications(args.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notiKeys.lists() });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
    },
  });
}

// ── FCM Hook ──

const FCM_TOKEN_KEY = "onmeet_fcm_token";

export function useFcmSetup(userId: string | undefined) {
  const registerMutation = useRegisterFcmToken();
  const unregisterMutation = useUnregisterFcmToken();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      try {
        const { messaging } = await import("@/shared/lib/firebase");
        if (!messaging || cancelled) return;

        const { getToken } = await import("firebase/messaging");
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) return;

        const token = await getToken(messaging, { vapidKey });
        if (!token || cancelled) return;

        tokenRef.current = token;
        localStorage.setItem(FCM_TOKEN_KEY, token);

        const deviceId = `${navigator.userAgent}-${userId}`;
        registerMutation.mutate({
          userId,
          data: { token, deviceId, deviceType: "WEB" },
        });
      } catch {
        // FCM not available (no service worker, permission denied, etc.)
      }
    })();

    return () => {
      cancelled = true;
      const token = tokenRef.current ?? localStorage.getItem(FCM_TOKEN_KEY);
      if (token && userId) {
        unregisterMutation.mutate({ userId, token });
        localStorage.removeItem(FCM_TOKEN_KEY);
        tokenRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
}

// ── SSE Hook ──

const SSE_URL = `${import.meta.env.VITE_API_BASE_URL}/notification/v1/sse/subscribe`;

export function useNotificationSSE(
  userId: string | undefined,
  onMessage?: (notification: NotificationResponseDto) => void,
) {
  const qc = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!userId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await fetch(SSE_URL, {
          credentials: "include",
          headers: { "X-User-Id": userId },
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setConnected(false);
          return;
        }

        setConnected(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const raw = line.slice(5).trim();
              if (!raw) continue;
              try {
                const notification = JSON.parse(raw) as NotificationResponseDto;
                onMessage?.(notification);
                qc.invalidateQueries({ queryKey: notiKeys.unreadCount() });
                qc.invalidateQueries({ queryKey: notiKeys.lists() });
              } catch {
                // ignore non-JSON keepalive messages
              }
            }
          }
        }
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") {
          setConnected(false);
          setTimeout(connect, 5_000);
        }
      }
    })();
  }, [userId, onMessage, qc]);

  useEffect(() => {
    connect();
    return () => {
      abortRef.current?.abort();
      setConnected(false);
    };
  }, [connect]);

  return { connected };
}
