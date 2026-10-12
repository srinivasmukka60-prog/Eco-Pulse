import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { CollectionRoute, CollectionWorker } from '../../types';
import {
  Route,
  Navigation,
  Fuel,
  Clock,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Send,
} from 'lucide-react';

export const RouteOptimizer: React.FC<{ onInspectOnMap?: () => void }> = ({ onInspectOnMap }) => {
  const { routes, workers, bins, complaints, generateOptimizedRoute, markWaypointCollected } = useWaste();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'WRK-01');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleGenerateRoute = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newRoute = generateOptimizedRoute(selectedWorkerId);
      setSelectedRouteId(newRoute.id);
      setIsGenerating(false);
      setSuccessToast(`Optimized Route ${newRoute.name} successfully computed!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const overflowingCount = bins.filter((b) => b.fillLevel > 80).length;
  const urgentComplaintsCount = complaints.filter(
    (c) => c.status !== 'Resolved' && (c.severity === 'Urgent' || c.severity === 'High')
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-emerald-950/60 rounded-2xl border border-teal-800/30 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Dynamic Traveling Salesperson Heuristic (TSP)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Smart Collection Route Optimization</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Traditional fixed garbage routes waste up to 40% fuel visiting empty bins. Our AI route engine
              dynamically clusters overflowing containers and high-severity citizen hotspots into minimal-distance paths.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  Assign to: {w.name} ({w.vehicleNumber})
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateRoute}
              disabled={isGenerating}
              className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Computing Shortest Path...' : 'Recalculate Dynamic Route'}</span>
            </button>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          {onInspectOnMap && (
            <button
              onClick={onInspectOnMap}
              className="underline text-emerald-200 hover:text-white font-semibold"
            >
              View on Live Map →
            </button>
          )}
        </div>
      )}

      {/* KPI Comparison: Dynamic AI Route vs Traditional Fixed Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Estimated Distance</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {activeRoute ? `${activeRoute.estimatedDistanceKm} km` : '8.6 km'}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-52% distance vs fixed route (17.9 km)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Fuel & Emissions Saved</span>
            <Fuel className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300">
            {activeRoute ? `${activeRoute.estimatedFuelSavedPercent}%` : '34%'}
          </div>
          <div className="text-[11px] text-teal-400 font-medium mt-1">
            ~12.4 Liters diesel saved per shift
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Estimated Turnaround</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {activeRoute ? `${activeRoute.estimatedTimeMinutes} mins` : '45 mins'}
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            Standard turnaround: 110 mins
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Critical Target Backlog</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {overflowingCount + urgentComplaintsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {overflowingCount} full bins · {urgentComplaintsCount} complaints
          </div>
        </div>
      </div>

      {/* Route Waypoints & Dispatch Section */}
      {activeRoute ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-mono text-emerald-400 font-bold">{activeRoute.id}</span>
                <span aria-hidden="true">·</span>
                <span>Assigned: {activeRoute.workerName}</span>
                <span aria-hidden="true">·</span>
                <span>{activeRoute.truckId}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{activeRoute.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                  activeRoute.status === 'Completed'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                    : 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                }`}
              >
                {activeRoute.status} ({activeRoute.waypoints.filter((w) => w.collected).length}/
                {activeRoute.waypoints.length} Stops Cleared)
              </span>
            </div>
          </div>

          {/* Turn-by-Turn Waypoint Sequence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Waypoint Navigation Sequence
            </h4>

            <div className="space-y-2.5">
              {activeRoute.waypoints.map((wp) => {
                const isDepot = wp.type === 'depot';
                const isCritical = wp.urgency === 'Critical';

                return (
                  <div
                    key={wp.order}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      wp.collected
                        ? 'bg-slate-950/50 border-slate-800/60 opacity-80'
                        : isCritical
                        ? 'bg-rose-950/20 border-rose-800/40'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                          wp.collected
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : isDepot
                            ? 'bg-slate-800 text-slate-300'
                            : isCritical
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {wp.collected ? '✓' : wp.order}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{wp.name}</h5>
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            [{wp.type}]
                          </span>
                          {wp.fillLevel !== undefined && (
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {wp.fillLevel}% Fill
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{wp.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {wp.collected ? (
                        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared {wp.collectedAt}</span>
                        </span>
                      ) : isDepot ? (
                        <span className="text-xs text-slate-400">Depot Hub</span>
                      ) : (
                        <button
                          onClick={() => markWaypointCollected(activeRoute.id, wp.order, 52)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                        >
                          Mark Collected
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <Truck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No route generated yet. Click above to compute dynamic route.</p>
        </div>
      )}
    </div>
  );
};
