
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { Search, Map, ChevronRight, Star } from 'lucide-react';

const LearningPaths: React.FC = () => {
  const { language } = useApp();
  const tc = eduTranslations[language].common;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={tc.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { title: "Fullstack Developer", level: tc.intermediate, progress: 35, modules: 12 },
          { title: "Data Science Specialization", level: tc.advanced, progress: 10, modules: 8 },
          { title: "Digital Marketing 101", level: tc.beginner, progress: 100, modules: 5 },
        ].map((path, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                  <Map size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{path.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{path.level} • {path.modules} Modules</span>
                </div>
              </div>
              {path.progress === 100 && <Star fill="#fbbf24" className="text-amber-400" size={18} />}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-gray-400">Progress</span>
                <span className="text-blue-600">{path.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${path.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                  style={{ width: `${path.progress}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPaths;
