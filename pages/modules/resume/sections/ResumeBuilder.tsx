
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { resumeTranslations } from '../i18n';
import { User, Briefcase, GraduationCap, Zap, Plus, Trash2, ChevronRight, Save } from 'lucide-react';

const ResumeBuilder: React.FC = () => {
  const { language } = useApp();
  const t = resumeTranslations[language].builder;
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'education' | 'skills'>('profile');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl">
        {(['profile', 'experience', 'education', 'skills'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            {t[tab as keyof typeof t]}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" defaultValue="John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Desired Title</label>
              <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" defaultValue="Senior Product Manager" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Summary</label>
              <textarea className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none h-24" defaultValue="Experienced manager with 10+ years in tech..." />
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl relative">
                <button className="absolute top-4 right-4 text-rose-500"><Trash2 size={16} /></button>
                <h4 className="font-bold text-xs mb-3 text-blue-600">Experience #{i}</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Company Name" className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs border-none" />
                  <input type="text" placeholder="Role" className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs border-none" />
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-gray-400 text-xs font-bold">
              <Plus size={16} /> Add Experience
            </button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Project Management', 'Agile', 'UI/UX'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full text-[10px] font-bold flex items-center gap-2">
                  {skill} <Trash2 size={10} className="opacity-50" />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add skill..." className="flex-1 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" />
              <button className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center"><Plus size={20} /></button>
            </div>
          </div>
        )}
        
        {activeTab === 'education' && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <GraduationCap size={40} className="mb-2 opacity-20" />
            <p className="text-xs font-bold">No education history added yet</p>
          </div>
        )}
      </div>

      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all">
        <Save size={20} />
        {t.saveResume}
      </button>
    </div>
  );
};

export default ResumeBuilder;
