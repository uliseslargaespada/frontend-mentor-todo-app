import Title from "@components/shared/Title.component";
import { Button } from "@components/ui/button";

/**
 * Application header component.
 */
export default function Header() {
  return (
    <header className="app-header">
      <Title>
        Supabase Tasks<span className="underline">--Worked with StylecComponents</span>
      </Title>
      <p className="app-header__subtitle">
        Simple task list powered by Supabase, built with React + Vite.
      </p>
      <Button variant="secondary">
        Click Me
      </Button>
    </header>
  );
}
