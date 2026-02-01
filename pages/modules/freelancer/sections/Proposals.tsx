
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { FileText, Search, Plus, Filter, MoreVertical, Send, CheckCircle, Clock } from 'lucide-react';

const Proposals: React.FC = () => {
  const { language } = useApp();
  const tc = freelancerTranslations[language].common;

  const proposals = [
    { id: 'PRP-001', client: 'GreenTech Inc', title: 'Mobile App Revamp', status: 'won', amount: '$4,500' },
    { id: 'PRP-002', client: 'Oceania Co', title: 'Brand Identity', status: 'sent', amount: '$1,200' },
    { id: 'PRP-003', client: 'SoftSys', title: 'Backend API Dev', status: 'draft', amount: '$3,800' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'sent': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'lost': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-slate-900';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Proposals</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95 transition-all">
          <Plus size={16} /> {tc.create}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={tc.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {proposals.map((prp) => (
          <div key={prp.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm truncate max-w-[150px]">{prp.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{prp.client}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusColor(prp.status)}`}>
                {prp.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{prp.amount}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                  <Send size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proposals;
