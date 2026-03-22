import { describe, it, expect } from "vitest";
import { reducer } from "./use-toast";

type ToasterToast = { id: string; open?: boolean; title?: string };
type State = { toasts: ToasterToast[] };

const emptyState: State = { toasts: [] };

const makeToast = (id: string, overrides?: Partial<ToasterToast>): ToasterToast => ({
  id,
  open: true,
  title: `Toast ${id}`,
  ...overrides,
});

describe("toast reducer", () => {
  describe("ADD_TOAST", () => {
    it("adds a toast to empty state", () => {
      const toast = makeToast("1");
      const result = reducer(emptyState, { type: "ADD_TOAST", toast });
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toEqual(toast);
    });

    it("prepends new toast (newest first)", () => {
      const state: State = { toasts: [makeToast("1")] };
      const toast = makeToast("2");
      const result = reducer(state, { type: "ADD_TOAST", toast });
      expect(result.toasts[0].id).toBe("2");
    });

    it("respects TOAST_LIMIT of 1", () => {
      const state: State = { toasts: [makeToast("1")] };
      const toast = makeToast("2");
      const result = reducer(state, { type: "ADD_TOAST", toast });
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe("2");
    });
  });

  describe("UPDATE_TOAST", () => {
    it("updates matching toast by id", () => {
      const state: State = { toasts: [makeToast("1", { title: "Old" })] };
      const result = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "1", title: "New" },
      });
      expect(result.toasts[0].title).toBe("New");
    });

    it("does not modify non-matching toasts", () => {
      const state: State = { toasts: [makeToast("1", { title: "Keep" })] };
      const result = reducer(state, {
        type: "UPDATE_TOAST",
        toast: { id: "999", title: "New" },
      });
      expect(result.toasts[0].title).toBe("Keep");
    });
  });

  describe("DISMISS_TOAST", () => {
    it("sets open=false for specific toast", () => {
      const state: State = { toasts: [makeToast("1", { open: true })] };
      const result = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });
      expect(result.toasts[0].open).toBe(false);
    });

    it("sets open=false for all toasts when no toastId", () => {
      const state: State = {
        toasts: [makeToast("1", { open: true })],
      };
      const result = reducer(state, { type: "DISMISS_TOAST" });
      expect(result.toasts.every((t) => t.open === false)).toBe(true);
    });

    it("does not modify non-matching toasts", () => {
      const state: State = { toasts: [makeToast("1", { open: true })] };
      const result = reducer(state, { type: "DISMISS_TOAST", toastId: "999" });
      expect(result.toasts[0].open).toBe(true);
    });
  });

  describe("REMOVE_TOAST", () => {
    it("removes specific toast by id", () => {
      const state: State = { toasts: [makeToast("1"), makeToast("2")] };
      const result = reducer(state, { type: "REMOVE_TOAST", toastId: "1" });
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe("2");
    });

    it("removes all toasts when no toastId", () => {
      const state: State = { toasts: [makeToast("1"), makeToast("2")] };
      const result = reducer(state, { type: "REMOVE_TOAST" });
      expect(result.toasts).toHaveLength(0);
    });

    it("returns unchanged state when id not found", () => {
      const state: State = { toasts: [makeToast("1")] };
      const result = reducer(state, { type: "REMOVE_TOAST", toastId: "999" });
      expect(result.toasts).toHaveLength(1);
    });
  });
});
