import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { Badge, SectionTitle } from "../components/visuals";
import { LOG_TABS } from "../data/redKingData";

function logTone(l) {
  return l === "critical" ? "danger" : l === "warn" ? "warn" : "neutral";
}

export function EventsView({ accent, filteredLogs, logQuery, setLogQuery, activeTab, setActiveTab }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <SectionTitle subtitle="Security Events" title="Live Activity Stream"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {LOG_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition ${activeTab===tab ? "text-white" : "border-white/10 bg-white/5 text-gray-600 hover:text-white"}`}
                style={activeTab===tab ? {borderColor:accent,backgroundColor:`${accent}15`} : undefined}>
                {tab}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <Search size={15} className="shrink-0 text-gray-600"/>
        <input value={logQuery} onChange={e => setLogQuery(e.target.value)}
          placeholder="Search events by source, text, or time…" aria-label="Search security events"
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-700"/>
      </div>

      <div className="max-h-[600px] space-y-2 overflow-y-auto pr-1 rk-scrollbar">
        <AnimatePresence initial={false}>
          {filteredLogs.length > 0 ? filteredLogs.map(log => (
            <motion.div key={log.id} layout
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}
              className="rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4"
              style={log.level==="critical" ? {borderColor:`${accent}25`,background:`${accent}06`} : undefined}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Badge tone={logTone(log.level)}>{log.level}</Badge>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600">{log.source}</span>
                </div>
                <span className="text-xs font-mono text-gray-700">{log.time}</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-300">{log.text}</p>
            </motion.div>
          )) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-sm text-gray-600">
              No events matched the current filters.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* stream footer */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs font-mono text-gray-700">
        <span>{filteredLogs.length} events visible</span>
        <span style={{color:accent}}>● Live · updates every 4.5 s</span>
      </div>
    </div>
  );
}
