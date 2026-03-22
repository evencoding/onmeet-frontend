import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottledValue } from "./useThrottledValue";

describe("useThrottledValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useThrottledValue("hello"));
    expect(result.current).toBe("hello");
  });

  it("throttles rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, { interval: 200 }),
      { initialProps: { value: "a" } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    // Should not update yet (within throttle interval)
    expect(result.current).toBe("a");

    // Advance past interval
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });

  it("flushes immediately when flushOn boundary is found", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, { interval: 500, flushOn: "DONE" }),
      { initialProps: { value: "processing" } },
    );

    expect(result.current).toBe("processing");

    rerender({ value: "complete DONE" });
    // Should flush immediately due to flushOn
    expect(result.current).toBe("complete DONE");
  });

  it("does not flush on flushOn for non-string values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, { interval: 500, flushOn: "x" }),
      { initialProps: { value: 1 as number } },
    );

    expect(result.current).toBe(1);

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(2);
  });

  it("uses default interval of 200ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { rerender, unmount } = renderHook(
      ({ value }) => useThrottledValue(value, { interval: 1000 }),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("flushes immediately when elapsed time exceeds interval", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottledValue(value, { interval: 100 }),
      { initialProps: { value: "a" } },
    );

    // Advance time well past the interval
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "b" });
    // Should flush immediately since elapsed >= interval
    expect(result.current).toBe("b");
  });
});
