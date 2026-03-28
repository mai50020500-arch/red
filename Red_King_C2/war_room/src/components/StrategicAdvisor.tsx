import { useState, useEffect } from 'react';
import { Eye, ShieldAlert, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface Strategy {
  summary: string;
  priority_node: string;
  recommended_technique: string;
  rationale: string;
  risk_score: number;
}

const StrategicAdvisor = () => {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStrategy = async () => {
    try {
      const res = await fetch("http://localhost:9001/api/strategy/analyze");
      if (res.ok) {
        const data = await res.json();
        setStrategy(data);
      }
    } catch (e) {
      console.error("Failed to fetch strategic analysis", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
    const interval = setInterval(fetchStrategy, 10000); // 10s intelligence refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/40 text-cyan-500/80 font-mono text-[10px]">
      <div className="p-3 border-b border-cyan-500/30 flex items-center gap-2 bg-cyan-500/5">
        <Eye size={14} className="text-cyan-400 animate-pulse" />
        <span className="font-bold uppercase tracking-widest text-cyan-400">Omniscient Eye | Strategy</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-600 animate-pulse">
            <TrendingUp size={12} />
            <span>Analyzing battlefield patterns...</span>
          </div>
        ) : strategy ? (
          <>
            <div className="space-y-1">
              <span className="text-[8px] uppercase text-zinc-500 font-bold">Current Assessment</span>
              <p className="text-zinc-300 leading-relaxed bg-cyan-500/5 p-2 border-l border-cyan-500/50">
                {strategy.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border border-zinc-800 bg-black/20">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <Target size={12} />
                  <span className="font-bold uppercase text-[8px]">Priority Node</span>
                </div>
                <span className="text-zinc-100 text-[9px] truncate block">{strategy.priority_node}</span>
              </div>
              <div className="p-2 border border-zinc-800 bg-black/20">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <AlertCircle size={12} />
                  <span className="font-bold uppercase text-[8px]">Risk Score</span>
                </div>
                <span className="text-zinc-100 text-[9px]">{strategy.risk_score} / 10</span>
              </div>
            </div>

            <div className="p-3 border border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <TrendingUp size={14} />
                <span className="font-bold uppercase">Proposed Next Step</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] border-b border-zinc-800 pb-1">
                  <span className="text-zinc-500">Technique</span>
                  <span className="text-cyan-400 font-bold">{strategy.recommended_technique}</span>
                </div>
                <p className="text-[9px] text-zinc-400 italic leading-tight">
                  "{strategy.rationale}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[8px] text-zinc-600 border-t border-zinc-900 pt-2">
              <ShieldAlert size={10} />
              <span className="uppercase">Predictive Engine: V1.0-Omni</span>
            </div>
          </>
        ) : (
          <div className="text-red-500/50">Intelligence Stream Offline</div>
        )}
      </div>
    </div>
  );
};

export default StrategicAdvisor;
