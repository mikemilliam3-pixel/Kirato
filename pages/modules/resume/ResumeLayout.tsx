
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import * as LucideIcons from 'lucide-react';
import { resumeRoutes } from './routes';
import { resumeTranslations } from './i18n';
import TopBar from '../../../components/TopBar';

interface ResumeLayoutProps {
  children: React.ReactNode;
}

const ResumeLayout: React.FC<ResumeLayoutProps> = ({ children }) => {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const t = resumeTranslations[language];

  const currentSection = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 z-40 px-4 pt-4 shadow-sm">
        <TopBar title={t.title} />

        <div className="flex gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {resumeRoutes.map((route) => {
            const Icon = (LucideIcons as any)[route.icon] || LucideIcons.Circle;
            const isActive = currentSection === route.path;
            
            return (
              <button
                key={route.id}
                onClick={() => navigate(`/modules/resume/${route.path}`)}
                className={`flex flex-col items-center gap-2 pb-3 min-w-[70px] transition-all relative ${
                  isActive ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className={`text-[10px] font-bold whitespace-nowrap`}>
                  {(t.sections as any)[route.labelKey]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default ResumeLayout;
