import React from 'react';
import { useWaste } from '../../context/WasteContext';
import {
  Bell,
  Check,
  Trash2,
  AlertTriangle,
  Info,
  Clock,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTarget?: (targetId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ isOpen, onClose, onSelectTarget }) => {
  const { alerts, markAlertRead, dismissAlert, clearAllAlerts } = useWaste();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <Bell className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">System Alerts & Incidents</h3>
                <span className="text-[11px] text-slate-400">
                  {alerts.filter((a) => !a.read).length} unread incidents
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAllAlerts}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear all alerts"
              >
                Clear All
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active notifications or critical container warnings.
              </div>
            ) : (
              alerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isWarning = alert.severity === 'warning';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      alert.read
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : isCritical
                        ? 'bg-rose-950/20 border-rose-800/40'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-800/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        {isCritical ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                        <h4 className="font-bold text-white text-xs">{alert.title}</h4>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-5 mb-2">{alert.message}</p>

                    <div className="flex items-center justify-between pl-5 text-[11px]">
                      {alert.targetId && onSelectTarget && (
                        <button
                          onClick={() => {
                            onSelectTarget(alert.targetId!);
                            onClose();
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Inspect Target</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        {!alert.read && (
                          <button
                            onClick={() => markAlertRead(alert.id)}
                            className="text-slate-400 hover:text-white"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-slate-500 hover:text-rose-400"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          EcoPulse IoT Alert Engine v2.4 · Auto-sync enabled
        </div>
      </div>
    </div>
  );
};
