
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Users, Folder, Send, DollarSign, ListTodo, Plus, UserPlus, Clock, Play, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-1">{kpi.label}</p>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.newProposal}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.addClient}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
              <Play size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.startTimer}</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1 flex items-center gap-2">
          <ListTodo size={16} className="text-emerald-600" />
          {t.todayTasks}
        </h3>
        <div className="space-y-3">
          {[
            { id: '1', title: 'Design Landing Page', project: 'EcoStore', time: '10:00 - 13:00' },
            { id: '2', title: 'Client Meeting', project: 'FitApp', time: '15:30 - 16:30' },
          ].map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</p>
                  <p className="text-[10px] text-gray-500">{task.project} • {task.time}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
