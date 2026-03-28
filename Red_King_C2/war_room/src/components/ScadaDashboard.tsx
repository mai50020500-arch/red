import React, { useState } from 'react';
import { Activity, Zap, Server, AlertTriangle, Terminal } from 'lucide-react';

interface PLCNode {
  ip: string;
  status: string;
  proto: string;
}

const ScadaDashboard: React.FC = () => {
  const [plcs, setPlcs] = useState<PLCNode[]>([]);
  const [scanning, setScanning] = useState(false);
  const [striking, setStriking] = useState<string | null>(null);

  const triggerStrike = async (ip: string) => {
    setStriking(ip);
    try {
      // Phase 35 Kinetic Strike
      await fetch('http://localhost:9001/api/hive/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: '770cfb36-e874-4b7c-9d1c-f2f261e42815', command: 'scada_blackout' })
      });
      setTimeout(() => setStriking(null), 3000);
    } catch (err) {
      console.error("Strike Failed:", err);
      setStriking(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/60 font-mono overflow-hidden border border-orange-500/20 rounded-lg">
      <div className="px-4 py-3 border-b border-orange-500/30 bg-orange-500/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-orange-500 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
            Industrial Grid Control [SCADA]
          </h2>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
            <span className="text-[8px] text-orange-500/60 uppercase font-bold">Monitoring Port 502</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* PLC Status Cards */}
        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-3 rounded group hover:border-orange-500/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded text-orange-500">
                    <Server size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white">PLC_NODE_0{i}</div>
                    <div className="text-[8px] text-zinc-500 uppercase tracking-widest">192.168.1.{100 + i}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/20">
                    MODBUS/TCP
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 gap-2">
                 <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-3/4 animate-pulse" />
                 </div>
                 <button 
                  onClick={() => triggerStrike(`192.168.1.${100 + i}`)}
                  disabled={striking === `192.168.1.${100+i}`}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-[9px] font-black uppercase tracking-tighter transition-all border
                    ${striking === `192.168.1.${100+i}` 
                      ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                      : 'bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-red-600 hover:text-white hover:border-red-500'}`}
                 >
                   <Zap size={10} />
                   {striking === `192.168.1.${100+i}` ? 'INJECTING...' : 'KINETIC STRIKE'}
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Panel */}
        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5" />
          <div>
            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest">Warning: Neural Feedback</div>
            <div className="text-[8px] text-zinc-400 leading-relaxed mt-1">
              Industrial sabotage detected in regional grid. Sovereign Key rotation recommended within 24 hours.
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-orange-500/10 bg-black/60">
        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-zinc-600">
          <span>Relay: ACTIVE</span>
          <span className="flex items-center gap-1">
            <Terminal size={8} />
             ARES_ENGINE_v3.5
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScadaDashboard;
