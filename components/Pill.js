export default function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ border: active ? "2.5px solid #1b3a4b" : "2.5px solid transparent", background: active ? "#fff" : "rgba(255,255,255,0.55)" }}
      className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
    >
      {children}
    </button>
  );
}
