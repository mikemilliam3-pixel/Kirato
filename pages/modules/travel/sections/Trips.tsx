
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Search, Map, Calendar, Users, ChevronRight, Plus, Filter } from 'lucide-react';

const Trips: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];

  const trips = [
    { id: '1', name: 'Summer in Paris', cities: ['Paris', 'Lyon'], dates: 'Aug 15 - Aug 25', travelers: 2, status: 'active' },
    { id: '2', name: 'Tokyo Explorer', cities: ['Tokyo', 'Osaka', 'Kyoto'], dates: 'Oct 10 - Oct 22', travelers: 1, status: 'planned' },
    { id: '3', name: 'Alps Skiing', cities: ['Chamonix'], dates: 'Jan 05 - Jan 12', travelers: 4, status: 'completed' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30';
      case 'planned': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30';
      case 'completed': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30';
      default: return 'bg-gray-100 text-gray-600 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Your Trips</h3>
        <button className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={t.common.search} className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden relative group">
            <div className="absolute top-5 right-5">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(trip.status)}`}>
                {trip.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
                <Map size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{trip.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium">{trip.cities.join(' • ')}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                  <Calendar size={12} /> {trip.dates}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                  <Users size={12} /> {trip.travelers} Persons
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
