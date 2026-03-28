import { motion } from "framer-motion";
import { NetworkMesh, Badge, SectionTitle, Skeleton } from "../components/visuals";
import { MESH_NODES, MESH_EDGES } from "../data/redKingData";

export function TopologyView({ accent, ready }) {
  const meshStats = [
    { label:"Active Tunnels",      value:"7",             col:"#10b981" },
    { label:"Encrypted Channels",  value:"AES-256-GCM",  col:"#3b82f6" },
    { label:"P2P Nodes",           value:"8 (2 relay)",   col:"#f59e0b" },
    { label:"Avg Mesh Latency",    value:"12 ms",         col:"#10b981" },
    { label:"Key Rotation in",     value:"08:44:22",      col:"#f59e0b" },
    { label:"Detection Risk",      value:"MINIMAL",       col:accent    },
  ];

  return (
    <div className="space-y-6">

      {/* Full-width mesh panel */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <SectionTitle subtitle="Live Topology" title="Shadow Mesh — Full Network Map"
          action={<Badge tone="danger">ENCRYPTED · AES-256</Badge>}/>

        <div style={{height:440}}>
          {!ready
            ? <Skeleton className="h-full w-full"/>
            : <NetworkMesh accent={accent} nodes={MESH_NODES} edges={MESH_EDGES}/>
          }
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-xs font-mono text-gray-600">
          <span><span style={{color:accent}}>●</span> C2 Brain (The Brain / FastAPI)</span>
          <span><span className="text-orange-400">●</span> Relay Node (P2P bridge)</span>
          <span><span className="text-gray-600">●</span> Ghost Agent (Rust binary)</span>
          <span className="ml-auto" style={{color:accent}}>Daily key rotation · Mesh fallback enabled</span>
        </div>
      </div>

      {/* Mesh stat grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {meshStats.map((s, i) => (
          <motion.div key={s.label}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            transition={{delay:i*0.06}}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
          >
            <span className="text-sm text-gray-500">{s.label}</span>
            <span className="font-mono font-bold" style={{color:s.col}}>{s.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Encryption status */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <SectionTitle subtitle="Encryption" title="Channel Key Status" action={<Badge tone="success">Active</Badge>}/>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {[
            {label:"Algorithm",   value:"AES-256-GCM", col:"#3b82f6"},
            {label:"Current Key", value:"ACTIVE",       col:"#10b981"},
            {label:"Rotation",    value:"Every 24 hrs", col:"#f59e0b"},
            {label:"Integrity",   value:"100%",          col:"#10b981"},
          ].map(r => (
            <div key={r.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
              <div className="text-lg font-black" style={{color:r.col}}>{r.value}</div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-gray-600">{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
