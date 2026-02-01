
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { TrendingUp, TrendingDown, Plus, ExternalLink, Share2, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].dashboard;

  const kpis = [
    { label: t.totalSales, value: "$12,450", trend: 12.5, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: t.orders, value: "148", trend: -2.4, icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: t.customers, value: "842", trend: 8.1, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: t.conversion, value: "3.2%", trend: 0.5, icon: Package, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  const recentOrders = [
    { id: '#ORD-7721', customer: 'Alex Johnson', amount: '$120.00', status: 'completed', date: '2 mins ago' },
    { id: '#ORD-7720', customer: 'Maria Garcia', amount: '$45.50', status: 'pending', date: '15 mins ago' },
    { id: '#ORD-7719', customer: 'James Wilson', amount: '$210.00', status: 'completed', date: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className={`w-8 h-8 lg:w-10 lg:h-10 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              <kpi.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${kpi.color}`} />
            </div>
            <p className="text-[11px] lg:text-xs font-bold text-gray-500 uppercase tracking-tight mb-1">{kpi.label}</p>
            <h4 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</h4>
            <div className={`flex items-center gap-1 mt-2 text-[10px] lg:text-[11px] font-bold ${kpi.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {kpi.trend >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {Math.abs(kpi.trend)}%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Panel */}
        <div className="lg:col-span-2 p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="font-bold text-sm lg:text-base mb-4">{t.totalSales} (7 days)</h3>
          <div className="h-56 lg:h-64 w-full bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-end justify-between px-4 pb-4 gap-2 lg:gap-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 dark:bg-blue-500/10 rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-md transition-all duration-500 hover:bg-blue-500" 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Sidebar style on desktop */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm mb-4">{t.quickActions}</h3>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <button className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-center lg:text-left leading-tight">{t.addProduct}</span>
              </button>
              <button className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <ExternalLink size={20} />
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-center lg:text-left leading-tight">{t.viewShop}</span>
              </button>
              <button className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl active:scale-95 transition-all">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <Share2 size={20} />
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-center lg:text-left leading-tight">{t.shareChannel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders - Full width list */}
      <div>
        <h3 className="font-bold text-sm mb-3 px-1">{t.recentOrders}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm text-gray-500">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customer}</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">{order.id} • {order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm lg:text-base font-bold text-slate-900 dark:text-white">{order.amount}</p>
                <span className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'completed' ? 'text-emerald-500' : 'text-orange-500'
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
