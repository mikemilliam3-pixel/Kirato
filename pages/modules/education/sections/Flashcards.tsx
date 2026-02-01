
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { Copy, Plus, MoreVertical, Layers } from 'lucide-react';

const Flashcards: React.FC = () => {
  const { language } = useApp();
  const t = eduTranslations[language].dashboard;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-lg">My Decks</h3>
        <button className="p-2 bg-blue-600 text-white rounded-xl active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "React Interview", cards: 45, due: 12, color: "bg-blue-500" },
          { title: "English Vocab", cards: 120, due: 0, color: "bg-emerald-500" },
          { title: "Design Patterns", cards: 32, due: 5, color: "bg-indigo-500" },
          { title: "AWS Cloud", cards: 88, due: 20, color: "bg-orange-500" },
        ].map((deck, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${deck.color}`} />
            <div className="flex flex-col h-full">
              <div className="flex justify-between mb-4">
                <Layers className="text-slate-400" size={20} />
                <button className="text-slate-300"><MoreVertical size={16} /></button>
              </div>
              <h4 className="font-bold text-sm mb-1">{deck.title}</h4>
              <p className="text-[10px] text-gray-500 mb-6">{deck.cards} Cards</p>
              
              <button className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all ${
                deck.due > 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 dark:bg-slate-900'
              }`}>
                {deck.due > 0 ? `Study ${deck.due} Due` : 'All Done'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
