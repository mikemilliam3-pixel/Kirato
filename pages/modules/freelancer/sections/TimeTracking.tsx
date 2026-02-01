
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Clock, Play, Square, Pause, Calendar, ChevronRight, BarChart } from 'lucide-react';

const TimeTracking: React.FC = () => {
  const { language } = useApp();
  const t = freelancerTranslations[language].sections;

  return (
    <div className="space-y-6 pb-20">
      <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-xl border border-gray-100 dark:border-slate-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mb-4">Timer</p>
        <h4 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tabular-nums">00:42:15</h4>
        <p className="text-xs text-emerald-600 font-bold mb-8">EcoStore • Homepage Design</p>
        
        <div className="flex justify-center gap-4">
          <button className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all">
            <Pause size={24} />
          </button>
          <button className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-none active:scale-90 transition-all">
            <Square size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Calendar size={16} className="text-emerald-600" /> Recent Entries
          </h3>
          <button className="text-[10px] font-bold text-emerald-600 uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { project: 'FitApp', note: 'Login flow fix', time: '01:24', date: 'Yesterday' },
            { project: 'EcoStore', note: 'Icon set update', time: '02:45', date: '2 days ago' },
          ].map((entry, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">{entry.project}</h4>
                <p className="text-[10px] text-gray-400">{entry.note} • {entry.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-slate-900 rounded-3xl text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <BarChart size={20} className="text-emerald-500" />
          </div>
          <div>
            <h5 className="text-xs font-bold">Weekly Report</h5>
            <p className="text-[10px] text-slate-400">You worked 32h this week</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-500" />
      </div>
    </div>
  );
};

export default TimeTracking;
