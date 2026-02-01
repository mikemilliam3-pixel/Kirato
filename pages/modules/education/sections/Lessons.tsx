
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { Search, BookOpen, Bookmark, CheckCircle, Clock } from 'lucide-react';

const Lessons: React.FC = () => {
  const { language } = useApp();
  const tc = eduTranslations[language].common;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-3">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={tc.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { title: "Asynchronous JavaScript", topic: "Programming", level: tc.advanced, done: true, bookmarked: true },
          { title: "Micro-interactions in UI", topic: "Design", level: tc.intermediate, done: false, bookmarked: false },
          { title: "Python for Data Analysis", topic: "Data", level: tc.beginner, done: false, bookmarked: true },
          { title: "English Grammar: Passive Voice", topic: "Languages", level: tc.beginner, done: true, bookmarked: false },
        ].map((lesson, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${lesson.done ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'} dark:bg-slate-900`}>
              {lesson.done ? <CheckCircle size={24} /> : <BookOpen size={24} />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold truncate">{lesson.title}</h4>
              <p className="text-[10px] text-gray-500 font-medium">{lesson.topic} • {lesson.level}</p>
            </div>
            <button className={`${lesson.bookmarked ? 'text-amber-500' : 'text-slate-300'}`}>
              <Bookmark size={18} fill={lesson.bookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
