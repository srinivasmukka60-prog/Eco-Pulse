import React from 'react';
import { useWaste } from '../../context/WasteContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  Leaf,
  Fuel,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AnalyticsReports: React.FC = () => {
  const { metrics, bins, complaints } = useWaste();

  // Weekly collection data (kg)
  const weeklyTrend = [
    { day: 'Mon', organic: 340, recyclable: 480, general: 210 },
    { day: 'Tue', organic: 390, recyclable: 510, general: 240 },
    { day: 'Wed', organic: 310, recyclable: 460, general: 190 },
    { day: 'Thu', organic: 450, recyclable: 590, general: 280 },
    { day: 'Fri', organic: 520, recyclable: 640, general: 320 },
    { day: 'Sat', organic: 610, recyclable: 720, general: 380 },
    { day: 'Sun', organic: 480, recyclable: 610, general: 260 },
  ];

  // Material composition percentages
  const composition = [
    { label: 'Recyclable Plastics', percent: 34, color: 'bg-blue-500', text: 'text-blue-400' },
    { label: 'Organic & Food Scraps', percent: 29, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Paper & Cardboard', percent: 18, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Glassware & Jars', percent: 12, color: 'bg-cyan-500', text: 'text-cyan-400' },
    { label: 'Scrap Metal & Cans', percent: 7, color: 'bg-indigo-500', text: 'text-indigo-400' },
  ];

  // Neighborhood hot spot activity
  const neighborhoodRankings = [
    { zone: 'Zone A - Downtown Commercial', reports: 28, resolvedPercent: 92, avgResponse: '1.8 hrs' },
    { zone: 'Zone C - Mission District', reports: 22, resolvedPercent: 86, avgResponse: '2.4 hrs' },
    { zone: 'Zone B - Civic Center', reports: 19, resolvedPercent: 89, avgResponse: '2.1 hrs' },
    { zone: 'Zone E - Waterfront & Tourist', reports: 14, resolvedPercent: 95, avgResponse: '1.4 hrs' },
    { zone: 'Zone D - SOMA Tech Corridor', reports: 11, resolvedPercent: 98, avgResponse: '1.2 hrs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Municipal Data Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Waste Analytics & ESG Performance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring citywide diversion rates, turnaround velocity, and carbon abatement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Reporting Window: Last 7 Days</span>
        </div>
      </div>

      {/* High Level Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Waste Diverted</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {(metrics.totalWasteCollectedKg / 1000).toFixed(2)} Tonnes
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            +18.4% diversion vs baseline
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Net CO2 Prevented</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300">
            {metrics.totalCO2SavedKg} kg
          </div>
          <div className="text-[11px] text-teal-400 mt-1">
            Calculated via EPA WARM model
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Grievance Turnaround</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            1.9 Hours
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            -78% faster than manual inspection
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Collection Efficiency</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {metrics.efficiencyRating}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Optimal resource allocation score
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Bar Graph */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Daily Waste Collection Volume (kg)</span>
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                <span>Recyclables</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>Organics</span>
              </div>
            </div>
          </div>

          <div className="h-56 pt-6 flex items-end justify-between gap-3 border-b border-slate-800 pb-2">
            {weeklyTrend.map((item, idx) => {
              const maxVal = 1400;
              const recHeight = (item.recyclable / maxVal) * 100;
              const orgHeight = (item.organic / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-1/2 bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                      style={{ height: `${recHeight}%` }}
                      title={`${item.day} Recyclables: ${item.recyclable} kg`}
                    />
                    <div
                      className="w-1/2 bg-emerald-500 rounded-t transition-all hover:bg-emerald-400"
                      style={{ height: `${orgHeight}%` }}
                      title={`${item.day} Organics: ${item.organic} kg`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 pt-1">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Peak collection days occur on Friday & Saturday due to commercial weekend surges.
          </div>
        </div>

        {/* Waste Stream Breakdown */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-400" />
            <span>Waste Stream Composition</span>
          </h3>

          <div className="space-y-3 pt-2">
            {composition.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{comp.label}</span>
                  <span className={`font-mono font-bold ${comp.text}`}>{comp.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${comp.color}`} style={{ width: `${comp.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
            <span className="text-emerald-400 font-semibold">63% of municipal waste</span> is currently sorted into dry recyclables or organic compost rather than landfill.
          </div>
        </div>
      </div>

      {/* Neighborhood Heat Ranking Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Frequently Affected Zones & Response Times</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Municipal Zone</th>
                <th className="py-2.5 px-3">Grievances Logged</th>
                <th className="py-2.5 px-3">Resolution Rate</th>
                <th className="py-2.5 px-3">Avg Clearance Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {neighborhoodRankings.map((n, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-white">{n.zone}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{n.reports} reports</td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-400 font-semibold">{n.resolvedPercent}%</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{n.avgResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
