import crypto from "crypto";

// Ofrenda challenges are seeded with deterministic UUIDv5 ids derived from
// their text ids (namespace: DNS, name: pjam. + text id). The runtime level
// list in lib/ofrendaTrack.js keeps the readable text ids; this maps them to
// the matching database uuid so lookups and submissions stay consistent.
const DNS_NAMESPACE = Buffer.from("6ba7b8109dad11d180b400c04fd430c8", "hex");

export function ofrendaChallengeUuid(textId) {
  const digest = crypto
    .createHash("sha1")
    .update(Buffer.concat([DNS_NAMESPACE, Buffer.from("pjam." + textId)]))
    .digest();
  const b = [...digest.slice(0, 16)];
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = b.map((v) => v.toString(16, "0").padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
