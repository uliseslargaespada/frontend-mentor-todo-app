/**
 * Header UI tests:
 * - Verifies visible content renders correctly
 * - Verifies theme toggle updates label and <html> class
 *
 * These tests intentionally treat Header as a black box UI component:
 * we verify what a user sees and what the app does to the DOM.
 */
import React from "react";
import { expect, test, describe } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Header from "@components/layout/Header";
import { ThemeProvider } from '@/providers/themeProvider';
import { STORAGE_KEY } from "@/constants/themeConstants.js";

function renderHeaderWithTheme({ defaultTheme = 'dark', storedTheme = null}) {
  if (storedTheme) {
    localStorage.setItem(STORAGE_KEY, storedTheme);
  }

  render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <Header />
    </ThemeProvider>
  );
}

// Group tests in categories
describe('Header', () => {
  test('renders title, subtitle, and the toggle button', async () => {
    renderHeaderWithTheme({ defaultTheme: "dark"});

    // Check for the title
    expect(
      screen.getByText(/Supabase Tasks/)
    ).toBeInTheDocument();

    // Subtitle
    expect(
      screen.getByText(/Simple task list powered by Supabase, built with React \+ Vite\./i)
    ).toBeInTheDocument();

    // Initial theme is dark -> button invites switching to Light Mode
    expect(
      screen.getByText(/Change to Light Mode/)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  test("toggles theme when clicking the button (dark -> light -> dark)", async () => {
    const user = userEvent.setup();

    renderHeaderWithTheme({ defaultTheme: "dark" });

    // Wait for initial effect
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });

    const toggleButton = screen.getByText(/Change to Light Mode/);

    // Click -> should switch to light
    await user.click(toggleButton);

    // Button label updates based on theme state in Header
    expect(
      screen.getByText(/Change to Dark Mode/)
    ).toBeInTheDocument();

    // DOM side effect (ThemeProvider)
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass("dark");
    });

    // localStorage stores the selected theme value
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");

    // Click again -> back to dark
    await user.click(screen.getByText(/Change to Dark Mode/));

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });
});