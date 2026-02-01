
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { Flame, CheckCircle2, Trophy, Map, Play, Plus, BookOpen, FileQuestion, Copy, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = eduTranslations[language].dashboard;

  const kpis = [
    { label: t.activePath, value: "UI/UX Design", icon: Map, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.lessonsDone, value: "24/40", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.avgScore, value: "88%", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: t.streak, value: "7 Days", icon: Flame, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
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

      <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Next Lesson</span>
            <h3 className="text-lg font-bold">Principles of Hierarchy</h3>
          </div>
          <Play fill="white" size={24} />
        </div>
        <div className="w-full bg-white/20 h-1.5 rounded-full mb-4">
          <div className="bg-white h-full rounded-full" style={{ width: '60%' }}></div>
        </div>
        <button className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-xs active:scale-95 transition-all">
          {t.continueLearning}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.createPath}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center">
              <FileQuestion size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.startQuiz}</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
              <Copy size={20} />
            </div>
            <span className="text-[10px] font-bold text-center leading-tight">{t.openFlashcards}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Recent Activity</h3>
        {[
          { title: "Completed Quiz: Intro to React", time: "2 hours ago", icon: FileQuestion, color: "text-amber-500" },
          { title: "Finished Reading: Flexbox Basics", time: "5 hours ago", icon: BookOpen, color: "text-blue-500" }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
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
