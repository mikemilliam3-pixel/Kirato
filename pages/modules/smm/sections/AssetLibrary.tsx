
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { Library, Search, Filter, Star, FileText, Image as ImageIcon, MoreVertical } from 'lucide-react';

const AssetLibrary: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].library;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search assets..." className="bg-transparent border-none text-xs focus:ring-0" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative group">
            <button className="absolute top-2 right-2 text-gray-300 group-hover:text-amber-400 transition-colors">
              <Star size={14} fill={i === 1 ? 'currentColor' : 'none'} className={i === 1 ? 'text-amber-400' : ''} />
            </button>
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center mb-3">
              {i % 2 === 0 ? <ImageIcon size={20} className="text-blue-500" /> : <FileText size={20} className="text-purple-500" />}
            </div>
            <h5 className="text-[11px] font-bold mb-1 truncate">Product Promo {i}</h5>
            <p className="text-[9px] text-gray-400">May 24, 2024</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetLibrary;
