
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
/* Changed FileZip to FileArchive as FileZip does not exist in lucide-react */
import { Download, RefreshCw, CheckCircle, AlertCircle, Clock, ChevronRight, FileArchive } from 'lucide-react';

const Export: React.FC = () => {
  const { language } = useApp();

  const jobs = [
    { id: 'JOB-441', project: 'Training Video', format: 'WAV', status: 'done', date: '12:45 PM' },
    { id: 'JOB-442', project: 'Summer Radio', format: 'MP3', status: 'running', date: '01:10 PM' },
    { id: 'JOB-443', project: 'Audiobook Ch.1', format: 'ZIP', status: 'failed', date: 'Yesterday' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'done': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'running': return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-slate-900 rounded-[40px] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <h3 className="text-lg font-bold mb-2">Start New Export</h3>
        <p className="text-xs text-slate-400 mb-6">Process all project assets into a single high-quality archive.</p>
        <button className="w-full py-4 bg-orange-500 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">
          Create Export Job
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-extrabold text-sm px-1">Job History</h3>
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                /* Updated to use FileArchive instead of FileZip */
                {job.format === 'ZIP' ? <FileArchive size={18} className="text-orange-500" /> : <Download size={18} className="text-blue-500" />}
              </div>
              <div>
                <h4 className="text-xs font-bold">{job.project}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{job.id} • {job.format} • {job.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               {getStatusIcon(job.status)}
               <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
        <p className="text-[10px] text-amber-700 dark:text-amber-300/70 leading-tight">
          Large exports (ZIP) may take up to 5 minutes to process. We'll notify you when ready.
        </p>
      </div>
    </div>
  );
};

export default Export;