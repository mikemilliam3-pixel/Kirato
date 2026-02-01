
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Search, UserPlus, MoreVertical, Mail, Phone, Hash, ChevronRight } from 'lucide-react';

const ClientCRM: React.FC = () => {
  const { language } = useApp();
  const tc = freelancerTranslations[language].common;

  const clients = [
    { id: '1', name: 'John Doe', company: 'Acme Corp', status: 'active', tags: ['High Value', 'Design'] },
    { id: '2', name: 'Sarah Connor', company: 'Cyberdyne', status: 'active', tags: ['Retainer'] },
    { id: '3', name: 'Peter Parker', company: 'Daily Bugle', status: 'inactive', tags: ['Photography'] },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={tc.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <UserPlus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{client.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{client.company}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {client.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-slate-900 rounded-lg text-[8px] font-bold text-gray-500 uppercase flex items-center gap-0.5">
                  <Hash size={10} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50 dark:border-slate-700">
              <button className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2">
                <Mail size={12} /> Email
              </button>
              <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2">
                <Phone size={12} /> Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientCRM;
