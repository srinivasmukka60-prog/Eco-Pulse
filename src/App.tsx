import React, { useState } from 'react';
import { WasteProvider, useWaste } from './context/WasteContext';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { SmartBinMonitor } from './components/Bins/SmartBinMonitor';
import { AIWasteClassifier } from './components/AI/AIWasteClassifier';
import { CitizenComplaints } from './components/Complaints/CitizenComplaints';
import { LiveWasteMap } from './components/Map/LiveWasteMap';
import { RouteOptimizer } from './components/Routes/RouteOptimizer';
import { WorkerDashboard } from './components/Worker/WorkerDashboard';
import { AdminConsole } from './components/Admin/AdminConsole';
import { AnalyticsReports } from './components/Analytics/AnalyticsReports';
import { EcoRewardsHub } from './components/Rewards/EcoRewardsHub';
import { AuthModal } from './components/Auth/AuthModal';
import { AlertsPanel } from './components/Notifications/AlertsPanel';
import {
  LayoutDashboard,
  Trash2,
  Sparkles,
  AlertTriangle,
  MapPin,
  Route,
  Truck,
  ShieldCheck,
  BarChart3,
  Award,
  Bell,
  Menu,
  X,
  User,
  Radio,
  ExternalLink,
  Leaf,
} from 'lucide-react';

function AppContent() {
  const { currentUser, switchRole, alerts, bins, complaints, workers, routes, emptyBin } = useWaste();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [highlightedBinId, setHighlightedBinId] = useState<string | undefined>(undefined);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bins', label: 'Smart Bins', icon: Trash2 },
    { id: 'classifier', label: 'AI Scanner', icon: Sparkles, badge: 'AI' },
    { id: 'complaints', label: 'Citizen Reports', icon: AlertTriangle },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'routes', label: 'Route Optimizer', icon: Route },
    { id: 'worker', label: 'Worker Portal', icon: Truck },
    { id: 'admin', label: 'Admin Console', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rewards', label: 'Eco Rewards', icon: Award },
  ];

  const handleInspectTargetOnMap = (targetId: string) => {
    setHighlightedBinId(targetId);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                  <span>EcoPulse</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    Smart Waste
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 hidden sm:block">Municipal IoT & AI Segregation</div>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* More dropdown or secondary links */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              {navItems.slice(7).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-emerald-400 border border-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher Pill */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 px-1 font-semibold text-[10px] uppercase">Role:</span>
              <button
                onClick={() => switchRole('citizen')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  currentUser.role === 'citizen'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Citizen perspective"
              >
                Citizen
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  currentUser.role === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Admin dispatch perspective"
              >
                Admin
              </button>
              <button
                onClick={() => switchRole('worker')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  currentUser.role === 'worker'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Collection worker perspective"
              >
                Worker
              </button>
            </div>

            {/* Eco Points Badge */}
            <button
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-amber-400 transition-colors"
              title="Click to view Eco Rewards"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.ecoPoints} pts</span>
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* User Profile Chip */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
              title="Manage profile & authentication"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="hidden md:inline max-w-[90px] truncate">{currentUser.name}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile role switcher */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Role:</span>
              <div className="flex gap-1">
                {(['citizen', 'admin', 'worker'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      currentUser.role === r
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewDashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'bins' && <SmartBinMonitor />}
        {activeTab === 'classifier' && <AIWasteClassifier />}
        {activeTab === 'complaints' && <CitizenComplaints />}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>City-Wide Geographic Telemetry Grid</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time Leaflet & OpenStreetMap view of municipal smart containers, citizen hotspots, and collection trucks.
                </p>
              </div>
            </div>
            <div className="h-[650px] w-full">
              <LiveWasteMap
                bins={bins}
                complaints={complaints}
                workers={workers}
                activeRoute={routes[0]}
                onEmptyBin={emptyBin}
                highlightTargetId={highlightedBinId}
              />
            </div>
          </div>
        )}
        {activeTab === 'routes' && <RouteOptimizer onInspectOnMap={() => setActiveTab('map')} />}
        {activeTab === 'worker' && <WorkerDashboard onInspectOnMap={() => setActiveTab('map')} />}
        {activeTab === 'admin' && <AdminConsole />}
        {activeTab === 'analytics' && <AnalyticsReports />}
        {activeTab === 'rewards' && <EcoRewardsHub />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">EcoPulse Municipal Platform</span>
            <span>·</span>
            <span>City Solid Waste Management Department</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini Multimodal AI</span>
            <span>·</span>
            <span>OpenStreetMap Telemetry</span>
            <span>·</span>
            <span className="text-emerald-500 font-medium">Zero Waste 2030 Initiative</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Panels */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AlertsPanel
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectTarget={handleInspectTargetOnMap}
      />
    </div>
  );
}

export default function App() {
  return (
    <WasteProvider>
      <AppContent />
    </WasteProvider>
  );
}
