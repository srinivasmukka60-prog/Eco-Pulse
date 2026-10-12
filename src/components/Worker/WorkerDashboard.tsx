import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  Navigation,
  AlertTriangle,
  PlayCircle,
  FileCheck,
  RotateCcw,
} from 'lucide-react';

export const WorkerDashboard: React.FC<{ onInspectOnMap?: () => void }> = ({ onInspectOnMap }) => {
  const {
    currentUser,
    routes,
    workers,
    complaints,
    markWaypointCollected,
    updateWorkerStatus,
    updateComplaintStatus,
  } = useWaste();

  const workerInfo =
    workers.find((w) => w.id === currentUser.workerDetails?.workerId) || workers[0];

  const assignedRoute =
    routes.find((r) => r.workerId === workerInfo.id && r.status !== 'Completed') || routes[0];

  const [wasteWeightInput, setWasteWeightInput] = useState<{ [order: number]: number }>({});
  const [resolutionNoteInput, setResolutionNoteInput] = useState<{ [compId: string]: string }>({});

  const handleCollectWaypoint = (order: number, targetType: string, targetId: string) => {
    const weight = wasteWeightInput[order] || 45;
    markWaypointCollected(assignedRoute.id, order, weight);
  };

  const handleResolveComplaintDirectly = (complaintId: string) => {
    const note = resolutionNoteInput[complaintId] || 'Waste cleared by collection worker on-site.';
    updateComplaintStatus(complaintId, 'Resolved', workerInfo.id, note);
  };

  // Remaining waypoints count
  const pendingStops = assignedRoute?.waypoints.filter((w) => !w.collected) || [];

  return (
    <div className="space-y-6">
      {/* Worker Status & Vehicle Card */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 rounded-2xl border border-blue-800/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-0.5">
                <span>Field Operator Console</span>
                <span aria-hidden="true">·</span>
                <span>{workerInfo.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{workerInfo.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vehicle: <strong className="text-slate-200">{workerInfo.vehicleNumber}</strong> · Zone: {workerInfo.zone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Collections</div>
              <div className="text-xl font-bold text-emerald-400">{workerInfo.completedTasksToday} stops</div>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => updateWorkerStatus(workerInfo.id, 'On Duty')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workerInfo.status === 'On Duty'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                On Duty
              </button>
              <button
                onClick={() => updateWorkerStatus(workerInfo.id, 'In Transit')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workerInfo.status === 'In Transit'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In Transit
              </button>
              <button
                onClick={() => updateWorkerStatus(workerInfo.id, 'Off Duty')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  workerInfo.status === 'Off Duty'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Off Duty
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Route Waypoints Checklist */}
      {assignedRoute ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold">{assignedRoute.id}</span>
              <h3 className="text-lg font-bold text-white">{assignedRoute.name}</h3>
              <p className="text-xs text-slate-400">
                {assignedRoute.estimatedDistanceKm} km total · {pendingStops.length} of {assignedRoute.waypoints.length} stops remaining
              </p>
            </div>

            {onInspectOnMap && (
              <button
                onClick={onInspectOnMap}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Navigate on Live Map</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {assignedRoute.waypoints.map((wp) => {
              const isCollected = wp.collected;
              const isDepot = wp.type === 'depot';

              return (
                <div
                  key={wp.order}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isCollected
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-70'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                        isCollected
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {isCollected ? '✓' : wp.order}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{wp.name}</h4>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          [{wp.type}]
                        </span>
                        {wp.fillLevel !== undefined && (
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {wp.fillLevel}% Fill
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{wp.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isCollected ? (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Collected ({wp.wasteCollectedKg || 45} kg logged)</span>
                      </div>
                    ) : isDepot ? (
                      <span className="text-xs text-slate-500">Depot Hub Base</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                          <Scale className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="number"
                            placeholder="45"
                            value={wasteWeightInput[wp.order] || ''}
                            onChange={(e) =>
                              setWasteWeightInput({
                                ...wasteWeightInput,
                                [wp.order]: Number(e.target.value),
                              })
                            }
                            className="w-14 bg-transparent text-xs text-white font-mono focus:outline-none"
                          />
                          <span className="text-[11px] text-slate-400">kg</span>
                        </div>

                        <button
                          onClick={() => handleCollectWaypoint(wp.order, wp.type, wp.targetId)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete & Log Waste</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <Truck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">All Active Stops Completed!</h3>
          <p className="text-xs text-slate-400 mt-1">Awaiting dispatch of next dynamic collection loop.</p>
        </div>
      )}

      {/* Assigned Citizen Complaint Queue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Assigned Citizen Grievances For Investigation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints
            .filter((c) => c.status !== 'Resolved')
            .slice(0, 4)
            .map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-400 font-bold">{comp.id}</span>
                    <span className="text-rose-400 font-semibold">{comp.severity} Priority</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{comp.title}</h4>
                  <p className="text-xs text-slate-400">{comp.location.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Reported by {comp.citizenName}</span>
                  <button
                    onClick={() => handleResolveComplaintDirectly(comp.id)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
