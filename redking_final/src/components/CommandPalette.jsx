import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Command, Search, X } from "lucide-react";

export function CommandPalette({
  open,
  onClose,
  accent,
  query,
  setQuery,
  commands,
}) {
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#06091a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Command size={16} style={{ color: accent }} />
                <span className="text-sm font-semibold text-white">Command palette</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white"
              >
                <X size={15} />
              </button>
            </div>
            <div className="p-4">
              <div
                className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                style={{ borderColor: `${accent}25` }}
              >
                <Search size={16} className="text-gray-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
                />
              </div>
              <div className="max-h-[420px] space-y-2 overflow-y-auto rk-scrollbar">
                {filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      onClick={() => {
                        cmd.run();
                        onClose();
                        setQuery("");
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl border bg-white/5"
                          style={{ borderColor: `${accent}28` }}
                        >
                          <Icon size={16} style={{ color: accent }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{cmd.label}</div>
                          <div className="text-xs text-gray-500">{cmd.hint}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  );
                })}
                {filteredCommands.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-gray-500">
                    No commands matched.
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <span className="text-white">Ctrl/⌘+K</span> palette ·{" "}
                <span className="text-white">Ctrl/⌘+B</span> sidebar ·{" "}
                <span className="text-white">/</span> search
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
