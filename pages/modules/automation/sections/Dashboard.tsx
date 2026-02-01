
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { Zap, Activity, ClipboardList, Users, Plus, Link, UserPlus, ChevronRight, Clock } from 'lucide-react';

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
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-1">{kpi.label}</p>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl text-white shadow-xl shadow-cyan-200 dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Last used workflow</span>
            <h3 className="text-xl font-bold">Client Onboarding</h3>
          </div>
          <Zap size={32} />
        </div>
        <p className="text-xs opacity-90 mb-6">Successfully triggered 12 mins ago. All steps completed.</p>
        <button className="w-full py-3 bg-white text-cyan-700 rounded-xl font-bold text-xs active:scale-95 transition-all">
          View Execution Logs
        </button>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.newWorkflow}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.newTemplate}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <Link size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.manageIntegrations}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.inviteMember}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Recent Activity</h3>
        {[
          { title: "Invoice Automation", action: "Workflow triggered", time: "2 mins ago", icon: Zap, color: "text-cyan-500" },
          { title: "Weekly Report Template", action: "Template updated", time: "1 hour ago", icon: ClipboardList, color: "text-purple-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.action} • {item.time}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
