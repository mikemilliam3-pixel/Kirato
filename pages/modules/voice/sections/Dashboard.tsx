
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
import { FolderOpen, FileText, Mic, Download, Plus, ChevronRight, Clock, Star, PlayCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = voiceTranslations[language].dashboard;

  const kpis = [
    { label: t.activeProjects, value: "4", icon: FolderOpen, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: t.scriptsCreated, value: "18", icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.plannedRecs, value: "6", icon: Mic, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
    { label: t.exportJobs, value: "2", icon: Download, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
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

      <div className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl text-white shadow-xl shadow-orange-200 dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Continue Working</span>
            <h3 className="text-xl font-bold">Podcast Ep. 42 Mix</h3>
          </div>
          <PlayCircle size={32} />
        </div>
        <p className="text-xs opacity-90 mb-6">Last edited 45 mins ago. 3 script sections pending review.</p>
        <button className="w-full py-3 bg-white text-orange-600 rounded-xl font-bold text-xs active:scale-95 transition-all">
          {t.continueWorking}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.newScript}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl flex items-center justify-center">
              <FolderOpen size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.newProject}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center">
              <Mic size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.addPlan}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Recent Activity</h3>
        {[
          { title: "Script 'Ad Campaign' exported", time: "2 hours ago", icon: Download, color: "text-emerald-500" },
          { title: "Added VO for Project Alpha", time: "5 hours ago", icon: Mic, color: "text-rose-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
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
