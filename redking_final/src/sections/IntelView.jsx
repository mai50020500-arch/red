import { motion } from "framer-motion";
import { AgentStatusPill, RiskChip, Badge, SectionTitle } from "../components/visuals";
import { MITRE_COVERAGE } from "../data/redKingData";

export function IntelView({ accent, filteredAgents }) {
  const total   = MITRE_COVERAGE.reduce((s,r) => s + r.total,   0);
  const covered = MITRE_COVERAGE.reduce((s,r) => s + r.covered, 0);
  const avg     = Math.round((covered / total) * 100);

  return (
    <div className="space-y-6">

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {label:"Total Techniques", value:total,                col:"#e2e8f0"},
          {label:"Techniques Covered", value:covered,            col:"#10b981"},
          {label:"Avg Coverage",       value:`${avg}%`,          col:accent   },
          {label:"Tactics Mapped",     value:MITRE_COVERAGE.length, col:"#3b82f6"},
        ].map((s,i) => (
          <motion.div key={s.label}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
          >
            <div className="text-2xl font-black" style={{color:s.col}}>{s.value}</div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-600">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Coverage matrix */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <SectionTitle subtitle="Intel DB" title="MITRE ATT&CK — Tactic Coverage"
          action={<Badge tone="success">Framework v14</Badge>}/>
        <div className="space-y-3">
          {MITRE_COVERAGE.map((row, i) => {
            const pct    = Math.round((row.covered / row.total) * 100);
            const barCol = pct === 100 ? "#10b981" : pct >= 80 ? accent : "#f59e0b";
            return (
              <motion.div key={row.tactic}
                initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                transition={{delay:i*0.055,ease:"easeOut"}}
              >
                <div className="mb-1 flex items-center justify-between text-xs font-mono">
                  <span className="w-44 text-gray-300">{row.tactic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">{row.covered}/{row.total}</span>
                    <span className="w-10 text-right font-bold" style={{color:barCol}}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{width:0}}
                    animate={{width:`${pct}%`}}
                    transition={{duration:0.9,delay:i*0.055,ease:"easeOut"}}
                    style={{
                      background:`linear-gradient(90deg,${barCol}88,${barCol})`,
                      boxShadow:`0 0 8px ${barCol}50`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/[0.06] pt-4 text-xs font-mono text-gray-700">
          <span>Source: <span className="text-gray-400">MITRE ATT&amp;CK Enterprise v14</span></span>
          <span>Validation: <span className="text-gray-400">OP-CRIMSON / Build 45</span></span>
        </div>
      </div>

      {/* Agent technique cross-reference */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <SectionTitle subtitle="Agent Intelligence" title="Technique Cross-Reference"
          action={<Badge tone="danger">OP-CRIMSON</Badge>}/>
        <div className="overflow-x-auto rk-scrollbar">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-gray-600">
                {["Agent","Codename","Technique","Status","Risk"].map(h => (
                  <th key={h} className="px-4 py-3 text-left tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map(a => (
                <tr key={a.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3" style={{color:accent}}>{a.id}</td>
                  <td className="px-4 py-3 text-gray-200">{a.name}</td>
                  <td className="px-4 py-3 text-gray-500">{a.technique}</td>
                  <td className="px-4 py-3"><AgentStatusPill status={a.status}/></td>
                  <td className="px-4 py-3"><RiskChip risk={a.risk}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
