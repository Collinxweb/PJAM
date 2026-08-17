import Link from "next/link";

export default function ZoneCard({ zone, t, tag }) {
  return (
    <Link
      href={`/zone/${zone.id}`}
      className="rounded-3xl p-4 flex flex-col gap-1 select-none active:scale-[0.98] transition-transform"
      style={{
        background: t.card,
        border: `3px solid ${t.ink}`,
        boxShadow: `4px 5px 0 ${t.ink}`,
      }}
    >
      <div className="text-3xl">{zone.emoji}</div>
      <div className="font-extrabold text-base leading-tight" style={{ color: t.ink }}>
        {zone.name}
      </div>
      <span
        className="self-start text-[11px] font-bold px-2 py-0.5 rounded-full mt-1"
        style={{ background: t.accent, color: t.accentInk }}
      >
        {tag}
      </span>
      <div className="text-xs mt-1 opacity-70" style={{ color: t.ink }}>
        {zone.description}
      </div>
    </Link>
  );
}
