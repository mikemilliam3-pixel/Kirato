import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { FileText, FileSearch, MessageCircle, ClipboardCheck, Plus, Search, ChevronRight } from 'lucide-react';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.newTemplate}</span>
          </button>
          <button className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Search size={20} />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.explainClause}</span>
          </button>
          <button className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle size={20} />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.startQA}</span>
          </button>
          <button className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ClipboardCheck size={20} />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 text-left">{t.createChecklist}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;