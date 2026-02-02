
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, rightSlot }) => {
  const navigate = useNavigate();
  const { t } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Logic: if history exists go back, otherwise go home
      // In a real app we might check window.history.length, but usually navigate(-1) works well
      navigate(-1);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between min-h-[64px]">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800 shadow-sm active:scale-90 transition-all shrink-0"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col truncate">
          <h1 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightSlot && (
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {rightSlot}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
