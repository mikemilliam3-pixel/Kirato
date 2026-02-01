
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
      className="flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-white dark:bg-slate-800"
    >
      <div 
        className="h-28 flex items-center justify-center transition-colors"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-10 h-10 text-white" />
      </div>
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: color }}>
          {t(`modules.${translationKey}.title`)}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          {t(`modules.${translationKey}.subtitle`)}
        </p>
      </div>
    </Link>
  );
};

export default ModuleCard;
