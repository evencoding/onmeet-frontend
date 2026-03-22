import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("renders the login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("input[type='email'], input[name='email']")).toBeVisible();
    await expect(page.locator("input[type='password'], input[name='password']")).toBeVisible();
  });
});

test.describe("Route guards", () => {
  test("unauthenticated user accessing protected page is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/schedule");

    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });
});
