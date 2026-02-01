
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { resumeTranslations } from '../i18n';
import { Download, FileText, Layout, CheckCircle2, RefreshCw, Smartphone } from 'lucide-react';

const Export: React.FC = () => {
  const { language } = useApp();
  const t = resumeTranslations[language];
  const [selectedTemplate, setSelectedTemplate] = useState('ats');
  const [isExporting, setIsExporting] = useState(false);

  const templates = [
    { id: 'ats', name: 'ATS Minimal', icon: Layout, desc: 'Highest compatibility with systems' },
    { id: 'modern', name: 'Modern Duo', icon: Smartphone, desc: 'Clean layout with sidebar' },
    { id: 'classic', name: 'Executive', icon: FileText, desc: 'Professional serif typography' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-sm mb-4 px-1">Select Resume</h3>
        <select className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold text-blue-600 mb-2">
          <option>Senior Web Developer (Active)</option>
          <option>Product Manager Draft</option>
        </select>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm px-1">Choose Template</h3>
        <div className="grid grid-cols-1 gap-3">
          {templates.map((tpl) => (
            <button 
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative ${
                selectedTemplate === tpl.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                  : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedTemplate === tpl.id ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-slate-900 text-slate-400'
                }`}>
                  <tpl.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tpl.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">{tpl.desc}</p>
                </div>
              </div>
              {selectedTemplate === tpl.id && (
                <div className="absolute top-4 right-4 text-blue-600">
                  <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button 
          onClick={handleExport}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all"
        >
          {isExporting ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
          Download PDF
        </button>
        <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-500 border border-gray-100 dark:border-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
          <FileText size={18} /> Export as Plain Text
        </button>
      </div>
    </div>
  );
};

export default Export;
