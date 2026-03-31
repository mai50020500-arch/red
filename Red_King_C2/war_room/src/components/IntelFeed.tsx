import { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, Target, Zap, Brain } from 'lucide-react';

interface TargetData {
    file: string;
    ip: string;
    dna: string;
}

interface AIResult {
    device_type: string;
    threat_level: string;
    attack_vector: string;
}

const IntelFeed = () => {
    const [targets, setTargets] = useState<TargetData[]>([]);
    const [loading, setLoading] = useState(true);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [reconStatus, setReconStatus] = useState<{ [key: string]: string }>({});
    const [aiResults, setAiResults] = useState<{ [key: string]: AIResult | null }>({});
    const [analyzing, setAnalyzing] = useState<{ [key: string]: boolean }>({});
    const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});

    // Poll for DNA Map (Targets)
    useEffect(() => {
        const fetchTargets = async () => {
            try {
                const res = await fetch('/api/dna_map');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTargets(data);
                }
            } catch (err) {
                console.error("Failed to fetch targets:", err);
            } finally {
                setLoading(false);
            }
        };

        const interval = setInterval(fetchTargets, 5000);
        fetchTargets(); // Initial fetch
        return () => clearInterval(interval);
    }, []);

    const triggerGhostRecon = async (ip: string) => {
        setReconStatus(prev => ({ ...prev, [ip]: 'SCANNING...' }));
        try {
            const res = await fetch('/api/ghost_recon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip })
            });
            const data = await res.json();
            if (data.status === 'SUCCESS') {
                setReconStatus(prev => ({ ...prev, [ip]: `[TITLE]: ${data.title}` }));
            } else {
                setReconStatus(prev => ({ ...prev, [ip]: 'FAILED' }));
            }
        } catch (err) {
            setReconStatus(prev => ({ ...prev, [ip]: 'ERROR' }));
        }
    };

    const triggerAIAssessment = async (target: TargetData) => {
        const now = Date.now();
        const lastRun = cooldowns[target.ip] || 0;

        if (now - lastRun < 60000) {
            alert(`Please wait ${Math.ceil((60000 - (now - lastRun)) / 1000)}s before rescanning.`);
            return;
        }

        setAnalyzing(prev => ({ ...prev, [target.ip]: true }));
        try {
            // Get title from recon status if available, otherwise just use IP
            const reconTitle = reconStatus[target.ip] || "Unknown";

            const res = await fetch('/api/ai_assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dna: target.dna,
                    title: reconTitle
                })
            });
            const data = await res.json();
            setAiResults(prev => ({ ...prev, [target.ip]: data }));
            setCooldowns(prev => ({ ...prev, [target.ip]: Date.now() }));
        } catch (err) {
            console.error("AI Analysis Failed:", err);
        } finally {
            setAnalyzing(prev => ({ ...prev, [target.ip]: false }));
        }
    };

    return (
        <div className="h-full bg-black/40 backdrop-blur-md border-l border-red-500/30 p-4 font-mono text-[10px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-2">
                <div className="flex items-center gap-2">
                    <span className="text-red-500 animate-pulse">●</span>
                    <h3 className="text-red-500 font-bold uppercase tracking-widest">Live Target Feed</h3>
                </div>
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-red-500 hover:text-white transition-colors">
                    {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} className="opacity-50" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {/* User's Requested Safety Check & Rendering Logic */}
                {targets && targets.length > 0 ? (
                    targets.map((target, index) => (
                        <div key={index} className="border-l border-white/10 pl-3 py-1 hover:bg-white/5 transition-colors group flex flex-col gap-1">
                            <div className="flex items-center justify-between text-red-400 font-bold">
                                <span className="flex items-center gap-1"><Target size={10} /> [DETECTED] {target.ip}</span>
                                <span className="text-zinc-600 text-[8px]">{target.file}</span>
                            </div>
                            <div className="text-zinc-400 group-hover:text-white truncate">
                                🧬 DNA: {target.dna}
                            </div>

                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <button
                                    onClick={() => triggerGhostRecon(target.ip)}
                                    className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/30 px-2 py-0.5 rounded text-[8px] transition-all"
                                >
                                    <Zap size={8} /> GHOST RECON
                                </button>

                                <button
                                    onClick={() => triggerAIAssessment(target)}
                                    disabled={cooldowns[target.ip] !== undefined && Date.now() - cooldowns[target.ip] < 60000}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] transition-all border ${cooldowns[target.ip] !== undefined && Date.now() - cooldowns[target.ip] < 60000
                                            ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                                            : 'bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-400 border-blue-500/30'
                                        }`}
                                >
                                    {analyzing[target.ip] ? (
                                        <Radio size={8} className="animate-spin" />
                                    ) : (
                                        <Brain size={8} />
                                    )}
                                    AI ASSESS
                                </button>

                                {reconStatus[target.ip] && (
                                    <span className="text-[8px] text-yellow-400 animate-pulse truncate max-w-[150px]">
                                        {reconStatus[target.ip]}
                                    </span>
                                )}
                            </div>

                            {/* AI Results Display */}
                            {aiResults[target.ip] && (
                                <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-[9px] space-y-1 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between font-bold text-blue-300">
                                        <span>DEVICE: {aiResults[target.ip]?.device_type}</span>
                                        <span className={aiResults[target.ip]?.threat_level === 'High' ? 'text-red-500' : 'text-yellow-500'}>
                                            THREAT: {aiResults[target.ip]?.threat_level}
                                        </span>
                                    </div>
                                    <div className="text-zinc-400">
                                        VECTOR: <span className="text-white">{aiResults[target.ip]?.attack_vector}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="animate-pulse text-gray-500 flex items-center gap-2 mt-4">
                        <Radio size={14} className="animate-spin" />
                        INITIATING DATA STREAM...
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-red-500/20 text-[8px] text-red-500/50 uppercase">
                System: Red King C2 | Encrypted Tunnel: Active
            </div>
        </div>
    );
};

export default IntelFeed;
