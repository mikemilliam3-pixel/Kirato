
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Wallet, Plane, Hotel, Utensils, Compass, ShoppingBag, Plus, TrendingUp, DollarSign } from 'lucide-react';

const Budget: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];

  const categories = [
    { id: 'transport', label: 'Transport', spent: 850, planned: 1000, color: 'bg-blue-500', icon: Plane },
    { id: 'acc', label: 'Accommodation', spent: 1200, planned: 1500, color: 'bg-indigo-500', icon: Hotel },
    { id: 'food', label: 'Food & Drink', spent: 450, planned: 600, color: 'bg-emerald-500', icon: Utensils },
    { id: 'act', label: 'Activities', spent: 300, planned: 500, color: 'bg-amber-500', icon: Compass },
  ];

  const totalSpent = categories.reduce((acc, c) => acc + c.spent, 0);
  const totalPlanned = categories.reduce((acc, c) => acc + c.planned, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="flex items-center gap-2 mb-8">
          <Wallet size={20} className="text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Budget</span>
        </div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-4xl font-extrabold">${totalSpent}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Spent of ${totalPlanned}</p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur">
            <TrendingUp size={24} className="text-emerald-400" />
          </div>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(totalSpent/totalPlanned)*100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm uppercase tracking-widest text-gray-400">Categories</h3>
          <button className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Plus size={14} /> Add Category
          </button>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${cat.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                  <cat.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{cat.label}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">${cat.spent} / ${cat.planned}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {Math.round((cat.spent/cat.planned)*100)}%
              </span>
            </div>
            <div className="w-full bg-gray-50 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className={`${cat.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(cat.spent/cat.planned)*100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-200 dark:shadow-none">
        <Plus size={20} /> Add New Expense
      </button>
    </div>
  );
};

export default Budget;
