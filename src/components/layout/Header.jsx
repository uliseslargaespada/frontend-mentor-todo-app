import Title from "@components/shared/Title.component";
import { Button } from "@components/ui/button";
import { useTheme } from "@hooks/useTheme";

/**
 * Application header component.
 */
export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="app-header">
      <Title>
        Supabase Tasks<span className="underline">--Worked with StylecComponents</span>
      </Title>
      <p className="app-header__subtitle">
        Simple task list powered by Supabase, built with React + Vite.
      </p>
      <Button variant="secondary" onClick={handleThemeChange} type="button" aria-label={`Change to ${isDark ? "Light" : "Dark"} Mode`}>
        Change to {isDark ? "Light" : "Dark"} Mode
      </Button>
    </header>
  );
}
