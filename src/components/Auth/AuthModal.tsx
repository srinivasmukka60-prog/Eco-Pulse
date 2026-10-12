import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { UserRole } from '../../types';
import {
  User,
  Shield,
  Truck,
  LogIn,
  UserPlus,
  CheckCircle,
  X,
  Mail,
  Lock,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, updateUserProfile } = useWaste();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      role,
    });
    switchRole(role);
    setSuccessMsg(`Authenticated successfully as ${name} (${role.toUpperCase()})`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Role-Based Access Control</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to EcoPulse' : 'Register New Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your municipal authorization role to unlock role-specific workflows.
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role selector tiles */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Select User Role</label>
          <div className="grid grid-cols-3 gap-2">
            {/* Citizen */}
            <button
              type="button"
              onClick={() => {
                setRole('citizen');
                setName('Maya Lin');
                setEmail('maya.lin@cleanurban.org');
              }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'citizen'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-bold">Citizen</span>
              <span className="text-[10px] text-slate-500">Report & Scan</span>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setName('Marcus Vance');
                setEmail('director.marcus@ecopulse.gov');
              }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold">Admin</span>
              <span className="text-[10px] text-slate-500">Dispatch & ESG</span>
            </button>

            {/* Worker */}
            <button
              type="button"
              onClick={() => {
                setRole('worker');
                setName('David Chen');
                setEmail('david.chen@ecopulse.gov');
              }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'worker'
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="text-xs font-bold">Worker</span>
              <span className="text-[10px] text-slate-500">Routes & Stops</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {successMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{mode === 'login' ? 'Authenticate & Enter' : 'Register Account'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
