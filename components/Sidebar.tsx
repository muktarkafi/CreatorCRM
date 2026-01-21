import React from 'react';
import { LayoutDashboard, KanbanSquare, Clapperboard, CreditCard, BarChart3, Settings, LogOut, Video, Archive, X, GraduationCap, PlaySquare } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  companyName: string;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, companyName, onLogout, isOpen = false, onClose }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'DEALS', label: 'Collaborations', icon: KanbanSquare },
    { id: 'PROJECTS', label: 'Ongoing Projects', icon: Clapperboard },
    { id: 'TUTORIALS', label: 'Free Tutorials', icon: PlaySquare },
    { id: 'COURSES', label: 'Course Manager', icon: GraduationCap },
    { id: 'FINISHED_PROJECTS', label: 'Finished Projects', icon: Archive },
    { id: 'PAYMENTS', label: 'Payments', icon: CreditCard },
    { id: 'INSIGHTS', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <>
      {/* Sidebar Container - Mobile Z-index higher than overlay */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-[60] w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 truncate">
              {companyName}
            </span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose} 
            className="lg:hidden text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewState);
                  if (window.innerWidth < 1024) {
                      onClose?.(); 
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
               onClick={() => {
                   setView('SETTINGS');
                   if (window.innerWidth < 1024) onClose?.();
               }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  currentView === 'SETTINGS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-1 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;