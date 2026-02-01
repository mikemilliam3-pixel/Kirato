
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { eduTranslations } from '../i18n';
import { CalendarDays, Plus, Bell, CheckCircle } from 'lucide-react';

const StudySchedule: React.FC = () => {
  const { language } = useApp();
  const t = eduTranslations[language].sections;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-lg">My Schedule</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          <Plus size={16} /> New Session
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={day} className={`flex flex-col items-center gap-2 min-w-[50px] p-3 rounded-2xl border transition-all ${
            i === 2 ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-500'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">{day}</span>
            <span className="text-sm font-extrabold">{20 + i}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { time: "10:00 AM", title: "React Mastery Course", type: "Lesson", done: true },
          { time: "02:00 PM", title: "Flashcard Review", type: "Study", done: false },
          { time: "05:30 PM", title: "Python Algorithm Practice", type: "Coding", done: false },
        ].map((session, i) => (
          <div key={i} className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between ${
            session.done ? 'border-l-emerald-500' : 'border-l-blue-600'
          }`}>
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <p className="text-[10px] font-bold text-gray-400">{session.time}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold">{session.title}</h4>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{session.type}</p>
              </div>
            </div>
            {session.done ? (
              <CheckCircle size={20} className="text-emerald-500" />
            ) : (
              <Bell size={20} className="text-slate-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudySchedule;
