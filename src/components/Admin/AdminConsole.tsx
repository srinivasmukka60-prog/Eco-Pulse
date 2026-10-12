import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { CitizenComplaint, CollectionWorker } from '../../types';
import {
  ShieldCheck,
  Users,
  Download,
  AlertTriangle,
  CheckCircle,
  Truck,
  FileSpreadsheet,
  Settings,
  UserCheck,
  Send,
  Search,
  Filter,
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const { complaints, workers, bins, routes, updateComplaintStatus, updateWorkerStatus } = useWaste();

  const [searchGrievance, setSearchGrievance] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [assignWorkerId, setAssignWorkerId] = useState<string>(workers[0]?.id || '');
  const [resolutionNote, setResolutionNote] = useState('');

  // CSV Export feature
  const exportMunicipalReportCSV = () => {
    const headers = ['Complaint_ID', 'Category', 'Severity', 'Status', 'Location', 'Upvotes', 'Assigned_Worker', 'Created_At'];
    const rows = complaints.map((c) => [
      c.id,
      c.category,
      c.severity,
      c.status,
      `"${c.location.address}"`,
      c.upvotes,
      `"${c.assignedWorkerName || 'Unassigned'}"`,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Municipal_Waste_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, 'Dispatched', assignWorkerId, resolutionNote);
    setSelectedComplaint(null);
    setResolutionNote('');
  };

  const handleMarkResolved = (complaintId: string) => {
    updateComplaintStatus(complaintId, 'Resolved', undefined, 'Direct municipal admin verification.');
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchGrievance.toLowerCase()) ||
      c.id.toLowerCase().includes(searchGrievance.toLowerCase()) ||
      c.location.address.toLowerCase().includes(searchGrievance.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Municipal Sanitation Directorate</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Operations & Crew Dispatch</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review community grievances, assign heavy compactor trucks, audit field crew progress, and export municipal compliance data.
          </p>
        </div>

        <button
          onClick={exportMunicipalReportCSV}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Municipal CSV Report</span>
        </button>
      </div>

      {/* Fleet & Crew Management Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Active Collection Fleet & Operators</span>
          </h3>
          <span className="text-xs text-slate-400">{workers.length} registered vehicles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <div key={worker.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{worker.name}</h4>
                  <div className="text-xs text-slate-400">{worker.vehicleNumber}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    worker.status === 'On Duty'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      : worker.status === 'In Transit'
                      ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {worker.status}
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Zone: <strong className="text-slate-300">{worker.zone}</strong></div>
                <div>Completed Stops: <strong className="text-emerald-400">{worker.completedTasksToday}</strong></div>
                <div>Contact: <span className="font-mono text-slate-400">{worker.phone}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => updateWorkerStatus(worker.id, worker.status === 'On Duty' ? 'In Transit' : 'On Duty')}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                >
                  Toggle Duty Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Grievance Triage Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Grievance Dispatch & Resolution Queue</span>
            </h3>
            <p className="text-xs text-slate-400">Assign open community reports to active collection vehicles.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchGrievance}
              onChange={(e) => setSearchGrievance(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Grievance</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Assigned Crew</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredComplaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-300 text-[11px]">{comp.id}</div>
                    <div className="font-semibold text-white max-w-xs truncate">{comp.title}</div>
                    <div className="text-[10px] text-slate-400">By {comp.citizenName} · {comp.upvotes} upvotes</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        comp.severity === 'Urgent'
                          ? 'text-rose-400'
                          : comp.severity === 'High'
                          ? 'text-orange-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {comp.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                    {comp.location.address}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {comp.assignedWorkerName ? (
                      <span className="text-blue-300 font-medium">{comp.assignedWorkerName}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        comp.status === 'Resolved'
                          ? 'bg-emerald-950/60 text-emerald-300'
                          : comp.status === 'Dispatched'
                          ? 'bg-blue-950/60 text-blue-300'
                          : 'bg-amber-950/60 text-amber-300'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    {comp.status !== 'Resolved' && (
                      <>
                        <button
                          onClick={() => setSelectedComplaint(comp)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                        >
                          Dispatch Crew
                        </button>
                        <button
                          onClick={() => handleMarkResolved(comp.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                        >
                          Mark Resolved
                        </button>
                      </>
                    )}
                    {comp.status === 'Resolved' && (
                      <span className="text-emerald-400 text-xs font-semibold">✓ Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignDispatch}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4"
          >
            <h3 className="text-base font-bold text-white">Dispatch Collection Crew</h3>
            <p className="text-xs text-slate-400">
              Assign complaint <strong className="text-white">{selectedComplaint.id}</strong> ({selectedComplaint.title}) to an on-duty truck.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Select Collection Worker & Vehicle</label>
                <select
                  value={assignWorkerId}
                  onChange={(e) => setAssignWorkerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.vehicleNumber} ({w.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Dispatch Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Priority collection: clearance required before school opening."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Confirm Dispatch
              </button>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
