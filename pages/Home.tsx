import React from 'react';
import { useApp } from '../context/AppContext';
import ModuleCard from '../components/ModuleCard';
import { ModuleConfig } from '../types';

const modules: ModuleConfig[] = [
  { id: '1', iconName: 'ShoppingBag', color: '#ff6b6b', path: '/modules/sales', translationKey: 'sales' },
  { id: '2', iconName: 'Megaphone', color: '#845ef7', path: '/modules/smm', translationKey: 'smm' },
  { id: '3', iconName: 'GraduationCap', color: '#4d7cf2', path: '/modules/education', translationKey: 'education' },
  { id: '4', iconName: 'Laptop', color: '#20c997', path: '/modules/freelancer', translationKey: 'freelancer' },
  { id: '5', iconName: 'Plane', color: '#fcc419', path: '/modules/travel', translationKey: 'travel' },
  { id: '6', iconName: 'Activity', color: '#40c057', path: '/modules/health', translationKey: 'health' },
  { id: '7', iconName: 'Hammer', color: '#fa5252', path: '/modules/legal', translationKey: 'legal' },
  { id: '8', iconName: 'FileText', color: '#4dabf7', path: '/modules/resume', translationKey: 'resume' },
  { id: '9', iconName: 'Mic', color: '#ff922b', path: '/modules/voice', translationKey: 'voice' },
  { id: '10', iconName: 'Settings2', color: '#3bc9db', path: '/modules/automation', translationKey: 'automation' },
];

const Home: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-6 md:py-12 lg:py-16 animate-in fade-in duration-500">
      <div className="mb-6 md:mb-16 text-left">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
          {t('homeTitle')}
        </h1>
        <p className="text-[11px] sm:text-base font-bold text-slate-400 dark:text-slate-500 max-w-2xl uppercase tracking-widest">
          {t('homeSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-8">
        {modules.map((module) => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>
      
      {/* Decorative background blur elements */}
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/4 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
};

export default Home;