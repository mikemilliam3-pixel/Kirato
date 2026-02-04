import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { CheckCircle, ShieldCheck, Copy, Home, ShoppingBag, Key } from 'lucide-react';
import { Order } from '../types';

const OrderSuccess: React.FC = () => {
  const { language, t: globalT } = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.checkout.success;

  useEffect(() => {
    const lastOrder = localStorage.getItem('kirato_last_order');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    } else {
      navigate('/modules/sales');
    }
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
          <CheckCircle size={48} />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-500 shadow-xl">
           <ShieldCheck size={20} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">{ts.title}</h2>
        <p className="text-sm text-slate-500 font-medium">{ts.subtitle}</p>
      </div>

      {/* Code Display */}
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 to-rose-600" />
        <div className="flex items-center justify-center gap-2 mb-2">
           <Key className="text-rose-600" size={20} />
           <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">{ts.security_code_title}</h4>
        </div>
        
        <div className="text-5xl font-black tracking-[8px] text-slate-900 dark:text-white tabular-nums">
          {order.deliveryCode}
        </div>
        
        <p className="text-[10px] font-bold text-rose-600 leading-relaxed uppercase px-4">
          {ts.security_warning}
        </p>

        <button 
          onClick={() => navigator.clipboard.writeText(order.deliveryCode || '')}
          className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
        >
          <Copy size={12} /> {ts.copy_code}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <button 
          onClick={() => navigate('/modules/sales')}
          className="h-14 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home size={16} /> {globalT('nav.home')}
        </button>
        <button 
          onClick={() => navigate('/modules/sales')}
          className="h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> {t.cart.start_shopping}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;