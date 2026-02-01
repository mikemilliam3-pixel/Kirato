
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { resumeTranslations } from '../i18n';
import { Mic, Play, CheckCircle2, ChevronRight, Award, Zap, Brain, History } from 'lucide-react';

const InterviewPractice: React.FC = () => {
  const { language } = useApp();
  const t = resumeTranslations[language];
  const [step, setStep] = useState<'start' | 'session' | 'result'>('start');

  return (
    <div className="space-y-6 pb-20">
      {step === 'start' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <Mic size={32} />
            </div>
            <h3 className="text-xl font-extrabold mb-2">Practice Interview</h3>
            <p className="text-xs text-gray-500 px-6 mb-8">Refine your answers with AI. We'll ask 5 typical behavioral or technical questions.</p>
            <button 
              onClick={() => setStep('session')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Play size={20} fill="currentColor" /> Start New Session
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm px-1 flex items-center gap-2">
              <History size={16} className="text-blue-600" /> Recent Results
            </h3>
            {[
              { role: "Frontend Dev", score: 92, date: "May 22" },
              { role: "Product Designer", score: 78, date: "May 18" }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.score >= 90 ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'} dark:bg-slate-900`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{item.role}</p>
                    <p className="text-[10px] text-gray-500">{item.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-extrabold ${item.score >= 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{item.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'session' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[4px]">Question 1 of 5</span>
            <button onClick={() => setStep('start')} className="text-xs text-gray-400 font-bold">Quit</button>
          </div>
          
          <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <h4 className="text-lg font-bold leading-relaxed">
              "Tell me about a time you had to deal with a difficult teammate. How did you resolve the situation?"
            </h4>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-4">
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Recording Response...</span>
               </div>
               <span className="text-xs font-mono font-bold text-slate-400">0:42</span>
             </div>
             <div className="h-2 w-full bg-gray-50 dark:bg-slate-900 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-2/3" />
             </div>
          </div>

          <button 
            onClick={() => setStep('result')}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            Submit Answer <ChevronRight size={20} />
          </button>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} />
            </div>
            <h3 className="text-2xl font-extrabold mb-1">Score: 84%</h3>
            <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold">Good effort!</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                <Zap size={16} className="text-blue-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Strengths</p>
                <p className="text-xs font-bold">Confidence, Clarity</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl">
                <Brain size={16} className="text-amber-600 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">Improvements</p>
                <p className="text-xs font-bold">Use STAR method</p>
              </div>
            </div>

            <button 
              onClick={() => setStep('start')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPractice;
