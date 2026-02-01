
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { CheckCircle2, Circle, Apple, Moon, Zap, Footprints } from 'lucide-react';

const LifestylePlan: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].sections;

  const tasks = [
    { id: '1', task: "Drink 2.5L of water", done: true, icon: Zap, color: "text-blue-500" },
    { id: '2', task: "Walk 10,000 steps", done: false, icon: Footprints, color: "text-orange-500" },
    { id: '3', task: "7 hours of sleep", done: true, icon: Moon, color: "text-indigo-500" },
    { id: '4', task: "Eat 2 portions of fruit", done: false, icon: Apple, color: "text-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-emerald-600 rounded-3xl text-white shadow-xl">
        <h3 className="text-xl font-bold mb-2">My Wellness Plan</h3>
        <p className="text-xs opacity-80 mb-6">Personalized guidance based on your activity level and wellness goals.</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-extrabold">2/4</p>
            <p className="text-[10px] font-bold uppercase opacity-60">Tasks Completed Today</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap size={24} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Daily Checklist</h4>
        {tasks.map((item) => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center`}>
                <item.icon size={20} className={item.color} />
              </div>
              <span className={`text-sm font-bold ${item.done ? 'line-through text-gray-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {item.task}
              </span>
            </div>
            {item.done ? (
              <CheckCircle2 className="text-emerald-500" size={20} />
            ) : (
              <Circle className="text-gray-300" size={20} />
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl font-bold text-xs text-slate-600 dark:text-slate-400">
        Update Lifestyle Preferences
      </button>
    </div>
  );
};

export default LifestylePlan;
