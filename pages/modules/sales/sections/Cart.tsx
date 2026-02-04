import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { useCart } from '../../../../context/CartContext';
import { salesTranslations } from '../i18n';
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, ArrowRight, X } from 'lucide-react';

const Cart: React.FC = () => {
  const { language, t: globalT } = useApp();
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const tc = t.cart;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-black mb-2">{tc.empty_cart}</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-sm">{globalT('common.loginRequiredDesc')}</p>
        <button onClick={() => navigate('/modules/sales')} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
          {tc.start_shopping}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-bold text-rose-600">
          <ChevronLeft size={18} /> {globalT('common.back')}
        </button>
        <div className="flex items-center gap-4">
           <button onClick={clearCart} className="text-[10px] font-black uppercase text-gray-400 hover:text-rose-600 transition-colors flex items-center gap-1">
             <Trash2 size={12}/> {tc.clear_cart}
           </button>
           <h3 className="text-xl font-black tracking-tight">{tc.cart_title} ({totalItems})</h3>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="p-4 bg-white dark:bg-slate-800 rounded-[28px] border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 text-3xl overflow-hidden">
               {item.product.images[0]?.length < 100 ? item.product.images[0] : <img src={item.product.images[0]} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
               <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">{item.product.title}</h4>
               <p className="text-rose-600 font-black text-sm mt-0.5">${item.product.price}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-slate-950 p-1 rounded-xl">
               <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-500 shadow-sm active:scale-90"><Minus size={12}/></button>
               <span className="text-[11px] font-black w-4 text-center">{item.quantity}</span>
               <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg text-slate-500 shadow-sm active:scale-90"><Plus size={12}/></button>
            </div>
            <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100" title={tc.remove}>
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
         <div className="flex justify-between items-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <span>{tc.estimated_total}</span>
            <span className="text-lg font-black text-rose-600">${subtotal.toFixed(2)}</span>
         </div>
         <button onClick={() => navigate('/modules/sales/checkout')} className="w-full h-14 bg-rose-600 text-white rounded-[20px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
           {tc.checkout} <ArrowRight size={18} />
         </button>
      </div>
    </div>
  );
};

export default Cart;