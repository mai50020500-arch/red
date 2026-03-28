import { useState, useEffect } from 'react';
import { Skull, Zap, Brain, Globe, Lock, Trophy } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

const IconMap: Record<string, any> = {
  Skull,
  Zap,
  Brain,
  Globe,
  Lock,
  Trophy
};

const AchievementPanel = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("http://localhost:9001/api/achievements");
      if (res.ok) {
        const data = await res.json();
        setAchievements(data);
      }
    } catch (e) {
      console.error("Failed to fetch achievements", e);
    }
  };

  useEffect(() => {
    fetchAchievements();
    const interval = setInterval(fetchAchievements, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/40 text-red-500/80 font-mono text-[10px]">
      <div className="p-3 border-b border-red-500/30 flex items-center gap-2 bg-red-500/5">
        <Trophy size={14} className="text-red-500 animate-pulse" />
        <span className="font-bold uppercase tracking-widest">Sovereign Achievements</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {achievements.map((a) => {
          const Icon = IconMap[a.icon] || Trophy;
          return (
            <div 
              key={a.id} 
              className={`flex gap-3 p-2 border transition-all duration-500 ${
                a.unlocked 
                  ? 'border-red-500/40 bg-red-500/10 opacity-100 scale-100 shadow-[0_0_10px_rgba(255,0,0,0.1)]' 
                  : 'border-zinc-800 bg-black/20 opacity-40 scale-95 grayscale'
              }`}
            >
              <div className={`p-2 rounded border ${a.unlocked ? 'border-red-500/50 bg-red-500/20' : 'border-zinc-700 bg-zinc-900'}`}>
                <Icon size={16} className={a.unlocked ? 'text-red-500' : 'text-zinc-600'} />
              </div>
              <div className="flex flex-col">
                <span className={`font-black uppercase ${a.unlocked ? 'text-red-400' : 'text-zinc-500'}`}>
                  {a.name}
                </span>
                <span className="text-[8px] text-zinc-500 leading-tight mt-1">
                  {a.description}
                </span>
                {a.unlocked_at && (
                  <span className="text-[7px] text-red-500/60 mt-1 italic">
                    Unlocked: {new Date(a.unlocked_at).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementPanel;
