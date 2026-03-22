import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import { ThemeProvider, useTheme } from "./ThemeContext";

// ── Helpers ──

function TestConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

// ── Setup ──

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark", "light");
});

// ── Tests ──

describe("ThemeContext", () => {
  it("useTheme throws when used outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });

  it("defaults to dark theme when no saved theme exists", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("reads saved theme from localStorage", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("toggleTheme switches from dark to light", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");

    act(() => {
      screen.getByText("toggle").click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("toggleTheme saves new theme to localStorage", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("toggle").click();
    });

    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("toggleTheme applies class to document.documentElement", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    // Default dark theme should have "dark" class
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      screen.getByText("toggle").click();
    });

    // After toggle, should switch to "light" class and remove "dark"
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
