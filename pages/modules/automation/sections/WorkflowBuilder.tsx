
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { Zap, Search, Plus, Play, Pause, Trash2, MoreVertical, ChevronRight, Settings, PlusCircle, AlertCircle } from 'lucide-react';

const WorkflowBuilder: React.FC = () => {
  const { language } = useApp();
  const t = autoTranslations[language];
  const [isEditing, setIsEditing] = useState(false);

  const workflows = [
    { id: '1', name: 'Lead Response', status: 'active', trigger: 'New Lead', steps: 3 },
    { id: '2', name: 'Invoice Reminder', status: 'active', trigger: 'Schedule', steps: 4 },
    { id: '3', name: 'Bug Report Alert', status: 'paused', trigger: 'Webhook', steps: 2 },
  ];

  if (isEditing) {
    return (
      <div className="space-y-6 pb-20 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-cyan-600">← Back to list</button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider">Save Workflow</button>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Workflow Name</label>
            <input type="text" className="w-full text-xl font-extrabold bg-transparent border-none focus:ring-0 p-0" defaultValue="Customer Onboarding" />
          </div>
          <div className="flex items-center gap-2">
             <span className="px-2 py-1 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 text-[9px] font-bold rounded uppercase">Webhook Trigger</span>
             <div className="h-4 w-px bg-gray-100 dark:bg-slate-700 mx-1" />
             <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-[9px] font-bold uppercase text-emerald-500">Active</span>
             </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm px-1 flex items-center justify-between">
            Workflow Steps
            <button className="text-cyan-600"><PlusCircle size={20}/></button>
          </h3>
          
          <div className="space-y-3 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-cyan-100 dark:before:bg-cyan-900/30">
            {[
              { id: 's1', type: 'Action', label: 'Send Welcome Email', icon: 'Mail', color: 'text-blue-500' },
              { id: 's2', type: 'Delay', label: 'Wait 2 days', icon: 'Clock', color: 'text-amber-500' },
              { id: 's3', type: 'Condition', label: 'If Replied', icon: 'Split', color: 'text-purple-500' }
            ].map((step, idx) => (
              <div key={step.id} className="flex gap-4 relative">
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-center z-10">
                  <span className="text-[10px] font-bold text-cyan-600">{idx + 1}</span>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{step.type}</p>
                    <h4 className="text-xs font-bold">{step.label}</h4>
                  </div>
                  <button className="text-slate-300"><Settings size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Workflows</h3>
        <button onClick={() => setIsEditing(true)} className="w-10 h-10 bg-cyan-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search workflows..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        {workflows.map((wf) => (
          <div key={wf.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-2xl flex items-center justify-center">
                  <Zap size={24} fill={wf.status === 'active' ? 'currentColor' : 'none'} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{wf.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{wf.trigger} • {wf.steps} steps</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
                wf.status === 'active' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
              }`}>
                {wf.status}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-lg hover:bg-cyan-600 hover:text-white transition-all">
                  <Play size={16} />
                </button>
                <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
