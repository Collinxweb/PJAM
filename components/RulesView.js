"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

function Section({ t, title, children }) {
  return (
    <div className="mt-5 rounded-2xl p-4" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
      <div className="font-extrabold text-sm mb-2" style={{ color: t.ink }}>
        {title}
      </div>
      <div className="text-sm font-semibold opacity-80" style={{ color: t.ink }}>
        {children}
      </div>
    </div>
  );
}

export default function RulesView() {
  const { t } = useTheme();

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          📜 Game rules
        </h1>

        <Section t={t} title="Scoring (100 points total)">
          <ul className="list-disc pl-4 space-y-1">
            <li>Accuracy — 60 pts. How closely the AI's output matches the challenge's target answer.</li>
            <li>Efficiency — 25 pts. Full marks for staying at or under the challenge's par word count; overshooting costs points.</li>
            <li>Style — 15 pts. Creativity and voice, judged independently of correctness.</li>
          </ul>
          <p className="mt-2">A score of 70 or higher clears the challenge — you'll see 🎉🏆. Below that, you'll see 😞💔 and can retry (outside tournaments).</p>
        </Section>

        <Section t={t} title="Difficulty">
          Every challenge is rated 1–5 stars, grouped into Easy (1–2★), Medium (3★), and Hard (4–5★). Pick a band before entering a zone's challenge list.
        </Section>

        <Section t={t} title="Coins and XP">
          Clearing a challenge (score 70+) pays coins based on difficulty (1★=20 up to 5★=100), scaled by how well you scored, plus flat XP toward your player Level. Scoring under 70 pays nothing — no coins, no XP — and prompts a retry. Leveling reflects challenges actually cleared, not just attempts made.
        </Section>

        <Section t={t} title="Levels">
          There are 50 player levels. Each level needs more cumulative XP than the last (Level N needs N×100 XP), earned only from clears. Level reflects how much you've cleared — it's separate from Reputation, which reflects how well you play.
        </Section>

        <Section t={t} title="Reputation and rank">
          Reputation is the average of your best 20 challenge scores, and decays 2% per week of inactivity. Tiers: Bronze (0–999) → Silver (1,000–2,499) → Gold (2,500–4,999) → Prompt Master (5,000+).
        </Section>

        <Section t={t} title="Achievements">
          Real milestone badges computed from your actual history — first clear, beating every AI opponent, winning a tournament, reaching each rank. No fake unlocks; a badge only shows earned once you've genuinely done it.
        </Section>

        <Section t={t} title="Tournaments">
          A host picks a challenge — an existing one, or writes a fully custom one (title, brief, and target answer) — and a size (4–8 players). Every participant gets exactly one attempt; there are no retries in tournament mode, and everyone is judged by the same AI, on the same formula, as regular play. When the host closes it, the highest score wins (ties go to whoever submitted first) — plus a 100-coin bonus and bragging rights they can share straight to X.
        </Section>

        <Section t={t} title="Fair play">
          Scores come from a real AI judge comparing your output to the challenge target — not from the client, so scores can't be faked by editing the page. Submitting the same prompt repeatedly to farm coins won't out-earn actually improving your prompt.
        </Section>
      </div>
      <BottomNav />
    </>
  );
}
