import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  let listeners: Array<() => void> = [];
  let originalInnerWidth: number;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    listeners = [];
    originalInnerWidth = window.innerWidth;

    mockAddEventListener = vi.fn((_, handler) => {
      listeners.push(handler);
    });
    mockRemoveEventListener = vi.fn();

    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it("returns false for desktop width (>= 768)", () => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile width (< 768)", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("responds to viewport changes", () => {
    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
    act(() => {
      listeners.forEach((fn) => fn());
    });
    expect(result.current).toBe(true);
  });

  it("registers matchMedia listener with correct breakpoint", () => {
    renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("cleans up event listener on unmount", () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});
