
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { ShieldCheck, Plus, FileText, Download, Check, AlertCircle } from 'lucide-react';

const Contracts: React.FC = () => {
  const { language } = useApp();
  const t = freelancerTranslations[language].sections;

  const templates = [
    { id: '1', name: 'Master Service Agreement', type: 'Main' },
    { id: '2', name: 'Non-Disclosure Agreement', type: 'Legal' },
    { id: '3', name: 'Change Order Form', type: 'Project' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900 flex items-start gap-4">
        <AlertCircle size={20} className="text-amber-500 mt-0.5" />
        <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
          Disclaimer: These templates are for general information only and do not constitute legal advice.
        </p>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-lg">Templates</h3>
        <button className="text-emerald-600 font-bold text-xs flex items-center gap-1">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">{tpl.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tpl.type}</p>
              </div>
            </div>
            <button className="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FileText size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
        <h4 className="text-lg font-bold mb-2">Contract Generator</h4>
        <p className="text-xs text-slate-400 mb-6">Create a ready-to-sign PDF by filling in client details.</p>
        <button className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">
          Generate Now
        </button>
      </div>
    </div>
  );
};

export default Contracts;
