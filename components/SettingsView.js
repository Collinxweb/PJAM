"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { createClient } from "@/lib/supabase/client";

export default function SettingsView({ signedIn = false }) {
  const { t } = useTheme();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  }

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

        <div className="mt-5 rounded-2xl p-4" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
          <div className="font-extrabold text-sm mb-3" style={{ color: t.ink }}>
            🐞 Report an issue
          </div>
          <p className="text-xs font-semibold opacity-70 mb-3" style={{ color: t.ink }}>
            Found a bug, or something feel off? Reach out directly.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://x.com/0xcollinxweb3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs"
              style={{ background: "#000", color: "#fff", border: "2px solid #000" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.5l4.5 6 5.9-6zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z" />
              </svg>
              @0xcollinxweb3 on X
            </a>
            <a
              href="https://t.me/C0llinXweb3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs"
              style={{ background: "#26A5E4", color: "#fff", border: "2px solid #26A5E4" }}
            >
              Telegram
            </a>
          </div>
        </div>

        {signedIn && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: "transparent", color: "#dc2626", border: "2.5px solid #dc2626" }}
          >
            {loggingOut ? "Signing out..." : "Log out"}
          </button>
        )}
      </div>
      <BottomNav />
    </>
  );
}
