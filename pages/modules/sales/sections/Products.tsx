
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';

const Products: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].products;
  const [filter, setFilter] = useState('all');

  const products = [
    { id: '1', title: 'Wireless Headphones', price: 59.99, stock: 12, category: 'Electronics', status: 'active', image: '🎧' },
    { id: '2', title: 'Smart Watch X', price: 129.00, stock: 0, category: 'Gadgets', status: 'out_of_stock', image: '⌚' },
    { id: '3', title: 'Minimalist Wallet', price: 25.00, stock: 45, category: 'Accessories', status: 'active', image: '💼' },
    { id: '4', title: 'Bamboo Coffee Cup', price: 18.50, stock: 8, category: 'Home', status: 'draft', image: '☕' },
  ];

  const filtered = products.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg lg:text-xl">Inventory</h3>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all">
          <Plus size={16} /> {t.add}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder={t.search} className="bg-transparent border-none text-sm focus:ring-0 w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['all', 'active', 'draft', 'out_of_stock'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === s ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border border-gray-100 dark:border-slate-700'
              }`}
            >
              {s === 'all' ? t.all : (t as any)[s === 'out_of_stock' ? 'outOfStock' : s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center md:items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl shadow-inner shrink-0">
              {product.image}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm lg:text-base truncate">{product.title}</h4>
              <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase mb-1">{product.category}</p>
              <div className="flex items-center gap-3">
                <span className="text-sm lg:text-base font-extrabold text-rose-600">${product.price}</span>
                <span className={`text-[9px] lg:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-300 hover:text-rose-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
