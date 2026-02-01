
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Heart, Search, Hash, Star, Plus, MapPin, ArrowRight } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];

  const wishes = [
    { id: '1', name: 'Montmartre Artists Square', city: 'Paris', priority: 'high', tags: ['Culture', 'Art'] },
    { id: '2', name: 'Ladurée Macarons', city: 'Paris', priority: 'med', tags: ['Food'] },
    { id: '3', name: 'Canal Saint-Martin', city: 'Paris', priority: 'low', tags: ['Nature', 'Walk'] },
    { id: '4', name: 'Versailles Palace', city: 'Versailles', priority: 'high', tags: ['History'] },
  ];

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'text-rose-500';
      case 'med': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search ideas..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wishes.map((wish) => (
          <div key={wish.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center">
                  <Heart size={20} fill={wish.priority === 'high' ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{wish.name}</h4>
                  <p className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <MapPin size={10} /> {wish.city}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${getPriorityColor(wish.priority)}`}>
                {wish.priority}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {wish.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[9px] font-bold text-gray-500 uppercase flex items-center gap-0.5">
                  <Hash size={10} /> {tag}
                </span>
              ))}
            </div>

            <button className="w-full py-2 bg-gray-50 dark:bg-slate-900 hover:bg-amber-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 transition-all">
              Move to Itinerary <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
