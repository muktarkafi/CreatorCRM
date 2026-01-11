import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { Video, ArrowRight, Lock, Mail, User as UserIcon, Building2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User, stayLoggedIn: boolean) => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

const Auth: React.FC<AuthProps> = ({ onLogin, initialMode = 'LOGIN' }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
        let user: User;

        if (mode === 'REGISTER') {
            const newUser: User = {
                id: `u-${Date.now()}`,
                name: formData.name,
                email: formData.email,
                companyName: formData.companyName
            };
            user = StorageService.register(newUser, formData.password);
        } else {
            user = StorageService.login(formData.email, formData.password);
        }

        onLogin(user, stayLoggedIn);

    } catch (err: any) {
        setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 relative overflow-y-auto custom-scrollbar p-6">
       {/* Ambient Background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] -z-10"></div>
       
       <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in my-auto">
          <div className="text-center mb-8">
             <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
                 <Video className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">
                 {mode === 'LOGIN' ? 'Welcome Back' : 'Create Your Workspace'}
             </h2>
             <p className="text-slate-400 text-sm">
                 {mode === 'LOGIN' ? 'Enter your credentials to access your dashboard.' : 'Start managing your creative business professionally.'}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
                 <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     {error}
                 </div>
             )}

             {mode === 'REGISTER' && (
                 <>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="text"
                                required 
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company / Channel Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                            <input 
                                type="text"
                                required 
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="ReachMora"
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            />
                        </div>
                    </div>
                 </>
             )}

             <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="email"
                        required 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
             </div>

             <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="password"
                        required 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
             </div>

             <div className="flex items-center justify-between pt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500/50"
                        checked={stayLoggedIn}
                        onChange={(e) => setStayLoggedIn(e.target.checked)}
                     />
                     <span className="text-xs text-slate-400">Stay logged in</span>
                 </label>
                 {mode === 'LOGIN' && (
                     <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                 )}
             </div>

             <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2"
             >
                {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
             </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
             <p className="text-sm text-slate-400">
                 {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
                 <button 
                    onClick={() => {
                        setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                        setError(null);
                    }}
                    className="text-white font-medium ml-2 hover:underline"
                 >
                     {mode === 'LOGIN' ? 'Register' : 'Log in'}
                 </button>
             </p>
          </div>
       </div>
    </div>
  );
};

export default Auth;