"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Mascot from "@/components/Mascot";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingView() {
  const { t } = useTheme();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  async function handleXSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "x",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleEmailSignIn(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="px-6 pb-10 pt-6 flex flex-col items-center text-center min-h-[560px]">
      <Mascot t={t} size={112} />
      <h1 className="font-black mt-3 leading-tight font-display" style={{ color: t.ink, fontSize: "1.7rem" }}>
        Welcome to PJAM.
        <br /> Every quest starts with a hello.
      </h1>
      <p className="text-sm mt-2 opacity-80 font-semibold max-w-[240px]" style={{ color: t.ink }}>
        Sign in to save your rank, rep, and rewards as you go.
      </p>

      <div className="w-full max-w-xs mt-8 flex flex-col gap-3">
        <button
          onClick={handleXSignIn}
          className="w-full py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
          style={{ background: "#000", color: "#fff", border: "3px solid #000" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.5l4.5 6 5.9-6zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z" />
          </svg>
          Continue with X
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-[2px]" style={{ background: t.ink, opacity: 0.15 }} />
          <span className="text-xs font-bold opacity-50" style={{ color: t.ink }}>
            or
          </span>
          <div className="flex-1 h-[2px]" style={{ background: t.ink, opacity: 0.15 }} />
        </div>

        {status === "sent" ? (
          <p className="text-sm font-bold" style={{ color: t.ink }}>
            ✦ Check {email} for your sign-in link.
          </p>
        ) : (
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@quest.mail"
              className="w-full py-3 px-4 rounded-2xl text-sm font-semibold outline-none"
              style={{ border: `2.5px solid ${t.ink}`, background: t.card, color: t.ink }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 rounded-2xl font-extrabold text-sm"
              style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
            >
              {status === "sending" ? "Sending..." : "Continue with email ✦"}
            </button>
            {status === "error" && (
              <p className="text-xs font-bold text-red-600">{errorMsg}</p>
            )}
          </form>
        )}
      </div>

      <p className="text-[11px] mt-6 opacity-50 max-w-[240px] font-semibold" style={{ color: t.ink }}>
        By continuing you agree to the quest rules and terms. No spam, just prompts.
      </p>
    </div>
  );
}
