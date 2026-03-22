import { describe, it, expect } from "vitest";
import { notiKeys } from "./hooks";

describe("notiKeys (query key factory)", () => {
  it("generates all key", () => {
    expect(notiKeys.all).toEqual(["notifications"]);
  });

  it("generates user-scoped key", () => {
    expect(notiKeys.user("user-1")).toEqual(["notifications", "user-1"]);
  });

  it("generates lists key", () => {
    expect(notiKeys.lists("user-1")).toEqual(["notifications", "user-1", "list"]);
  });

  it("generates list key with pageable", () => {
    const pageable = { page: 0, size: 10 };
    expect(notiKeys.list("user-1", pageable)).toEqual([
      "notifications",
      "user-1",
      "list",
      pageable,
    ]);
  });

  it("generates list key without pageable", () => {
    expect(notiKeys.list("user-1")).toEqual([
      "notifications",
      "user-1",
      "list",
      undefined,
    ]);
  });

  it("generates unread count key", () => {
    expect(notiKeys.unreadCount("user-1")).toEqual([
      "notifications",
      "user-1",
      "unread-count",
    ]);
  });

  it("generates settings key", () => {
    expect(notiKeys.settings(42)).toEqual(["notifications", "settings", 42]);
  });

  it("different users produce different keys", () => {
    expect(notiKeys.user("user-1")).not.toEqual(notiKeys.user("user-2"));
    expect(notiKeys.unreadCount("a")).not.toEqual(notiKeys.unreadCount("b"));
  });
});
