
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { FileText, Search, Plus, Filter, MoreVertical, Download, Edit3 } from 'lucide-react';

const Templates: React.FC = () => {
  const { language } = useApp();
  const t = legalTranslations[language];

  const templates = [
    { id: '1', title: 'Non-Disclosure Agreement', category: 'NDA', updated: '2 days ago' },
    { id: '2', title: 'Master Service Agreement', category: 'Service Agreement', updated: '1 week ago' },
    { id: '3', title: 'Employment Contract', category: 'Employment', updated: 'May 15, 2024' },
    { id: '4', title: 'Sales Terms & Conditions', category: 'Sales', updated: 'May 10, 2024' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">My Templates</h3>
        <button className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={t.common.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm truncate max-w-[200px]">{tpl.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tpl.category}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Updated {tpl.updated}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all">
                  <Edit3 size={16} />
                </button>
                <button className="p-2 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
