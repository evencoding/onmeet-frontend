import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createQueryHook, createMutationHook } from "./query-factory";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("createQueryHook", () => {
  it("creates a working query hook", async () => {
    const mockFn = vi.fn().mockResolvedValue({ name: "test" });

    const useTestQuery = createQueryHook({
      queryKey: () => ["test"],
      queryFn: mockFn,
    });

    const { result } = renderHook(() => useTestQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ name: "test" });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("passes parameters to queryKey and queryFn", async () => {
    const mockFn = vi.fn().mockResolvedValue({ id: 42 });

    const useItemQuery = createQueryHook<{ id: number }, [number]>({
      queryKey: (id: number) => ["items", id],
      queryFn: (id: number) => mockFn(id),
    });

    const { result } = renderHook(() => useItemQuery(42), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFn).toHaveBeenCalledWith(42);
  });

  it("respects defaultOptions", async () => {
    const mockFn = vi.fn().mockResolvedValue("data");

    const useTestQuery = createQueryHook({
      queryKey: () => ["test-disabled"],
      queryFn: mockFn,
      defaultOptions: { enabled: false },
    });

    const { result } = renderHook(() => useTestQuery(), {
      wrapper: createWrapper(),
    });

    // Should not fire because enabled=false
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe("createMutationHook", () => {
  it("creates a working mutation hook", async () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true });

    const useTestMutation = createMutationHook<{ success: boolean }, string>({
      mutationFn: mockFn,
    });

    const { result } = renderHook(() => useTestMutation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("payload");

    expect(mockFn).toHaveBeenCalledWith("payload");
  });

  it("calls onSuccess with data and variables", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const onSuccess = vi.fn();

    const useTestMutation = createMutationHook<string, number>({
      mutationFn: mockFn,
    });

    const { result } = renderHook(
      () => useTestMutation({ onSuccess }),
      { wrapper: createWrapper() },
    );

    await result.current.mutateAsync(99);

    expect(onSuccess).toHaveBeenCalledWith("result", 99, undefined);
  });

  it("invalidates specified query keys on success", async () => {
    const mockFn = vi.fn().mockResolvedValue("ok");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const useTestMutation = createMutationHook<string, void>({
      mutationFn: mockFn,
      invalidateKeys: [["items"], ["counts"]],
    });

    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useTestMutation(), { wrapper });

    await result.current.mutateAsync(undefined);

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["items"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["counts"] });
  });
});
