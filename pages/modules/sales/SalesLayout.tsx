
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import * as LucideIcons from 'lucide-react';
import { salesRoutes } from './routes';
import { salesTranslations } from './i18n';
import TopBar from '../../../components/TopBar';

interface SalesLayoutProps {
  children: React.ReactNode;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ children }) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const t = salesTranslations[language];

  const currentSection = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Module Header */}
      <header className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 z-40 px-4 pt-4 lg:px-8">
        <TopBar title={t.title} />

        {/* Scrollable Tabs */}
        <div className="max-w-6xl mx-auto w-full flex gap-6 overflow-x-auto no-scrollbar md:overflow-visible md:justify-center md:gap-8 lg:gap-12 px-4 pb-1">
          {salesRoutes.map((route) => {
            const Icon = (LucideIcons as any)[route.icon] || LucideIcons.Circle;
            const isActive = currentSection === route.id;
            
            return (
              <button
                key={route.id}
                onClick={() => navigate(`/modules/sales/${route.path}`)}
                className={`flex flex-col items-center gap-2 pb-3 min-w-[70px] md:min-w-0 transition-all relative ${
                  isActive ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className={`text-[10px] md:text-[11px] font-bold whitespace-nowrap`}>
                  {(t.sections as any)[route.labelKey]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-6 lg:px-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SalesLayout;
