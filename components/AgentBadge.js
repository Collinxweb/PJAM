const MONOGRAMS = { claude: "C", chatgpt: "G", grok: "X", gemini: "G" };

export default function AgentBadge({ agent, t }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg"
        style={{
          background: agent.color_hex,
          color: "#ffffff",
          border: `2.5px solid ${t.ink}`,
          boxShadow: `2px 3px 0 ${t.ink}`,
        }}
      >
        {MONOGRAMS[agent.id] || agent.label[0]}
      </div>
      <span className="text-[10px] font-extrabold opacity-75" style={{ color: t.ink }}>
        {agent.label}
      </span>
    </div>
  );
}
