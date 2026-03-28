# Red King BAS — Complete Modular Project
> Breach & Attack Simulation Platform v5.0 | Build 45 | Combat Ready

## Quick Start

```bash
npm create vite@latest red-king -- --template react
cd red-king
npm install framer-motion recharts lucide-react
# Replace src/ with the contents of this package
npm run dev
```

## Project Structure

```
src/
├── App.jsx                        # Root shell — state, routing, header, sidebar
├── components/
│   ├── CommandPalette.jsx         # Ctrl+K command palette (modal)
│   └── visuals.jsx                # Shared primitives: Badge, StatCard, NetworkMesh…
├── data/
│   └── redKingData.js             # All constants, agents, logs, MITRE, scores
├── sections/
│   ├── OperationsView.jsx         # Campaign overview, mesh, agent matrix, events
│   ├── TopologyView.jsx           # Full-width P2P mesh + encryption status
│   ├── EventsView.jsx             # Full-page live event stream
│   ├── IntelView.jsx              # MITRE ATT&CK coverage + technique cross-ref
│   └── DefenseView.jsx            # Score gauges + remediation queue + compliance
└── utils/
    └── helpers.js                 # cn(), isEditableElement()
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ + K` | Open command palette |
| `Ctrl/⌘ + B` | Toggle sidebar |
| `/` | Focus global search |
| `Esc` | Close palette |

## Dependencies

```json
{
  "framer-motion": "^11",
  "recharts": "^2",
  "lucide-react": "^0.383"
}
```

## Safety Note

All simulation data is synthetic. This is a defensive visualization platform.
No offensive capability, evasion logic, or harmful operational guidance is included.

---
*Red King BAS v5.0 · Build 45 · © 2025 Red King Security*
