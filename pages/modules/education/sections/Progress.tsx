
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { LineChart, BarChart3, PieChart, Zap, TrendingUp, Award } from 'lucide-react';

const Progress: React.FC = () => {
  const { language } = useApp();
  const t = eduTranslations[language].dashboard;

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-amber-500" fill="currentColor" size={20} />
          <h3 className="font-bold text-sm">Learning Activity</h3>
        </div>
        
        <div className="h-40 w-full flex items-end justify-between gap-1 mb-6">
          {[30, 60, 40, 80, 50, 90, 70, 40, 60, 85, 45, 60].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-50 dark:bg-slate-900 rounded-t-sm relative">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-sm transition-all duration-1000" 
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-slate-700 pt-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Hours</p>
            <h4 className="text-xl font-extrabold">124.5</h4>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">XP Earned</p>
            <h4 className="text-xl font-extrabold text-blue-600">8,420</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
          <TrendingUp size={24} className="text-emerald-500 mx-auto mb-3" />
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Success Rate</p>
          <h4 className="text-lg font-extrabold">94%</h4>
        </div>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
          <Award size={24} className="text-amber-500 mx-auto mb-3" />
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Certificates</p>
          <h4 className="text-lg font-extrabold">12</h4>
        </div>
      </div>

      <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <Zap size={24} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Focus Recommendation</h4>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80">You're doing great in CSS! Focus next on <b>React Performance</b> to level up.</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
