import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { TrendingUp, TrendingDown, Plus, ExternalLink, Share2, Package, ShoppingCart, Users, BarChart3, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const SellerPanelApproved: React.FC = () => {
  const { language, isLoggedIn, user } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations]?.dashboard || salesTranslations['EN'].dashboard;

  const [realMetrics, setRealMetrics] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    setLoading(true);
    
    // Realtime listeners for counts/metrics
    const qProducts = query(collection(db, "products"), where("sellerId", "==", user.uid));
    const unsubProducts = onSnapshot(qProducts, (snap) => {
      setRealMetrics(prev => ({ ...prev, products: snap.size }));
    });

    const qOrders = query(collection(db, "orders"), where("sellerId", "==", user.uid));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setRealMetrics(prev => ({ ...prev, orders: snap.size }));
      const total = snap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);
      setRealMetrics(prev => ({ ...prev, totalSales: total }));
    });

    setLoading(false);
    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, [isLoggedIn, user]);

  const kpis = [
    { 
      label: t.totalSales, 
      value: `$${realMetrics.totalSales.toLocaleString()}`, 
      trend: 0, 
      icon: BarChart3, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50 dark:bg-emerald-900/20" 
    },
    { 
      label: t.onHoldFunds, 
      value: "$0", 
      trend: 0, 
      icon: ShieldCheck, 
      color: "text-blue-600", 
      bg: "bg-blue-50 dark:bg-blue-900/20" 
    },
    { 
      label: t.orders, 
      value: realMetrics.orders.toString(), 
      trend: 0, 
      icon: ShoppingCart, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50 dark:bg-emerald-900/20" 
    },
    { 
      label: t.disputedOrders, 
      value: "0", 
      trend: 0, 
      icon: AlertCircle, 
      color: "text-rose-600", 
      bg: "bg-rose-50 dark:bg-rose-900/20" 
    },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-500 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing live data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 sm:p-5 md:p-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
              <kpi.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${kpi.color}`} />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</h4>
            <div className={`flex items-center gap-1 mt-2 sm:mt-3 text-[10px] md:text-xs font-bold text-emerald-500`}>
              <TrendingUp size={14}/>
              0%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart Panel */}
        <div className="lg:col-span-2 p-5 sm:p-6 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-6 tracking-tight text-emerald-600">{t.totalSales} (7 days)</h3>
          <div className="h-48 sm:h-60 md:h-72 w-full bg-gray-50 dark:bg-slate-900/50 rounded-[24px] flex items-end justify-between px-4 sm:px-6 pb-4 sm:pb-6 gap-2 sm:gap-3 md:gap-5">
            {[20, 30, 45, 30, 65, 40, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-500/10 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-emerald-600 rounded-t-lg transition-all duration-700 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm h-fit">
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-6 tracking-tight">{t.quickActions}</h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <button className="flex items-center gap-4 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl active:scale-95 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/50 group h-14 sm:h-16">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <Plus size={20} />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase text-emerald-700 dark:text-emerald-300">{t.addProduct}</span>
            </button>
            <button className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 group h-14 sm:h-16">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <ExternalLink size={20} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{t.viewShop}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-sm sm:text-base md:text-lg mb-3 px-1 tracking-tight">{t.recentOrders}</h3>
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
           <Package size={48} className="text-emerald-500 mb-2" />
           <p className="text-xs font-black uppercase tracking-widest">No real orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default SellerPanelApproved;