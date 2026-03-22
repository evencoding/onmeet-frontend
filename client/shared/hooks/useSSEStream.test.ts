import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSSEStream } from "./useSSEStream";
import { createElement } from "react";

// ── Mock EventSource ──

type EventSourceHandler = ((e: MessageEvent) => void) | ((e: Event) => void);

class MockEventSource {
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  listeners: Record<string, EventSourceHandler[]> = {};
  readyState = 0;

  constructor(url: string) {
    this.url = url;
    // Simulate async open
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
    }, 0);
  }

  addEventListener(event: string, handler: EventSourceHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }

  removeEventListener(event: string, handler: EventSourceHandler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    }
  }

  close() {
    this.readyState = 2;
  }

  // Test helpers
  simulateMessage(data: string, eventName = "message") {
    const handlers = this.listeners[eventName] || [];
    handlers.forEach((h) => h(new MessageEvent(eventName, { data })));
  }

  simulateEnd() {
    const handlers = this.listeners["end"] || [];
    handlers.forEach((h) => h(new Event("end")));
  }

  simulateError() {
    this.onerror?.();
  }
}

let mockES: MockEventSource;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useSSEStream", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("EventSource", class extends MockEventSource {
      constructor(url: string) {
        super(url);
        mockES = this;
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does not connect when url is null", () => {
    const { result } = renderHook(
      () => useSSEStream({ url: null }),
      { wrapper: createWrapper() },
    );

    expect(result.current.connected).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(result.current.ended).toBe(false);
  });

  it("connects and sets connected=true on open", async () => {
    const { result } = renderHook(
      () => useSSEStream({ url: "http://test/sse" }),
      { wrapper: createWrapper() },
    );

    // Simulate open
    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.connected).toBe(true);
  });

  it("buffers messages and flushes after throttleMs", async () => {
    const { result } = renderHook(
      () => useSSEStream<{ text: string }>({
        url: "http://test/sse",
        throttleMs: 100,
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    // Send a message
    act(() => {
      mockES.simulateMessage(JSON.stringify({ text: "hello" }));
    });

    // Not yet flushed
    expect(result.current.data).toEqual([]);

    // Flush after throttle
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.data).toEqual([{ text: "hello" }]);
    expect(result.current.latest).toEqual({ text: "hello" });
  });

  it("flushes immediately on flush boundary", async () => {
    const { result } = renderHook(
      () => useSSEStream<{ text: string }>({
        url: "http://test/sse",
        throttleMs: 500,
        flushBoundary: "FINAL",
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      mockES.simulateMessage(JSON.stringify({ text: "FINAL result" }));
    });

    // Should flush immediately due to boundary
    expect(result.current.data).toEqual([{ text: "FINAL result" }]);
  });

  it("sets ended=true and disconnects on end event", async () => {
    const { result } = renderHook(
      () => useSSEStream({ url: "http://test/sse" }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      mockES.simulateEnd();
    });

    expect(result.current.ended).toBe(true);
    expect(result.current.connected).toBe(false);
  });

  it("reset clears all state", async () => {
    const { result } = renderHook(
      () => useSSEStream<string>({
        url: "http://test/sse",
        throttleMs: 50,
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      mockES.simulateMessage(JSON.stringify("data"));
      vi.advanceTimersByTime(50);
    });

    expect(result.current.data.length).toBeGreaterThan(0);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.latest).toBeNull();
    expect(result.current.ended).toBe(false);
    expect(result.current.connected).toBe(false);
  });

  it("close stops the connection", async () => {
    const { result } = renderHook(
      () => useSSEStream({ url: "http://test/sse" }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.connected).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.connected).toBe(false);
  });

  it("skips messages with invalid JSON", async () => {
    const { result } = renderHook(
      () => useSSEStream<{ id: number }>({
        url: "http://test/sse",
        throttleMs: 50,
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      mockES.simulateMessage("invalid json{{{");
      vi.advanceTimersByTime(50);
    });

    expect(result.current.data).toEqual([]);
  });

  it("reconnects on error with configured delay", async () => {
    const { result } = renderHook(
      () => useSSEStream({
        url: "http://test/sse",
        reconnectMs: 2000,
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    const firstES = mockES;

    // Trigger error
    act(() => {
      mockES.simulateError();
    });

    expect(result.current.connected).toBe(false);

    // Advance past reconnect delay
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // New EventSource should be created (mockES would be a new instance)
    expect(mockES).not.toBe(firstES);
  });

  it("uses custom parse function", async () => {
    const { result } = renderHook(
      () => useSSEStream<string>({
        url: "http://test/sse",
        throttleMs: 50,
        parse: (raw) => raw.toUpperCase(),
      }),
      { wrapper: createWrapper() },
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    act(() => {
      mockES.simulateMessage("hello");
      vi.advanceTimersByTime(50);
    });

    expect(result.current.data).toEqual(["HELLO"]);
  });
});
