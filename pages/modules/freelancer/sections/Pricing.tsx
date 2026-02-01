
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Calculator, Save, Info, ArrowRight } from 'lucide-react';

const Pricing: React.FC = () => {
  const { language } = useApp();
  const t = freelancerTranslations[language].sections;
  const tc = freelancerTranslations[language].common;

  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(50);
  const [complexity, setComplexity] = useState(1.2);

  const total = Math.round(hours * rate * complexity);

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-emerald-600 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={24} className="opacity-80" />
          <h3 className="text-lg font-bold">Pricing Calculator</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Recommended Price</p>
          <h4 className="text-4xl font-extrabold">${total}</h4>
        </div>
        <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
          <Save size={16} /> Save Template
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase">Hourly Rate ($)</label>
            <span className="text-sm font-bold text-emerald-600">${rate}</span>
          </div>
          <input 
            type="range" min="10" max="200" step="5" value={rate}
            onChange={(e) => setRate(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-xs font-bold text-gray-500 uppercase">Estimated Hours</label>
            <span className="text-sm font-bold text-emerald-600">{hours}h</span>
          </div>
          <input 
            type="range" min="1" max="100" value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Complexity</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: 'Simple', v: 1.0 },
              { l: 'Medium', v: 1.2 },
              { l: 'Hard', v: 1.5 },
            ].map(lvl => (
              <button 
                key={lvl.l}
                onClick={() => setComplexity(lvl.v)}
                className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${
                  complexity === lvl.v 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/20' 
                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-400'
                }`}
              >
                {lvl.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
        <Info size={20} className="text-blue-500 mt-1" />
        <p className="text-[10px] text-blue-600/80 dark:text-blue-500/80 leading-relaxed">
          Higher complexity adds a 20-50% buffer for revisions and unexpected technical challenges.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
