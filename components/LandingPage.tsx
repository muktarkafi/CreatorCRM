import React from 'react';
import { Video, KanbanSquare, CreditCard, Clapperboard, ChevronRight, Check } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const RevenuePreview = () => {
  const data = [
    { name: 'Mon', value: 1000 },
    { name: 'Tue', value: 2500 },
    { name: 'Wed', value: 1800 },
    { name: 'Thu', value: 4200 },
    { name: 'Fri', value: 3800 },
    { name: 'Sat', value: 5500 },
    { name: 'Sun', value: 6200 },
  ];
  return (
    <div className="h-32 w-full mt-6 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden relative shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-900/10 pointer-events-none" />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
             <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
               <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
             </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#f43f5e" 
            strokeWidth={3} 
            fill="url(#colorValue)" 
            isAnimationActive={true} 
            animationDuration={2000} 
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute top-3 left-4 text-[10px] font-bold text-rose-300 uppercase tracking-wider bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20">
         Live Revenue
      </div>
    </div>
  )
}

const PipelinePreview = () => {
    return (
        <div className="h-32 w-full mt-6 bg-slate-900 border border-slate-700/50 rounded-xl p-3 flex gap-3 overflow-hidden relative shadow-inner">
             {/* Column 1 */}
             <div className="w-1/3 h-full bg-slate-800/50 rounded-lg flex flex-col gap-2 p-2 border border-slate-700/30">
                 <div className="h-1.5 w-1/3 bg-slate-600 rounded-full mb-1"></div>
                 <div className="h-8 w-full bg-slate-700 rounded border border-slate-600/50"></div>
                 <div className="h-8 w-full bg-slate-700 rounded border border-slate-600/50 opacity-60"></div>
             </div>
             {/* Column 2 - Animated */}
             <div className="w-1/3 h-full bg-slate-800/50 rounded-lg flex flex-col gap-2 p-2 border border-slate-700/30 relative overflow-hidden">
                 <div className="h-1.5 w-1/3 bg-indigo-500/50 rounded-full mb-1"></div>
                 <div className="absolute top-10 left-2 right-2 h-8 bg-indigo-600 rounded border border-indigo-400 shadow-lg shadow-indigo-500/20 animate-pulse"></div>
             </div>
             {/* Column 3 */}
             <div className="w-1/3 h-full bg-slate-800/50 rounded-lg flex flex-col gap-2 p-2 border border-slate-700/30">
                 <div className="h-1.5 w-1/3 bg-emerald-500/50 rounded-full mb-1"></div>
                 <div className="h-8 w-full bg-slate-700 rounded border border-slate-600/50 border-l-2 border-l-emerald-500"></div>
             </div>
        </div>
    )
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="h-screen bg-slate-950 text-white overflow-y-auto custom-scrollbar font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">CreatorCRM</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin} 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/20 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-indigo-400 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              The Operating System for Creators
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
             Stop Managing Tasks. <br/>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
               Start Building an Empire.
             </span>
           </h1>
           
           <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
             The all-in-one workspace to track sponsorships, manage video projects, and visualize your creative income. Built for professional content creators.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
               onClick={onGetStarted}
               className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2"
             >
               Start Free Trial
               <ChevronRight className="w-5 h-5" />
             </button>
             <button 
                onClick={() => {
                    const el = document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all"
             >
               See How It Works
             </button>
           </div>
        </div>
      </div>

      {/* Visual Feature Grid */}
      <div id="features" className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Card 1: Pipeline */}
           <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <KanbanSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deal Pipeline</h3>
              <p className="text-slate-400 leading-relaxed text-sm flex-1">
                 Never lose a sponsorship in your inbox again. Visualize every deal stage.
              </p>
              <PipelinePreview />
           </div>

           {/* Card 2: Workflow */}
           <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-emerald-500/50 transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Clapperboard className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Workflow</h3>
              <p className="text-slate-400 leading-relaxed text-sm flex-1">
                 Seamlessly transition from deal to production. Track scripting, filming, and editing.
              </p>
              {/* Simple Project visual */}
               <div className="h-32 w-full mt-6 bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center gap-3 shadow-inner">
                   <div className="flex justify-between items-center text-xs text-slate-400">
                       <span>Scripting</span>
                       <span>80%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[80%] rounded-full animate-[shimmer_2s_infinite]"></div>
                   </div>
                   <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                       <span>Editing</span>
                       <span>25%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[25%] rounded-full"></div>
                   </div>
               </div>
           </div>

           {/* Card 3: Financials */}
           <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-rose-500/50 transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <CreditCard className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Hub</h3>
              <p className="text-slate-400 leading-relaxed text-sm flex-1">
                 Track AdSense, affiliates, and sponsorships. Visualize your true monthly income.
              </p>
              <RevenuePreview />
           </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-24 relative">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
           <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-2 md:p-4 shadow-2xl overflow-hidden">
               {/* Abstract representation of the dashboard */}
               <div className="flex gap-4 mb-4">
                  <div className="w-64 h-full bg-slate-900 rounded-lg p-4 hidden md:block space-y-3 opacity-50">
                      <div className="h-8 bg-slate-800 rounded w-full"></div>
                      <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-8 bg-slate-800 rounded w-5/6"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                          <div className="h-32 bg-slate-800 rounded-lg opacity-60"></div>
                          <div className="h-32 bg-slate-800 rounded-lg opacity-60"></div>
                          <div className="h-32 bg-slate-800 rounded-lg opacity-60"></div>
                      </div>
                      <div className="h-64 bg-slate-800 rounded-lg opacity-40"></div>
                  </div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center z-20">
                   <p className="text-2xl font-bold text-white bg-slate-900/80 backdrop-blur px-8 py-4 rounded-full border border-slate-700">
                       Your new command center
                   </p>
               </div>
           </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-24 border-t border-slate-800">
         <div className="max-w-4xl mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to professionalize your workflow?</h2>
             <p className="text-slate-400 mb-10 text-lg">Join thousands of creators who treat their content like a business.</p>
             
             <ul className="flex flex-col md:flex-row justify-center gap-6 mb-10 text-sm font-medium text-slate-300">
                <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" /> Free for solo creators
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" /> No credit card required
                </li>
                <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" /> Cancel anytime
                </li>
             </ul>

             <button 
               onClick={onGetStarted}
               className="w-full sm:w-auto px-10 py-4 bg-white text-slate-950 hover:bg-indigo-50 rounded-xl font-bold text-lg transition-all shadow-xl shadow-white/10"
             >
               Create Your Account
             </button>
         </div>
      </div>
    </div>
  );
};

export default LandingPage;