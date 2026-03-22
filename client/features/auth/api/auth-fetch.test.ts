import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildFormData } from "./auth-fetch";

describe("buildFormData", () => {
  it("appends request data as JSON blob", () => {
    const data = { name: "Test", email: "test@example.com" };
    const formData = buildFormData(data);

    const requestBlob = formData.get("request") as Blob;
    expect(requestBlob).toBeInstanceOf(Blob);
    expect(requestBlob.type).toBe("application/json");
  });

  it("appends profileImage when provided", () => {
    const data = { name: "Test" };
    const file = new File(["content"], "avatar.png", { type: "image/png" });
    const formData = buildFormData(data, file);

    expect(formData.get("profileImage")).toBe(file);
  });

  it("does not append profileImage when not provided", () => {
    const data = { name: "Test" };
    const formData = buildFormData(data);

    expect(formData.get("profileImage")).toBeNull();
  });

  it("serializes complex data correctly", async () => {
    const data = {
      name: "김철수",
      roles: ["USER", "ADMIN"],
      nested: { key: "value" },
    };
    const formData = buildFormData(data);

    const blob = formData.get("request") as Blob;
    // jsdom Blob doesn't support .text(), use FileReader approach
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blob);
    });
    const parsed = JSON.parse(text);

    expect(parsed.name).toBe("김철수");
    expect(parsed.roles).toEqual(["USER", "ADMIN"]);
    expect(parsed.nested.key).toBe("value");
  });
});

describe("authFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("makes request with credentials and JSON content type", async () => {
    const { authFetch } = await import("./auth-fetch");

    const body = JSON.stringify({ success: true, data: { id: 1 } });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(body),
      }),
    );

    const result = await authFetch<{ id: number }>("/v1/me");
    expect(result).toEqual({ id: 1 });

    const [url, opts] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain("/v1/me");
    expect(opts.credentials).toBe("include");
    expect(opts.headers["Content-Type"]).toBe("application/json");
  });

  it("skips Content-Type for FormData requests", async () => {
    const { authFetch } = await import("./auth-fetch");

    const body = JSON.stringify({ success: true, data: "ok" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(body),
      }),
    );

    const formData = new FormData();
    formData.append("file", "content");
    await authFetch("/v1/upload", { method: "POST", body: formData });

    const opts = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(opts.headers).not.toHaveProperty("Content-Type");
  });

  it("throws error for non-ok responses", async () => {
    const { authFetch } = await import("./auth-fetch");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: "Forbidden", status: 403 }),
      }),
    );

    await expect(authFetch("/v1/admin")).rejects.toEqual({
      message: "Forbidden",
      status: 403,
    });
  });

  it("retries with refresh on 401 (not on login/refresh endpoints)", async () => {
    const { authFetch } = await import("./auth-fetch");

    const successBody = JSON.stringify({ success: true, data: { id: 1 } });
    const fetchMock = vi
      .fn()
      // First call: 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized", status: 401 }),
      })
      // Refresh call: success
      .mockResolvedValueOnce({ ok: true })
      // Retry call: success
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(successBody),
      });

    vi.stubGlobal("fetch", fetchMock);

    const result = await authFetch<{ id: number }>("/v1/me");
    expect(result).toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
