import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Bell, ChevronRight, Command, Cpu, Database, Eye, LayoutGrid, Lock, Menu, MonitorCog, PanelLeftClose, Search, Server, Shield, Sparkles, X, Zap, Gauge, SlidersHorizontal } from 'lucide-react'
import { CommandPalette } from './components/CommandPalette'
import { Badge, ToggleRow } from './components/visuals'
import { AGENTS, INITIAL_LOGS, LIVE_LOG_TEMPLATES, NAV_ITEMS, STAT_DATA, STORAGE_KEYS, THEME_PRESETS } from './data/redKingData'
import { isEditableElement, cn } from './utils/helpers'
import { OperationsView } from './sections/OperationsView'
import { TopologyView } from './sections/TopologyView'
import { EventsView } from './sections/EventsView'
import { IntelView } from './sections/IntelView'
import { DefenseView } from './sections/DefenseView'

function iconByName(name) {
  return { Activity, Server, Bell, Database, Shield }[name] || Activity
}

function viewDescription(view) {
  return NAV_ITEMS.find((item) => item.label === view)?.description || ''
}

export default function RedKingHybridDashboard() {
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [globalQuery, setGlobalQuery] = useState('')
  const [logQuery, setLogQuery] = useState('')
  const [cmdQuery, setCmdQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedNav, setSelectedNav] = useState('Operations')
  const [themeKey, setThemeKey] = useState('ember')
  const [widgets, setWidgets] = useState({ stats: true, mesh: true, agents: true, logs: true, queue: true })
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }))

  const theme = THEME_PRESETS[themeKey] || THEME_PRESETS.ember
  const accent = theme.accent
  const chartId = useId()
  const searchRef = useRef(null)
  const logIdRef = useRef(INITIAL_LOGS.length + 1)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme)
      if (savedTheme && THEME_PRESETS[savedTheme]) setThemeKey(savedTheme)
      const savedWidgets = window.localStorage.getItem(STORAGE_KEYS.widgets)
      if (savedWidgets) {
        const parsed = JSON.parse(savedWidgets)
        if (parsed && typeof parsed === 'object') setWidgets((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, themeKey)
    } catch {
      // ignore
    }
  }, [themeKey])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.widgets, JSON.stringify(widgets))
    } catch {
      // ignore
    }
  }, [widgets])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false })
      const tpl = LIVE_LOG_TEMPLATES[Math.floor(Math.random() * LIVE_LOG_TEMPLATES.length)]
      setLogs((prev) => [{ id: logIdRef.current++, ...tpl, time: now }, ...prev].slice(0, 18))
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      const isCmd = e.ctrlKey || e.metaKey
      const editable = isEditableElement(e.target)

      if (isCmd && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen((v) => !v) }
      if (isCmd && e.key.toLowerCase() === 'b') { e.preventDefault(); setSidebarOpen((v) => !v) }
      if (e.key === 'Escape') setCmdOpen(false)
      if (!editable && e.key === '/' && !isCmd) {
        e.preventDefault()
        searchRef.current?.focus?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filteredAgents = useMemo(() => {
    const needle = globalQuery.trim().toLowerCase()
    if (!needle) return AGENTS
    return AGENTS.filter((agent) => `${agent.id} ${agent.name} ${agent.status} ${agent.target} ${agent.technique} ${agent.risk}`.toLowerCase().includes(needle))
  }, [globalQuery])

  const filteredLogs = useMemo(() => {
    const globalNeedle = globalQuery.trim().toLowerCase()
    const logNeedle = logQuery.trim().toLowerCase()
    return logs.filter((log) => {
      const matchTab = activeTab === 'all' || log.level === activeTab
      const blob = `${log.text} ${log.source} ${log.time}`.toLowerCase()
      const matchGlobalQuery = !globalNeedle || blob.includes(globalNeedle)
      const matchLogQuery = !logNeedle || blob.includes(logNeedle)
      return matchTab && matchGlobalQuery && matchLogQuery
    })
  }, [logs, activeTab, globalQuery, logQuery])

  const activeCount = AGENTS.filter((a) => a.status === 'active').length
  const currentView = selectedNav

  const commands = useMemo(() => ([
    { label: 'Toggle sidebar', hint: 'Ctrl+B', icon: Menu, run: () => setSidebarOpen((v) => !v) },
    { label: 'Focus search', hint: '/', icon: Search, run: () => searchRef.current?.focus?.() },
    { label: 'Switch to Ember theme', hint: 'Palette', icon: Sparkles, run: () => setThemeKey('ember') },
    { label: 'Switch to Violet theme', hint: 'Palette', icon: Sparkles, run: () => setThemeKey('violet') },
    { label: 'Switch to Mint theme', hint: 'Palette', icon: Sparkles, run: () => setThemeKey('mint') },
    { label: 'Toggle logs widget', hint: 'Widget', icon: Eye, run: () => setWidgets((v) => ({ ...v, logs: !v.logs })) },
    { label: 'Toggle mesh widget', hint: 'Widget', icon: LayoutGrid, run: () => setWidgets((v) => ({ ...v, mesh: !v.mesh })) },
    { label: 'Toggle agents table', hint: 'Widget', icon: MonitorCog, run: () => setWidgets((v) => ({ ...v, agents: !v.agents })) },
    ...NAV_ITEMS.map((item) => ({ label: `Open ${item.label}`, hint: 'Navigate', icon: iconByName(item.icon), run: () => setSelectedNav(item.label) })),
  ]), [])

  const viewNode = {
    Operations: (
      <OperationsView
        accent={accent}
        ready={ready}
        widgets={widgets}
        setWidgets={setWidgets}
        activeCount={activeCount}
        globalQuery={globalQuery}
        logQuery={logQuery}
        setLogQuery={setLogQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredAgents={filteredAgents}
        filteredLogs={filteredLogs}
      />
    ),
    Topology: <TopologyView accent={accent} ready={ready} />,
    Events: <EventsView accent={accent} ready={ready} filteredLogs={filteredLogs} activeTab={activeTab} setActiveTab={setActiveTab} logQuery={logQuery} setLogQuery={setLogQuery} />,
    'Intel DB': <IntelView accent={accent} filteredAgents={filteredAgents} />,
    Defense: <DefenseView accent={accent} />,
  }[currentView]

  return (
    <div
      className="min-h-screen overflow-hidden bg-[#04050a] text-gray-200"
      style={{
        backgroundImage: `
          radial-gradient(circle at top left, ${theme.accentSoft}, transparent 35%),
          radial-gradient(circle at bottom right, ${theme.accentSoft2}, transparent 30%)
        `,
      }}
    >
      <style>{`
        .rk-scrollbar::-webkit-scrollbar { width:4px; }
        .rk-scrollbar::-webkit-scrollbar-track  { background:transparent; }
        .rk-scrollbar::-webkit-scrollbar-thumb  { background:rgba(255,255,255,.1); border-radius:4px; }
      `}</style>

      <header className="relative z-20 border-b border-white/10 bg-[#06091280] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: accent, boxShadow: `0 0 24px ${theme.glow}` }}>
              <span style={{ fontSize: 16 }}>♛</span>
            </div>
            <div>
              <div className="rk-glitch text-xl font-black tracking-tighter text-white" data-text="Red King BAS">
                Red King <span style={{ color: accent }}>BAS</span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-gray-500">Breach & Attack Simulation · v5.0</div>
            </div>
          </div>

          <div className="hidden flex-1 px-6 lg:block">
            <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border bg-white/5 px-4 py-2.5" style={{ borderColor: `${accent}28` }}>
              <Search size={16} className="text-gray-500" />
              <input
                ref={searchRef}
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Search events, agents, techniques... (/)"
                aria-label="Search agents, techniques, and events"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
              <Badge tone="danger">LIVE SIM</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: accent }} />
              <span className="text-xs font-mono" style={{ color: accent }}>{activeCount} AGENTS ACTIVE</span>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
              <ClockIcon accent={accent} value={clock} />
            </div>
            <button onClick={() => setCmdOpen(true)} className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10 md:inline-flex">
              <Command size={16} /> Command palette
            </button>
            <button onClick={() => setSidebarOpen((v) => !v)} className="hidden h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition md:inline-flex" style={{ borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}10` }}>
              <PanelLeftClose size={16} />
              {sidebarOpen ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1760px] gap-6 px-4 py-5 md:px-6 lg:gap-5">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-[290px] border-r border-white/10 bg-[#060913f5] p-4 backdrop-blur-2xl lg:static lg:z-auto lg:block lg:w-auto lg:bg-transparent lg:p-0"
            >
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <span className="text-sm font-semibold text-white">Navigation</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white">
                  <PanelLeftClose size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-xs font-mono uppercase tracking-[0.22em]" style={{ color: accent }}>Campaign Status</div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">OP-CRIMSON</div>
                      <div className="text-xs text-gray-500">Build 45 · Combat Ready</div>
                    </div>
                    <div className="rounded-2xl border p-3" style={{ borderColor: `${accent}35`, backgroundColor: `${accent}12` }}>
                      <Cpu size={18} style={{ color: accent }} />
                    </div>
                  </div>
                </div>

                <nav className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = iconByName(item.icon)
                    const active = selectedNav === item.label
                    return (
                      <button
                        key={item.label}
                        onClick={() => setSelectedNav(item.label)}
                        className={cn('mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition last:mb-0', active ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white')}
                        style={active ? { borderLeft: `2px solid ${accent}` } : undefined}
                      >
                        <Icon size={16} style={{ color: active ? accent : '#6b7280' }} />
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight size={16} style={{ color: accent }} />}
                      </button>
                    )
                  })}
                </nav>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-4">
                    <div className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">Command</div>
                    <h3 className="mt-1 text-lg font-bold text-white">Quick actions</h3>
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => setCmdOpen(true)} className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-white transition hover:opacity-80" style={{ borderColor: `${accent}35`, backgroundColor: `${accent}12` }}>
                      Open command palette <Zap size={16} style={{ color: accent }} />
                    </button>
                    <button onClick={() => setWidgets((v) => ({ ...v, logs: !v.logs }))} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                      Toggle events feed <MonitorCog size={16} style={{ color: accent }} />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-4">
                    <div className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">Layout</div>
                    <h3 className="mt-1 text-lg font-bold text-white">Widget visibility</h3>
                  </div>
                  <div className="space-y-2">
                    <ToggleRow label="Stats row" enabled={widgets.stats} onToggle={() => setWidgets((v) => ({ ...v, stats: !v.stats }))} icon={SlidersHorizontal} accent={accent} />
                    <ToggleRow label="Shadow Mesh" enabled={widgets.mesh} onToggle={() => setWidgets((v) => ({ ...v, mesh: !v.mesh }))} icon={LayoutGrid} accent={accent} />
                    <ToggleRow label="Agent matrix" enabled={widgets.agents} onToggle={() => setWidgets((v) => ({ ...v, agents: !v.agents }))} icon={Activity} accent={accent} />
                    <ToggleRow label="Events feed" enabled={widgets.logs} onToggle={() => setWidgets((v) => ({ ...v, logs: !v.logs }))} icon={Eye} accent={accent} />
                    <ToggleRow label="Queue panel" enabled={widgets.queue} onToggle={() => setWidgets((v) => ({ ...v, queue: !v.queue }))} icon={Database} accent={accent} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-4">
                    <div className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">Theme</div>
                    <h3 className="mt-1 text-lg font-bold text-white">Preset palette</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(THEME_PRESETS).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setThemeKey(key)}
                        className="rounded-xl border px-3 py-3 text-center text-xs font-semibold transition hover:bg-white/5"
                        style={themeKey === key ? { borderColor: item.accent, backgroundColor: `${item.accent}18`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
                      >
                        <div className="mx-auto mb-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.accent, boxShadow: `0 0 12px ${item.glow}` }} />
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-gray-500">{selectedNav}</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white">{viewDescription(selectedNav)}</h1>
              </div>
              <div className="flex items-center gap-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSelectedNav(item.label)}
                    className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold transition', selectedNav === item.label ? 'text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:text-white')}
                    style={selectedNav === item.label ? { borderColor: accent, backgroundColor: `${accent}18` } : undefined}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNav}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              {viewNode}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} accent={accent} query={cmdQuery} setQuery={setCmdQuery} commands={commands} />

      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/55 lg:hidden" aria-label="Close sidebar" />
      )}

      <footer className="border-t border-white/[0.06] px-6 py-3 text-center">
        <span className="text-xs font-mono text-gray-700">
          RED KING BAS v5.0 · Build 45 · Combat Ready · <span style={{ color: accent }}>OP-CRIMSON ACTIVE</span>
        </span>
      </footer>
    </div>
  )
}

function ClockIcon({ accent, value }) {
  return (
    <span className="font-mono text-xs" style={{ color: accent }}>
      {value}
    </span>
  )
}
