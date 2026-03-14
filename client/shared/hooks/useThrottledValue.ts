import { useState, useEffect, useRef, useCallback } from "react";

interface ThrottledValueOptions {
  interval?: number;
  flushOn?: string;
}

/**
 * Returns a throttled version of `value` that updates at most once per `interval` ms.
 * If `flushOn` string is found in the serialized value, flushes immediately.
 */
export function useThrottledValue<T>(
  value: T,
  { interval = 200, flushOn }: ThrottledValueOptions = {},
): T {
  const [throttled, setThrottled] = useState(value);
  const lastFlush = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const flush = useCallback(() => {
    lastFlush.current = Date.now();
    setThrottled(value);
  }, [value]);

  useEffect(() => {
    // Check flushOn boundary
    if (flushOn && typeof value === "string" && value.includes(flushOn)) {
      if (timer.current) clearTimeout(timer.current);
      flush();
      return;
    }

    const elapsed = Date.now() - lastFlush.current;

    if (elapsed >= interval) {
      flush();
    } else {
      timer.current = setTimeout(flush, interval - elapsed);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, interval, flushOn, flush]);

  return throttled;
}
