import { useEffect, useRef, useCallback, useState } from "react";

const SSE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/api/rooms`;

interface WaitingRoomEvent {
  type: "WAITING_ROOM_ADMITTED" | "WAITING_ROOM_REJECTED";
  token?: string;
  livekitUrl?: string;
  isHost?: boolean;
}

export function useWaitingRoomSSE(
  roomId: string | null,
  userId: string | undefined,
  onAdmitted: (token: string, isHost: boolean) => void,
  onRejected: () => void,
) {
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
    if (!roomId || !userId || disposedRef.current) return;

    abortRef.current?.abort();
    clearReconnect();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await fetch(`${SSE_BASE_URL}/${roomId}/waiting/sse/participant`, {
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
                const event = JSON.parse(raw) as WaitingRoomEvent;
                if (event.type === "WAITING_ROOM_ADMITTED" && event.token) {
                  onAdmitted(event.token, event.isHost ?? false);
                  return;
                }
                if (event.type === "WAITING_ROOM_REJECTED") {
                  onRejected();
                  return;
                }
              } catch {
                // parse error — skip
              }
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
  }, [roomId, userId, onAdmitted, onRejected, clearReconnect, scheduleReconnect]);

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

  const disconnect = useCallback(() => {
    disposedRef.current = true;
    clearReconnect();
    abortRef.current?.abort();
    setConnected(false);
  }, [clearReconnect]);

  return { connected, disconnect };
}
