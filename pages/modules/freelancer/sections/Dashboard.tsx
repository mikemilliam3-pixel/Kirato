import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Users, Folder, Send, DollarSign, ListTodo, Plus, UserPlus, Play, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = freelancerTranslations[language].dashboard;

  const kpis = [
    { label: t.activeClients, value: "12", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.activeProjects, value: "5", icon: Folder, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.proposalsSent, value: "24", icon: Send, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: t.invoicesDue, value: "$1,200", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
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

      <div>
        <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.newProposal}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserPlus size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.addClient}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Play size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.startTimer}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-sm sm:text-base md:text-lg px-1 flex items-center gap-2 tracking-tight">
          <ListTodo size={20} className="text-emerald-600" />
          {t.todayTasks}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {[
            { id: '1', title: 'Design Landing Page', project: 'EcoStore', time: '10:00 - 13:00' },
            { id: '2', title: 'Client Meeting', project: 'FitApp', time: '15:30 - 16:30' },
          ].map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white truncate tracking-tight">{task.title}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{task.project} • {task.time}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;