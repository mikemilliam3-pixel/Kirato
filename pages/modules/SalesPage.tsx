import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import SalesLayout from './sales/SalesLayout';
import Dashboard from './sales/sections/Dashboard';
import Products from './sales/sections/Products';
import Orders from './sales/sections/Orders';
import ChannelPosting from './sales/sections/ChannelPosting';
import PublicShop from './sales/sections/PublicShop';
import Customers from './sales/sections/Customers';
import Chat from './sales/sections/Chat';
import Promotions from './sales/sections/Promotions';
import Settings from './sales/sections/Settings';
import SupportInbox from './sales/sections/SupportInbox';
import { LogIn, ArrowRight, Store, Rocket, Clock, CheckCircle, Smartphone, Tag, Building, User, LayoutDashboard, ShieldCheck, Sparkles, X, UserCheck } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const SalesPage: React.FC = () => {
  const { isLoggedIn, user, t, openAuth } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [sellerStatus, setSellerStatus] = useState<'none' | 'pending' | 'approved' | 'rejected' | 'loading'>('loading');
  const [isApplying, setIsApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  
  // Application Form State
  const [form, setForm] = useState({
    storeName: '',
    category: 'electronics',
    phone: ''
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setSellerStatus(doc.data().sellerStatus || 'none');
        } else {
          setSellerStatus('none');
        }
      });
      return () => unsub();
    } else {
      setSellerStatus('none');
    }
  }, [isLoggedIn, user]);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsApplying(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const appRef = doc(db, "sellerApplications", user.uid);
      
      await setDoc(userRef, {
        sellerStatus: 'pending',
        sellerAppliedAt: serverTimestamp()
      }, { merge: true });

      await setDoc(appRef, {
        uid: user.uid,
        storeName: form.storeName,
        category: form.category,
        phone: form.phone,
        status: 'pending',
        submittedAt: serverTimestamp()
      });
      
      setShowForm(false);
    } catch (error) {
      console.error("Application failed", error);
    } finally {
      setIsApplying(false);
    }
  };

  // --- RENDERING HELPERS ---

  const PendingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-[28px] flex items-center justify-center mb-6 shadow-inner">
        <Clock size={32} className="animate-pulse" />
      </div>
      <h2 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">
        {t('auth.applicationPending')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-sm font-medium">
        {t('auth.applicationPendingDesc')}
      </p>
      <button onClick={() => navigate('/modules/sales')} className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Back to Marketplace</button>
    </div>
  );

  const ApplicationForm = () => (
    <div className="max-w-xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 sm:p-12 border border-gray-100 dark:border-slate-800 shadow-2xl space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight">{t('auth.becomeSellerTitle')}</h2>
          <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmitApplication} className="space-y-5">
           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.storeName')}</label>
             <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required
                  type="text" 
                  value={form.storeName}
                  onChange={e => setForm({...form, storeName: e.target.value})}
                  placeholder="My Amazing Shop"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border-none focus:ring-2 focus:ring-rose-500/20 font-bold text-sm"
                />
             </div>
           </div>

           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.storeCategory')}</label>
             <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  required
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border-none focus:ring-2 focus:ring-rose-500/20 font-bold text-sm appearance-none"
                >
                   <option value="electronics">Electronics & Gadgets</option>
                   <option value="clothing">Clothing & Accessories</option>
                   <option value="home">Home & Kitchen</option>
                   <option value="beauty">Beauty & Personal Care</option>
                   <option value="food">Food & Drinks</option>
                   <option value="other">Other</option>
                </select>
             </div>
           </div>

           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.storePhone')}</label>
             <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="tel" 
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="+998 90 123 45 67"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border-none focus:ring-2 focus:ring-rose-500/20 font-bold text-sm"
                />
             </div>
           </div>

           <button 
             type="submit"
             disabled={isApplying}
             className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
           >
             {isApplying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('auth.submitApp')}
           </button>
        </form>
      </div>
    </div>
  );

  const HeaderSellerButton = () => {
    const handleClick = () => {
      if (!isLoggedIn) {
        openAuth('signin');
        return;
      }
      if (sellerStatus === 'approved') {
        navigate('/modules/sales/dashboard');
      } else {
        setShowModeModal(true);
      }
    };

    return (
      <button 
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 transition-all shadow-sm active:scale-95"
      >
        <UserCheck size={16} />
        <span>{t('auth.sellerMode')}</span>
      </button>
    );
  };

  const ModeModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModeModal(false)} />
       <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black tracking-tight">{t('auth.becomeSellerTitle')}</h4>
            <button onClick={() => setShowModeModal(false)} className="text-gray-400 hover:text-slate-600"><X size={20}/></button>
          </div>

          <div className="space-y-3">
             <button 
              onClick={() => { setShowModeModal(false); navigate('/modules/sales/seller-demo'); }}
              className="w-full p-6 bg-purple-50 dark:bg-purple-900/20 rounded-[28px] border border-purple-100 dark:border-purple-800 text-left group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles size={20} />
                   </div>
                   <span className="font-black uppercase tracking-widest text-[11px] text-purple-600">{t('auth.demoModeOption')}</span>
                </div>
                <p className="text-[10px] font-bold text-purple-700/60 dark:text-purple-300/60 leading-relaxed uppercase">Explore all features instantly with mock data. No registration needed.</p>
             </button>

             <button 
              onClick={() => { setShowModeModal(false); setShowForm(true); navigate('/modules/sales/seller-apply'); }}
              className="w-full p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[28px] border border-emerald-100 border-emerald-800 text-left group active:scale-95 transition-all"
             >
                <div className="flex items-center gap-4 mb-2">
                   <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket size={20} />
                   </div>
                   <span className="font-black uppercase tracking-widest text-[11px] text-emerald-600">{t('auth.applyOption')}</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-300/60 leading-relaxed uppercase">Apply to list your own products and start receiving real orders.</p>
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Routes>
        {/* Buyer Views */}
        <Route path="/" element={
          <>
            <SalesLayout hideNav={true} rightSlot={<HeaderSellerButton />}>
              <PublicShop mode="marketplace" />
            </SalesLayout>
            {showModeModal && <ModeModal />}
          </>
        } />
        <Route path="shop/:sellerId" element={
          <SalesLayout hideNav={true} rightSlot={<HeaderSellerButton />}>
            <PublicShop mode="seller_shop" />
          </SalesLayout>
        } />

        {/* Application Logic */}
        <Route path="seller-apply" element={
          sellerStatus === 'pending' ? <PendingScreen /> : showForm ? <ApplicationForm /> : <Navigate to="/modules/sales" replace />
        } />

        {/* Demo Mode */}
        <Route path="seller-demo/*" element={
          <SalesLayout isDemo={true}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products isDemo={true} />} />
              <Route path="orders" element={<Orders />} />
              <Route path="channel-posting" element={<ChannelPosting />} />
              {/* Fix: In Demo mode, SHOP tab shows My Shop (with demo ID) */}
              <Route path="public-shop" element={<PublicShop mode="seller_shop" sellerId="seller_kirato" />} />
              <Route path="customers" element={<Customers />} />
              <Route path="chat" element={<Chat />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="settings" element={<Settings isDemo={true} />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </SalesLayout>
        } />

        {/* Real Seller Dashboard */}
        <Route path="/*" element={
          sellerStatus === 'approved' ? (
            <SalesLayout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="channel-posting" element={<ChannelPosting />} />
                {/* Fix: In Approved mode, SHOP tab shows My Shop (with user's ID) */}
                <Route path="public-shop" element={<PublicShop mode="seller_shop" sellerId={user?.uid} />} />
                <Route path="customers" element={<Customers />} />
                <Route path="chat" element={<Chat />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support-inbox" element={<SupportInbox />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </SalesLayout>
          ) : (
            <Navigate to="/modules/sales" replace />
          )
        } />
      </Routes>
    </div>
  );
};

export default SalesPage;