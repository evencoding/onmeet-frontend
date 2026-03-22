import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getErrorMessage,
  parseResponseBody,
  apiFetch,
  createServiceFetch,
} from "./apiFetch";

// ── getErrorMessage ──

describe("getErrorMessage", () => {
  it("extracts message from Error instance", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("extracts message from plain object with message property", () => {
    expect(getErrorMessage({ message: "fail" })).toBe("fail");
  });

  it("returns fallback for unknown value", () => {
    expect(getErrorMessage(42)).toBe("요청에 실패했습니다");
  });

  it("uses custom fallback", () => {
    expect(getErrorMessage(null, "custom")).toBe("custom");
  });
});

// ── parseResponseBody ──

describe("parseResponseBody", () => {
  it("unwraps { success: true, data } envelope", () => {
    const text = JSON.stringify({ success: true, data: { id: 1 } });
    expect(parseResponseBody(text)).toEqual({ id: 1 });
  });

  it("throws error object when success is false", () => {
    const text = JSON.stringify({ success: false, error: { message: "bad" } });
    expect(() => parseResponseBody(text)).toThrow();
  });

  it("returns empty object for empty string", () => {
    expect(parseResponseBody("")).toEqual({});
  });

  it("returns raw json when no success wrapper", () => {
    const text = JSON.stringify({ name: "test" });
    expect(parseResponseBody(text)).toEqual({ name: "test" });
  });
});

// ── apiFetch ──

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed data on success", async () => {
    const body = JSON.stringify({ success: true, data: { id: 1 } });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(body),
      }),
    );

    const result = await apiFetch<{ id: number }>("/api/test");
    expect(result).toEqual({ id: 1 });
    expect(fetch).toHaveBeenCalledWith("/api/test", { credentials: "include" });
  });

  it("throws error on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized", status: 401 }),
      }),
    );

    await expect(apiFetch("/api/secret")).rejects.toEqual({
      message: "Unauthorized",
      status: 401,
    });
  });

  it("throws fallback error when error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("invalid json")),
      }),
    );

    await expect(apiFetch("/api/broken")).rejects.toEqual({
      message: "요청에 실패했습니다",
      status: 500,
    });
  });
});

// ── createServiceFetch ──

describe("createServiceFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("prepends baseUrl and injects X-User-Id header", async () => {
    const body = JSON.stringify({ success: true, data: "ok" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(body),
      }),
    );

    const serviceFetch = createServiceFetch("https://api.example.com");
    await serviceFetch("/users", "user-123");

    expect(fetch).toHaveBeenCalledWith("https://api.example.com/users", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": "user-123",
      },
    });
  });

  it("skips Content-Type for FormData body", async () => {
    const body = JSON.stringify({ success: true, data: "ok" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(body),
      }),
    );

    const serviceFetch = createServiceFetch("https://api.example.com");
    const formData = new FormData();
    formData.append("file", "content");

    await serviceFetch("/upload", "user-456", {
      method: "POST",
      body: formData,
    });

    const callHeaders = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1]
      .headers;
    expect(callHeaders).not.toHaveProperty("Content-Type");
    expect(callHeaders["X-User-Id"]).toBe("user-456");
  });
});
