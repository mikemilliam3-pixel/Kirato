
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { Activity, Flame, ClipboardCheck, Apple, ChevronRight, Play, CheckCircle2, Droplets } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].dashboard;

  const kpis = [
    { label: t.todayHabits, value: "3/5", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.streak, value: "12 Days", icon: Flame, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: t.lastIntake, value: "May 20", icon: ClipboardCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.activePlan, value: "Wellness", icon: Apple, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  return (
    <div className="space-y-6">
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

      <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Next Task</span>
            <h3 className="text-lg font-bold">15-Min Evening Walk</h3>
          </div>
          <Activity className="animate-pulse" size={24} />
        </div>
        <button className="w-full py-3 bg-white text-emerald-700 rounded-xl font-bold text-xs active:scale-95 transition-all">
          {t.viewPlan}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <ClipboardCheck size={20} />
            </div>
            <span className="text-xs font-bold">{t.startIntake}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <span className="text-xs font-bold">{t.logHabits}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Recent Activity</h3>
        {[
          { title: "Drank 500ml Water", time: "30 mins ago", icon: Droplets, color: "text-blue-500" },
          { title: "Completed Symptom Intake", time: "Yesterday", icon: ClipboardCheck, color: "text-emerald-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.time}</p>
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
