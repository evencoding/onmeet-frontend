import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero section with brand name", async ({ page }) => {
    await page.goto("/");
    // The landing page should have ONMEET brand name visible
    await expect(page.getByText("ONMEET")).toBeVisible();
  });

  test("renders feature cards", async ({ page }) => {
    await page.goto("/");
    // Landing page has feature sections
    await expect(page.getByText("화상 회의")).toBeVisible();
  });

  test("has login button/link", async ({ page }) => {
    await page.goto("/");
    // Should have a way to navigate to login
    const loginLink = page
      .getByRole("link", { name: /로그인|시작/i })
      .or(page.getByRole("button", { name: /로그인|시작/i }));
    await expect(loginLink.first()).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    await page.goto("/");
    const loginLink = page
      .getByRole("link", { name: /로그인|시작/i })
      .or(page.getByRole("button", { name: /로그인|시작/i }));
    await loginLink.first().click();
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });
});
