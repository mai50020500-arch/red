import { useState } from 'react';
import IntelFeed from './components/IntelFeed';
import { Skull, Activity } from 'lucide-react';
import { AlertProvider } from './alerts/AlertContext';
import AlertPanel from './components/AlertPanel';
import AchievementPanel from './components/AchievementPanel';
import StrategicAdvisor from './components/StrategicAdvisor';
import SwarmController from './components/SwarmController';
import LiveViewport from './components/LiveViewport';
import StealthPanel from './components/StealthPanel';
import SwarmJobMonitor from './components/SwarmJobMonitor';

function App() {
  const [monitoringAgent, setMonitoringAgent] = useState<string | null>(null);

  return (
    <AlertProvider>
      <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden">
        <header className="px-6 py-4 border-b border-red-500/20 flex justify-between items-center bg-black/60">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tighter text-red-500">
              RED KING | WAR ROOM
            </h1>
            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-red-500/60 font-bold tracking-widest uppercase">
                System Online
              </span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-2 border border-red-500/50 px-3 py-1 rounded bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-wider">
              <Activity size={12} />
              Status: ACTIVE
            </button>
            <button className="flex items-center gap-2 border border-red-500/50 px-3 py-1 rounded bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-wider">
              <Skull size={12} />
              Forensics
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          <div className="w-80 flex flex-col gap-6">
            <div className="flex-1 border border-red-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur min-h-[300px]">
              <SwarmController onMonitor={(id) => setMonitoringAgent(id)} />
            </div>
            <div className="h-48 border border-red-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
              <SwarmJobMonitor />
            </div>
            <div className="h-40 border border-red-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
              <AchievementPanel />
            </div>
          </div>

          <div className="flex-1 border border-red-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur flex flex-col">
            <IntelFeed />
          </div>

          <div className="w-80 flex flex-col gap-6">
            <div className="flex-1 border border-red-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
              <AlertPanel />
            </div>
            <div className="h-48 border border-emerald-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
              <StealthPanel />
            </div>
            <div className="h-48 border border-cyan-500/20 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
              <StrategicAdvisor />
            </div>
          </div>
        </div>

        {monitoringAgent && (
          <LiveViewport
            agentId={monitoringAgent}
            onClose={() => setMonitoringAgent(null)}
          />
        )}
      </div>
    </AlertProvider>
  );
}

export default App;