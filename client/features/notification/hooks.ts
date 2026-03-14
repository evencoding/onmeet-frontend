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

export const notiKeys = {
  all: ["notifications"] as const,
  user: (userId: string) => [...notiKeys.all, userId] as const,
  lists: (userId: string) => [...notiKeys.user(userId), "list"] as const,
  list: (userId: string, pageable?: Pageable) => [...notiKeys.lists(userId), pageable] as const,
  unreadCount: (userId: string) => [...notiKeys.user(userId), "unread-count"] as const,
  settings: (userId: number) => [...notiKeys.all, "settings", userId] as const,
};

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
    queryKey: notiKeys.list(userId, pageable),
    queryFn: () => getNotifications(userId, pageable),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: notiKeys.unreadCount(userId),
    queryFn: () => getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30_000,
  });
}

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
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: notiKeys.lists(vars.userId) });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount(vars.userId) });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => markAllAsRead(args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: notiKeys.lists(vars.userId) });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount(vars.userId) });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { notificationId: number; userId: string }) =>
      deleteNotification(args.notificationId, args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: notiKeys.lists(vars.userId) });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount(vars.userId) });
    },
  });
}

export function useDeleteAllNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { userId: string }) => deleteAllNotifications(args.userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: notiKeys.lists(vars.userId) });
      qc.invalidateQueries({ queryKey: notiKeys.unreadCount(vars.userId) });
    },
  });
}

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
      } catch {}
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
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
}

const SSE_URL = `${import.meta.env.VITE_API_BASE_URL}/notification/v1/sse/subscribe`;

export function useNotificationSSE(
  userId: string | undefined,
  onMessage?: (notification: NotificationResponseDto) => void,
) {
  const qc = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposedRef = useRef(false);
  const [connected, setConnected] = useState(false);

  const clearReconnect = useCallback(() => {
    if (reconnectRef.current !== null) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(
    (fn: () => void) => {
      clearReconnect();
      if (!disposedRef.current) {
        reconnectRef.current = setTimeout(fn, 5_000);
      }
    },
    [clearReconnect],
  );

  const connect = useCallback(() => {
    if (!userId || disposedRef.current) return;

    abortRef.current?.abort();
    clearReconnect();
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
          scheduleReconnect(connect);
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
                qc.invalidateQueries({ queryKey: notiKeys.unreadCount(userId) });
                qc.invalidateQueries({ queryKey: notiKeys.lists(userId) });
              } catch {}
            }
          }
        }

        setConnected(false);
        scheduleReconnect(connect);
      } catch (err) {
        if ((err as DOMException)?.name !== "AbortError") {
          setConnected(false);
          scheduleReconnect(connect);
        }
      }
    })();
  }, [userId, onMessage, qc, clearReconnect, scheduleReconnect]);

  useEffect(() => {
    disposedRef.current = false;
    connect();
    return () => {
      disposedRef.current = true;
      clearReconnect();
      abortRef.current?.abort();
      setConnected(false);
    };
  }, [connect, clearReconnect]);

  return { connected };
}
