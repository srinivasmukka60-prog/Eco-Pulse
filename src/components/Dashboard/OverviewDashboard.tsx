import React from 'react';
import { useWaste } from '../../context/WasteContext';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  Zap,
  MapPin,
  Clock,
  Radio,
} from 'lucide-react';
import { LiveWasteMap } from '../Map/LiveWasteMap';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const {
    metrics,
    bins,
    complaints,
    workers,
    routes,
    alerts,
    emptyBin,
    triggerSimulatedSpike,
    isSimulating,
  } = useWaste();

  const activeRoute = routes[0];
  const criticalBins = bins.filter((b) => b.fillLevel > 80);
  const unreadAlerts = alerts.filter((a) => !a.read);

  return (
    <div className="space-y-6">
      {/* Real-time Alert Ticker */}
      {unreadAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <strong className="text-white">{unreadAlerts[0].title}:</strong>
            <span>{unreadAlerts[0].message}</span>
          </div>
          <button
            onClick={() => onNavigate('bins')}
            className="text-rose-400 hover:text-white font-semibold text-xs shrink-0 underline"
          >
            Inspect Target →
          </button>
        </div>
      )}

      {/* Top Hero Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/50 rounded-2xl border border-emerald-800/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Leaf className="w-4 h-4" />
              <span>City of San Francisco · Smart Sanitation Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              EcoPulse Urban Waste Command
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              IoT sensor telemetry, AI waste composition neural audit, dynamic route heuristics,
              and community citizen grievance triage in one unified console.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('classifier')}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Waste Scanner</span>
            </button>

            <button
              onClick={() => onNavigate('routes')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Optimize Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Smart Bins */}
        <div
          onClick={() => onNavigate('bins')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Smart Bins</span>
            <Trash2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">{metrics.totalBins}</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{metrics.normalBins} normal</span>
            <span>·</span>
            <span className="text-amber-400 font-semibold">{metrics.nearlyFullBins} nearly full</span>
          </div>
        </div>

        {/* Card 2: Overflowing Bins */}
        <div
          onClick={() => onNavigate('bins')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-rose-900/50 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Overflow (&gt;80%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-400">{metrics.overflowingBins}</div>
          <div className="text-[11px] text-rose-300 font-medium">
            Immediate dispatch recommended
          </div>
        </div>

        {/* Card 3: Pending Citizen Grievances */}
        <div
          onClick={() => onNavigate('complaints')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Grievances</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400">{metrics.pendingComplaints}</div>
          <div className="text-[11px] text-slate-400">
            {metrics.resolvedComplaints} community issues resolved
          </div>
        </div>

        {/* Card 4: Diversion & Landfill Offset */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resource Efficiency</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-teal-300">
            {metrics.efficiencyRating}%
          </div>
          <div className="text-[11px] text-teal-400">
            ~{metrics.totalCO2SavedKg} kg net CO2 diverted
          </div>
        </div>
      </div>

      {/* Live Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Metropolitan Geographic Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive OpenStreetMap showing container fill gradients, citizen alert pins, and active compactor trucks.
            </p>
          </div>

          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Full Map Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <LiveWasteMap
          bins={bins}
          complaints={complaints}
          workers={workers}
          activeRoute={activeRoute}
          onEmptyBin={emptyBin}
        />
      </div>

      {/* Lower Dual Section: Critical Overflow Watchlist & Dynamic Route Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Critical Overflow Watchlist */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Critical Overflow Watchlist ({criticalBins.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('bins')}
              className="text-xs text-slate-400 hover:text-white"
            >
              View All Bins →
            </button>
          </div>

          <div className="space-y-3">
            {criticalBins.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 rounded-lg">
                All municipal containers are currently operating within safe thresholds (&lt;80%).
              </div>
            ) : (
              criticalBins.map((bin) => (
                <div
                  key={bin.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-rose-900/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300">{bin.id}</span>
                      <span className="font-semibold text-white text-xs">{bin.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{bin.location.address}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-rose-400">
                      {bin.fillLevel}%
                    </span>
                    <button
                      onClick={() => emptyBin(bin.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                    >
                      Empty
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Route Summary */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-400" />
              <span>Current Collection Circuit</span>
            </h3>
            <button
              onClick={() => onNavigate('routes')}
              className="text-xs text-teal-400 hover:text-teal-300"
            >
              Route Planner →
            </button>
          </div>

          {activeRoute ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{activeRoute.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Operator: {activeRoute.workerName} ({activeRoute.truckId})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    {activeRoute.estimatedDistanceKm} km
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeRoute.estimatedTimeMinutes} mins est.
                  </div>
                </div>
              </div>

              {/* Waypoints preview */}
              <div className="space-y-1.5 text-xs">
                {activeRoute.waypoints.slice(0, 3).map((wp) => (
                  <div
                    key={wp.order}
                    className="p-2 rounded bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500">#{wp.order}</span>
                      <span className="font-medium truncate max-w-xs">{wp.name}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400">
                      {wp.collected ? '✓ Cleared' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No route active. Click Route Planner to compute one.</p>
          )}
        </div>
      </div>
    </div>
  );
};
