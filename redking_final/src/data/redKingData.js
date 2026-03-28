export const THEME_PRESETS = {
  ember:  { name:"Ember",  accent:"#ef4444", accentSoft:"rgba(239,68,68,0.13)",  accentSoft2:"rgba(239,68,68,0.07)",  glow:"rgba(239,68,68,0.35)"  },
  violet: { name:"Violet", accent:"#8b5cf6", accentSoft:"rgba(139,92,246,0.13)", accentSoft2:"rgba(139,92,246,0.07)", glow:"rgba(139,92,246,0.35)" },
  mint:   { name:"Mint",   accent:"#22c55e", accentSoft:"rgba(34,197,94,0.13)",  accentSoft2:"rgba(34,197,94,0.07)",  glow:"rgba(34,197,94,0.35)"  },
};

export const STAT_DATA = [
  { title:"Active Agents",     value:"6",     delta:"+2",    icon:"Shield" },
  { title:"Techniques Run",    value:"38",    delta:"+14",   icon:"Zap"    },
  { title:"Bypassed Controls", value:"11",    delta:"+3",    icon:"Lock"   },
  { title:"MITRE Coverage",    value:"91.7%", delta:"+2.1%", icon:"Gauge"  },
];

export const AGENTS = [
  { id:"GH-001", name:"Ghost-Alpha",   status:"active",    target:"10.0.1.15",    technique:"T1055 · Process Injection",  progress:87,  risk:"critical" },
  { id:"GH-002", name:"Ghost-Beta",    status:"active",    target:"192.168.3.44", technique:"T1078 · Valid Accounts",      progress:62,  risk:"high"     },
  { id:"GH-003", name:"Ghost-Gamma",   status:"dormant",   target:"172.16.0.8",   technique:"T1021 · Remote Services",     progress:34,  risk:"medium"   },
  { id:"GH-004", name:"Ghost-Delta",   status:"active",    target:"10.0.2.99",    technique:"T1110 · Brute Force",         progress:95,  risk:"critical" },
  { id:"GH-005", name:"Ghost-Epsilon", status:"completed", target:"10.0.1.201",   technique:"T1003 · Credential Dump",     progress:100, risk:"critical" },
  { id:"GH-006", name:"Ghost-Zeta",    status:"dormant",   target:"192.168.1.12", technique:"T1059 · Command Exec",        progress:19,  risk:"low"      },
];

export const MESH_NODES = [
  { id:0, x:50, y:48, label:"Brain",   type:"server" },
  { id:1, x:18, y:18, label:"GH-001",  type:"agent"  },
  { id:2, x:82, y:14, label:"GH-002",  type:"agent"  },
  { id:3, x:12, y:76, label:"GH-003",  type:"agent"  },
  { id:4, x:87, y:72, label:"GH-004",  type:"agent"  },
  { id:5, x:50, y:88, label:"GH-005",  type:"agent"  },
  { id:6, x:36, y:26, label:"Relay-1", type:"relay"  },
  { id:7, x:68, y:76, label:"Relay-2", type:"relay"  },
];

export const MESH_EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
  [1,6],[2,6],[3,7],[4,7],[5,7],[6,7],[1,3],[2,4],
];

export const INITIAL_LOGS = [
  { id:1, level:"critical", source:"EDR",      text:"Ghost-Delta elevated to SYSTEM on 10.0.2.99 — EDR rule bypassed",          time:"14:32:01" },
  { id:2, level:"critical", source:"CREDS",    text:"Ghost-Epsilon completed credential harvest — 14 NTLM hashes captured",      time:"14:30:55" },
  { id:3, level:"warn",     source:"ENDPOINT", text:"EDR bypass confirmed on WIN-SRV-03 — behavioral detection not triggered",   time:"14:28:12" },
  { id:4, level:"info",     source:"MESH",     text:"Shadow Mesh P2P tunnel established — 3 relay nodes active, AES-256 keyed",  time:"14:25:44" },
  { id:5, level:"warn",     source:"LATERAL",  text:"Ghost-Beta authenticated via T1078 lateral movement to 192.168.3.44",       time:"14:22:33" },
  { id:6, level:"info",     source:"CAMPAIGN", text:"Simulation campaign OP-CRIMSON initiated — 6 agents deployed",             time:"14:19:07" },
];

export const LIVE_LOG_TEMPLATES = [
  { level:"critical", source:"EDR",      text:"Behavioral rule suppressed — agent traversed detection boundary undetected"   },
  { level:"warn",     source:"LATERAL",  text:"Lateral movement path discovered via SMB relay — propagating to next segment" },
  { level:"info",     source:"MESH",     text:"P2P relay heartbeat confirmed — tunnel integrity 100%"                        },
  { level:"warn",     source:"CREDS",    text:"LSASS memory read attempted — credential extraction in progress"              },
  { level:"info",     source:"CAMPAIGN", text:"MITRE technique mapping updated — new finding recorded in graph DB"           },
  { level:"critical", source:"PRIV-ESC", text:"Token impersonation succeeded — agent running as NT AUTHORITY\\SYSTEM"        },
  { level:"info",     source:"KEY-ROT",  text:"AES-256 channel key rotated — new key material derived, agents re-synced"    },
];

export const LOG_TABS = ["all", "critical", "warn", "info"];

export const ACTIVITY_DATA = [
  { time:"00:00", techniques:2,  detections:1 },
  { time:"02:00", techniques:4,  detections:2 },
  { time:"04:00", techniques:5,  detections:1 },
  { time:"06:00", techniques:9,  detections:3 },
  { time:"08:00", techniques:14, detections:4 },
  { time:"10:00", techniques:19, detections:5 },
  { time:"12:00", techniques:24, detections:4 },
  { time:"14:00", techniques:32, detections:6 },
  { time:"16:00", techniques:38, detections:7 },
];

export const MITRE_COVERAGE = [
  { tactic:"Initial Access",    covered:9,  total:9,  },
  { tactic:"Execution",         covered:12, total:14, },
  { tactic:"Persistence",       covered:17, total:19, },
  { tactic:"Priv. Escalation",  covered:13, total:13, },
  { tactic:"Defense Evasion",   covered:38, total:42, },
  { tactic:"Credential Access", covered:16, total:17, },
  { tactic:"Discovery",         covered:29, total:31, },
  { tactic:"Lateral Movement",  covered:9,  total:9,  },
  { tactic:"Collection",        covered:17, total:17, },
  { tactic:"Exfiltration",      covered:9,  total:9,  },
];

export const SCORES = {
  detection:  { value:23, label:"Controls detected simulation", color:"#ef4444" },
  prevention: { value:61, label:"Attacks actively blocked",     color:"#f59e0b" },
  resilience: { value:44, label:"Recovery posture index",       color:"#3b82f6" },
};

export const REMEDIATION = [
  { n:1, text:"Enable behavioral detection for T1055 Process Injection",  risk:"critical", effort:"2h" },
  { n:2, text:"Enforce MFA on all privileged service accounts",            risk:"critical", effort:"4h" },
  { n:3, text:"Restrict lateral movement via SMB signing enforcement",     risk:"high",     effort:"1h" },
  { n:4, text:"Deploy AD deception tokens for T1003 detection",            risk:"high",     effort:"6h" },
  { n:5, text:"Update EDR policy baseline for Rust-compiled binaries",     risk:"medium",   effort:"3h" },
];

export const NAV_ITEMS = [
  { label:"Operations", icon:"Activity", description:"Campaign overview & live agent matrix"   },
  { label:"Topology",   icon:"Server",   description:"Shadow Mesh P2P live network topology"  },
  { label:"Events",     icon:"Bell",     description:"Real-time security event stream"         },
  { label:"Intel DB",   icon:"Database", description:"MITRE ATT&CK technique coverage matrix" },
  { label:"Defense",    icon:"Shield",   description:"Scores, posture & remediation queue"    },
];

export const STORAGE_KEYS = {
  theme:   "red-king-theme",
  widgets: "red-king-widgets",
};
