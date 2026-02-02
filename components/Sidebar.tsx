import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, ShoppingBag, Megaphone, GraduationCap, 
  Laptop, Plane, Activity, Hammer, 
  FileText, Mic, Settings2, X, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useApp();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', key: 'home' },
    { icon: ShoppingBag, label: t('modules.sales.title'), path: '/modules/sales', key: 'sales' },
    { icon: Megaphone, label: t('modules.smm.title'), path: '/modules/smm', key: 'smm' },
    { icon: GraduationCap, label: t('modules.education.title'), path: '/modules/education', key: 'education' },
    { icon: Laptop, label: t('modules.freelancer.title'), path: '/modules/freelancer', key: 'freelancer' },
    { icon: Plane, label: t('modules.travel.title'), path: '/modules/travel', key: 'travel' },
    { icon: Activity, label: t('modules.health.title'), path: '/modules/health', key: 'health' },
    { icon: Hammer, label: t('modules.legal.title'), path: '/modules/legal', key: 'legal' },
    { icon: FileText, label: t('modules.resume.title'), path: '/modules/resume', key: 'resume' },
    { icon: Mic, label: t('modules.voice.title'), path: '/modules/voice', key: 'voice' },
    { icon: Settings2, label: t('modules.automation.title'), path: '/modules/automation', key: 'automation' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70]
        w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-black text-lg tracking-tight leading-none">Kirato AI</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[2px] mt-1">Assistant</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);
              
              // Added: Extract icon to a capitalized variable to satisfy JSX component requirements and aid parser stability
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  // Fixed: Removed the incorrect 'lg:' label which was breaking JS syntax and scoping
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'}
                  `}
                >
                  {/* Fixed: Use the capitalized Icon variable for the component name */}
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800">
          <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-3xl flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
               <Settings2 size={20} />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-black truncate">Free Plan</p>
               <p className="text-[10px] text-gray-500 font-bold">Manage Billing</p>
             </div>
             <ChevronRight size={14} className="text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;