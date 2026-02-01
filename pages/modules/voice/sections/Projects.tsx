
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
import { FolderOpen, Search, Filter, Plus, ChevronRight, Hash, MoreVertical } from 'lucide-react';

const Projects: React.FC = () => {
  const { language } = useApp();
  const t = voiceTranslations[language];

  const projects = [
    { id: '1', title: 'Corporate Training Video', status: 'active', tags: ['Learning', 'B2B'], scripts: 3 },
    { id: '2', title: 'Summer Radio Spot', status: 'done', tags: ['Ads', 'Retail'], scripts: 1 },
    { id: '3', title: 'Audiobook: Chapter 1', status: 'draft', tags: ['Creative'], scripts: 5 },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30';
      case 'done': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30';
      case 'draft': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30';
      default: return 'bg-gray-100 text-gray-600 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Projects</h3>
        <button className="p-3 bg-orange-500 text-white rounded-xl shadow-lg active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search projects..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative group overflow-hidden">
            <div className="absolute top-5 right-5 flex items-center gap-3">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(proj.status)}`}>
                {proj.status}
              </span>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-2xl flex items-center justify-center">
                <FolderOpen size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm pr-20 truncate">{proj.title}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{proj.scripts} linked scripts</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {proj.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-slate-900 rounded-lg text-[8px] font-bold text-gray-400 uppercase flex items-center gap-0.5">
                  <Hash size={10} /> {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full py-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 group-hover:bg-orange-500 group-hover:text-white transition-all">
              Manage Project <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
