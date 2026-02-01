
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Backpack, CheckCircle2, Circle, MoreVertical, Plus, ListChecks } from 'lucide-react';

const Packing: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];
  
  const [items, setItems] = useState([
    { id: '1', name: 'Passport', packed: true, category: 'Documents' },
    { id: '2', name: 'Power Bank', packed: true, category: 'Electronics' },
    { id: '3', name: 'Sunscreen', packed: false, category: 'Toiletries' },
    { id: '4', name: 'Summer Hat', packed: false, category: 'Clothes' },
    { id: '5', name: 'Walking Shoes', packed: true, category: 'Clothes' },
  ]);

  const togglePacked = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
  };

  const packedCount = items.filter(i => i.packed).length;
  const progress = Math.round((packedCount / items.length) * 100);

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Backpack className="text-amber-500" size={20} />
            <h3 className="font-bold text-sm">Packing Progress</h3>
          </div>
          <span className="text-xl font-extrabold text-amber-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-50 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">{packedCount} of {items.length} items packed</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {['All', 'Documents', 'Clothes', 'Electronics', 'Toiletries'].map(cat => (
          <button key={cat} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-[10px] font-bold text-gray-500 whitespace-nowrap active:bg-amber-500 active:text-white transition-all">
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => togglePacked(item.id)}
            className={`w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-all active:scale-[0.98] ${
              item.packed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {item.packed ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <Circle className="text-gray-300" size={20} />
              )}
              <div className="text-left">
                <p className={`text-sm font-bold ${item.packed ? 'line-through text-gray-400' : 'text-slate-900 dark:text-white'}`}>
                  {item.name}
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
              </div>
            </div>
            <MoreVertical size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-200 dark:shadow-none">
          <Plus size={20} /> Add Item
        </button>
        <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-500 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
          <ListChecks size={18} className="text-amber-500" /> Use Template
        </button>
      </div>
    </div>
  );
};

export default Packing;
