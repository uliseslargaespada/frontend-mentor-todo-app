/**
 * Global test setup for Vitest + React Testing Library.
 *
 * Includes:
 * - jest-dom matchers compatible with Vitest
 * - matchMedia polyfill (ThemeProvider depends on it)
 * - consistent cleanup after each test
 */
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// Polyfill matchMedia for jsdom (required by ThemeProvider).
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => {
      let matches = false;
      const listeners = new Set();

      const mql = {
        media: query,
        get matches() {
          return matches;
        },
        set matches(val) {
          matches = val;
        },

        // Modern event API
        addEventListener: (event, cb) => {
          if (event === "change") listeners.add(cb);
        },
        removeEventListener: (event, cb) => {
          if (event === "change") listeners.delete(cb);
        },

        // Legacy API (not used by you, but harmless)
        addListener: (cb) => listeners.add(cb),
        removeListener: (cb) => listeners.delete(cb),

        // Test helper (not used by app code)
        __dispatch: (nextMatches) => {
          matches = nextMatches;
          listeners.forEach((cb) => cb({ matches: nextMatches }));
        }
      };

      return mql;
    }
  });
}

afterEach(() => {
  // Reset DOM state for theme tests.
  document.documentElement.classList.remove("dark");

  // Reset localStorage for tests that depend on STORAGE_KEY.
  localStorage.clear();

  // Reset timers/mocks if a student uses them.
  vi.clearAllMocks();
});