import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import * as LucideIcons from 'lucide-react';

interface ModuleCardProps {
  id: string;
  iconName: string;
  color: string;
  path: string;
  translationKey: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ iconName, color, path, translationKey }) => {
  const { t } = useApp();
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <Link 
      to={path} 
      className="flex flex-col rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 active:scale-95 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 group h-full relative"
    >
      <div 
        className="h-20 sm:h-36 md:h-44 flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white drop-shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
      </div>
      <div className="p-2.5 sm:p-6 md:p-8 flex flex-col items-center text-center flex-1 justify-center relative bg-white dark:bg-slate-900">
        <h3 className="font-black text-[13px] sm:text-base md:text-lg mb-0.5 sm:mb-2 line-clamp-1 uppercase tracking-tight" style={{ color: color }}>
          {t(`modules.${translationKey}.title`)}
        </h3>
        <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-tight sm:leading-relaxed">
          {t(`modules.${translationKey}.subtitle`)}
        </p>
      </div>
    </Link>
  );
};

export default ModuleCard;