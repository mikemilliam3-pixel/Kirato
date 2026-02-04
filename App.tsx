import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Header, { formatNameFromEmail } from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AuthModal from './components/AuthModal';
import VerifyEmail from './pages/VerifyEmail';
import { 
  Home as HomeIcon, User as UserIcon, LogIn, 
  Settings, Bell, LogOut, ChevronRight, Compass, X, Coins, Crown
} from 'lucide-react';
import { useAndroidBackGuard } from './hooks/useAndroidBackGuard';

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
import SellerApplications from './pages/admin/SellerApplications';

const RootLayout: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (o: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const { t, isLoggedIn, unreadNotifications, openAuth, user, logout, credits } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  useAndroidBackGuard();

  const userData = useMemo(() => {
    if (!user) return null;
    const name = user.displayName || formatNameFromEmail(user.email || '');
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return { name, email: user.email, initials };
  }, [user]);

  const activeTab = useMemo(() => {
    if (isProfileSheetOpen) return 'profile';
    if (location.pathname === '/' || location.pathname === '/home') return 'home';
    if (location.pathname === '/explore') return 'explore';
    if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings') || location.pathname.startsWith('/notifications')) return 'profile';
    return '';
  }, [location.pathname, isProfileSheetOpen]);

  if (isLoggedIn && user && !user.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

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
        openAuth('signin');
      }
    }
  };

  const closeMenu = () => setIsProfileSheetOpen(false);

  const menuAction = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto relative no-scrollbar bg-gray-50 dark:bg-slate-950 pb-[calc(72px+env(safe-area-inset-bottom))] min-w-0">
          <Outlet />
        </main>
        <AuthModal />

        {/* Mobile Profile Menu Sheet */}
        {isProfileSheetOpen && isLoggedIn && userData && (
          <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center px-4 pb-[calc(88px+env(safe-area-inset-bottom))]">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeMenu} />
            <div className="relative w-full max-sm bg-white dark:bg-slate-900 rounded-[32px] p-2 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 overflow-hidden">
               <div className="flex flex-col p-4 border-b border-gray-50 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">{userData.initials}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">{userData.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{userData.email}</p>
                      </div>
                    </div>
                    <button onClick={closeMenu} className="p-2 text-gray-400"><X size={20}/></button>
                  </div>

                  {/* Credits Summary Row - Mobile */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-blue-600 cursor-default select-none">
                    <Coins size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('common.credits')}:</span>
                    <span className="text-[11px] font-black">{credits}</span>
                  </div>
               </div>
               
               <div className="p-2 space-y-1">
                 <button onClick={() => menuAction('/notifications')} className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                   <div className="flex items-center gap-3">
                      <Bell size={20} className="text-blue-600" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('common.notifications')}</span>
                   </div>
                   {unreadNotifications > 0 && <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">{unreadNotifications}</span>}
                 </button>
                 <button onClick={() => menuAction('/profile')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                   <UserIcon size={20} className="text-blue-600" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('nav.profile')}</span>
                 </button>
                 <button onClick={() => menuAction('/settings')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                   <Settings size={20} className="text-blue-600" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('nav.settings')}</span>
                 </button>

                 {/* Upgrade Menu Item - Mobile Placeholder */}
                 <button 
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     closeMenu();
                     alert(`${t('nav.upgrade')}: ${t('common.comingSoon')}`);
                   }}
                   className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                 >
                   <Crown size={20} className="text-amber-500" />
                   <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('nav.upgrade')}</span>
                 </button>

                 <div className="h-px bg-gray-50 dark:bg-slate-800 my-1" />
                 
                 <button onClick={() => { logout(); closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors text-rose-500">
                   <LogOut size={20} />
                   <span className="text-xs font-black uppercase tracking-widest">{t('nav.logout')}</span>
                 </button>
               </div>
            </div>
          </div>
        )}

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
          <div className="h-[72px] flex items-center justify-around px-2">
            <button onClick={() => handleNavClick('home')} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
              <HomeIcon size={22} className={activeTab === 'home' ? 'scale-110' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.home')}</span>
              {activeTab === 'home' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full" />}
            </button>
            <button onClick={() => handleNavClick('explore')} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${activeTab === 'explore' ? 'text-blue-600' : 'text-slate-400'}`}>
              <Compass size={22} className={activeTab === 'explore' ? 'scale-110' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.explore')}</span>
              {activeTab === 'explore' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full" />}
            </button>
            <button onClick={() => handleNavClick('profile')} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
              {isLoggedIn && userData ? (
                <>
                  <div className={`w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-sm ${activeTab === 'profile' ? 'ring-2 ring-blue-500/50' : ''}`}>{userData.initials}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.profile')}</span>
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('nav.signIn')}</span>
                </>
              )}
              {activeTab === 'profile' && <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AppProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="/modules/sales/*" element={<SalesPage />} />
              <Route path="modules/smm/*" element={<SMMPage />} />
              <Route path="modules/education/*" element={<EducationPage />} />
              <Route path="modules/freelancer/*" element={<FreelancerPage />} />
              <Route path="modules/travel/*" element={<TravelPage />} />
              <Route path="modules/health/*" element={<HealthPage />} />
              <Route path="modules/legal/*" element={<LegalPage />} />
              <Route path="modules/resume/*" element={<ResumePage />} />
              <Route path="modules/voice/*" element={<VoicePage />} />
              <Route path="modules/automation/*" element={<AutomationPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="billing" element={<Billing />} />
              <Route path="admin/seller-applications" element={<SellerApplications />} />
              {/* Fallback to index if no route matches */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AppProvider>
  );
};

export default App;