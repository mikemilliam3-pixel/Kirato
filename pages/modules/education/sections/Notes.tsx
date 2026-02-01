
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { StickyNote, Search, Plus, Hash, Clock } from 'lucide-react';

const Notes: React.FC = () => {
  const { language } = useApp();
  const tc = eduTranslations[language].common;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-3">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={tc.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { title: "React State Management", excerpt: "Context API vs Redux vs Zustand. Use context for low-freq updates...", tags: ["React", "Programming"], date: "May 24" },
          { title: "UX Psychology Principles", excerpt: "Gestalt laws, Hicks law, Fitt's law. Focus on cognitive load...", tags: ["Design", "Psychology"], date: "May 22" },
        ].map((note, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-blue-600">{note.title}</h4>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                <Clock size={12} /> {note.date}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
              {note.excerpt}
            </p>
            <div className="flex gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[9px] font-bold text-gray-500 uppercase flex items-center gap-0.5">
                  <Hash size={10} /> {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
