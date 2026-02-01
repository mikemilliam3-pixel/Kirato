
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { AlertCircle, ChevronRight, Check } from 'lucide-react';

const Intake: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].intake;
  const [step, setStep] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [redFlags, setRedFlags] = useState<string[]>([]);

  const flags = ["Chest Pain", "Breathing Difficulty", "Sudden Weakness", "Severe Bleeding"];

  const toggleFlag = (flag: string) => {
    setRedFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 mx-1 rounded-full transition-colors ${s <= step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-800'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right duration-300">
          <h3 className="text-lg font-bold">{t.concern}</h3>
          <textarea 
            className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
            placeholder="Describe your symptoms briefly..."
          />
          <button onClick={() => setStep(2)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div>
            <h3 className="text-lg font-bold mb-4">{t.severity}</h3>
            <div className="flex justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-gray-400">Mild</span>
              <span className="text-[10px] font-bold text-gray-400">Moderate</span>
              <span className="text-[10px] font-bold text-gray-400">Severe</span>
            </div>
            <input 
              type="range" min="1" max="3" step="1" value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          <button onClick={() => setStep(3)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            Next <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <h3 className="text-lg font-bold">{t.redFlags}</h3>
          <div className="grid grid-cols-1 gap-2">
            {flags.map((flag) => (
              <button 
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  redFlags.includes(flag) 
                  ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/20' 
                  : 'bg-white border-gray-100 text-slate-600 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <span className="text-sm font-bold">{flag}</span>
                {redFlags.includes(flag) && <Check size={18} />}
              </button>
            ))}
          </div>

          {redFlags.length > 0 && (
            <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200 leading-tight italic">
                {t.urgentWarning}
              </p>
            </div>
          )}

          <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg">
            {t.submit}
          </button>
        </div>
      )}
    </div>
  );
};

export default Intake;
