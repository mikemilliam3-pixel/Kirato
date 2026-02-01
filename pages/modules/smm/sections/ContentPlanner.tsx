
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { Calendar as CalendarIcon, Plus, Filter, Instagram, Send, Video } from 'lucide-react';

const ContentPlanner: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].planner;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Calendar</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
          <Plus size={16} />
          {t.addPost}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-2">{d}</div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                i === 14 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {i + 1}
              {i === 15 && <div className="absolute translate-y-3 w-1 h-1 bg-purple-400 rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-[10px] font-bold">All Platforms</button>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-500 rounded-full text-[10px] font-bold border border-gray-100 dark:border-slate-700 flex items-center gap-2">
          <Instagram size={12} /> Instagram
        </button>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-500 rounded-full text-[10px] font-bold border border-gray-100 dark:border-slate-700 flex items-center gap-2">
          <Send size={12} /> Telegram
        </button>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-purple-600 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Instagram size={14} className="text-pink-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">18:00 • Scheduled</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">✨ Discover our new sustainable collection. Link in bio!</p>
        </div>
      </div>
    </div>
  );
};

export default ContentPlanner;
