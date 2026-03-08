import { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

export interface UseSSEStreamOptions<T> {
  /** Full URL for the EventSource */
  url: string | null;
  /** EventSource event name to listen for (default: "message") */
  eventName?: string;
  /** Parse raw `event.data` string into T */
  parse?: (raw: string) => T;
  /** Throttle interval in ms for flushing buffer to state (default: 250) */
  throttleMs?: number;
  /** If this string appears in raw data, flush immediately */
  flushBoundary?: string;
  /** Reconnect delay in ms after connection loss (default: 3000, 0 = no reconnect) */
  reconnectMs?: number;
  /** TanStack Query key(s) to invalidate when stream ends */
  invalidateOnEnd?: QueryKey[];
}

export interface UseSSEStreamReturn<T> {
  connected: boolean;
  data: T[];
  latest: T | null;
  ended: boolean;
  close: () => void;
  reset: () => void;
}

export function useSSEStream<T>(
  options: UseSSEStreamOptions<T>,
): UseSSEStreamReturn<T> {
  const {
    url,
    eventName = "message",
    parse = (raw: string) => JSON.parse(raw) as T,
    throttleMs = 250,
    flushBoundary,
    reconnectMs = 3000,
    invalidateOnEnd,
  } = options;

  const queryClient = useQueryClient();

  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [latest, setLatest] = useState<T | null>(null);
  const [ended, setEnded] = useState(false);

  const bufferRef = useRef<T[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const flushBuffer = useCallback(() => {
    if (bufferRef.current.length === 0) return;
    const items = [...bufferRef.current];
    bufferRef.current = [];
    setData((prev) => [...prev, ...items]);
    setLatest(items[items.length - 1]);
  }, []);

  const close = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setConnected(false);
  }, []);

  const reset = useCallback(() => {
    close();
    bufferRef.current = [];
    setData([]);
    setLatest(null);
    setEnded(false);
  }, [close]);

  useEffect(() => {
    if (!url) return;

    const connect = () => {
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => setConnected(true);

      es.addEventListener(eventName, (e) => {
        try {
          const parsed = parse(e.data);
          bufferRef.current.push(parsed);

          // Check flush boundary
          if (flushBoundary && typeof e.data === "string" && e.data.includes(flushBoundary)) {
            if (timerRef.current) clearTimeout(timerRef.current);
            flushBuffer();
            return;
          }

          // Throttled flush
          if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
              timerRef.current = undefined;
              flushBuffer();
            }, throttleMs);
          }
        } catch {
          // parse error — skip
        }
      });

      es.addEventListener("end", () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        flushBuffer();
        setEnded(true);
        es.close();
        esRef.current = null;
        setConnected(false);

        if (invalidateOnEnd) {
          invalidateOnEnd.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        setConnected(false);

        if (reconnectMs > 0) {
          reconnectTimerRef.current = setTimeout(connect, reconnectMs);
        }
      };
    };

    connect();

    return () => {
      close();
    };
  }, [url, eventName, throttleMs, flushBoundary, reconnectMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return { connected, data, latest, ended, close, reset };
}
