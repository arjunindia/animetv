import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { Toggle } from "./ui/toggle";

export function ModeToggle() {
  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      ref.current.click();
    },
  });
  const { setTheme, theme } = useTheme();
  return (
    <Toggle
      size="lg"
      aria-label="change theme"
      className={focused ? "outline outline-primary" : ""}
      ref={ref}
      defaultChecked={theme === "light"}
      onPressedChange={(checked) => {
        checked ? setTheme("light") : setTheme("dark");
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Toggle>
  );
}
