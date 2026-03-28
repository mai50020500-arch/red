import React from "react";
import { motion } from "framer-motion";
import { Activity, Gauge, Lock, Shield, Zap } from "lucide-react";
import { cn } from "../utils/helpers";

export function NetworkMesh({ accent, nodes, edges }) {
  const [activeEdge, setActiveEdge] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setActiveEdge((p) => (p + 1) % edges.length), 650);
    return () => clearInterval(t);
  }, [edges.length]);

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 0 10px ${accent}35)` }}
    >
      {[20,40,60,80].map(v => (
        <g key={v}>
          <line x1={v} y1={0} x2={v} y2={100} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
          <line x1={0} y1={v} x2={100} y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
        </g>
      ))}

      {edges.map(([a, b], i) => {
        const na = nodes[a], nb = nodes[b];
        const isActive = i === activeEdge;
        return (
          <line
            key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={isActive ? accent : `${accent}22`}
            strokeWidth={isActive ? "0.6" : "0.25"}
            style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
          />
        );
      })}

      {nodes.map(n => {
        const isServer = n.type === "server";
        const isRelay  = n.type === "relay";
        const color = isServer ? accent : isRelay ? "#f97316" : "#6b7280";
        const r = isServer ? 4.5 : isRelay ? 2.8 : 2.2;
        return (
          <g key={n.id}>
            {isServer && (
              <>
                <circle cx={n.x} cy={n.y} r={r + 5} fill="none" stroke={`${accent}18`} strokeWidth="0.4"
                  style={{ animation: "meshPing 2s ease-in-out infinite" }} />
                <circle cx={n.x} cy={n.y} r={r + 2.5} fill="none" stroke={`${accent}28`} strokeWidth="0.4"
                  style={{ animation: "meshPing 2s ease-in-out infinite 0.5s" }} />
              </>
            )}
            <circle cx={n.x} cy={n.y} r={r} fill={`${color}18`} stroke={color} strokeWidth="0.6" />
            <circle cx={n.x} cy={n.y} r={r * 0.45} fill={color}
              style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
            <text x={n.x} y={n.y - r - 1.8} textAnchor="middle"
              fill="#9ca3af" fontSize="3.2" fontFamily="monospace">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AgentStatusPill({ status }) {
  const map = {
    active:    { label: "ACTIVE",  cls: "border-red-500/25 bg-red-500/10 text-red-300" },
    dormant:   { label: "DORMANT", cls: "border-amber-500/25 bg-amber-500/10 text-amber-300" },
    completed: { label: "DONE",    cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" },
  };
  const s = map[status] || map.dormant;
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest", s.cls)}>
      {s.label}
    </span>
  );
}

export function RiskChip({ risk }) {
  const map = {
    critical: { label: "CRITICAL", cls: "text-red-400 border-red-500/20 bg-red-500/10" },
    high:     { label: "HIGH", cls: "text-orange-300 border-orange-500/20 bg-orange-500/10" },
    medium:   { label: "MEDIUM", cls: "text-amber-300 border-amber-500/20 bg-amber-500/10" },
    low:      { label: "LOW", cls: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10" },
  };
  const r = map[risk] || map.low;
  return <span className={cn("rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest", r.cls)}>{r.label}</span>;
}

export function Badge({ children, tone = "neutral" }) {
  const map = {
    neutral: "border-white/10 bg-white/5 text-gray-300",
    danger: "border-red-500/20 bg-red-500/10 text-red-300",
    warn: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  };
  return <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]", map[tone] || map.neutral)}>{children}</span>;
}

export function Skeleton({ className = "" }) {
  return <div className={cn("animate-pulse rounded-2xl border border-white/10 bg-white/5", className)} />;
}

export function StatCard({ title, value, delta, icon: Icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
      style={{ boxShadow: `0 0 30px ${accent}06` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border"
          style={{ borderColor: `${accent}25`, backgroundColor: `${accent}12` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        <Badge tone="success">{delta}</Badge>
      </div>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-1 text-3xl font-black tracking-tight text-white">{value}</div>
    </motion.div>
  );
}

export function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">{subtitle}</div>
        <h2 className="mt-1 text-lg font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ToggleRow({ label, enabled, onToggle, icon: Icon, accent }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition hover:bg-white/5",
        enabled ? "border-white/10 bg-white/5 text-white" : "border-white/5 bg-transparent text-gray-400"
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white/5"
          style={{ borderColor: `${accent}28` }}
        >
          <Icon size={15} style={{ color: accent }} />
        </span>
        <span>{label}</span>
      </span>
      <span
        className="relative h-5 w-10 rounded-full border transition"
        style={{
          borderColor: enabled ? accent : "rgba(255,255,255,0.10)",
          backgroundColor: enabled ? `${accent}22` : "rgba(255,255,255,0.04)",
        }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all"
          style={{ left: enabled ? "20px" : "2px", boxShadow: enabled ? `0 0 12px ${accent}` : "none" }}
        />
      </span>
    </button>
  );
}
