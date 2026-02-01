
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { resumeTranslations } from '../i18n';
// Added ChevronRight to imports
import { Mail, Search, Plus, Send, Copy, RefreshCw, FileText, Sparkles, ChevronRight } from 'lucide-react';

const CoverLetters: React.FC = () => {
  const { language } = useApp();
  const t = resumeTranslations[language];
  const [isGenerating, setIsGenerating] = useState(false);
  const [letter, setLetter] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLetter("Dear Hiring Manager,\n\nI am writing to express my enthusiastic interest in the Software Engineer position at TechCorp. With my extensive experience in React and TypeScript, I am confident in my ability to contribute effectively to your engineering team...");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      {!letter ? (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-600" size={20} />
            <h3 className="text-lg font-bold">AI Letter Generator</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Target Company</label>
              <input type="text" placeholder="e.g. Google" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Job Title</label>
              <input type="text" placeholder="e.g. Frontend Engineer" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Job Description (optional)</label>
              <textarea placeholder="Paste the job requirements here for a more tailored letter..." className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none h-32" />
            </div>
          </div>
          <button 
            onClick={handleGenerate}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-none active:scale-95 transition-all"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Mail size={20} />}
            Generate Letter
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-sm mb-4 border-b border-gray-50 dark:border-slate-700 pb-2">Draft Letter</h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {letter}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-gray-100 dark:bg-slate-900 text-slate-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
              <Copy size={16} /> Copy
            </button>
            <button 
              onClick={() => setLetter('')}
              className="flex-1 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Regenerate
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-sm mb-3 px-1">Recent Letters</h3>
        <div className="space-y-3">
          {[
            { company: "TechCorp", role: "Software Engineer", date: "May 24" },
            { company: "Acme Inc", role: "Product Manager", date: "May 20" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">{item.company}</p>
                  <p className="text-[10px] text-gray-500">{item.role} • {item.date}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverLetters;
