import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Wifi, Globe, Trash2, Plus, Zap } from 'lucide-react';

interface Redirector {
  id: string;
  ip: string;
  hostname: string;
  type: string;
  status: string;
  last_seen: string;
}

const StealthPanel = () => {
  const [redirectors, setRedirectors] = useState<Redirector[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newHost, setNewHost] = useState('');

  const fetchRedirectors = async () => {
    try {
      const res = await fetch("/api/stealth/redirectors");
      if (res.ok) {
        const data = await res.json();
        setRedirectors(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRedirectors();
    const interval = setInterval(fetchRedirectors, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/stealth/redirectors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: newIP, hostname: newHost })
      });
      if (res.ok) {
        setShowAdd(false);
        setNewIP('');
        setNewHost('');
        fetchRedirectors();
      }
    } catch (e) {}
  };

  const handleBurn = async (id: string) => {
    try {
      const res = await fetch("/api/stealth/redirectors/burn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchRedirectors();
    } catch (e) {}
  };

  return (
    <div className="flex flex-col h-full bg-black/40 text-emerald-500/80 font-mono text-[10px]">
      <div className="p-3 border-b border-emerald-500/30 flex items-center justify-between bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-emerald-500 animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-emerald-400">Shadow Comms | Stealth</span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="p-1 hover:bg-emerald-500/20 rounded">
          <Plus size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {showAdd && (
          <div className="p-3 border border-emerald-500/30 bg-emerald-500/5 space-y-2 mb-4">
             <input 
               placeholder="IP ADDRESS" 
               className="w-full bg-black/60 border border-zinc-800 p-1 text-[8px] outline-none focus:border-emerald-500/40"
               value={newIP}
               onChange={(e) => setNewIP(e.target.value)}
             />
             <input 
               placeholder="HOSTNAME" 
               className="w-full bg-black/60 border border-zinc-800 p-1 text-[8px] outline-none focus:border-emerald-500/40"
               value={newHost}
               onChange={(e) => setNewHost(e.target.value)}
             />
             <button 
               onClick={handleRegister}
               className="w-full py-1 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black transition-all text-[8px] font-bold"
             >
               DEPLOY REDIRECTOR
             </button>
          </div>
        )}

        {redirectors.length === 0 ? (
          <div className="text-zinc-600 italic py-4 text-center">No Shadow Nodes Active</div>
        ) : (
          redirectors.map(r => (
            <div key={r.id} className={`p-2 border transition-all ${
              r.status === 'BURNED' ? 'border-red-500/20 opacity-40 grayscale' : 'border-emerald-500/20 bg-emerald-500/5'
            }`}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                   <Globe size={10} className={r.status === 'BURNED' ? 'text-zinc-600' : 'text-emerald-500'} />
                   <span className="font-bold text-zinc-100">{r.hostname}</span>
                </div>
                {r.status !== 'BURNED' && (
                  <button onClick={() => handleBurn(r.id)} className="text-red-500/50 hover:text-red-500">
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
              <div className="flex justify-between text-[7px] text-zinc-500 uppercase">
                <span>{r.ip}</span>
                <span className={r.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}>{r.status}</span>
              </div>
              {r.status === 'ACTIVE' && (
                <div className="mt-2 h-1 bg-zinc-900 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500/60 animate-[progress_5s_infinite_linear]" style={{width: '40%'}} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-emerald-500/5 border-t border-emerald-500/20 space-y-3">
         <div>
            <div className="flex items-center gap-2 text-[8px] text-emerald-400 font-bold mb-1">
               <ShieldAlert size={10} />
               <span>TRAFFIC VITALS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[7px] uppercase">
               <div className="flex flex-col">
                  <span className="text-zinc-600">Jitter State</span>
                  <span className="text-emerald-400 font-bold">ACTIVE (RND: 5-30s)</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-zinc-600">Fragmentation</span>
                  <span className="text-emerald-400 font-bold">SHADOW_CHUNK_V1</span>
               </div>
            </div>
         </div>
         
         <div>
            <div className="flex items-center gap-2 text-[8px] text-emerald-400 font-bold mb-1">
               <Zap size={10} />
               <span>ENCRYPTION OVERRIDE</span>
            </div>
            <p className="text-[7px] text-zinc-500 leading-tight">
              Redirectors rotate every 6h. Burn compromised nodes immediately to maintain sovereignty.
            </p>
         </div>
      </div>
    </div>
  );
};

export default StealthPanel;
