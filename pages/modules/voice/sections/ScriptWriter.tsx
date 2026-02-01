
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
import { FileText, Plus, Search, Sparkles, Clock, MoreVertical, Edit3, Save } from 'lucide-react';

const ScriptWriter: React.FC = () => {
  const { language } = useApp();
  const t = voiceTranslations[language].scripts;
  const [view, setView] = useState<'list' | 'editor'>('list');

  const scripts = [
    { id: '1', title: 'Product Launch Ad', purpose: 'Ads', tone: 'Energetic', duration: '30s', updated: '2h ago' },
    { id: '2', title: 'Tutorial Voiceover', purpose: 'Youtube', tone: 'Professional', duration: '5m', updated: '1d ago' },
  ];

  if (view === 'editor') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
        <div className="flex items-center justify-between">
          <button onClick={() => setView('list')} className="text-xs font-bold text-orange-600">← Back</button>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-slate-500"><MoreVertical size={16} /></button>
            <button className="p-2 bg-orange-500 text-white rounded-lg shadow-md"><Save size={16} /></button>
          </div>
        </div>

        <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <input 
            type="text" 
            placeholder="Script Title" 
            className="w-full text-xl font-extrabold bg-transparent border-none focus:ring-0 p-0"
            defaultValue="Summer Sale Promo"
          />
          <div className="flex gap-2">
             <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-[9px] font-bold rounded uppercase">Ads</span>
             <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-bold rounded uppercase">Energetic</span>
          </div>
          <div className="h-px bg-gray-50 dark:bg-slate-700" />
          <textarea 
            className="w-full h-64 bg-transparent border-none focus:ring-0 text-sm leading-relaxed p-0 resize-none"
            placeholder="Start writing your script here..."
            defaultValue="Hey everyone! Are you ready for the hottest sale of the year? We're bringing you 50% OFF on all items. Don't wait, click the link below!"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{t.structure}</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Hook', 'Problem', 'Solution', 'CTA'].map(part => (
              <button key={part} className="py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[10px] font-bold text-slate-500 active:bg-orange-500 active:text-white transition-all">
                + {part}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t.estimated}</span>
          </div>
          <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">~15 seconds</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">My Scripts</h3>
        <button 
          onClick={() => setView('editor')}
          className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={t.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="space-y-3">
        {scripts.map((script) => (
          <div key={script.id} onClick={() => setView('editor')} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{script.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{script.purpose} • {script.tone}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
               <span className="text-[10px] text-gray-400 font-bold uppercase">Updated {script.updated}</span>
               <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-500">
                  <Clock size={12} /> {script.duration}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptWriter;
