import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEY, ThemeContext } from "@/constants/themeConstants";

const initialTheme = (defaultTheme) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || defaultTheme;
};

function ThemeProvider({ children, defaultTheme = "system"}) {
  const [theme, setTheme] = useState(() => initialTheme(defaultTheme));
  
  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const resolved = theme === "system" ? (mql.matches ? "dark" : "light") : theme;

    root.classList.toggle("dark", resolved === "dark");
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === "system") {
      const onChange = (e) => root.classList.toggle("dark", e.matches);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeProvider };