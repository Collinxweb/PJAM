"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function SettingsView() {
  const { t } = useTheme();

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          ⚙️ Settings
        </h1>

        <div className="mt-5 rounded-2xl p-4" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
          <div className="font-extrabold text-sm mb-3" style={{ color: t.ink }}>
            Theme
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
