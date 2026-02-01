
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
    <main className="max-w-6xl mx-auto px-6 py-4 pb-12 lg:px-8">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          {t('homeTitle')}
        </h2>
        <p className="text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400">
          {t('homeSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>
    </main>
  );
};

export default Home;
