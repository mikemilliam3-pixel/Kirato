
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { resumeTranslations } from '../i18n';
// Added ChevronRight to imports
import { Briefcase, Search, Plus, Filter, MoreVertical, Calendar, DollarSign, MapPin, ChevronRight } from 'lucide-react';

const JobTracker: React.FC = () => {
  const { language } = useApp();
  const t = resumeTranslations[language].jobTracker;
  const [activeTab, setActiveTab] = useState<string>('applied');

  const jobs = [
    { id: '1', company: 'Google', role: 'Full Stack Engineer', status: 'interview', salary: '$160k', location: 'Remote' },
    { id: '2', company: 'Meta', role: 'Product Designer', status: 'applied', salary: '$145k', location: 'London' },
    { id: '3', company: 'Amazon', role: 'Solutions Architect', status: 'interview', salary: '$170k', location: 'Seattle' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'interview': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'offer': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'rejected': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-slate-900';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">My Pipeline</h3>
        <button className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {(['saved', 'applied', 'interview', 'offer', 'rejected'] as const).map(status => (
          <button 
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === status 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'
            }`}
          >
            {t[status]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {jobs.filter(j => j.status === activeTab).map((job) => (
          <div key={job.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-700">
                  <Briefcase size={24} className="text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.role}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{job.company}</p>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50 dark:border-slate-700">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                <MapPin size={12} className="text-blue-500" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                <DollarSign size={12} className="text-emerald-500" /> {job.salary}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
              <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {jobs.filter(j => j.status === activeTab).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-40">
            <Briefcase size={48} className="mb-2" />
            <p className="text-xs font-bold">No jobs in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTracker;
