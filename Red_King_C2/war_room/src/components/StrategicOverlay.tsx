import React from 'react';
import { Globe, Activity, Shield, Users, Wifi, Database } from 'lucide-react';

interface StrategicOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    agents: number;
    neighbors: number;
    intel: number;
  };
}

const StrategicOverlay: React.FC<StrategicOverlayProps> = ({ isOpen, onClose, stats }) => {
  const [isAutonomyEnabled, setIsAutonomyEnabled] = React.useState(false);

  // Toggle Function
  const toggleAutonomy = async () => {
    try {
        const newState = !isAutonomyEnabled;
        await fetch('http://localhost:9001/api/settings/autonomy', {
            method: 'POST',
            body: JSON.stringify({ enabled: newState }),
            headers: {'Content-Type': 'application/json'}
        });
        setIsAutonomyEnabled(newState);
    } catch(e) { console.error(e); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center text-red-500 animate-in fade-in duration-300">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-red-500/[0.05] pointer-events-none" style={{ backgroundSize: '40px 40px' }}></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-zinc-500 hover:text-white border border-zinc-700 px-4 py-2 uppercase text-xs tracking-widest hover:bg-red-500 hover:border-red-500 transition-all font-mono"
      >
        Exit Command Mode
      </button>

      {/* Main Content */}
      <div className="max-w-6xl w-full grid grid-cols-12 gap-8 p-12 relative">
        
        {/* Header */}
        <div className="col-span-12 text-center mb-12">
          <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 glitch-text" data-text="GLOBAL COMMAND">
            GLOBAL COMMAND
          </h1>
          <div className="mt-4 flex justify-center items-center gap-6 text-2xl tracking-widest font-mono text-red-400">
            <span className="animate-pulse">●</span> 
            <span>{isAutonomyEnabled ? "DEFCON 0: AI AUTONOMY ACTIVE" : "DEFCON 1: HUMAN CONTROL"}</span> 
            <span className="animate-pulse">●</span>
          </div>
          
          {/* Autonomy Toggle */}
          <div className="mt-8 flex flex-col items-center gap-6">
            <button
                onClick={toggleAutonomy}
                className={`flex items-center gap-4 px-8 py-4 border-2 ${isAutonomyEnabled ? 'border-red-500 bg-red-600/20 shadow-[0_0_50px_rgba(255,0,0,0.4)]' : 'border-zinc-700 bg-black/50'} transition-all group`}
            >
                <div className={`w-4 h-4 rounded-full ${isAutonomyEnabled ? 'bg-red-500 animate-ping' : 'bg-zinc-700'}`} />
                <span className={`text-xl font-black tracking-widest ${isAutonomyEnabled ? 'text-red-100' : 'text-zinc-500'}`}>
                    {isAutonomyEnabled ? "RED QUEEN PROTOCOL: ENGAGED" : "ENABLE AUTONOMOUS PROTOCOLS"}
                </span>
            </button>

            {/* Report Download */}
            <a 
                href="http://localhost:9001/api/mission/report" 
                target="_blank" 
                className="text-xs font-mono text-zinc-500 hover:text-red-400 border-b border-transparent hover:border-red-400 transition-all uppercase tracking-widest"
            >
                [ DOWNLOAD CLASSIFIED MISSION DOSSIER ]
            </a>
          </div>
        </div>

        {/* Stat Block 1: Agents */}
        <div className="col-span-4 border border-red-500/30 bg-red-500/5 p-8 flex flex-col items-center hover:bg-red-500/10 transition-all group">
          <Users size={48} className="mb-4 text-red-400 group-hover:scale-110 transition-transform" />
          <div className="text-6xl font-black text-white mb-2">{stats.agents}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-red-400">Active Operatives</div>
        </div>

        {/* Stat Block 2: Network Reach */}
        <div className="col-span-4 border border-red-500/30 bg-red-500/5 p-8 flex flex-col items-center hover:bg-red-500/10 transition-all group">
          <Wifi size={48} className="mb-4 text-red-400 group-hover:scale-110 transition-transform" />
          <div className="text-6xl font-black text-white mb-2">{stats.neighbors}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-red-400">Mapped Devices</div>
        </div>

        {/* Stat Block 3: Intel Yield */}
        <div className="col-span-4 border border-red-500/30 bg-red-500/5 p-8 flex flex-col items-center hover:bg-red-500/10 transition-all group">
          <Database size={48} className="mb-4 text-red-400 group-hover:scale-110 transition-transform" />
          <div className="text-6xl font-black text-white mb-2">{stats.intel}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-red-400">Intel Events</div>
        </div>

        {/* World Map Visualization (Stylized) */}
        <div className="col-span-12 border-t border-red-500/30 pt-12 mt-4 flex justify-center relative h-64 overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-red-500/20 to-transparent pointer-events-none flex items-center justify-center">
                <Globe size={400} className="text-red-900/40 animate-spin-slow" strokeWidth={0.5} />
             </div>
             <div className="z-10 text-center font-mono text-xs text-red-500/50">
                <p>TARGETING ALGORITHM: GLOBAL</p>
                <p>LATENCY: 12ms</p>
                <p>ENCRYPTION: AES-256-CBC</p>
             </div>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 w-full text-center text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
        Red King C2 // Classified // Eyes Only
      </div>

    </div>
  );
};

export default StrategicOverlay;
