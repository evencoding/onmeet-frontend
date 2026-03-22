import { describe, it, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it("sets document.title to the provided value", () => {
    renderHook(() => useDocumentTitle("OnMeet - 회의"));
    expect(document.title).toBe("OnMeet - 회의");
  });

  it("updates document.title when value changes", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Page A" },
    });

    expect(document.title).toBe("Page A");

    rerender({ title: "Page B" });
    expect(document.title).toBe("Page B");
  });

  it("handles empty string", () => {
    renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe("");
  });
});
