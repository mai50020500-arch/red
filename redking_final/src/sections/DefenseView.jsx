import { motion } from "framer-motion";
import { RiskChip, Badge, SectionTitle } from "../components/visuals";
import { SCORES, REMEDIATION } from "../data/redKingData";

/* ── SVG Gauge arc ──────────────────────────────── */
function GaugeArc({ value, label, color }) {
  const r = 34, cx = 50, cy = 52;
  const toRad = a => (a - 90) * Math.PI / 180;
  const arc = (ri, s, e) => {
    const x1 = cx + ri * Math.cos(toRad(s)), y1 = cy + ri * Math.sin(toRad(s));
    const x2 = cx + ri * Math.cos(toRad(e)), y2 = cy + ri * Math.sin(toRad(e));
    return `M ${x1} ${y1} A ${ri} ${ri} 0 ${e - s > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const endAngle = -140 + (Math.min(value, 100) / 100) * 280;

  return (
    <svg viewBox="0 0 100 68" className="w-full" role="img" aria-label={`${label}: ${value}%`}>
      <path d={arc(r,-140,140)} fill="none" stroke="#1e2638" strokeWidth="7" strokeLinecap="round"/>
      <path d={arc(r,-140,endAngle)} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        style={{filter:`drop-shadow(0 0 7px ${color}80)`}}/>
      <text x={cx} y={cy-2}  textAnchor="middle" fill={color}    fontSize="15" fontWeight="bold"  fontFamily="monospace">{value}%</text>
      <text x={cx} y={cy+9}  textAnchor="middle" fill="#4b5563"  fontSize="4.5"                   fontFamily="monospace">{label}</text>
    </svg>
  );
}

/* ── Score key labels ───────────────────────────── */
const SCORE_LABELS = {
  detection:  "Detection Rate",
  prevention: "Prevention Rate",
  resilience: "Resilience Score",
};

export function DefenseView({ accent }) {
  return (
    <div className="space-y-6">

      {/* Gauge row */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <SectionTitle subtitle="Security Posture" title="Simulation Score Summary"
          action={<Badge tone="danger">OP-CRIMSON</Badge>}/>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Object.entries(SCORES).map(([key, s], i) => (
            <motion.div key={key} className="text-center"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em]" style={{color:s.color}}>
                {SCORE_LABELS[key]}
              </div>
              <GaugeArc value={s.value} label="" color={s.color}/>
              <p className="mt-2 text-xs text-gray-600">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Score interpretation */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5 text-center text-xs font-mono">
          <div>
            <div className="text-sm font-black text-red-400">77%</div>
            <div className="mt-0.5 text-gray-700">attacks undetected</div>
          </div>
          <div>
            <div className="text-sm font-black text-amber-400">39%</div>
            <div className="mt-0.5 text-gray-700">attacks not blocked</div>
          </div>
          <div>
            <div className="text-sm font-black text-blue-400">56%</div>
            <div className="mt-0.5 text-gray-700">recovery gap</div>
          </div>
        </div>
      </div>

      {/* Remediation queue */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <SectionTitle subtitle="Remediation" title="Priority Action Queue"
          action={<Badge tone="warn">Auto-Generated</Badge>}/>

        <div className="space-y-3">
          {REMEDIATION.map((item, i) => (
            <motion.div key={item.n}
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.07}}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-5 py-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                style={{backgroundColor:accent}}>
                {item.n}
              </div>
              <span className="flex-1 text-sm leading-snug text-gray-300">{item.text}</span>
              <div className="flex shrink-0 items-center gap-2">
                <RiskChip risk={item.risk}/>
                <span className="font-mono text-xs text-gray-600">{item.effort}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-mono text-gray-700">
          <span>Total estimated effort: <span className="text-gray-400">16 hours</span></span>
          <span>Findings mapped to <span style={{color:accent}}>MITRE ATT&amp;CK v14</span></span>
        </div>
      </div>

      {/* Compliance posture */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <SectionTitle subtitle="Compliance" title="Framework Alignment" action={<Badge>Informational</Badge>}/>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {label:"NIST CSF 2.0",    pct:74, col:"#3b82f6"},
            {label:"ISO 27001",       pct:68, col:"#8b5cf6"},
            {label:"CIS Controls v8", pct:81, col:"#10b981"},
            {label:"SOC 2 Type II",   pct:59, col:accent   },
          ].map(f => (
            <div key={f.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <div className="text-xl font-black" style={{color:f.col}}>{f.pct}%</div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-600">{f.label}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div className="h-full rounded-full"
                  initial={{width:0}} animate={{width:`${f.pct}%`}}
                  transition={{duration:0.9,ease:"easeOut"}}
                  style={{background:`linear-gradient(90deg,${f.col}88,${f.col})`,boxShadow:`0 0 6px ${f.col}50`}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
