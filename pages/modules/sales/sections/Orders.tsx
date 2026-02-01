
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Truck, Package } from 'lucide-react';

const Orders: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].orders;

  const orders = [
    { id: '#8842', customer: 'Anvar Toshov', total: 120.50, items: 3, status: 'pending', date: '10 mins ago' },
    { id: '#8841', customer: 'Sitora Karimova', total: 45.00, items: 1, status: 'processing', date: '1 hour ago' },
    { id: '#8840', customer: 'Botir Ergashev', total: 210.00, items: 4, status: 'shipped', date: '3 hours ago' },
    { id: '#8839', customer: 'Malika Faiz', total: 18.00, items: 1, status: 'delivered', date: 'Yesterday' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'processing': return <Package size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-indigo-500" />;
      case 'delivered': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <XCircle size={16} className="text-rose-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20';
      case 'processing': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20';
      case 'shipped': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20';
      default: return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-lg">All Orders</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase">Showing 24 total</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative group overflow-hidden active:scale-[0.98] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {order.id}
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {(t.status as any)[order.status]}
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-rose-600">${order.total}</p>
                <p className="text-[9px] text-gray-400 font-medium">{order.date}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-700">
              <div className="flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${getStatusColor(order.status)} opacity-80`}>
                   {getStatusIcon(order.status)}
                 </div>
                 <span className="text-[10px] text-slate-500 font-bold uppercase">{order.items} items</span>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
