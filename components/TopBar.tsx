import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Share2, MoreVertical } from 'lucide-react';

interface TopBarProps {
  title: string;
  hideMenu?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title, hideMenu = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4 md:mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 active:scale-90 transition-all border border-gray-100 dark:border-slate-800 hover:shadow-md shadow-sm shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft size={20} className="sm:size-6" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-none leading-none tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[2px]">Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
          <Share2 size={16} /> Share
        </button>
        {!hideMenu && (
          <button className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-all shadow-sm active:scale-95">
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;