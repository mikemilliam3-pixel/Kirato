
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { healthRoutes } from './routes';
import { healthTranslations } from './i18n';
import TopBar from '../../../components/TopBar';

interface HealthLayoutProps {
  children: React.ReactNode;
}

const HealthLayout: React.FC<HealthLayoutProps> = ({ children }) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const t = healthTranslations[language];

  const currentSection = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Safety Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 flex items-start gap-3 border-b border-amber-100 dark:border-amber-900/50">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] leading-tight font-medium text-amber-800 dark:text-amber-200/70">
          {t.disclaimer}
        </p>
      </div>

      <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 z-40 px-4 pt-4">
        <TopBar title={t.title} />

        <div className="flex gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {healthRoutes.map((route) => {
            const Icon = (LucideIcons as any)[route.icon] || LucideIcons.Circle;
            const isActive = currentSection === route.path;
            
            return (
              <button
                key={route.id}
                onClick={() => navigate(`/modules/health/${route.path}`)}
                className={`flex flex-col items-center gap-2 pb-3 min-w-[80px] transition-all relative ${
                  isActive ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className={`text-[10px] font-bold whitespace-nowrap`}>
                  {(t.sections as any)[route.labelKey]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950">
        <div className="p-6 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HealthLayout;
