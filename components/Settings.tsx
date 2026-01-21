import React, { useRef, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Trash2, RefreshCw, User as UserIcon, LogOut, ShieldAlert, Download, Upload, FileJson, Key, Check, Copy, Smartphone } from 'lucide-react';
import { getApiKey } from '../services/ai';

interface SettingsProps {
  user: User | null;
  onResetData: () => void;
  onLoadSampleData: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onResetData, onLoadSampleData, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [importString, setImportString] = useState('');
  const [showImportInput, setShowImportInput] = useState(false);

  useEffect(() => {
      const current = localStorage.getItem('reachmora_api_key') || '';
      setApiKey(current);
  }, []);

  const handleSaveKey = () => {
      localStorage.setItem('reachmora_api_key', apiKey);
      setIsKeySaved(true);
      setTimeout(() => setIsKeySaved(false), 2000);
  };

  const handleExport = () => {
    if (!user) return;
    const data = StorageService.exportData(user.id);
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `reachmora_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyData = () => {
    if (!user) return;
    const data = StorageService.exportData(user.id);
    const jsonString = JSON.stringify(data);
    navigator.clipboard.writeText(jsonString).then(() => {
        setCopyFeedback('Copied! Send this text to your phone.');
        setTimeout(() => setCopyFeedback(''), 3000);
    });
  };

  const handlePasteImport = () => {
      if(!importString || !user) return;
      try {
          const parsedData = JSON.parse(importString);
           if (Array.isArray(parsedData.deals) && Array.isArray(parsedData.projects)) {
                StorageService.saveUserData(user.id, parsedData);
                alert('Success! Data imported.');
                window.location.reload();
            } else {
                alert('Invalid data format.');
            }
      } catch (e) {
          alert('Could not parse data. Ensure you copied the entire string.');
      }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            const parsedData = JSON.parse(content);
            if (Array.isArray(parsedData.deals) && Array.isArray(parsedData.projects)) {
                StorageService.saveUserData(user.id, parsedData);
                alert('Database imported successfully! The app will reload.');
                window.location.reload();
            } else {
                alert('Invalid file format. Please use a valid JSON export.');
            }
        } catch (err) {
            alert('Error parsing file.');
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
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

      {/* AI Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Key className="w-5 h-5 text-amber-400" /> AI Configuration
         </h3>
         <p className="text-slate-400 text-sm mb-4">
             Enter your Google Gemini API Key to enable script generation features.
         </p>
         <div className="flex gap-4">
             <input 
                type="password" 
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
             />
             <button 
                onClick={handleSaveKey}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isKeySaved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
             >
                 {isKeySaved ? <Check className="w-4 h-4" /> : 'Save Key'}
             </button>
         </div>
      </div>

      {/* Sync / Database */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Smartphone className="w-5 h-5 text-blue-400" /> Mobile Sync & Backup
         </h3>
         <p className="text-slate-400 text-sm mb-6 max-w-2xl">
             Transfer your data between devices. Use "Copy Data" to get a text code you can paste on your phone.
         </p>

         <div className="flex flex-col gap-4">
             {/* PC Actions */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={handleCopyData}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                >
                    <Copy className="w-4 h-4" />
                    {copyFeedback || 'Copy Data to Clipboard'}
                </button>
                 <button 
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                >
                    <Download className="w-4 h-4" />
                    Download JSON File
                </button>
             </div>

             {/* Import Section */}
             <div className="border-t border-slate-800 pt-4 mt-2">
                <button 
                    onClick={() => setShowImportInput(!showImportInput)}
                    className="text-indigo-400 text-sm hover:underline mb-3 block"
                >
                    {showImportInput ? 'Hide Import Tools' : 'I want to Import Data...'}
                </button>
                
                {showImportInput && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder="Paste data string here..."
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                value={importString}
                                onChange={(e) => setImportString(e.target.value)}
                            />
                            <button 
                                onClick={handlePasteImport}
                                className="bg-emerald-600 text-white px-4 rounded-lg text-xs font-bold"
                            >
                                Import Text
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-xs">Or upload file:</span>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs bg-slate-800 px-3 py-1 rounded text-white border border-slate-700"
                            >
                                Select JSON File
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImport} 
                                className="hidden" 
                                accept=".json"
                            />
                        </div>
                    </div>
                )}
             </div>
         </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden relative">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-rose-400" /> Danger Zone
         </h3>

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