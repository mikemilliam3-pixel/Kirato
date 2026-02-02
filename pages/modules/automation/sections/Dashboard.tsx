import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { Zap, Activity, ClipboardList, Users, Plus, Link, UserPlus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = autoTranslations[language].dashboard;

  const kpis = [
    { label: t.activeWorkflows, value: "8", icon: Zap, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { label: t.runsToday, value: "142", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.templates, value: "12", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: t.teamSize, value: "5", icon: Users, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 sm:p-5 md:p-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
              <kpi.icon size={22} className={kpi.color} />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Zap size={240} />
        </div>
        <div className="flex-1 relative z-10">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70">Infrastructure Status</span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mt-1">Client Onboarding</h3>
          <p className="text-xs sm:text-sm font-bold opacity-80 mt-2 max-w-md">Successfully triggered 12 mins ago. All 5 steps completed without errors.</p>
        </div>
        <button className="h-12 sm:h-14 px-8 sm:px-10 bg-white text-cyan-700 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg shrink-0 relative z-10">
          View Execution Logs
        </button>
      </div>

      <div>
        <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.newWorkflow}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ClipboardList size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.newTemplate}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Link size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.manageIntegrations}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserPlus size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.inviteMember}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;