
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import { 
  Home as HomeIcon, User as UserIcon, LogIn, 
  Settings, Bell, LogOut, ChevronRight, Compass
} from 'lucide-react';

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
import SettingsPage from './pages/Settings';
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
  const { t, isLoggedIn, login, logout, unreadNotifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const activeTab = useMemo(() => {
    if (isProfileSheetOpen) return 'profile';
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/explore') return 'explore';
    if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings') || location.pathname.startsWith('/notifications')) return 'profile';
    return '';
  }, [location.pathname, isProfileSheetOpen]);

  const handleNavClick = (tab: string) => {
    if (tab === 'home') {
      navigate('/');
      setIsProfileSheetOpen(false);
    } else if (tab === 'explore') {
      navigate('/explore');
      setIsProfileSheetOpen(false);
    } else if (tab === 'profile') {
      if (isLoggedIn) {
        setIsProfileSheetOpen(!isProfileSheetOpen);
      } else {
        login();
        navigate('/');
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 relative">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content scroll area - pb reserves space for the bottom nav bar height + safe area */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar bg-gray-50 dark:bg-slate-950 pb-[calc(72px+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>

        {/* --- MODERN DOCKED BOTTOM NAVIGATION --- */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
          <div className="h-[72px] flex items-center justify-around px-4">
            
            {/* Home Tab */}
            <button 
              onClick={() => handleNavClick('home')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <HomeIcon size={22} className={activeTab === 'home' ? 'scale-110' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.home')}</span>
              {activeTab === 'home' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full animate-in slide-in-from-top-1 duration-300" />}
            </button>

            {/* Explore Tab */}
            <button 
              onClick={() => handleNavClick('explore')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${activeTab === 'explore' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Compass size={22} className={activeTab === 'explore' ? 'scale-110' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.explore')}</span>
              {activeTab === 'explore' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full animate-in slide-in-from-top-1 duration-300" />}
            </button>

            {/* Profile / Sign In Tab */}
            <button 
              onClick={() => handleNavClick('profile')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {isLoggedIn ? (
                <>
                  <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-sm ${activeTab === 'profile' ? 'ring-2 ring-blue-500/50' : ''}`}>JD</div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.profile')}</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-3 right-4 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 text-[8px] flex items-center justify-center text-white">!</span>
                  )}
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.signIn')}</span>
                </>
              )}
              {activeTab === 'profile' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full animate-in slide-in-from-top-1 duration-300" />}
            </button>
          </div>
        </div>

        {/* --- PROFILE BOTTOM SHEET --- */}
        {isProfileSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsProfileSheetOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500 p-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-6 shrink-0" />
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white font-black text-2xl shadow-xl">JD</div>
                 <div>
                    <h3 className="text-xl font-black tracking-tight">John Doe</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">@johndoe</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <button 
                  onClick={() => { navigate('/profile'); setIsProfileSheetOpen(false); }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                 >
                    <div className="flex items-center gap-3">
                       <UserIcon size={20} className="text-blue-600" />
                       <span className="text-xs font-black uppercase tracking-widest">{t('profile.title')}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                 </button>

                 <button 
                  onClick={() => { navigate('/settings'); setIsProfileSheetOpen(false); }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                 >
                    <div className="flex items-center gap-3">
                       <Settings size={20} className="text-blue-600" />
                       <span className="text-xs font-black uppercase tracking-widest">{t('nav.settings')}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                 </button>

                 <button 
                  onClick={() => { navigate('/notifications'); setIsProfileSheetOpen(false); }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                 >
                    <div className="flex items-center gap-3">
                       <Bell size={20} className="text-blue-600" />
                       <span className="text-xs font-black uppercase tracking-widest">{t('common.notifications')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       {unreadNotifications > 0 && <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full">{unreadNotifications}</span>}
                       <ChevronRight size={16} className="text-gray-300" />
                    </div>
                 </button>

                 <div className="h-px bg-gray-100 dark:bg-slate-800 my-4" />

                 <button 
                  onClick={() => { logout(); setIsProfileSheetOpen(false); }}
                  className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all"
                 >
                    <LogOut size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{t('nav.logout')}</span>
                 </button>
              </div>
            </div>
          </div>
        )}
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
            <Route path="/explore" element={<Explore />} />
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
            <Route path="/settings" element={<SettingsPage />} />
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
