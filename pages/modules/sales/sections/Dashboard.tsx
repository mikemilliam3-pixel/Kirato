
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { TrendingUp, TrendingDown, Plus, ExternalLink, Share2, Package, ShoppingCart, Users, BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations]?.dashboard || salesTranslations['EN'].dashboard;

  const kpis = [
    { label: t.totalSales, value: "$12,450", trend: 12.5, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.onHoldFunds, value: "$3,240", trend: 2.1, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: t.pendingPayouts, value: "$1,120", trend: 8.4, icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.disputedOrders, value: "2", trend: -50, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  const recentOrders = [
    { id: '#ORD-7721', customer: 'Anvar Toshov', amount: '$120.00', status: 'completed', date: '2 mins ago' },
    { id: '#ORD-7720', customer: 'Sitora Karimova', amount: '$45.50', status: 'pending', date: '15 mins ago' },
    { id: '#ORD-7719', customer: 'James Wilson', amount: '$210.00', status: 'disputed', date: '1 hour ago' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* KPI Grid - Scales 2 to 4 columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 sm:p-5 md:p-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
              <kpi.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${kpi.color}`} />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</h4>
            <div className={`flex items-center gap-1 mt-2 sm:mt-3 text-[10px] md:text-xs font-bold ${kpi.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {kpi.trend >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
              {Math.abs(kpi.trend)}%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart Panel */}
        <div className="lg:col-span-2 p-5 sm:p-6 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-6 tracking-tight">{t.totalSales} (7 days)</h3>
          <div className="h-48 sm:h-60 md:h-72 w-full bg-gray-50 dark:bg-slate-900/50 rounded-[24px] flex items-end justify-between px-4 sm:px-6 pb-4 sm:pb-6 gap-2 sm:gap-3 md:gap-5">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 dark:bg-blue-500/10 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg transition-all duration-700 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
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
            <button className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 group h-14 sm:h-16">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <Plus size={20} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{t.addProduct}</span>
            </button>
            <button className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 group h-14 sm:h-16">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <ExternalLink size={20} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{t.viewShop}</span>
            </button>
            <button className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 group h-14 sm:h-16">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <Share2 size={20} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{t.shareChannel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-4">
        <h3 className="font-black text-sm sm:text-base md:text-lg mb-3 px-1 tracking-tight">{t.recentOrders}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 sm:p-5 md:p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-slate-400 shrink-0 border border-gray-100 dark:border-slate-600">
                  {order.customer.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white truncate tracking-tight">{order.customer}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold uppercase mt-0.5">{order.id} • {order.date}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3 sm:ml-4">
                <p className="text-sm sm:text-base md:text-lg font-black text-rose-600 tracking-tight">{order.amount}</p>
                <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                  order.status === 'completed' ? 'text-emerald-500' : 
                  order.status === 'disputed' ? 'text-rose-500 animate-pulse' : 'text-amber-500'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
