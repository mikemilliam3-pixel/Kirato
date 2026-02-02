
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/ui/PageHeader';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ModuleConfig } from '../types';

const MODULE_LIST: ModuleConfig[] = [
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

const Explore: React.FC = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title={t('nav.explore')} subtitle="Discover Modules" />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500 space-y-8">
        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULE_LIST.length > 0 ? (
            MODULE_LIST.map((m) => {
              const Icon = (LucideIcons as any)[m.iconName] || Sparkles;
              return (
                <button
                  key={m.id}
                  onClick={() => navigate(m.path)}
                  className="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all active:scale-[0.98] group text-left"
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: m.color }}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{t(`modules.${m.translationKey}.title`)}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate mt-0.5">{t(`modules.${m.translationKey}.subtitle`)}</p>
                  </div>
                  <ArrowRight size={18} className="text-gray-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-30">
               <Compass size={64} className="mb-4" />
               <p className="text-sm font-black uppercase tracking-[4px]">{t('common.noModulesFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
