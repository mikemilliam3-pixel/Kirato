
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { Droplets, Footprints, Moon, Brain, Plus } from 'lucide-react';

const HabitTracker: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].sections;

  const habits = [
    { name: "Water Intake", current: 1500, goal: 2500, unit: "ml", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { name: "Daily Steps", current: 6420, goal: 10000, unit: "steps", icon: Footprints, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { name: "Sleep Duration", current: 6.5, goal: 8, unit: "hrs", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { name: "Meditation", current: 5, goal: 10, unit: "min", icon: Brain, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-extrabold">Habit Tracker</h3>
        <button className="p-2 bg-emerald-600 text-white rounded-xl active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {habits.map((habit) => {
          const progress = Math.min(100, (habit.current / habit.goal) * 100);
          return (
            <div key={habit.name} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${habit.bg} rounded-2xl flex items-center justify-center`}>
                  <habit.icon size={24} className={habit.color} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{habit.name}</h4>
                  <p className="text-xs text-gray-500">
                    <span className="font-extrabold text-slate-900 dark:text-white">{habit.current}</span> / {habit.goal} {habit.unit}
                  </p>
                </div>
                <button className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl text-[10px] font-bold uppercase">
                  Add
                </button>
              </div>
              <div className="w-full bg-gray-50 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${habit.color.replace('text', 'bg')}`} 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
