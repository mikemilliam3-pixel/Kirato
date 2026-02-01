
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { Calendar, Sparkles, FolderHeart, MessageSquareCode, Clock, ChevronRight, Plus, CalendarRange } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].dashboard;

  const kpis = [
    { label: t.scheduled, value: "12", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: t.generated, value: "45", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: t.saved, value: "128", icon: FolderHeart, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { label: t.activeVoice, value: "Luxury", icon: MessageSquareCode, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ];

  const upcomingPosts = [
    { id: '1', platform: 'Instagram', time: 'Today, 18:00', title: 'New Collection Launch', status: 'Scheduled' },
    { id: '2', platform: 'Telegram', time: 'Tomorrow, 10:00', title: 'Daily Market Update', status: 'Draft' },
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
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.quickActions}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 bg-purple-600 text-white rounded-2xl active:scale-95 transition-all shadow-lg shadow-purple-200 dark:shadow-none">
            <Plus size={20} />
            <span className="text-xs font-bold">{t.createPost}</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl active:scale-95 transition-all">
            <CalendarRange size={20} className="text-purple-600" />
            <span className="text-xs font-bold">{t.openPlanner}</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.thisWeek}</h3>
        <div className="space-y-3">
          {upcomingPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold">{post.title}</p>
                  <p className="text-[10px] text-gray-500">{post.platform} • {post.time}</p>
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
