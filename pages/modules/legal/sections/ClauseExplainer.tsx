
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { FileSearch, Sparkles, AlertCircle, CheckCircle2, Info, History } from 'lucide-react';

const ClauseExplainer: React.FC = () => {
  const { language } = useApp();
  const t = legalTranslations[language];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleExplain = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Paste Clause or Text</label>
          <textarea 
            className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-xs border-none focus:ring-2 focus:ring-rose-500 min-h-[150px]"
            placeholder="Paste the legal text you want to analyze here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.common.jurisdiction}</label>
            <select className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none">
              <option>International</option>
              <option>United States</option>
              <option>European Union</option>
              <option>Central Asia</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.common.category}</label>
            <select className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none">
              <option>Commercial</option>
              <option>Employment</option>
              <option>IP / Privacy</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleExplain}
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-rose-200 dark:shadow-none"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={18} />}
          Analyze Clause
        </button>
      </div>

      {result && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-rose-600">
              <FileSearch size={18} />
              <h4 className="font-bold text-sm">Explanation</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              This clause limits your liability for indirect or consequential damages. In plain terms, if you make a mistake, you only pay for the direct loss, not for lost profits or secondary costs the client might incur.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-0.5">Risk Flag</p>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-200/60">The current cap might be too low given the project value. Consider raising it.</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Standard Practice</p>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-200/60">This exclusion is standard in most B2B service agreements.</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
            <History size={16} /> Save to History
          </button>
        </div>
      )}
    </div>
  );
};

export default ClauseExplainer;
