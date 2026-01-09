/**
 * Header Snapshot example tests
 */
import React from "react";
import { render } from "@testing-library/react";
import Header from "@components/layout/Header";
import { ThemeProvider } from '@/providers/themeProvider';
import { describe, test, expect } from "vitest";

describe("Header snapshot", () => {
  test("matches snapshot (dark theme)", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <Header />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
