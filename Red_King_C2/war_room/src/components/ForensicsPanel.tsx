import React, { useState, useRef } from 'react';
import { Upload, FileCode, Key, Skull, Terminal, Crosshair, ShieldAlert, Cpu } from 'lucide-react';

interface ForensicsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForensicsPanel: React.FC<ForensicsPanelProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadPcap = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:9000/api/forensics/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resurrectSession = async (sess: any) => {
      // Demo: Assuming victim IP is the target host for now, or use a demo URL
      const demoUrl = "https://admin-portal.demo.local/dashboard"; 
      
      try {
          await fetch('http://localhost:9000/api/war/resurrect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  target_url: demoUrl,
                  cookies: [sess] // Pass the session object as a cookie source
              })
          });
          alert("⚡ GOD MODE: PROXY BROWSER LAUNCHED ON C2 SERVER");
      } catch (e) {
          console.error(e);
      }
  };

  // Safe color coding for OS
  const getOsColor = (os: string) => {
      if (os.includes("Windows")) return "text-blue-400";
      if (os.includes("Linux")) return "text-orange-400";
      return "text-zinc-500";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center font-mono">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Container */}
      <div className="relative w-full max-w-6xl h-[90vh] border border-red-500/30 bg-black/80 flex flex-col shadow-[0_0_100px_rgba(255,0,0,0.1)] rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-red-500/20 bg-gradient-to-r from-red-950/20 to-transparent">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                <Skull className="text-red-500" size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Forensic Warlord Deck</h2>
                <div className="text-[10px] text-red-500/60 font-bold">MODULE: SCAPY_AUTOPSY // VER: 6.6.6</div>
             </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">CLOSE [ESC]</button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Upload & Controls */}
          <div className="w-1/3 border-r border-red-500/10 p-8 flex flex-col gap-6 bg-zinc-950/50">
            
            {!report ? (
                <div className="flex-1 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-red-500/50 hover:bg-red-500/5 transition-all p-8 text-center group">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept=".pcap,.pcapng,.cap"
                    />
                    <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-red-500/20 transition-all">
                        <Upload className="text-zinc-500 group-hover:text-red-500" size={32} />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white mb-2">Drag PCAP Evidence</div>
                        <div className="text-xs text-zinc-500">Supported: .pcap, .pcapng, .cap</div>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-xs uppercase font-bold tracking-wider"
                    >
                        Browse Files
                    </button>
                    {file && (
                        <div className="mt-4 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs flex items-center gap-2">
                            <FileCode size={14} />
                            {file.name}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin"></div>
                    <div className="text-red-500 font-bold animate-pulse">ANALYSIS REPLAY LOOP ACTIVE</div>
                </div>
            )}

            <button 
                onClick={uploadPcap}
                disabled={!file || loading}
                className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all
                    ${loading ? 'bg-zinc-900 text-zinc-600' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'}
                `}
            >
                {loading ? 'RUNNING AUTOPSY...' : 'INITIATE ANALYSIS'}
            </button>
          
          </div>

          {/* Right Panel: Results Visualization */}
          <div className="flex-1 p-8 overflow-y-auto bg-black relative">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

            {report ? (
                <div className="space-y-8 relative z-10">
                    
                    {/* 1. TOP STATS */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Devices Found</div>
                            <div className="text-3xl font-black text-white">{report.device_count}</div>
                        </div>
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                            <div className="text-xs text-zinc-500 uppercase mb-1">Creds Stolen</div>
                            <div className="text-3xl font-black text-yellow-500">{report.credentials_found}</div>
                        </div>
                        <div className="p-4 bg-red-950/20 border border-red-500/40 rounded">
                            <div className="text-xs text-red-500 uppercase mb-1">Zombie Sessions</div>
                            <div className="text-3xl font-black text-red-500">{report.sessions_hijacked}</div>
                        </div>
                    </div>

                    {/* 2. ZOMBIE SESSIONS (ELITE 6TH POINT) */}
                    {report.sessions_hijacked > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-red-500">
                                <Crosshair size={18} />
                                <h3 className="font-bold tracking-widest">TEMPORAL RESURRECTION TARGETS</h3>
                            </div>
                            <div className="grid gap-3">
                                {report.details.zombie_sessions.map((sess: any, i: number) => (
                                    <div key={i} className="p-4 border border-red-500/30 bg-red-950/10 rounded flex justify-between items-center group hover:bg-red-950/20 transition-all">
                                        <div className="flex gap-4 items-start">
                                            <div className="p-2 bg-red-500/10 rounded text-red-500 mt-1">
                                                <Terminal size={20} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-red-400 font-bold mb-1">{sess.type} :: {sess.victim_ip}</div>
                                                <code className="text-[10px] text-zinc-400 block max-w-md truncate bg-black/50 p-1 rounded border border-white/5 font-mono">
                                                    {sess.token}
                                                </code>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => resurrectSession(sess)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse"
                                        >
                                            RESURRECT SESSION
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. CREDENTIALS */}
                    {report.credentials_found > 0 && (
                         <div>
                            <div className="flex items-center gap-2 mb-4 text-yellow-500">
                                <Key size={18} />
                                <h3 className="font-bold tracking-widest">DECRYPTED CREDENTIALS</h3>
                            </div>
                            <div className="grid gap-3">
                                {report.details.credentials.map((cred: any, i: number) => (
                                    <div key={i} className="p-4 border border-yellow-500/20 bg-yellow-950/10 rounded flex justify-between items-center">
                                         <div>
                                            <div className="text-xs text-zinc-500 mb-1">{cred.type} from {cred.src}</div>
                                            <div className="text-sm text-yellow-200 font-bold font-mono">{cred.data || cred.snippet}</div>
                                         </div>
                                         <ShieldAlert className="text-yellow-500/40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. PASSIVE FINGERPRINTS */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <Cpu size={18} />
                            <h3 className="font-bold tracking-widest">NETWORK TOPOLOGY MAP</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(report.details.devices).map((dev: any, i: number) => (
                                <div key={i} className="p-3 border border-zinc-800 bg-zinc-900/30 rounded flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${dev.os_guess === 'Windows' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{dev.ip}</div>
                                        <div className={`text-[10px] ${getOsColor(dev.os_guess)}`}>{dev.os_guess}</div>
                                        {dev.ja3_signatures.length > 0 && <div className="text-[9px] text-pink-500 mt-1">JA3: DETECTED</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
                    <Terminal size={64} className="mb-4 opacity-20" />
                    <div className="text-2xl font-black uppercase opacity-20 tracking-[1em]">NO_DATA</div>
                    <div className="text-xs uppercase opacity-30 mt-2">Waiting for Neural Dump...</div>
                </div>
            )}
          
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ForensicsPanel;
