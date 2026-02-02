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
    { id: '3', platform: 'TikTok', time: 'Wednesday, 14:00', title: 'Unboxing Video', status: 'Draft' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.quickActions}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button className="flex items-center gap-4 p-5 sm:p-6 bg-purple-600 text-white rounded-[24px] sm:rounded-[32px] active:scale-95 transition-all shadow-lg shadow-purple-200 dark:shadow-none hover:bg-purple-700 h-16 sm:h-20">
              <Plus size={24} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest">{t.createPost}</span>
            </button>
            <button className="flex items-center gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[24px] sm:rounded-[32px] active:scale-95 transition-all shadow-sm hover:shadow-md h-16 sm:h-20">
              <CalendarRange size={24} className="text-purple-600" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.openPlanner}</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.thisWeek}</h3>
          <div className="space-y-3">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                    <Clock size={20} className="text-slate-400 group-hover:text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm md:text-base font-bold truncate tracking-tight">{post.title}</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{post.platform} • {post.time}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;