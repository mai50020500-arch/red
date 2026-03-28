import React, { useEffect } from 'react';
import { useAlerts } from '../alerts/AlertContext';
import { AlertCircle, Info, ShieldAlert, Terminal } from 'lucide-react';
import { Alert } from '../alerts/alert.types';
import { fetchIntel } from '../alerts/ops';

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-600 bg-red-950/20 text-red-500';
      case 'warning':
        return 'border-orange-500 bg-orange-950/20 text-orange-400';
      default:
        return 'border-blue-500/30 bg-blue-950/10 text-blue-400';
    }
  };

  const getIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <div className={`p-3 mb-2 border-l-4 rounded-r bg-zinc-900/40 backdrop-blur-sm transition-all hover:translate-x-1 ${getSeverityStyles(alert.severity)}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon(alert.severity)}</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-tighter bg-current/10 px-1 rounded">
              {alert.severity}
            </span>
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {alert.message}
          </p>
        </div>
      </div>
    </div>
  );
};

const AlertPanel: React.FC = () => {
  const { alerts, addAlerts } = useAlerts();

  useEffect(() => {
    const poll = async () => {
      const newAlerts = await fetchIntel();
      if (newAlerts.length > 0) {
        addAlerts(newAlerts);
      }
    };

    const interval = setInterval(poll, 3000);
    poll();
    return () => clearInterval(interval);
  }, [addAlerts]);

  const simulateAlert = () => {
    const types: Alert['severity'][] = ['info', 'warning', 'critical'];
    const randType = types[Math.floor(Math.random() * types.length)];
    addAlerts([{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message: `SIMULATED ALERT: ${randType.toUpperCase()} EVENT DETECTED ON NODE ${Math.floor(Math.random() * 255)}`,
      severity: randType
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="px-4 py-3 border-b border-red-500/20 flex justify-between items-center bg-red-500/5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-red-500" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
            Live Intelligence Alerts
          </h2>
        </div>
        <div className="flex gap-2">
            <button 
            onClick={simulateAlert}
            className="text-[9px] font-bold hover:text-red-400 transition-colors uppercase tracking-widest"
            >
            [ Sim ]
            </button>
            <span className="text-zinc-800">|</span>
            <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] text-green-500/60 uppercase font-bold">Live</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 filter grayscale">
            <ShieldAlert size={48} className="mb-4" />
            <p className="text-[10px] uppercase tracking-widest font-bold">No active threats</p>
          </div>
        ) : (
          alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)
        )}
      </div>

      <div className="px-4 py-2 border-t border-red-500/10 bg-black/60">
        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-zinc-600">
          <span>Active Nodes: 53</span>
          <span>Buffer: {alerts.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;
