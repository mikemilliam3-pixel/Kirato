
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { Hash, Search, Copy, Check } from 'lucide-react';

const HashtagSEO: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].hashtag;

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl mb-4">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search keywords..." 
            className="bg-transparent border-none text-xs focus:ring-0 w-full"
          />
        </div>
        <button className="w-full py-3 bg-purple-600 text-white rounded-xl text-xs font-bold">Find Best Tags</button>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Trending Set #1</span>
            <button className="text-gray-400"><Copy size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#business', '#growth', '#strategy', '#marketing', '#ai', '#future', '#trends'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashtagSEO;
