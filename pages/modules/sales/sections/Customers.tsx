
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { User, Search, MoreVertical, Star, ShieldAlert, History } from 'lucide-react';

const Customers: React.FC = () => {
  const { language } = useApp();
  const tc = salesTranslations[language].dashboard;

  const customers = [
    { id: '1', name: 'John Doe', orders: 12, total: 450, last: '2 days ago', status: 'loyal' },
    { id: '2', name: 'Jane Smith', orders: 2, total: 45, last: '1 week ago', status: 'new' },
    { id: '3', name: 'Alex Johnson', orders: 25, total: 1240, last: 'Today', status: 'vip' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'vip': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'loyal': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'new': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Find customer..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="space-y-3">
        {customers.map((c) => (
          <div key={c.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-400">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{c.name}</h4>
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              </div>
              <button className="text-gray-300"><MoreVertical size={18} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-slate-700 pt-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Orders</p>
                <h5 className="font-extrabold">{c.orders}</h5>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Spent</p>
                <h5 className="font-extrabold text-emerald-600">${c.total}</h5>
              </div>
            </div>

            <button className="w-full py-2.5 mt-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-500 flex items-center justify-center gap-2 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
              <History size={14} /> View History
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
