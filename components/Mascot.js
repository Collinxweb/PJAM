export default function Mascot({ t, pose = "wave", size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="110" rx="28" ry="5" fill="#000" opacity="0.12" />

      <line x1="60" y1="10" x2="60" y2="22" stroke={t.ink} strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="8" r="5" fill={t.accent} stroke={t.ink} strokeWidth="2.5" />

      <rect x="24" y="22" width="72" height="62" rx="20" fill={t.mascotBody} stroke={t.ink} strokeWidth="3" />

      <rect x="34" y="34" width="52" height="34" rx="10" fill={t.dark ? "#0c0a12" : "#0f1a22"} opacity="0.9" />
      <circle cx="48" cy="51" r="4.5" fill={t.accent} />
      <circle cx="72" cy="51" r="4.5" fill={t.accent} />
      <path
        d={pose === "wave" ? "M50 60q10 7 20 0" : "M48 60h24"}
        stroke={t.accent}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="20" cy="52" r="6" fill={t.mascotBody} stroke={t.ink} strokeWidth="2.5" />
      <circle cx="100" cy="52" r="6" fill={t.mascotBody} stroke={t.ink} strokeWidth="2.5" />

      <path
        d={pose === "wave" ? "M92 68q16-4 18 8t-14 12" : "M92 72q14 4 14 14"}
        stroke={t.ink}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M28 72q-8 6 -4 14" stroke={t.ink} strokeWidth="3" fill="none" strokeLinecap="round" />

      <rect x="42" y="84" width="10" height="14" rx="4" fill={t.mascotBody} stroke={t.ink} strokeWidth="2.5" />
      <rect x="68" y="84" width="10" height="14" rx="4" fill={t.mascotBody} stroke={t.ink} strokeWidth="2.5" />
    </svg>
  );
}
