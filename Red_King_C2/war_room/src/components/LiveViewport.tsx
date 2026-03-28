import { useState, useEffect, useRef } from 'react';
import { Monitor, X, Camera, RefreshCw, Maximize2, Activity } from 'lucide-react';

interface LiveViewportProps {
  agentId: string;
  onClose: () => void;
}

const LiveViewport = ({ agentId, onClose }: LiveViewportProps) => {
  const [frame, setFrame] = useState<string | null>(null);
  const [latency, setLatency] = useState(0);
  const [fps, setFps] = useState(0);
  const [status, setStatus] = useState<'CONNECTING' | 'LIVE' | 'OFFLINE'>('CONNECTING');
  
  const framesReceived = useRef(0);
  const lastTime = useRef(Date.now());
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to specific agent stream
    const ws = new WebSocket(`ws://localhost:9001/api/hive/stream/${agentId}`);
    socketRef.current = ws;

    ws.onopen = () => setStatus('LIVE');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'SCREEN_FRAME') {
          setFrame(`data:image/jpeg;base64,${msg.data}`);
          framesReceived.current++;
          
          // FPS Calculation
          const now = Date.now();
          if (now - lastTime.current >= 1000) {
            setFps(framesReceived.current);
            framesReceived.current = 0;
            lastTime.current = now;
          }
        }
      } catch (e) {
        console.error("Frame decode error", e);
      }
    };

    ws.onclose = () => setStatus('OFFLINE');
    ws.onerror = () => setStatus('OFFLINE');

    return () => {
      ws.close();
    };
  }, [agentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm pointer-events-none">
      <div className="relative w-full max-w-5xl aspect-video border border-red-500/30 rounded-lg overflow-hidden glass-card pointer-events-auto flex flex-col">
        
        {/* Header bar */}
        <div className="h-10 border-b border-red-500/20 bg-red-500/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Monitor size={14} className="text-red-500" />
            <span className="font-mono text-[10px] font-bold text-red-500 tracking-widest uppercase">
              Visual Intelligence Feed | Agent {agentId.slice(0, 8)}
            </span>
            <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full border text-[8px] font-black ${
              status === 'LIVE' ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-red-500/40 bg-red-500/10 text-red-400'
            }`}>
              <span className={`w-1 h-1 rounded-full ${status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {status}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-6 font-mono text-[8px] text-zinc-500 font-bold">
                <div className="flex items-center gap-1">
                   <Activity size={10} />
                   <span>{fps} FPS</span>
                </div>
                <div className="flex items-center gap-1">
                   <RefreshCw size={10} />
                   <span>LATENCY: {latency}ms</span>
                </div>
             </div>
             <button onClick={onClose} className="p-1 hover:bg-red-500/20 text-red-500 transition-colors">
               <X size={16} />
             </button>
          </div>
        </div>

        {/* Stream Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {frame ? (
            <img 
              src={frame} 
              alt="Live Stream" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-zinc-700">
               <Monitor size={64} className="opacity-20 animate-pulse" />
               <span className="font-mono text-[10px] uppercase tracking-tighter">Waiting for visual signal...</span>
            </div>
          )}

          {/* CRT Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>

        {/* Footer Controls */}
        <div className="p-3 bg-black/40 border-t border-red-500/20 flex items-center justify-between">
           <div className="flex gap-2">
              <button className="p-2 border border-zinc-800 bg-black/40 text-zinc-500 hover:border-red-500/40 hover:text-red-400 transition-all rounded">
                <Camera size={14} />
              </button>
              <button className="p-2 border border-zinc-800 bg-black/40 text-zinc-500 hover:border-red-500/40 hover:text-red-400 transition-all rounded">
                <Maximize2 size={14} />
              </button>
           </div>
           
           <div className="text-[7px] font-mono text-zinc-600 uppercase flex flex-col items-end">
              <span>Sovereign Link 2026.42</span>
              <span>Encrypted VNC Tunnel Alpha</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveViewport;
