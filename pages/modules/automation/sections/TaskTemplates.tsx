
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { ClipboardList, Plus, Search, Tag, MoreVertical, Copy, ChevronRight } from 'lucide-react';

const TaskTemplates: React.FC = () => {
  const { language } = useApp();
  const t = autoTranslations[language];

  const templates = [
    { id: '1', title: 'Monthly Financial Audit', category: 'Finance', items: 15 },
    { id: '2', title: 'New Employee Kit', category: 'HR', items: 8 },
    { id: '3', title: 'Content Audit Pro', category: 'Marketing', items: 22 },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Templates</h3>
        <button className="p-3 bg-purple-600 text-white rounded-xl shadow-lg active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search templates..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tpl.title}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tpl.category}</span>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{tpl.items} Checklist Items</p>
            
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Copy size={14} /> Use Template
              </button>
              <button className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-slate-500 active:scale-95 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTemplates;
