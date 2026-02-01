
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { ClipboardCheck, CheckCircle2, Circle, MoreVertical, Plus, Info } from 'lucide-react';

const Checklist: React.FC = () => {
  const { language } = useApp();
  const t = legalTranslations[language];
  
  const [items, setItems] = useState([
    { id: '1', task: 'Check jurisdiction clause', done: true },
    { id: '2', task: 'Review termination notice period', done: true },
    { id: '3', task: 'Confirm payment milestones', done: false },
    { id: '4', task: 'Verify IP ownership transfer', done: false },
    { id: '5', task: 'Check liability caps', done: false },
  ]);

  const toggleTask = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const doneCount = items.filter(i => i.done).length;
  const progress = Math.round((doneCount / items.length) * 100);

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <ClipboardCheck size={20} />
            <h3 className="font-bold text-sm">Review Progress</h3>
          </div>
          <span className="text-xl font-extrabold text-emerald-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-50 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">{doneCount} of {items.length} items checked</p>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-all active:scale-[0.98] ${
              item.done ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <Circle className="text-gray-300" size={20} />
              )}
              <div className="text-left">
                <p className={`text-sm font-bold ${item.done ? 'line-through text-gray-400' : 'text-slate-900 dark:text-white'}`}>
                  {item.task}
                </p>
              </div>
            </div>
            <MoreVertical size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none">
          <Plus size={20} /> Add Item
        </button>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
          <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-tight">
            Using "Standard Review Checklist". You can customize items for specific contract types.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
