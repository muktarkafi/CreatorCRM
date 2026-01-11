import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, Briefcase, AlertCircle, TrendingUp, Eye, EyeOff, PlaySquare, GraduationCap, KanbanSquare, ArrowRight } from 'lucide-react';
import { Deal, Project, DealStage, ProjectStage, Transaction, Course } from '../types';

interface DashboardProps {
  deals: Deal[];
  projects: Project[];
  transactions: Transaction[];
  courses: Course[];
  privacyMode: boolean;
  setPrivacyMode: (mode: boolean) => void;
}

// Helper for stage colors
const getProgressColorClass = (stage: ProjectStage) => {
    switch (stage) {
        case ProjectStage.TOOL_ACCESS:
        case ProjectStage.CONCEPT: return 'bg-rose-500';
        case ProjectStage.FILMING: return 'bg-orange-500';
        case ProjectStage.SCRIPTING: return 'bg-amber-400';
        case ProjectStage.EDITING: return 'bg-indigo-500';
        case ProjectStage.REVIEW: return 'bg-blue-500';
        case ProjectStage.FINAL_PAYMENT: return 'bg-emerald-400';
        case ProjectStage.PUBLISHED: return 'bg-emerald-600';
        default: return 'bg-slate-500';
    }
};

const getDealColorClass = (stage: DealStage) => {
    switch (stage) {
        case DealStage.NEW_INQUIRY: return 'bg-blue-500';
        case DealStage.RATE_SENT: return 'bg-purple-500';
        case DealStage.NEGOTIATION: return 'bg-orange-500';
        case DealStage.ACCEPTED_AWAITING_UPFRONT: return 'bg-rose-500';
        case DealStage.UPFRONT_RECEIVED: return 'bg-emerald-500';
        default: return 'bg-slate-500';
    }
};

// Deal Progress Percentage
const getDealProgress = (stage: DealStage) => {
    switch (stage) {
        case DealStage.NEW_INQUIRY: return 15;
        case DealStage.RATE_SENT: return 40;
        case DealStage.NEGOTIATION: return 60;
        case DealStage.ACCEPTED_AWAITING_UPFRONT: return 90;
        case DealStage.UPFRONT_RECEIVED: return 100;
        default: return 0;
    }
};

const Dashboard: React.FC<DashboardProps> = ({ deals, projects, transactions, courses, privacyMode, setPrivacyMode }) => {
  const activeDeals = deals.filter(d => d.stage !== DealStage.REJECTED && d.stage !== DealStage.CANCELLED);
  const activeProjects = projects.filter(p => !p.archived && p.type === 'SPONSORED');
  const activeTutorials = projects.filter(p => !p.archived && p.type === 'TUTORIAL');
  
  const activeDealsCount = activeDeals.length;
  const activeProjectsCount = activeProjects.length;
  
  const pipelineValue = activeDeals.reduce((acc, curr) => acc + curr.value, 0);

  const actionRequiredCount = useMemo(() => {
      const dealsWaiting = deals.filter(d => d.stage === DealStage.ACCEPTED_AWAITING_UPFRONT).length;
      const now = new Date();
      const projectsAction = projects.filter(p => {
          if (p.stage === ProjectStage.PUBLISHED || p.archived) return false;
          return new Date(p.dueDate) < now || p.stage === ProjectStage.REVIEW;
      }).length;
      return dealsWaiting + projectsAction;
  }, [deals, projects]);

  const stats = [
    { label: 'Active Deals', value: activeDealsCount, icon: Briefcase, color: 'bg-blue-500', isPrivate: false },
    { label: 'Ongoing Projects', value: activeProjectsCount, icon: TrendingUp, color: 'bg-emerald-500', isPrivate: false },
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, color: 'bg-indigo-500', isPrivate: true },
    { label: 'Action Required', value: actionRequiredCount, icon: AlertCircle, color: 'bg-rose-500', isPrivate: false },
  ];

  // Pipeline Funnel Data
  const funnelData = useMemo(() => {
      const stages = [
          { id: DealStage.NEW_INQUIRY, label: 'Inquiry', color: '#3b82f6' },
          { id: DealStage.RATE_SENT, label: 'Rate Sent', color: '#a855f7' },
          { id: DealStage.NEGOTIATION, label: 'Negot.', color: '#f97316' },
          { id: DealStage.ACCEPTED_AWAITING_UPFRONT, label: 'Accepted', color: '#f43f5e' },
          { id: DealStage.UPFRONT_RECEIVED, label: 'Production', color: '#10b981' },
      ];
      return stages.map(s => {
          const count = activeDeals.filter(d => d.stage === s.id).length;
          const value = activeDeals.filter(d => d.stage === s.id).reduce((sum, d) => sum + d.value, 0);
          return { ...s, count, value };
      });
  }, [activeDeals]);

  // Chart Data
  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    const growthData: { date: string, balance: number }[] = [];
    if (sorted.length === 0) return [{ date: 'Start', balance: 0 }];
    growthData.push({ date: 'Start', balance: 0 });

    sorted.forEach(t => {
        if (t.type === 'INCOME') currentBalance += t.amount;
        else currentBalance -= t.amount;
        growthData.push({
            date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            balance: currentBalance
        });
    });
    return growthData;
  }, [transactions]);

  const currentMonthIncome = useMemo(() => {
    const now = new Date();
    return transactions
        .filter(t => t.type === 'INCOME')
        .filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
        .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return (
    <div className="p-8 pt-16 lg:pt-8 space-y-8 animate-fade-in pb-20">
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

      {/* PIPELINE VELOCITY FUNNEL (New) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <KanbanSquare className="w-5 h-5 text-indigo-500" />
              Pipeline Velocity
              <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-800 px-2 py-1 rounded">
                  {activeDeals.length} active deals
              </span>
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-0 -translate-y-4"></div>
              
              {funnelData.map((stage, i) => (
                  <div key={stage.label} className="flex flex-col items-center w-full z-10 relative group">
                      <div className="mb-3 relative">
                          <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110"
                              style={{ backgroundColor: stage.count > 0 ? stage.color : '#1e293b', opacity: stage.count > 0 ? 1 : 0.5 }}
                          >
                              {stage.count}
                          </div>
                          {stage.count > 0 && (
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          )}
                      </div>
                      <span className="text-xs font-bold text-slate-300 mb-1">{stage.label}</span>
                      <span className={`text-[10px] ${privacyMode ? 'blur-[2px]' : 'text-slate-500'}`}>
                          ${stage.value.toLocaleString()}
                      </span>
                  </div>
              ))}
          </div>
      </div>

      {/* Production Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Collaborations List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Deal Progress
                </h3>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeDeals.length === 0 && <p className="text-slate-500 text-sm italic">No active deals in pipeline.</p>}
                {activeDeals.map(deal => (
                    <div key={deal.id}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-200">{deal.brandName}</span>
                            <span className="text-slate-400">{deal.stage}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${getDealColorClass(deal.stage)} transition-all duration-500`} 
                                style={{ width: `${getDealProgress(deal.stage)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Sponsored Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Sponsored Projects
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeProjects.length === 0 && <p className="text-slate-500 text-sm italic">No active sponsored projects.</p>}
                {activeProjects.map(project => (
                    <div key={project.id}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-200">{project.brandName} - {project.title}</span>
                            <span className="text-slate-400">{project.stage}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${getProgressColorClass(project.stage)} transition-all duration-500`} 
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Tutorials */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PlaySquare className="w-5 h-5 text-pink-500" />
                Free Tutorials
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeTutorials.length === 0 && <p className="text-slate-500 text-sm italic">No active tutorials.</p>}
                {activeTutorials.map(project => (
                    <div key={project.id}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-200">{project.title}</span>
                            <span className="text-slate-400">{project.stage}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${getProgressColorClass(project.stage)} transition-all duration-500`} 
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Course Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Course Creation
            </h3>
             <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {courses.length === 0 && <p className="text-slate-500 text-sm italic">No courses in development.</p>}
                {courses.map(course => (
                    <div key={course.id}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-200">{course.title}</span>
                            <span className="text-blue-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                            <div 
                                className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500`} 
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-slate-500">{course.chapters.length} / {course.totalChapters} Chapters</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-96">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <h3 className="text-lg font-bold text-white mb-6">Net Income Growth</h3>
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
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} minTickGap={30} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} 
                  itemStyle={{ color: '#34d399' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
                />
                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent Transactions</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {transactions.slice(0, 5).map((t, i) => (
              <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 group-hover:scale-125 transition-transform ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div>
                  <p className="text-sm text-slate-200">
                      {t.type === 'INCOME' ? 'Received' : 'Paid'} <span className={`font-semibold ${privacyMode ? 'blur-sm' : 'text-white'}`}>${t.amount}</span> for {t.description}
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