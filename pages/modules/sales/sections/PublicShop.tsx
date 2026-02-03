import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  ShoppingCart, Search, Heart, Star, ChevronLeft, ArrowRight, 
  Check, Plus, ShieldCheck, MapPin, Clock, AlertTriangle, MessageSquare, 
  Send, X, ThumbsUp, Phone, Image as ImageIcon, Sparkles, LogIn, Copy, ExternalLink, Store
} from 'lucide-react';
import { ShopProfile, Message, Conversation, ShopWorkingHours, VerificationStatus, Product } from '../types';
import { chatService } from '../chatService';

interface SellerReview {
  id: string;
  sellerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface PublicShopProps {
  mode?: 'marketplace' | 'seller_shop';
  sellerId?: string; // Explicitly pass sellerId for "My Shop" context
}

const PublicShop: React.FC<PublicShopProps> = ({ mode = 'marketplace', sellerId: propSellerId }) => {
  const { language, isLoggedIn, login, t: globalT } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const { sellerId: urlSellerId } = useParams();
  
  // Logic: Priority given to propSellerId (for tabs), then urlSellerId (for public links)
  const activeSellerId = propSellerId || urlSellerId || 'seller_kirato';

  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.publicShop;
  const tc = t.chat;
  const tSettings = t.settings;

  // --- DEEP LINK ROUTING LOGIC ---
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const deepLinkedProductId = queryParams.get('productId');

  const [cartCount, setCartCount] = useState(0);
  const [view, setView] = useState<'browse' | 'product'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modals State
  const [showRateModal, setShowRateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Loaded Seller Data (For Seller Shop view)
  const [seller, setSeller] = useState<ShopProfile & { id: string, baseRating: number, baseReviewCount: number }>({
    id: activeSellerId,
    shopName: activeSellerId === 'seller_kirato' ? 'Kirato Premium Gadgets' : 'My Store',
    description: 'We sell the best AI-integrated gadgets and accessories. Quality guaranteed.',
    city: 'Tashkent',
    workingHours: {
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      startTime: '09:00',
      endTime: '20:00'
    },
    verificationStatus: 'unverified',
    baseRating: 4.6,
    baseReviewCount: 23,
    logoUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80'
  });

  const allProducts: Product[] = useMemo(() => {
    const saved = localStorage.getItem('kirato-sales-products');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', sellerId: 'seller_kirato', title: 'Wireless Headphones', price: 59.99, images: ['🎧'], shortDescription: 'Premium noise-cancelling headphones.', fullDescription: '', category: 'electronics', tags: [], currency: 'USD', stock: 10, status: 'active', visibility: 'public', approvalRequired: false, trialAvailable: false, createdAt: '' },
      { id: '2', sellerId: 'seller_kirato', title: 'Minimalist Wallet', price: 25.00, images: ['💼'], shortDescription: 'RFID blocking slim wallet.', fullDescription: '', category: 'electronics', tags: [], currency: 'USD', stock: 10, status: 'active', visibility: 'public', approvalRequired: false, trialAvailable: false, createdAt: '' },
      { id: '3', sellerId: 'other_seller', title: 'Smart Watch X', price: 129.00, images: ['⌚'], shortDescription: 'Full health tracking.', fullDescription: '', category: 'electronics', tags: [], currency: 'USD', stock: 10, status: 'active', visibility: 'public', approvalRequired: false, trialAvailable: false, createdAt: '' },
      { id: '4', sellerId: 'other_seller', title: 'Bamboo Cup', price: 18.50, images: ['☕'], shortDescription: 'Eco-friendly reusable coffee cup.', fullDescription: '', category: 'electronics', tags: [], currency: 'USD', stock: 10, status: 'active', visibility: 'public', approvalRequired: false, trialAvailable: false, createdAt: '' },
    ];
  }, []);

  // Use the explicitly filtered product list based on mode
  const displayProducts = useMemo(() => {
    if (mode === 'marketplace') return allProducts;
    return allProducts.filter(p => p.sellerId === activeSellerId);
  }, [mode, allProducts, activeSellerId]);

  useEffect(() => {
    if (mode === 'seller_shop') {
      const saved = localStorage.getItem('kirato-sales-shop-profile');
      if (saved) {
        const data = JSON.parse(saved);
        // Only override if the current active seller is the user (simplified for local demo)
        if (activeSellerId !== 'other_seller') setSeller(prev => ({ ...prev, ...data }));
      }
    }
  }, [mode, activeSellerId]);

  // Handle Deep Linking
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

  const formattedWorkingHours = useMemo(() => {
    const wh = seller.workingHours;
    if (!wh) return null;
    if (typeof wh === 'string') return wh;
    const typedWH = wh as ShopWorkingHours;
    if (!typedWH.days || !typedWH.days.length) return tSettings.closed;
    let daysStr = "";
    if (typedWH.days.length === 7) daysStr = tSettings.presets.everyday;
    else if (typedWH.days.length === 5 && !['sat', 'sun'].some(d => typedWH.days.includes(d as any))) daysStr = tSettings.presets.monFri;
    else if (typedWH.days.length === 6 && !typedWH.days.includes('sun' as any)) daysStr = tSettings.presets.monSat;
    else daysStr = typedWH.days.map(d => (tSettings.days as any)[d]).join(', ');
    return `${daysStr} · ${typedWH.startTime}–${typedWH.endTime}`;
  }, [seller.workingHours, language, tSettings]);

  const openProduct = (p: Product) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}?productId=${p.id}`);
  };

  const closeProduct = () => {
    const currentPath = location.pathname;
    navigate(currentPath);
  };

  const goToSellerShop = (sid: string) => {
    navigate(`/modules/sales/shop/${sid}`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (view === 'product' && selectedProduct) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-24 relative max-w-5xl mx-auto">
         <button onClick={closeProduct} className="flex items-center gap-1 text-xs font-bold text-rose-600 transition-transform active:translate-x-[-4px]">
           <ChevronLeft size={18} /> Back
         </button>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-white dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-8xl shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
              {selectedProduct.images[0]?.length < 50 ? selectedProduct.images[0] : <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt={selectedProduct.title} />}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                 <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-black tracking-tight">{selectedProduct.title}</h3>
                    <button 
                      onClick={() => goToSellerShop(selectedProduct.sellerId!)}
                      className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1.5 hover:underline"
                    >
                      <Store size={12} /> {globalT('auth.viewSellerProducts')} <ArrowRight size={10} />
                    </button>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-rose-600">${selectedProduct.price}</span>
                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                       <Star size={14} fill="currentColor" />
                       <span className="text-[10px] font-black uppercase tracking-wider">4.8</span>
                    </div>
                 </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {selectedProduct.shortDescription || 'No description provided.'}
              </p>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                   onClick={() => { setCartCount(c => c + 1); triggerSuccess("Item added to cart"); }}
                   className="w-full h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-rose-200"
                 >
                   Add to Cart <ShoppingCart size={20} />
                 </button>
                 <button 
                   onClick={() => setShowChatPanel(true)}
                   className="w-full h-14 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                   Contact Seller <MessageSquare size={20} />
                 </button>
              </div>
            </div>
         </div>

         {/* More products section */}
         <section className="pt-12 space-y-6">
            <h4 className="text-lg font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">More from this shop</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {allProducts.filter(p => p.sellerId === selectedProduct.sellerId && p.id !== selectedProduct.id).slice(0, 4).map(p => (
                 <div key={p.id} onClick={() => openProduct(p)} className="bg-white dark:bg-slate-800 rounded-3xl p-3 border border-gray-100 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-95">
                    <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-3xl mb-3 overflow-hidden">
                       {p.images[0]?.length < 50 ? p.images[0] : <img src={p.images[0]} className="w-full h-full object-cover" alt={p.title} />}
                    </div>
                    <h5 className="text-[11px] font-black truncate">{p.title}</h5>
                    <p className="text-xs font-black text-rose-600 mt-1">${p.price}</p>
                 </div>
               ))}
            </div>
         </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 max-w-7xl mx-auto relative animate-in fade-in duration-500">
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-xs uppercase flex items-center gap-2">
          <Check size={18} /> {successMsg}
        </div>
      )}

      {/* SHOP BANNER: Only visible in Seller Shop mode */}
      {mode === 'seller_shop' && (
        <section className="relative rounded-[32px] sm:rounded-[48px] overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="h-32 sm:h-56 w-full relative bg-slate-100 dark:bg-slate-900">
            {seller.bannerUrl ? (
              <img src={seller.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-rose-500/20 to-blue-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="px-4 sm:px-10 pb-6 sm:pb-8 -mt-8 sm:-mt-12 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-5">
                <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-[24px] sm:rounded-[32px] border-4 border-white dark:border-slate-800 bg-white shadow-xl overflow-hidden shrink-0">
                  <img src={seller.logoUrl || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="Logo" />
                </div>
                <div className="text-center sm:text-left pb-1">
                  <h2 className="text-lg sm:text-3xl font-black tracking-tight text-white sm:text-slate-900 dark:text-white mb-1 sm:mb-2">{seller.shopName}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                     <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50/50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-black">4.8</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setShowRateModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-slate-900 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95">
                  <ThumbsUp size={14} /> {ts.rateBtn}
                </button>
              </div>
            </div>
            {seller.description && <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium max-w-2xl">{seller.description}</p>}
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50 flex flex-wrap gap-4">
               <div className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500"/> <span className="text-[10px] font-bold">{seller.city}</span></div>
               <div className="flex items-center gap-1.5"><Clock size={12} className="text-amber-500"/> <span className="text-[10px] font-bold">{formattedWorkingHours}</span></div>
            </div>
          </div>
        </section>
      )}

      {/* MARKETPLACE TITLE: Only in Marketplace mode */}
      {mode === 'marketplace' && (
        <div className="px-1 space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Marketplace</h2>
          <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Mixed products from all verified sellers</p>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex-1 max-w-md flex items-center gap-3 bg-white dark:bg-slate-800 h-12 px-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search products..." className="bg-transparent border-none text-xs font-medium focus:ring-0 w-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayProducts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
              <div onClick={() => openProduct(p)} className="h-32 sm:h-48 bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-4xl cursor-pointer group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {p.images[0]?.length < 50 ? p.images[0] : <img src={p.images[0]} className="w-full h-full object-cover" alt={p.title} />}
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                <h4 onClick={() => openProduct(p)} className="font-black text-xs sm:text-sm truncate cursor-pointer hover:text-rose-600">{p.title}</h4>
                {mode === 'marketplace' && (
                  <button onClick={() => goToSellerShop(p.sellerId!)} className="text-[8px] font-bold text-blue-500 uppercase flex items-center gap-1">
                    <Store size={10} /> View Shop
                  </button>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-rose-600">${p.price}</span>
                  <button onClick={() => openProduct(p)} className="p-2 bg-rose-50 text-rose-600 rounded-lg active:scale-90 transition-transform">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals like Rate, Report, Chat remains as previous implementation */}
      {showChatPanel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowChatPanel(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] h-[500px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black tracking-tight">Contact Seller</h4>
                <button onClick={() => setShowChatPanel(false)} className="text-gray-400"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 opacity-40 flex flex-col items-center justify-center text-center space-y-4">
                 <MessageSquare size={48} />
                 <p className="text-xs font-black uppercase">Chat system ready for demo</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PublicShop;