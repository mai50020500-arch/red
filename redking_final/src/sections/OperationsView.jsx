import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Filter } from "lucide-react";
import {
  NetworkMesh, AgentStatusPill, RiskChip,
  Badge, Skeleton, StatCard, SectionTitle,
} from "../components/visuals";
import {
  STAT_DATA, ACTIVITY_DATA, MESH_NODES, MESH_EDGES, LOG_TABS,
} from "../data/redKingData";

const tooltipStyle = {
  background:"rgba(4,5,10,0.96)",
  border:"1px solid rgba(255,255,255,0.08)",
  borderRadius:14, color:"#fff", fontSize:12,
};

function logTone(l) {
  return l === "critical" ? "danger" : l === "warn" ? "warn" : "neutral";
}

function iconForStat(name) {
  const icons = {
    Shield: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    Zap: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    Lock: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    Gauge: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M22 12A10 10 0 1 0 12 22"/>
      </svg>
    ),
  };
  return icons[name] || icons.Shield;
}

export function OperationsView({
  accent, ready, widgets, setWidgets,
  filteredAgents, filteredLogs,
  logQuery, setLogQuery, activeTab, setActiveTab,
}) {
  const uid = useId();
  const techGradId = `${uid}-tg`;
  const detGradId  = `${uid}-dg`;

  return (
    <div className="space-y-6">

      {/* ── STAT CARDS ─────────────────────────────── */}
      <AnimatePresence>
        {widgets.stats && (
          <motion.section key="stats"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {!ready
              ? Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-[140px]"/>)
              : STAT_DATA.map(s => (
                  <StatCard key={s.title} {...s} icon={() => iconForStat(s.icon)} accent={accent}/>
                ))
            }
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── MESH + CHART ───────────────────────────── */}
      <AnimatePresence>
        {widgets.mesh && (
          <motion.section key="mesh"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]"
          >
            {/* P2P Shadow Mesh */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle subtitle="Topology" title="Shadow Mesh — P2P Live Map"
                action={<Badge tone="danger">ENCRYPTED</Badge>}/>
              <div style={{height:300}}>
                {!ready
                  ? <Skeleton className="h-full w-full"/>
                  : <NetworkMesh accent={accent} nodes={MESH_NODES} edges={MESH_EDGES}/>
                }
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono text-gray-600">
                <span><span style={{color:accent}}>●</span> C2 Brain</span>
                <span><span className="text-orange-400">●</span> Relay</span>
                <span><span className="text-gray-600">●</span> Ghost Agent</span>
                <span className="ml-auto" style={{color:accent}}>AES-256-GCM · 24 hr key rotation</span>
              </div>
            </div>

            {/* Activity chart */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <SectionTitle subtitle="Telemetry" title="Technique Activity" action={<Badge tone="warn">Live</Badge>}/>
              <div style={{height:210}}>
                {!ready ? <Skeleton className="h-full w-full"/> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACTIVITY_DATA}>
                      <defs>
                        <linearGradient id={techGradId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={accent}    stopOpacity={0.35}/>
                          <stop offset="95%" stopColor={accent}    stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id={detGradId}  x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                      <XAxis dataKey="time" tick={{fill:"#6b7280",fontSize:11}}/>
                      <YAxis tick={{fill:"#6b7280",fontSize:11}}/>
                      <Tooltip contentStyle={tooltipStyle}/>
                      <Area type="monotone" dataKey="techniques" stroke={accent}    strokeWidth={2} fill={`url(#${techGradId})`} name="Techniques"/>
                      <Area type="monotone" dataKey="detections" stroke="#8b5cf6"   strokeWidth={2} fill={`url(#${detGradId})`}  name="Detections"/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {[
                  {label:"Techniques Run", val:"38",  col:accent    },
                  {label:"EDR Detections", val:"7",   col:"#8b5cf6" },
                  {label:"Bypass Rate",    val:"82%", col:"#f97316" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{background:r.col}}/>
                      <span className="text-gray-400">{r.label}</span>
                    </div>
                    <span className="font-bold text-white">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── GHOST AGENT MATRIX ─────────────────────── */}
      <AnimatePresence>
        {widgets.agents && (
          <motion.div key="agents"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.26em]" style={{color:accent}}>Active Campaign</div>
                <h2 className="mt-0.5 text-lg font-bold text-white">Ghost Agent Matrix</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full" style={{backgroundColor:accent}}/>
                <Badge tone="danger">OP-CRIMSON</Badge>
              </div>
            </div>

            <div className="overflow-x-auto rk-scrollbar">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/[0.08] text-gray-600">
                    {["Agent ID","Codename","Status","Target","Technique","Progress","Risk"].map(h => (
                      <th key={h} className="px-5 py-3 text-left tracking-widest uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.length > 0 ? filteredAgents.map(a => (
                    <motion.tr key={a.id}
                      initial={{opacity:0}} animate={{opacity:1}}
                      className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3.5" style={{color:accent}}>{a.id}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-200">{a.name}</td>
                      <td className="px-5 py-3.5"><AgentStatusPill status={a.status}/></td>
                      <td className="px-5 py-3.5 text-cyan-500/80">{a.target}</td>
                      <td className="px-5 py-3.5 max-w-[200px] truncate text-gray-500">{a.technique}</td>
                      <td className="px-5 py-3.5 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div className="h-full rounded-full"
                              initial={{width:0}} animate={{width:`${a.progress}%`}}
                              transition={{duration:1.1,ease:"easeOut"}}
                              style={{
                                background: a.progress===100
                                  ? "linear-gradient(90deg,#059669,#10b981)"
                                  : a.progress>70
                                    ? `linear-gradient(90deg,${accent}88,${accent})`
                                    : "linear-gradient(90deg,#d97706,#f59e0b)",
                                boxShadow:`0 0 6px ${a.progress>70 ? accent : "#f59e0b"}55`,
                              }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-500">{a.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><RiskChip risk={a.risk}/></td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-600">
                        No agents matched the current search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EVENTS + RIGHT PANEL ───────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* Events feed */}
        <AnimatePresence>
          {widgets.logs && (
            <motion.div key="logs"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <SectionTitle subtitle="Events" title="Live Security Feed"
                action={
                  <div className="flex flex-wrap gap-1.5">
                    {LOG_TABS.map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition ${activeTab===tab ? "text-white" : "border-white/10 bg-white/5 text-gray-600 hover:text-white"}`}
                        style={activeTab===tab ? {borderColor:accent,backgroundColor:`${accent}15`} : undefined}>
                        {tab}
                      </button>
                    ))}
                  </div>
                }
              />

              <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
                <Filter size={13} className="shrink-0 text-gray-600"/>
                <input value={logQuery} onChange={e => setLogQuery(e.target.value)}
                  placeholder="Filter events…" aria-label="Filter security events"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-700"/>
              </div>

              <div className="max-h-[340px] space-y-2 overflow-y-auto pr-0.5 rk-scrollbar">
                <AnimatePresence initial={false}>
                  {filteredLogs.length > 0 ? filteredLogs.map(log => (
                    <motion.div key={log.id} layout
                      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
                      className="rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3"
                      style={log.level==="critical" ? {borderColor:`${accent}28`,background:`${accent}07`} : undefined}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge tone={logTone(log.level)}>{log.level}</Badge>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600">{log.source}</span>
                        </div>
                        <span className="text-[11px] font-mono text-gray-700">{log.time}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300">{log.text}</p>
                    </motion.div>
                  )) : (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-600">
                      No events matched the current filters.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: BAS State + mini chart */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle subtitle="Overview" title="BAS System State" action={<Badge tone="success">Stable</Badge>}/>
            <div className="space-y-2 text-sm">
              {[
                ["Campaign",      "OP-CRIMSON",     accent    ],
                ["Active Agents", "6 / 6",          "#10b981" ],
                ["Key Rotation",  "08:44:22 left",  "#f59e0b" ],
                ["MITRE Mapped",  "169 techniques", "#3b82f6" ],
                ["Encryption",    "AES-256-GCM",    "#10b981" ],
              ].map(([lbl,val,col]) => (
                <div key={lbl} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <span className="text-gray-500">{lbl}</span>
                  <span className="font-mono font-semibold" style={{color:col}}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <SectionTitle subtitle="Trend" title="Technique Progression" action={<Badge>Campaign</Badge>}/>
            <div style={{height:150}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="time" tick={{fill:"#6b7280",fontSize:10}}/>
                  <YAxis tick={{fill:"#6b7280",fontSize:10}}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Line type="monotone" dataKey="techniques" stroke={accent} strokeWidth={2.5} dot={false} name="Techniques"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
