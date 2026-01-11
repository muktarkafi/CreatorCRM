import React from 'react';
import { User } from '../types';
import { Trash2, RefreshCw, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  user: User | null;
  onResetData: () => void;
  onLoadSampleData: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onResetData, onLoadSampleData, onLogout }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 mt-1">Manage your account and data preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <UserIcon className="w-5 h-5 text-indigo-400" /> Profile
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                 <div className="text-white p-3 bg-slate-950 border border-slate-800 rounded-lg">
                     {user?.name || 'Guest'}
                 </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">Company / Channel</label>
                 <div className="text-white p-3 bg-slate-950 border border-slate-800 rounded-lg">
                     {user?.companyName || 'Not set'}
                 </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                 <div className="text-white p-3 bg-slate-950 border border-slate-800 rounded-lg">
                     {user?.email || 'Not set'}
                 </div>
             </div>
         </div>
         <div className="mt-6 flex justify-end">
             <button 
                onClick={onLogout}
                className="px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 border border-rose-500/20 hover:border-rose-500/50"
             >
                <LogOut className="w-4 h-4" />
                Sign Out
             </button>
         </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden relative">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-indigo-400" /> Data Management
         </h3>
         <p className="text-slate-400 text-sm mb-6">
             Control your application data. Use "Load Demo Data" to explore features, or "Reset Data" to start fresh.
         </p>

         <div className="flex flex-col sm:flex-row gap-4">
             <button 
                onClick={() => {
                    if (window.confirm('This will replace your current data with sample demo data. Continue?')) {
                        onLoadSampleData();
                    }
                }}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
             >
                 <RefreshCw className="w-4 h-4" />
                 Load Demo Data
             </button>
             
             <button 
                onClick={() => {
                    if (window.confirm('WARNING: This will delete ALL your deals, projects, and transactions. This action cannot be undone. Are you sure?')) {
                        onResetData();
                    }
                }}
                className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-200 text-slate-300 rounded-xl font-medium transition-colors border border-slate-700 hover:border-rose-800"
             >
                 <Trash2 className="w-4 h-4" />
                 Reset All Data
             </button>
         </div>
      </div>
    </div>
  );
};

export default Settings;