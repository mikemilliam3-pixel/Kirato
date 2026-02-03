import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import * as LucideIcons from 'lucide-react';
import { salesRoutes } from './routes';
import { salesTranslations } from './i18n';
import TopBar from '../../../components/TopBar';

interface SalesLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  isDemo?: boolean;
  rightSlot?: React.ReactNode;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ children, hideNav = false, isDemo = false, rightSlot }) => {
  const { language, t: globalT } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];

  const [supportMode, setSupportMode] = useState(false);

  useEffect(() => {
    setSupportMode(localStorage.getItem('kirato-support-mode') === 'true');
  }, []);

  const currentSection = location.pathname.split('/').pop() || 'dashboard';

  const visibleRoutes = salesRoutes.filter(route => {
    if (route.id === 'support-inbox') return supportMode;
    return true;
  });

  const baseRoute = isDemo ? '/modules/sales/seller-demo' : '/modules/sales';

  return (
    <div className="flex flex-col min-h-full">
      {/* Demo Warning Banner */}
      {isDemo && (
        <div className="bg-purple-600 text-white py-2 px-4 text-center">
           <p className="text-[10px] font-black uppercase tracking-[3px] flex items-center justify-center gap-2">
             <LucideIcons.Sparkles size={14}/> {globalT('auth.demoWarning')}
           </p>
        </div>
      )}

      {/* Module Navigation Sub-Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 z-30 px-4 md:px-8 py-6">
        <TopBar title={t.title} hideMenu={true} rightSlot={rightSlot} />

        {!hideNav && (
          <nav className="max-w-7xl mx-auto w-full flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar md:justify-center md:gap-10 lg:gap-14 pb-1">
            {visibleRoutes.map((route) => {
              const IconComponent = (LucideIcons as any)[route.icon] || LucideIcons.Circle;
              const isActive = currentSection === route.id;
              
              return (
                <button
                  key={route.id}
                  onClick={() => navigate(`${baseRoute}/${route.path}`)}
                  className={`flex flex-col items-center gap-1.5 pb-3 min-w-[65px] sm:min-w-[80px] md:min-w-0 transition-all relative group shrink-0 ${
                    isActive ? 'text-rose-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <IconComponent size={18} className={isActive ? 'animate-pulse' : ''} />
                  <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider whitespace-nowrap`}>
                    {(t.sections as any)[route.labelKey]}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600 rounded-t-full shadow-[0_-4px_10px_rgba(225,29,72,0.3)]" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Module Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8 lg:px-10">
        {children}
      </div>
    </div>
  );
};

export default SalesLayout;