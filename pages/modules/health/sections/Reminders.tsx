
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { Bell, Clock, Plus, MoreVertical } from 'lucide-react';

const Reminders: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].sections;

  const reminders = [
    { title: "Hydration Reminder", time: "Every 2 hours", active: true },
    { title: "Bedtime", time: "10:30 PM", active: true },
    { title: "Medication", time: "09:00 AM", active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-extrabold">My Reminders</h3>
        <button className="text-emerald-600 font-bold text-xs flex items-center gap-1">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, idx) => (
          <div key={idx} className={`p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between transition-opacity ${!reminder.active && 'opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'} dark:bg-slate-900`}>
                <Bell size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">{reminder.title}</h4>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                  <Clock size={12} /> {reminder.time}
                </div>
              </div>
            </div>
            <button className={`w-12 h-6 rounded-full p-1 transition-all ${reminder.active ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${reminder.active ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
