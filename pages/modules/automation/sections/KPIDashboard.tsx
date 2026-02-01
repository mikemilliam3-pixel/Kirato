
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { BarChart3, TrendingUp, Zap, Clock, Calendar, ChevronRight } from 'lucide-react';

const KPIDashboard: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
        {['7 Days', '30 Days', 'All Time'].map(p => (
          <button key={p} className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${p === '7 Days' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400'}`}>
            {p}
          </button>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Workflow Runs</h3>
        <div className="h-40 w-full flex items-end justify-between gap-1 mb-6">
          {[40, 70, 45, 90, 65, 80, 55, 30, 60, 40, 85, 45].map((h, i) => (
            <div key={i} className="flex-1 bg-cyan-50 dark:bg-slate-900 rounded-t-sm relative">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-cyan-600 rounded-t-sm transition-all duration-1000" 
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px]">Total Runs: 1,420</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp size={14} /> +12%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Clock size={20} className="text-blue-500 mb-3" />
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Time Saved</p>
          <h4 className="text-lg font-extrabold">24.5h</h4>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Zap size={20} className="text-amber-500 mb-3" />
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Error Rate</p>
          <h4 className="text-lg font-extrabold">0.4%</h4>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Top Workflows</h3>
        {[
          { name: "Onboarding", runs: 420, success: "99%" },
          { name: "Invoicing", runs: 385, success: "98%" },
        ].map((wf, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center font-bold text-xs text-cyan-600">
                  #{idx+1}
               </div>
               <div>
                  <h4 className="text-xs font-bold">{wf.name}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{wf.runs} runs this week</p>
               </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-500">{wf.success}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIDashboard;
