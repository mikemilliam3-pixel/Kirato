
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Plane, Hotel, Compass, Utensils, Train, Sparkles, Plus, Clock, MapPin } from 'lucide-react';

const Itinerary: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];
  const [activeDay, setActiveDay] = useState(1);

  const days = [1, 2, 3, 4, 5, 6, 7];
  
  const itineraryItems = [
    { id: '1', time: '09:00', title: 'Breakfast at Café de Flore', type: 'food', location: 'Saint-Germain-des-Prés', cost: 25 },
    { id: '2', time: '11:00', title: 'Louvre Museum Tour', type: 'activity', location: 'Rue de Rivoli', cost: 40 },
    { id: '3', time: '14:30', title: 'Seine River Cruise', type: 'activity', location: 'Pont Neuf', cost: 15 },
    { id: '4', time: '19:00', title: 'Dinner at Le Jules Verne', type: 'food', location: 'Eiffel Tower', cost: 120 },
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'food': return Utensils;
      case 'transport': return Train;
      default: return Compass;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-slate-700 flex gap-2 overflow-x-auto no-scrollbar">
        {days.map(d => (
          <button 
            key={d}
            onClick={() => setActiveDay(d)}
            className={`min-w-[60px] py-4 rounded-2xl flex flex-col items-center gap-1 transition-all ${
              activeDay === d 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'bg-transparent text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase opacity-80">Day</span>
            <span className="text-sm font-extrabold">{d}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-lg">Day {activeDay} Schedule</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl text-xs font-bold active:scale-95 transition-all">
          <Sparkles size={14} /> AI Generate
        </button>
      </div>

      <div className="space-y-4 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-slate-800">
        {itineraryItems.map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <div key={item.id} className="flex gap-4 relative">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-center z-10">
                <Icon size={20} className="text-amber-500" />
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                    <Clock size={12} /> {item.time}
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-500">${item.cost}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="flex items-center gap-1 text-[10px] text-gray-500">
                  <MapPin size={10} /> {item.location}
                </p>
              </div>
            </div>
          );
        })}
        
        <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2 text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-all">
          <Plus size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">{t.dashboard.addItem}</span>
        </button>
      </div>
    </div>
  );
};

export default Itinerary;
