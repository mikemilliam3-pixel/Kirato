
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { FileText, FileSearch, MessageCircle, ClipboardCheck, Plus, Search, ChevronRight, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = legalTranslations[language].dashboard;

  const kpis = [
    { label: t.templatesSaved, value: "12", icon: FileText, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: t.docsGenerated, value: "48", icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.clausesChecked, value: "156", icon: FileSearch, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: t.activeChecklists, value: "3", icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
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

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.newTemplate}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center">
              <Search size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.explainClause}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.startQA}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
              <ClipboardCheck size={20} />
            </div>
            <span className="text-xs font-bold text-left leading-tight">{t.createChecklist}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Recent Activity</h3>
        {[
          { title: "NDA for Tech Project", action: "Generated", time: "2 hours ago", icon: FileText, color: "text-blue-500" },
          { title: "Liability Clause", action: "Explained", time: "Yesterday", icon: FileSearch, color: "text-amber-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
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
