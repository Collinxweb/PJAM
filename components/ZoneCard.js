import Link from "next/link";

export default function ZoneCard({ zone, t, tag, seasonal = false }) {
  if (zone.coming_soon) {
    return (
      <div
        className="rounded-3xl p-4 flex flex-col gap-1 select-none relative"
        style={{
          background: t.card,
          border: `3px solid ${t.ink}`,
          boxShadow: `4px 5px 0 ${t.ink}`,
          opacity: 0.5,
        }}
      >
        <span
          className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full"
          style={{ background: t.ink, color: t.card }}
        >
          🚧 Soon
        </span>
        <div className="text-3xl">{zone.emoji}</div>
        <div className="font-extrabold text-base leading-tight" style={{ color: t.ink }}>
          {zone.name}
        </div>
        <div className="text-xs mt-1 opacity-70" style={{ color: t.ink }}>
          {zone.description}
        </div>
      </div>
    );
  }

  const cardClass = `rounded-3xl p-4 flex flex-col gap-1 select-none ${seasonal ? "ofrenda-card" : "active:scale-[0.98] transition-transform"}`;
  const cardStyle = { background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` };
  const content = (
    <>
      <div className="text-3xl">{zone.emoji}</div>
      <div className="font-extrabold text-base leading-tight" style={{ color: t.ink }}>
        {zone.name}
      </div>
      {seasonal && <span className="mt-1 text-[10px] font-extrabold" style={{ color: "#ff9500" }}>🕯️ Limited seasonal event</span>}
      <span
        className="self-start text-[11px] font-bold px-2 py-0.5 rounded-full mt-1"
        style={{ background: t.accent, color: t.accentInk }}
      >
        {tag}
      </span>
      <div className="text-xs mt-1 opacity-70" style={{ color: t.ink }}>
        {zone.description}
      </div>
    </>
  );

  if (seasonal) {
    return <div className={cardClass} style={cardStyle} aria-label="Ofrenda Track seasonal event">{content}</div>;
  }
  return <Link href={`/zone/${zone.id}`} className={cardClass} style={cardStyle}>{content}</Link>;
}
