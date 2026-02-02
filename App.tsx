
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';

// Module pages
import SalesPage from './pages/modules/SalesPage';
import SMMPage from './pages/modules/SMMPage';
import EducationPage from './pages/modules/EducationPage';
import FreelancerPage from './pages/modules/FreelancerPage';
import TravelPage from './pages/modules/TravelPage';
import HealthPage from './pages/modules/HealthPage';
import LegalPage from './pages/modules/LegalPage';
import ResumePage from './pages/modules/ResumePage';
import VoicePage from './pages/modules/VoicePage';
import AutomationPage from './pages/modules/AutomationPage';

// New Global Pages
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Billing from './pages/Billing';

const NotFound: React.FC = () => {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('common.notFoundTitle') || 'Page Not Found'}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">{t('common.notFoundDesc') || 'The section you are looking for does not exist or is under construction.'}</p>
      <button onClick={() => window.location.hash = '#/'} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-blue-500/20">
        {t('common.back')}
      </button>
    </div>
  );
};

const RootLayout: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (o: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      {/* Sidebar - Desktop and Mobile (via state) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Global Persistent Header - Sticky at the top of the viewport */}
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main Content Area - Scrollable, containing Home or Modules */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar bg-gray-50 dark:bg-slate-950">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Quick access for Home/Menu */}
        <div className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 flex items-center justify-around px-4 shrink-0 z-40">
          <button 
            onClick={() => window.location.hash = '#/'} 
            className="p-2 text-blue-600 flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </button>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 text-gray-400 dark:text-gray-500 flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-1.5 h-1.5 bg-transparent rounded-full mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<RootLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
            <Route path="/" element={<Home />} />
            <Route path="/modules/sales/*" element={<SalesPage />} />
            <Route path="/modules/smm/*" element={<SMMPage />} />
            <Route path="/modules/education/*" element={<EducationPage />} />
            <Route path="/modules/freelancer/*" element={<FreelancerPage />} />
            <Route path="/modules/travel/*" element={<TravelPage />} />
            <Route path="/modules/health/*" element={<HealthPage />} />
            <Route path="/modules/legal/*" element={<LegalPage />} />
            <Route path="/modules/resume/*" element={<ResumePage />} />
            <Route path="/modules/voice/*" element={<VoicePage />} />
            <Route path="/modules/automation/*" element={<AutomationPage />} />
            
            {/* Global Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/billing" element={<Billing />} />

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;