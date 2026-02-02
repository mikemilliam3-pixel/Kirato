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
    <div className="flex flex-col min-h-full">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 z-30 px-4 md:px-8 py-6">
        <TopBar title={t.title} />

        <nav className="max-w-7xl mx-auto w-full flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar md:justify-center md:gap-10 pb-1">
          {resumeRoutes.map((route) => {
            const Icon = (LucideIcons as any)[route.icon] || LucideIcons.Circle;
            const isActive = currentSection === route.path;
            
            return (
              <button
                key={route.id}
                onClick={() => navigate(`/modules/resume/${route.path}`)}
                className={`flex flex-col items-center gap-1.5 pb-3 min-w-[70px] sm:min-w-[90px] md:min-w-0 transition-all relative group shrink-0 ${
                  isActive ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider whitespace-nowrap`}>
                  {(t.sections as any)[route.labelKey]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_-4px_10px_rgba(59,130,246,0.3)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 lg:px-10">
        {children}
      </div>
    </div>
  );
};

export default ResumeLayout;