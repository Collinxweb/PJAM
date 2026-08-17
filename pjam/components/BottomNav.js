"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const TABS = [
  ["🏠", "Home", "/"],
  ["✨", "Explore", "/explore"],
  ["🎒", "Backpack", "/backpack"],
  ["🏅", "Rank", "/rank"],
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTheme();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 max-w-sm mx-auto"
      style={{ background: t.card, borderTop: `3px solid ${t.ink}` }}
    >
      {TABS.map(([icon, label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5" style={{ opacity: active ? 1 : 0.5 }}>
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-extrabold" style={{ color: t.ink }}>
              {label}
            </span>
            {active && <span className="w-1 h-1 rounded-full mt-0.5" style={{ background: t.accent }} />}
          </Link>
        );
      })}
    </div>
  );
}
