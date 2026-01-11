import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DealBoard from './components/DealBoard';
import ProjectBoard from './components/ProjectBoard';
import FinishedProjects from './components/FinishedProjects';
import Payments from './components/Payments';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Settings from './components/Settings';
import { Deal, Project, ViewState, DealStage, ProjectStage, Transaction, User } from './types';
import { INITIAL_DEALS, INITIAL_PROJECTS, INITIAL_TRANSACTIONS } from './services/data';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // App Data State - Initialized to EMPTY by default for new instances
  const [currentView, setView] = useState<ViewState>('DASHBOARD');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check Local Storage for Session
  useEffect(() => {
    const storedUser = localStorage.getItem('reachmora_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === 'demo@reachmora.com' && deals.length === 0) {
          loadSampleData();
      }
    }
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadSampleData = () => {
      setDeals(INITIAL_DEALS);
      setProjects(INITIAL_PROJECTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setNotification('📂 Demo data loaded');
  };

  const resetData = () => {
      setDeals([]);
      setProjects([]);
      setTransactions([]);
      setNotification('🗑️ All data has been reset');
  };

  // Auth Handlers
  const handleLogin = (userData: User, stayLoggedIn: boolean) => {
      setUser(userData);
      setShowAuth(false);
      
      if (stayLoggedIn) {
          localStorage.setItem('reachmora_user', JSON.stringify(userData));
      } else {
          sessionStorage.setItem('reachmora_user', JSON.stringify(userData));
      }

      if (authMode === 'REGISTER') {
          resetData();
          setNotification(`🎉 Welcome to CreatorCRM, ${userData.name}!`);
      } else {
          if (userData.email === 'demo@reachmora.com' || userData.companyName === 'ReachMora') {
              loadSampleData();
              setNotification(`👋 Welcome back, ${userData.name}!`);
          } else {
              resetData(); 
              setNotification(`👋 Welcome back, ${userData.name}!`);
          }
      }
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('reachmora_user');
      sessionStorage.removeItem('reachmora_user');
      resetData();
      setNotification('Logged out successfully');
      setView('DASHBOARD'); 
  };

  const handleGetStarted = () => {
      setAuthMode('REGISTER');
      setShowAuth(true);
  };

  const handleSignInClick = () => {
      setAuthMode('LOGIN');
      setShowAuth(true);
  };


  // Data Handlers
  const handleAddDeal = (dealInput: Omit<Deal, 'id' | 'stage' | 'lastActivity'>) => {
    const finalBrandName = dealInput.brandName || dealInput.toolName;
    const newDeal: Deal = {
      ...dealInput,
      brandName: finalBrandName,
      id: `d-${Date.now()}`,
      stage: DealStage.NEW_INQUIRY,
      lastActivity: new Date().toISOString(),
    };
    setDeals([...deals, newDeal]);
    setNotification('✨ New inquiry added to the pipeline!');
  };

  const handleUpdateDeal = (dealId: string, updates: Partial<Deal>) => {
    const updatedDeals = deals.map(d => 
      d.id === dealId ? { ...d, ...updates, lastActivity: new Date().toISOString() } : d
    );
    setDeals(updatedDeals);
    setNotification('💾 Deal details updated');
  };

  const handleRemoveDeal = (dealId: string) => {
    if (window.confirm('Are you sure you want to remove this deal?')) {
        setDeals(deals.filter(d => d.id !== dealId));
        setNotification('🗑️ Deal removed from pipeline');
    }
  };

  const handleMoveDeal = (dealId: string, newStage: DealStage) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const updatedDeals = deals.map(d => 
      d.id === dealId ? { ...d, stage: newStage, lastActivity: new Date().toISOString() } : d
    );
    setDeals(updatedDeals);

    if (deal.stage !== DealStage.UPFRONT_RECEIVED && newStage === DealStage.UPFRONT_RECEIVED) {
      const newProject: Project = {
        id: `p-${Date.now()}`,
        dealId: deal.id,
        brandName: deal.brandName,
        title: `${deal.toolName} Tutorial`,
        stage: ProjectStage.TOOL_ACCESS,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        upfrontPaid: true,
        finalPaid: false,
        totalValue: deal.value,
        progress: 5,
        archived: false
      };
      
      setProjects([...projects, newProject]);
      setNotification(`🚀 Project created for ${deal.brandName}!`);

      const upfrontAmount = deal.value * 0.5;
      handleAddTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Upfront Payment: ${deal.brandName}`,
        amount: upfrontAmount,
        type: 'INCOME',
        category: 'Sponsorship'
      });
    }
  };

  const handleMoveProject = (projectId: string, newStage: ProjectStage) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const stages = Object.values(ProjectStage);
    const stageIndex = stages.indexOf(newStage);
    const progress = Math.round(((stageIndex + 1) / stages.length) * 100);

    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, stage: newStage, progress } : p
    );
    setProjects(updatedProjects);
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    );
    setProjects(updatedProjects);
    setNotification('💾 Project updated');
  };

  const handleArchiveProject = (projectId: string) => {
      const updatedProjects = projects.map(p => 
        p.id === projectId ? { ...p, archived: true } : p
      );
      setProjects(updatedProjects);
      setNotification('📦 Project archived to Finished Projects');
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
      const transaction: Transaction = {
          ...newTransaction,
          id: `t-${Date.now()}`
      };
      setTransactions([transaction, ...transactions]);
      setNotification(`💰 ${newTransaction.type === 'INCOME' ? 'Income' : 'Expense'} recorded`);
  };

  const handleDeleteTransaction = (id: string) => {
      if(window.confirm('Delete this transaction?')) {
        setTransactions(transactions.filter(t => t.id !== id));
        setNotification('🗑️ Transaction deleted');
      }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard deals={deals} projects={projects.filter(p => !p.archived)} transactions={transactions} privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} />;
      case 'DEALS':
        return <DealBoard deals={deals} onMoveDeal={handleMoveDeal} onAddDeal={handleAddDeal} onUpdateDeal={handleUpdateDeal} onRemoveDeal={handleRemoveDeal} />;
      case 'PROJECTS':
        return <ProjectBoard projects={projects.filter(p => !p.archived)} onMoveProject={handleMoveProject} onUpdateProject={handleUpdateProject} onArchiveProject={handleArchiveProject} />;
      case 'FINISHED_PROJECTS':
        return <FinishedProjects projects={projects.filter(p => p.archived)} />;
      case 'PAYMENTS':
        return <Payments transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      case 'INSIGHTS':
        return (
            <div className="p-8 pt-20 lg:pt-8 flex items-center justify-center h-full text-slate-500">
                <p>Insights & Analytics (Coming Soon)</p>
            </div>
        );
      case 'SETTINGS':
        return <Settings user={user} onResetData={resetData} onLoadSampleData={loadSampleData} onLogout={handleLogout} />;
      default:
        return <Dashboard deals={deals} projects={projects} transactions={transactions} privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} />;
    }
  };

  // View Logic: Landing Page -> Auth -> App
  if (!user) {
      if (showAuth) {
          return <Auth onLogin={handleLogin} initialMode={authMode} />;
      }
      return <LandingPage onGetStarted={handleGetStarted} onLogin={handleSignInClick} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        companyName={user.companyName} 
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <main className="flex-1 overflow-hidden relative flex flex-col w-full">
        {/* Mobile Header Trigger */}
        <div className="lg:hidden absolute top-4 left-4 z-30">
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white shadow-lg hover:bg-slate-800 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
            {renderContent()}
        </div>

        {/* Floating Notification Toast */}
        {notification && (
            <div className="absolute bottom-8 right-8 bg-slate-800 border border-indigo-500/50 text-white px-6 py-4 rounded-xl shadow-2xl shadow-black/50 flex items-center gap-3 animate-slide-up z-50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {notification}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;