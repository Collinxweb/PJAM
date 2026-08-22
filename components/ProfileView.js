"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import { tierForReputation, levelForXp } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";

export default function ProfileView({ profile }) {
  const { t } = useTheme();
  const supabase = createClient();
  const fileInputRef = useRef(null);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState("");

  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const { level, maxed } = levelForXp(profile?.xp ?? 0);

  async function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    setUploading(true);
    setErrorMsg("");
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${profile.id}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const freshUrl = `${pub.publicUrl}?t=${Date.now()}`; // cache-bust so the new image shows right away

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, username, bio, avatarUrl: freshUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save avatar.");

      setAvatarUrl(freshUrl);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, username, bio, avatarUrl }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error || "Could not save.");
      setStatus("error");
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>

        <div className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl overflow-hidden active:scale-95 transition-transform"
            style={{ background: t.accent, border: `3px solid ${t.ink}` }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              "🙂"
            )}
            <div
              className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
            >
              {uploading ? "Uploading..." : "Change"}
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-[11px] font-bold mt-2 opacity-70"
            style={{ color: t.ink }}
          >
            {uploading ? "Uploading..." : "Tap to upload a photo"}
          </button>

          <div className="flex gap-2 mt-3">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: tier.color, color: "#fff" }}>
              {tier.name}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.card, border: `2px solid ${t.ink}`, color: t.ink }}>
              Lv. {level}{maxed ? " (MAX)" : ""}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-3">
          <div>
            <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
              Display name
            </div>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should players see?"
              className="w-full p-3 rounded-2xl text-sm font-semibold outline-none"
              style={{ border: `2.5px solid ${t.ink}`, background: t.card, color: t.ink }}
            />
          </div>

          <div>
            <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
              Username (unique)
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-handle"
              className="w-full p-3 rounded-2xl text-sm font-semibold outline-none"
              style={{ border: `2.5px solid ${t.ink}`, background: t.card, color: t.ink }}
            />
          </div>

          <div>
            <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
              Bio
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell other players a bit about you"
              className="w-full p-3 rounded-2xl text-sm font-semibold outline-none"
              style={{ border: `2.5px solid ${t.ink}`, background: t.card, color: t.ink }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full mt-2 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            {status === "saving" ? "Saving..." : status === "saved" ? "✓ Saved" : "Save profile"}
          </button>
          {errorMsg && <p className="text-xs font-bold text-red-600">{errorMsg}</p>}
        </form>
      </div>
      <BottomNav />
    </>
  );
}
