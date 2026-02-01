
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { UserCheck, Plus, CheckCircle2, MoreVertical, Edit3 } from 'lucide-react';

const BrandVoice: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].voice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Profiles</h3>
        <button className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-600 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <CheckCircle2 size={20} className="text-purple-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Luxury Lifestyle</h4>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Profile</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400 font-bold uppercase">Audience</span>
              <span className="font-bold">High-net worth, 25-45</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400 font-bold uppercase">Tone</span>
              <span className="font-bold">Elegant, Exclusive, Sophisticated</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm opacity-60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 text-gray-400 rounded-xl flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <h4 className="font-bold text-sm">Tech Casual</h4>
            </div>
            <button className="text-gray-400"><MoreVertical size={16} /></button>
          </div>
          <button className="w-full py-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-purple-600 hover:text-white transition-all">
            Set as Active
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandVoice;
