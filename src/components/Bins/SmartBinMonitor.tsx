import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { SmartBin, BinType, BinStatus } from '../../types';
import {
  Trash2,
  Search,
  Filter,
  Plus,
  Zap,
  Battery,
  Thermometer,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  X,
  Radio,
} from 'lucide-react';

export const SmartBinMonitor: React.FC = () => {
  const {
    bins,
    emptyBin,
    updateBinFill,
    addNewBin,
    triggerSimulatedSpike,
    isSimulating,
    setIsSimulating,
  } = useWaste();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BinStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | BinType>('all');
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New bin form state
  const [newBinName, setNewBinName] = useState('');
  const [newBinType, setNewBinType] = useState<BinType>('Plastic');
  const [newBinAddress, setNewBinAddress] = useState('');
  const [newBinZone, setNewBinZone] = useState('Zone A - Commercial');
  const [newBinCapacity, setNewBinCapacity] = useState(660);
  const [newBinFill, setNewBinFill] = useState(30);

  // Filter logic
  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
    const matchesType = typeFilter === 'all' || bin.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinName || !newBinAddress) return;

    addNewBin({
      name: newBinName,
      type: newBinType,
      capacityLiters: Number(newBinCapacity),
      fillLevel: Number(newBinFill),
      battery: 95,
      temperature: 22.4,
      location: {
        lat: 37.775 + (Math.random() - 0.5) * 0.03,
        lng: -122.418 + (Math.random() - 0.5) * 0.03,
        address: newBinAddress,
        zone: newBinZone,
      },
      lastCollected: 'Just deployed',
    });

    setIsAddModalOpen(false);
    setNewBinName('');
    setNewBinAddress('');
  };

  const getStatusBadge = (status: BinStatus) => {
    switch (status) {
      case 'overflowing':
        return (
          <span className="text-rose-400 font-semibold text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Overflowing (&gt;80%)
          </span>
        );
      case 'nearly_full':
        return (
          <span className="text-amber-400 font-semibold text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Nearly Full (50-80%)
          </span>
        );
      default:
        return (
          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Normal (&lt;50%)
          </span>
        );
    }
  };

  const getFillColor = (fill: number) => {
    if (fill > 80) return 'bg-rose-500';
    if (fill >= 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Simulation Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Smart IoT Bin Network</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono">
              <Radio className={`w-3 h-3 ${isSimulating ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
              <span>{isSimulating ? 'Sensors Live' : 'Simulation Paused'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ultrasonic fill sensors, battery telemetry, and thermal fire safety monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              isSimulating
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Pause IoT Tick' : 'Resume IoT Tick'}</span>
          </button>

          <button
            onClick={triggerSimulatedSpike}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 flex items-center gap-1.5 transition-colors"
            title="Simulate sudden rush causing an overflow"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Overflow Surge</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Smart Bin</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, location, or street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({bins.length})
          </button>
          <button
            onClick={() => setStatusFilter('overflowing')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'overflowing'
                ? 'bg-rose-950/80 text-rose-300 shadow-sm border border-rose-800/40'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Critical ({bins.filter((b) => b.status === 'overflowing').length})
          </button>
          <button
            onClick={() => setStatusFilter('nearly_full')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'nearly_full'
                ? 'bg-amber-950/80 text-amber-300 shadow-sm border border-amber-800/40'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Nearly Full ({bins.filter((b) => b.status === 'nearly_full').length})
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              statusFilter === 'normal'
                ? 'bg-emerald-950/80 text-emerald-300 shadow-sm border border-emerald-800/40'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Normal ({bins.filter((b) => b.status === 'normal').length})
          </button>
        </div>

        {/* Stream Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Waste Streams</option>
          <option value="Plastic">Plastic</option>
          <option value="Organic">Organic</option>
          <option value="Paper">Paper</option>
          <option value="Glass">Glass</option>
          <option value="General">General</option>
          <option value="Hazardous">Hazardous</option>
        </select>
      </div>

      {/* Bins Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBins.map((bin) => {
          const isCritical = bin.status === 'overflowing';
          return (
            <div
              key={bin.id}
              className={`rounded-xl border p-4 bg-slate-900/90 shadow-md transition-all hover:border-slate-700 flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-900/60 bg-gradient-to-b from-rose-950/20 to-slate-900/90'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{bin.id}</span>
                  {getStatusBadge(bin.status)}
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{bin.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{bin.location.address}</span>
                </p>

                {/* Fill Meter Bar */}
                <div className="space-y-1.5 mb-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Fill Level</span>
                    <span className="font-bold font-mono text-white text-sm">{bin.fillLevel}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getFillColor(bin.fillLevel)}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{bin.capacityLiters} L Capacity</span>
                    <span>{bin.type} Stream</span>
                  </div>
                </div>

                {/* Sensor Readings */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-md border border-slate-800/50">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>{bin.temperature}°C Temp</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-md border border-slate-800/50">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bin.battery}% Battery</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{bin.lastCollected}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedBin(bin)}
                    className="p-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Inspect telemetry & history"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => emptyBin(bin.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    Empty
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect & Telemetry Modal */}
      {selectedBin && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedBin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">{selectedBin.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedBin.name}</h3>
                <p className="text-xs text-slate-400">{selectedBin.location.address}</p>
              </div>
              <div>{getStatusBadge(selectedBin.status)}</div>
            </div>

            {/* Simulated Live Slider */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Simulate Fill Telemetry</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{selectedBin.fillLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedBin.fillLevel}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateBinFill(selectedBin.id, val);
                  setSelectedBin((prev) => (prev ? { ...prev, fillLevel: val } : null));
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% Empty</span>
                <span>50% Warning</span>
                <span>100% Full</span>
              </div>
            </div>

            {/* Historical Fill Chart Bars */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2">Historical Fill Trend (Today)</div>
              <div className="flex items-end justify-between gap-2 h-24 pt-4">
                {selectedBin.historicalFill.map((rec, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className={`w-full rounded-t transition-all ${getFillColor(rec.fill)}`}
                      style={{ height: `${Math.max(8, rec.fill)}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-500">{rec.timestamp}</span>
                    <span className="text-[9px] font-mono text-slate-400">{rec.fill}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  emptyBin(selectedBin.id);
                  setSelectedBin((prev) => (prev ? { ...prev, fillLevel: 0, status: 'normal' } : null));
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Mark Emptied (0%)</span>
              </button>
              <button
                onClick={() => setSelectedBin(null)}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy New Bin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBin}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Deploy New Smart Bin</h3>
            <p className="text-xs text-slate-400">Configure simulated IoT telemetry sensors and stream category.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Bin Location Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pine St & Battery Intersection"
                  value={newBinName}
                  onChange={(e) => setNewBinName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Pine St, Financial District"
                  value={newBinAddress}
                  onChange={(e) => setNewBinAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Stream Type</label>
                  <select
                    value={newBinType}
                    onChange={(e) => setNewBinType(e.target.value as BinType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Organic">Organic</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="General">General</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Capacity (Liters)</label>
                  <select
                    value={newBinCapacity}
                    onChange={(e) => setNewBinCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={240}>240 L</option>
                    <option value={480}>480 L</option>
                    <option value={660}>660 L</option>
                    <option value={1100}>1100 L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Initial Fill Level: {newBinFill}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newBinFill}
                  onChange={(e) => setNewBinFill(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                Register & Activate Bin
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
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
