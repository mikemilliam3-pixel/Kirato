
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

const SalesPage: React.FC = () => {
  const { isLoggedIn, t } = useApp();
  const location = useLocation();

  const isPublicRoute = location.pathname.includes('public-shop');

  // Guard: If not logged in and trying to access anything other than public shop
  if (!isLoggedIn && !isPublicRoute) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-black mb-2">{t('auth.notAuthorized.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
          {t('auth.notAuthorized.description')}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.hash = '#/modules/sales/public-shop'} 
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all shadow-sm"
          >
            {t('auth.notAuthorized.visitPublicShop')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <SalesLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="channel-posting" element={<ChannelPosting />} />
        <Route path="public-shop" element={<PublicShop />} />
        <Route path="customers" element={<Customers />} />
        <Route path="chat" element={<Chat />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support-inbox" element={<SupportInbox />} />
      </Routes>
    </SalesLayout>
  );
};

export default SalesPage;