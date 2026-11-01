"use client";

import { THEMES } from "@/lib/theme";
import { useTheme } from "@/components/ThemeProvider";
import Pill from "@/components/Pill";

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {Object.entries(THEMES).map(([key, val]) => (
        <Pill key={key} active={themeKey === key} onClick={() => setThemeKey(key)}>
          {val.emoji} {val.label}
        </Pill>
      ))}
    </div>
  );
}
