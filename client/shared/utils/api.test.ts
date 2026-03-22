import { describe, it, expect } from "vitest";
import { pageQs } from "./api";

describe("pageQs", () => {
  it("returns empty string when no pageable provided", () => {
    expect(pageQs()).toBe("");
    expect(pageQs(undefined)).toBe("");
  });

  it("returns empty string for empty pageable object", () => {
    expect(pageQs({})).toBe("");
  });

  it("builds query string with page only", () => {
    expect(pageQs({ page: 0 })).toBe("?page=0");
    expect(pageQs({ page: 3 })).toBe("?page=3");
  });

  it("builds query string with size only", () => {
    expect(pageQs({ size: 20 })).toBe("?size=20");
  });

  it("builds query string with page and size", () => {
    const result = pageQs({ page: 1, size: 10 });
    expect(result).toContain("page=1");
    expect(result).toContain("size=10");
    expect(result).toMatch(/^\?/);
  });

  it("builds query string with single sort", () => {
    const result = pageQs({ sort: ["createdAt,desc"] });
    expect(result).toBe("?sort=createdAt%2Cdesc");
  });

  it("builds query string with multiple sort params", () => {
    const result = pageQs({ sort: ["name,asc", "createdAt,desc"] });
    expect(result).toContain("sort=name%2Casc");
    expect(result).toContain("sort=createdAt%2Cdesc");
  });

  it("combines all parameters", () => {
    const result = pageQs({ page: 2, size: 5, sort: ["id,asc"] });
    expect(result).toContain("page=2");
    expect(result).toContain("size=5");
    expect(result).toContain("sort=id%2Casc");
  });

  it("handles page=0 correctly (falsy but valid)", () => {
    const result = pageQs({ page: 0, size: 10 });
    expect(result).toContain("page=0");
  });

  it("handles empty sort array", () => {
    expect(pageQs({ sort: [] })).toBe("");
  });
});
