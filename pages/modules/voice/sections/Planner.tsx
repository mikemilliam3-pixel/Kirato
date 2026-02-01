
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
import { ClipboardList, Plus, Sparkles, Mic, MoreVertical, CheckCircle2, Circle, GripVertical } from 'lucide-react';

const Planner: React.FC = () => {
  const { language } = useApp();
  const t = voiceTranslations[language].planner;

  const [items, setItems] = useState([
    { id: '1', title: 'Intro Hook', speaker: 'Sarah', duration: '5s', status: 'done', notes: 'High energy' },
    { id: '2', title: 'Main Problem Statement', speaker: 'Sarah', duration: '15s', status: 'recording', notes: 'More serious tone' },
    { id: '3', title: 'Solution Explanation', speaker: 'Mike', duration: '45s', status: 'todo', notes: 'Professional/Technical' },
    { id: '4', title: 'Outro / CTA', speaker: 'Sarah', duration: '10s', status: 'todo', notes: 'Warm & friendly' },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'done': return 'text-emerald-500';
      case 'recording': return 'text-blue-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="font-bold text-sm mb-4">Target Project</h3>
        <select className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold text-orange-600">
          <option>Corporate Training Video</option>
          <option>Summer Radio Spot</option>
        </select>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-lg">Recording Plan</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg text-[10px] font-bold active:scale-95 transition-all">
          <Sparkles size={14} /> AI Auto-Plan
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 group">
            <button className="text-slate-300 cursor-grab active:cursor-grabbing"><GripVertical size={16} /></button>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(item.status)}`}>
               {item.status === 'done' ? <CheckCircle2 size={24} /> : item.status === 'recording' ? <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Circle size={24} />}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold">{item.title}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.speaker} • {item.duration} • {item.notes}</p>
            </div>
            <button className="text-slate-300"><MoreVertical size={16} /></button>
          </div>
        ))}
        
        <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2 text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-all">
          <Plus size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Add Item</span>
        </button>
      </div>
    </div>
  );
};

export default Planner;
