"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME_KEY } from "@/lib/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY);

  useEffect(() => {
    const saved = window.localStorage.getItem("pjam-theme");
    if (saved && THEMES[saved]) setThemeKey(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pjam-theme", themeKey);
  }, [themeKey]);

  const t = THEMES[themeKey];

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, t }}>
      <div
        style={{
          background: `linear-gradient(180deg, ${t.bgFrom} 0%, ${t.bgTo} 100%)`,
          minHeight: "100vh",
          transition: "background 0.4s ease",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
