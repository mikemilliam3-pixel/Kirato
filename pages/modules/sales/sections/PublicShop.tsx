
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
// Fixed missing 'Plus' icon import
import { ShoppingCart, Search, Heart, Star, ChevronLeft, ArrowRight, Check, Plus } from 'lucide-react';

const PublicShop: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language];
  const [cartCount, setCartCount] = useState(0);
  const [view, setView] = useState<'browse' | 'product'>('browse');

  const products = [
    { id: '1', title: 'Wireless Headphones', price: 59.99, image: '🎧', rating: 4.8 },
    { id: '2', title: 'Minimalist Wallet', price: 25.00, image: '💼', rating: 4.5 },
    { id: '3', title: 'Smart Watch X', price: 129.00, image: '⌚', rating: 4.9 },
    { id: '4', title: 'Bamboo Cup', price: 18.50, image: '☕', rating: 4.2 },
  ];

  if (view === 'product') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
         <button onClick={() => setView('browse')} className="flex items-center gap-1 text-xs font-bold text-rose-600">
           <ChevronLeft size={16} /> Back to Shop
         </button>
         <div className="h-64 bg-white dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-8xl shadow-lg border border-gray-100 dark:border-slate-700">
           🎧
         </div>
         <div className="space-y-2">
            <div className="flex justify-between items-start">
               <h3 className="text-2xl font-extrabold">Wireless Headphones</h3>
               <span className="text-2xl font-extrabold text-rose-600">$59.99</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
               <Star size={14} fill="currentColor" />
               <span className="text-xs font-bold">4.8 (124 reviews)</span>
            </div>
         </div>
         <p className="text-xs text-slate-500 leading-relaxed">
           Premium noise-cancelling headphones with up to 30 hours of battery life and studio-quality sound. Perfect for daily commutes and professional work.
         </p>
         <div className="pt-6 space-y-3">
            <button 
              onClick={() => { setCartCount(c => c + 1); setView('browse'); }}
              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              Add to Cart <ShoppingCart size={18} />
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-extrabold text-xl">Kirato Demo Shop</h3>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Storefront Online</p>
        </div>
        <div className="relative">
          <button className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-700 relative">
            <ShoppingCart size={22} className="text-rose-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Search products..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} onClick={() => setView('product')} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all">
            <div className="h-32 bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-5xl">
              {p.image}
            </div>
            <div className="p-4">
              <h4 className="font-bold text-xs truncate mb-1">{p.title}</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold text-rose-600">${p.price}</span>
                <button className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicShop;
