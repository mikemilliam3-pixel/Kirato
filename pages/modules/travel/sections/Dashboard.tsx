import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Map, CalendarDays, Wallet, Backpack, Plus, Compass, Clock, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language].dashboard;

  const kpis = [
    { label: t.activeTrips, value: "2", icon: Map, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: t.daysPlanned, value: "14", icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.budgetTracked, value: "$2,400", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.packingDone, value: "85%", icon: Backpack, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 sm:p-5 md:p-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
              <kpi.icon size={22} className={kpi.color} />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 pointer-events-none">
          <Compass size={240} />
        </div>
        <div className="flex-1 relative z-10">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70">Current Adventure</span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mt-1">Summer in Paris</h3>
          <p className="text-xs sm:text-sm font-bold opacity-80 mt-2 max-w-md">3 days left to finalize your itinerary before departure on August 15th.</p>
        </div>
        <button className="h-12 sm:h-14 px-8 sm:px-10 bg-white text-orange-600 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg shrink-0 relative z-10">
          {t.continuePlanning}
        </button>
      </div>

      <div>
        <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.createTrip}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <CalendarDays size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.addItem}</span>
          </button>
          <button className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all hover:bg-gray-50 h-16 sm:h-20 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Backpack size={20} />
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.openPacking}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;