
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { BarChart2, TrendingUp, Eye, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const Performance: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].performance;

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-purple-600" /> 
          Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Reach</span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-extrabold">42.8K</span>
              <span className="text-[10px] text-emerald-500 font-bold mb-1">+12%</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Engagement</span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-extrabold">4.2%</span>
              <span className="text-[10px] text-emerald-500 font-bold mb-1">+0.8%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold px-1">Best Performing Posts</h4>
        {[1, 2].map(p => (
          <div key={p} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 italic">
              "We just launched the 2024 Tech Roadmap! Check out what we have planned for the next 6 months..."
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold">12.4K</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold">842</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold">45</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
