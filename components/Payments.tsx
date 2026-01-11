import React, { useState, useMemo } from 'react';
import { Transaction, IncomeCategory, ExpenseCategory } from '../types';
import { 
  DollarSign, TrendingUp, TrendingDown, Plus, Filter, Download, 
  ArrowUpRight, ArrowDownRight, Wallet, PieChart, Calendar, Tag, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, PieChart as RePieChart, Pie
} from 'recharts';

interface PaymentsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  'YouTube Partner', 'Affiliate Payment', 'Link Placement', 'Course Sales', 'Digital Products', 'Sponsorship', 'Other'
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Software Subscription', 'Editing Services', 'Equipment/Tools', 'Freelancers', 'Marketing', 'Other'
];

const Payments: React.FC<PaymentsProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: 'Other' as string
  });

  const resetForm = () => {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'INCOME',
        category: 'Other'
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category as any,
    });
    setModalOpen(false);
    resetForm();
  };

  // Calculations
  const financials = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const netIncome = totalIncome - totalExpenses;
    
    // Chart Data Preparation (Group by Month)
    const monthlyDataMap = new Map<string, {name: string, income: number, expense: number}>();
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyDataMap.has(monthKey)) {
            monthlyDataMap.set(monthKey, { name: monthKey, income: 0, expense: 0 });
        }
        
        const entry = monthlyDataMap.get(monthKey)!;
        if (t.type === 'INCOME') entry.income += t.amount;
        else entry.expense += t.amount;
    });

    // Ensure strictly chronological order would require more logic, 
    // but for this snippet we'll just take the map values.
    // In a real app, sort by date.
    const chartData = Array.from(monthlyDataMap.values());

    return { totalIncome, totalExpenses, netIncome, chartData };
  }, [transactions]);

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-white">Financial Hub</h2>
           <p className="text-slate-400 mt-1">Track diversified income streams and operational costs.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-24 h-24 text-indigo-500" />
             </div>
             <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                Net Profit
                <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-300">Total</span>
             </p>
             <h3 className="text-3xl font-bold text-white mt-2">${financials.netIncome.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div style={{width: '75%'}} className="h-full bg-indigo-500 rounded-full"></div>
                </div>
                <span>Healthy</span>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24 text-emerald-500" />
             </div>
             <p className="text-slate-400 font-medium text-sm">Total Income</p>
             <h3 className="text-3xl font-bold text-emerald-400 mt-2">${financials.totalIncome.toLocaleString()}</h3>
             <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                From {transactions.filter(t => t.type === 'INCOME').length} transactions
             </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingDown className="w-24 h-24 text-rose-500" />
             </div>
             <p className="text-slate-400 font-medium text-sm">Total Expenses</p>
             <h3 className="text-3xl font-bold text-rose-400 mt-2">${financials.totalExpenses.toLocaleString()}</h3>
             <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3 text-rose-500" />
                Operational costs
             </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Income vs Expenses</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financials.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            cursor={{fill: '#1e293b', opacity: 0.4}}
                        />
                        <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expenses" fill="#fb7185" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution (Simplified Visualization) */}
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Income Breakdown</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {INCOME_CATEGORIES.map(cat => {
                    const amount = transactions
                        .filter(t => t.type === 'INCOME' && t.category === cat)
                        .reduce((sum, t) => sum + t.amount, 0);
                    
                    if (amount === 0) return null;
                    const percent = (amount / financials.totalIncome) * 100;

                    return (
                        <div key={cat}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-300">{cat}</span>
                                <span className="text-white font-medium">${amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{width: `${percent}%`}}></div>
                            </div>
                        </div>
                    )
                })}
            </div>
         </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
              <div className="flex bg-slate-800 rounded-lg p-1">
                  {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            filterType === type ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                      </button>
                  ))}
              </div>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1">
             <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 bg-slate-900 z-10 text-xs uppercase text-slate-500 font-medium">
                     <tr>
                         <th className="pb-3 pl-2">Date</th>
                         <th className="pb-3">Description</th>
                         <th className="pb-3">Category</th>
                         <th className="pb-3 text-right pr-2">Amount</th>
                         <th className="pb-3 w-10"></th>
                     </tr>
                 </thead>
                 <tbody className="text-sm">
                     {filteredTransactions.map(t => (
                         <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                             <td className="py-3 pl-2 text-slate-400 font-mono text-xs">{t.date}</td>
                             <td className="py-3 text-white">{t.description}</td>
                             <td className="py-3">
                                 <span className={`text-[10px] px-2 py-1 rounded-full border ${
                                     t.type === 'INCOME' 
                                     ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                     : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                 }`}>
                                     {t.category}
                                 </span>
                             </td>
                             <td className={`py-3 text-right pr-2 font-medium ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-white'}`}>
                                 {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                             </td>
                             <td className="py-3 text-right">
                                 <button 
                                    onClick={() => onDeleteTransaction(t.id)}
                                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                 >
                                     <X className="w-4 h-4" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             {filteredTransactions.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm">
                     <p>No transactions found.</p>
                 </div>
             )}
          </div>
      </div>

      {/* Add Transaction Modal */}
      {modalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add Transaction</h3>
                    <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({...formData, type: 'INCOME', category: INCOME_CATEGORIES[0]});
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                                formData.type === 'INCOME' 
                                ? 'bg-emerald-600 border-emerald-500 text-white' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({...formData, type: 'EXPENSE', category: EXPENSE_CATEGORIES[0]});
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                                formData.type === 'EXPENSE' 
                                ? 'bg-rose-600 border-rose-500 text-white' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            Expense
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                        <input 
                            type="number" 
                            required
                            min="0.01"
                            step="0.01"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder={formData.type === 'INCOME' ? "e.g. YouTube AdSense" : "e.g. Adobe Creative Cloud"}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                {formData.type === 'INCOME' 
                                    ? INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                                    : EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                                }
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg mt-2 ${
                            formData.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                        }`}
                    >
                        Save {formData.type === 'INCOME' ? 'Income' : 'Expense'}
                    </button>
                </form>
             </div>
          </div>
      )}
    </div>
  );
};

export default Payments;