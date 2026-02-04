import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { useCart } from '../../../../context/CartContext';
import { salesTranslations } from '../i18n';
import { 
  ShoppingCart, Search, Star, ChevronLeft, ArrowRight, 
  Check, Plus, ShieldCheck, MapPin, Clock, MessageSquare, 
  ThumbsUp, Store
} from 'lucide-react';
import { ShopProfile, Product, ShopWorkingHours } from '../types';
import ProductChat from '../../../../components/chat/ProductChat';

interface PublicShopProps {
  mode?: 'marketplace' | 'seller_shop';
  sellerId?: string;
}

const PublicShop: React.FC<PublicShopProps> = ({ mode = 'marketplace', sellerId: propSellerId }) => {
  const { language, t: globalT } = useApp();
  const { addToCart, totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { sellerId: urlSellerId } = useParams();
  
  const activeSellerId = propSellerId || urlSellerId || 'seller_kirato';
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.publicShop;
  const tc = t.cart;
  const tSettings = t.settings;

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const deepLinkedProductId = queryParams.get('productId');

  const [view, setView] = useState<'browse' | 'product'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [seller, setSeller] = useState<ShopProfile & { id: string, baseRating: number }>({
    id: activeSellerId,
    shopName: activeSellerId === 'seller_kirato' ? 'Kirato Premium' : 'Merchant Store',
    description: 'Specialized hardware and software solutions.',
    city: 'Tashkent',
    workingHours: { days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], startTime: '09:00', endTime: '20:00' },
    baseRating: 4.8,
    logoUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80'
  });

  const allProducts: Product[] = useMemo(() => {
    const saved = localStorage.getItem('kirato-sales-products');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', sellerId: 'seller_kirato', title: 'Wireless Headphones', price: 59.99, images: ['🎧'], shortDescription: 'Premium noise-cancelling headphones.', status: 'active', visibility: 'public', category: 'electronics' },
      { id: '2', sellerId: 'seller_kirato', title: 'Minimalist Wallet', price: 25.00, images: ['💼'], shortDescription: 'RFID blocking slim wallet.', status: 'active', visibility: 'public', category: 'bags' },
      { id: '3', sellerId: 'other_seller', title: 'Smart Watch X', price: 129.00, images: ['⌚'], shortDescription: 'Full health tracking.', status: 'active', visibility: 'public', category: 'electronics' },
    ];
  }, []);

  const displayProducts = useMemo(() => {
    if (mode === 'marketplace') return allProducts;
    return allProducts.filter(p => p.sellerId === activeSellerId);
  }, [mode, allProducts, activeSellerId]);

  useEffect(() => {
    if (deepLinkedProductId) {
      const p = allProducts.find(prod => prod.id === deepLinkedProductId);
      if (p) {
        setSelectedProduct(p);
        setView('product');
      }
    } else {
      setView('browse');
      setSelectedProduct(null);
    }
  }, [deepLinkedProductId, allProducts]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAddToCart = (p: Product) => {
    addToCart(p, 1);
    triggerSuccess(`${tc.added_to_cart}: "${p.title}"`);
  };

  const openContactSeller = (p: Product) => {
    setSelectedProduct(p);
    setShowChatPanel(true);
  };

  const openProduct = (p: Product) => {
    navigate(`${location.pathname}?productId=${p.id}`);
  };

  const closeProduct = () => {
    navigate(location.pathname);
  };

  const formattedWorkingHours = useMemo(() => {
    const wh = seller.workingHours as ShopWorkingHours;
    if (!wh || !wh.days.length) return tSettings.closed;
    return `${wh.startTime}–${wh.endTime}`;
  }, [seller.workingHours, tSettings]);

  if (view === 'product' && selectedProduct) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-24 relative max-w-5xl mx-auto">
         <button onClick={closeProduct} className="flex items-center gap-1 text-xs font-bold text-rose-600">
           <ChevronLeft size={18} /> {globalT('common.back')}
         </button>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-white dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-8xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
              {selectedProduct.images[0]?.length < 100 ? selectedProduct.images[0] : <img src={selectedProduct.images[0]} className="w-full h-full object-cover" />}
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tight">{selectedProduct.title}</h3>
              <span className="text-3xl font-black text-rose-600">${selectedProduct.price}</span>
              <p className="text-sm text-slate-500 leading-relaxed">{selectedProduct.shortDescription}</p>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button onClick={() => handleAddToCart(selectedProduct)} className="w-full h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                   {tc.add_to_cart} <ShoppingCart size={20} />
                 </button>
                 <button onClick={() => openContactSeller(selectedProduct)} className="w-full h-14 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                   {tc.contact_seller} <MessageSquare size={20} />
                 </button>
              </div>
            </div>
         </div>
         <ProductChat isOpen={showChatPanel} onClose={() => setShowChatPanel(false)} sellerId={selectedProduct.sellerId} sellerName={seller.shopName} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 max-w-7xl mx-auto relative animate-in fade-in duration-500">
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-[10px] uppercase flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {totalItems > 0 && (
        <button onClick={() => navigate('/modules/sales/cart')} className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-300 active:scale-90 transition-all">
          <ShoppingCart size={24} />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-rose-600 rounded-full flex items-center justify-center text-xs font-black border-2 border-rose-600">{totalItems}</span>
        </button>
      )}

      {mode === 'seller_shop' && (
        <section className="relative rounded-[32px] overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="h-32 sm:h-56 w-full relative bg-slate-100 dark:bg-slate-900">
            <img src={seller.bannerUrl} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="px-6 pb-8 -mt-8 relative z-10 flex flex-col items-center sm:items-start">
             <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-[24px] border-4 border-white dark:border-slate-800 bg-white overflow-hidden shadow-xl mb-4">
                <img src={seller.logoUrl} className="w-full h-full object-cover" />
             </div>
             <h2 className="text-xl sm:text-3xl font-black tracking-tight">{seller.shopName}</h2>
             <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
               <div className="flex items-center gap-1.5 text-[10px] font-bold"><MapPin size={12} className="text-rose-500"/> {seller.city}</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold"><Clock size={12} className="text-amber-500"/> {formattedWorkingHours}</div>
             </div>
          </div>
        </section>
      )}

      <div className="px-1 space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{mode === 'marketplace' ? globalT('nav.explore') : ts.shopProfile}</h2>
        <div className="flex-1 max-w-md flex items-center gap-3 bg-white dark:bg-slate-800 h-12 px-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder={globalT('common.search')} className="bg-transparent border-none text-xs font-medium focus:ring-0 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {displayProducts.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
            <div onClick={() => openProduct(p)} className="h-32 sm:h-48 bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-4xl cursor-pointer overflow-hidden">
              {p.images[0]?.length < 100 ? p.images[0] : <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h4 onClick={() => openProduct(p)} className="font-black text-xs sm:text-sm truncate cursor-pointer hover:text-rose-600 mb-1">{p.title}</h4>
              <span className="text-sm font-black text-rose-600 block mb-4">${p.price}</span>
              
              <div className="space-y-2 mt-auto">
                <button 
                  onClick={() => handleAddToCart(p)}
                  className="w-full h-9 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> {tc.add_to_cart}
                </button>
                <button 
                  onClick={() => openContactSeller(p)}
                  className="w-full h-9 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> {tc.contact_seller}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && <ProductChat isOpen={showChatPanel} onClose={() => setShowChatPanel(false)} sellerId={selectedProduct.sellerId} sellerName={seller.shopName} />}
    </div>
  );
};

export default PublicShop;