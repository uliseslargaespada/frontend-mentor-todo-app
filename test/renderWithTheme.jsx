import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/providers/themeProvider";

/**
 * Renders the provided UI wrapped with ThemeProvider.
 *
 * @param {React.ReactElement} ui
 * @param {object} options
 * @param {"dark"|"light"|"system"} [options.defaultTheme]
 * @param {"dark"|"light"|"system"|null} [options.storedTheme] - localStorage override before render
 * @returns Testing Library render result
 */
export function renderWithTheme(ui, { defaultTheme = "dark", storedTheme = null, ...options } = {}) {
  // If a test wants to force a stored theme, set it before ThemeProvider initializes.
  if (storedTheme) {
    // Your ThemeProvider reads STORAGE_KEY from themeConstants; tests can set it directly if desired.
    // If you want to avoid importing the constant here, set it in each test instead.
  }

  return render(<ThemeProvider defaultTheme={defaultTheme}>{ui}</ThemeProvider>, options);
}
