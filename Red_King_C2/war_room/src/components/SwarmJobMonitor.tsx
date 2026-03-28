import { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, Loader2, Target } from 'lucide-react';

interface SwarmJob {
  id: string;
  type: string;
  status: string;
  targets: string[];
  progress: number;
}

const SwarmJobMonitor = () => {
  const [jobs, setJobs] = useState<SwarmJob[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:9001/api/swarm/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/40 text-red-500/80 font-mono text-[10px]">
      <div className="p-3 border-b border-red-500/30 flex items-center justify-between bg-red-500/5">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-red-500" />
          <span className="font-bold uppercase tracking-widest text-red-400">Swarm Job Orbit</span>
        </div>
        <span className="text-[8px] text-zinc-600 uppercase">Real-time Tasking</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {jobs.length === 0 ? (
          <div className="text-zinc-700 italic py-6 text-center border border-dashed border-zinc-900 rounded">
            No active orbits detected
          </div>
        ) : (
          jobs.map(j => (
            <div key={j.id} className="p-3 border border-red-500/10 bg-black/40 rounded space-y-2">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <Target size={12} className="text-red-400" />
                   <span className="font-bold text-zinc-100">{j.id}</span>
                 </div>
                 <div className="flex items-center gap-1">
                    {j.status === 'running' ? (
                      <Loader2 size={10} className="text-amber-500 animate-spin" />
                    ) : (
                      <CheckCircle size={10} className="text-green-500" />
                    )}
                    <span className={`uppercase text-[8px] ${j.status === 'running' ? 'text-amber-500' : 'text-green-500'}`}>
                      {j.status}
                    </span>
                 </div>
              </div>

              <div className="flex justify-between text-[7px] text-zinc-500 uppercase">
                 <span>Type: {j.type}</span>
                 <span>Targets: {j.targets.length} Units</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${j.status === 'running' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                   style={{ width: `${j.progress * 100 || 30}%` }}
                 />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                 {j.targets.map(t => (
                   <span key={t} className="px-1 border border-zinc-800 text-[6px] text-zinc-600 rounded">
                     {t.slice(0,6)}
                   </span>
                 ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-red-500/20 bg-red-500/5">
         <div className="flex items-center gap-2 text-[7px] text-zinc-500 font-bold uppercase">
            <Clock size={10} />
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
         </div>
      </div>
    </div>
  );
};

export default SwarmJobMonitor;
