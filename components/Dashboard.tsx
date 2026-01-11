import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { DollarSign, Briefcase, AlertCircle, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Deal, Project, DealStage, ProjectStage, Transaction } from '../types';

interface DashboardProps {
  deals: Deal[];
  projects: Project[];
  transactions: Transaction[];
  privacyMode: boolean;
  setPrivacyMode: (mode: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ deals, projects, transactions, privacyMode, setPrivacyMode }) => {
  const activeDeals = deals.filter(d => d.stage !== DealStage.REJECTED && d.stage !== DealStage.UPFRONT_RECEIVED);
  const activeProjects = projects.filter(p => p.stage !== ProjectStage.PUBLISHED);
  
  const activeDealsCount = activeDeals.length;
  const activeProjectsCount = activeProjects.length;
  
  // Calculate projected income (based on active deal value)
  const pipelineValue = activeDeals.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic Action Required Calculation
  const actionRequiredCount = useMemo(() => {
      // 1. Deals waiting for payment
      const dealsWaiting = deals.filter(d => d.stage === DealStage.ACCEPTED_AWAITING_UPFRONT).length;
      
      // 2. Projects overdue or needing review
      const now = new Date();
      const projectsAction = projects.filter(p => {
          if (p.stage === ProjectStage.PUBLISHED || p.archived) return false;
          
          const isOverdue = new Date(p.dueDate) < now;
          const isReviewPending = p.stage === ProjectStage.REVIEW;
          
          return isOverdue || isReviewPending;
      }).length;

      return dealsWaiting + projectsAction;
  }, [deals, projects]);

  const stats = [
    { label: 'Active Deals', value: activeDealsCount, icon: Briefcase, color: 'bg-blue-500', isPrivate: false },
    { label: 'Ongoing Projects', value: activeProjectsCount, icon: TrendingUp, color: 'bg-emerald-500', isPrivate: false },
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-500', isPrivate: true },
    { label: 'Action Required', value: actionRequiredCount, icon: AlertCircle, color: 'bg-rose-500', isPrivate: false },
  ];

  // Helper to get color based on progress (0-100)
  const getProgressColor = (percent: number) => {
    if (percent < 25) return 'bg-red-500';
    if (percent < 50) return 'bg-orange-500';
    if (percent < 75) return 'bg-yellow-500';
    if (percent < 90) return 'bg-lime-500';
    return 'bg-emerald-500';
  };

  const projectStages = Object.values(ProjectStage);
  const dealStages = [DealStage.NEW_INQUIRY, DealStage.RATE_SENT, DealStage.NEGOTIATION, DealStage.ACCEPTED_AWAITING_UPFRONT, DealStage.UPFRONT_RECEIVED];

  // Generate Real Chart Data from Transactions
  const chartData = useMemo(() => {
    const monthlyDataMap = new Map<string, {name: string, income: number}>();
    
    // Sort transactions by date first to ensure months appear in order if we iterated chronologically
    // A simplified approach for dashboard:
    const sorted = [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(t => {
        if (t.type === 'INCOME') {
            const date = new Date(t.date);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            
            if (!monthlyDataMap.has(monthKey)) {
                monthlyDataMap.set(monthKey, { name: monthKey, income: 0 });
            }
            monthlyDataMap.get(monthKey)!.income += t.amount;
        }
    });

    // If empty, return placeholder
    if (monthlyDataMap.size === 0) {
        return [
            { name: 'Jan', income: 0 }, { name: 'Feb', income: 0 }, { name: 'Mar', income: 0 }
        ]
    }

    return Array.from(monthlyDataMap.values());
  }, [transactions]);

  // Current Month Income
  const currentMonthIncome = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
        .filter(t => t.type === 'INCOME')
        .filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);


  return (
    <div className="p-8 pt-16 lg:pt-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, ReachMora</h1>
          <p className="text-slate-400">Here's what's happening in your creative empire today.</p>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                title={privacyMode ? "Show financial data" : "Hide financial data"}
            >
                {privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span className="text-sm font-medium">{privacyMode ? 'Privacy On' : 'Privacy Off'}</span>
            </button>
            <div className="text-right">
                <span className="text-sm text-slate-500">Income This Month</span>
                <div className={`text-2xl font-bold text-emerald-400 transition-all ${privacyMode ? 'blur-md select-none' : ''}`}>
                    ${currentMonthIncome.toLocaleString()}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition-colors">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold text-white mt-1 transition-all ${stat.isPrivate && privacyMode ? 'blur-md select-none' : ''}`}>
                    {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ongoing Projects Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ongoing Projects Status</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeProjects.length === 0 && <p className="text-slate-500 text-sm italic">No active projects.</p>}
                {activeProjects.map(project => {
                    const stageIndex = projectStages.indexOf(project.stage);
                    const progress = Math.round(((stageIndex + 1) / (projectStages.length - 1)) * 100); // Exclude Published from count effectively
                    return (
                        <div key={project.id}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-slate-200">{project.title}</span>
                                <span className="text-slate-400">{project.stage}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${getProgressColor(progress)} transition-all duration-500`} 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Collaborations Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Collaboration Pipeline</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeDeals.length === 0 && <p className="text-slate-500 text-sm italic">No active collaborations.</p>}
                {activeDeals.map(deal => {
                    const stageIndex = dealStages.indexOf(deal.stage);
                    const progress = Math.round(((stageIndex + 1) / dealStages.length) * 100);
                    return (
                        <div key={deal.id}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-slate-200">{deal.brandName}</span>
                                <span className="text-slate-400">{deal.stage}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${getProgressColor(progress)} transition-all duration-500`} 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Trend (Real Data)</h3>
          {privacyMode && (
             <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl border border-slate-800">
                <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-400 shadow-xl">
                    <EyeOff className="w-4 h-4" />
                    <span>Hidden</span>
                </div>
             </div>
          )}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} 
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {/* Displaying a mix of recent updates placeholder + actual recent transactions could go here */}
            {transactions.slice(0, 5).map((t, i) => (
              <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 group-hover:scale-125 transition-transform ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div>
                  <p className="text-sm text-slate-200">
                      {t.type === 'INCOME' ? 'Received' : 'Paid'} <span className="font-semibold text-white">${t.amount}</span> for {t.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;