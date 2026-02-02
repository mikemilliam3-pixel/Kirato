import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  ShoppingCart, Search, Heart, Star, ChevronLeft, ArrowRight, 
  Check, Plus, ShieldCheck, MapPin, Clock, AlertTriangle, MessageSquare, 
  Send, X, ThumbsUp, Phone, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { ShopProfile, Message, Conversation, ShopWorkingHours, VerificationStatus } from '../types';
import { chatService } from '../chatService';

interface SellerReview {
  id: string;
  sellerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface SellerReport {
  id: string;
  sellerId: string;
  reason: string;
  description?: string;
  createdAt: string;
}

const PublicShop: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.publicShop;
  const tc = t.chat;
  const tSettings = t.settings;

  const [cartCount, setCartCount] = useState(0);
  const [view, setView] = useState<'browse' | 'product'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Modals State
  const [showRateModal, setShowRateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Chat State
  const [buyerId] = useState(() => {
    const stored = localStorage.getItem('kirato-buyer-id');
    if (stored) return stored;
    const newId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('kirato-buyer-id', newId);
    return newId;
  });
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentConv, setCurrentConv] = useState<Conversation | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form State
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reportReason, setReportReason] = useState('scam');
  const [reportDesc, setReportDesc] = useState('');

  // Loaded Seller Data
  const [seller, setSeller] = useState<ShopProfile & { id: string, baseRating: number, baseReviewCount: number }>({
    id: 'seller_kirato',
    shopName: 'Kirato Premium Gadgets',
    description: 'We sell the best AI-integrated gadgets and accessories in Uzbekistan. Quality guaranteed.',
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

  const loadProfile = () => {
    const saved = localStorage.getItem('kirato-sales-shop-profile');
    if (saved) {
      const data = JSON.parse(saved);
      setSeller(prev => ({ ...prev, ...data }));
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('shop-profile-updated', loadProfile);
    return () => window.removeEventListener('shop-profile-updated', loadProfile);
  }, []);

  // Real-time Chat Sync
  useEffect(() => {
    if (showChatPanel) {
      const conv = chatService.getOrCreateConversation(seller.id, buyerId, 'Guest User');
      setCurrentConv(conv);
      setChatMessages(chatService.getMessages(conv.id));
      
      chatService.onMessage((data) => {
        if (data.type === 'NEW_MESSAGE' && data.payload.conversationId === conv.id) {
          setChatMessages(chatService.getMessages(conv.id));
        }
        if (data.type === 'CONVERSATION_UPDATED' && data.payload.id === conv.id) {
          setCurrentConv(prev => prev ? { ...prev, ...data.payload } : null);
        }
      });
    }
  }, [showChatPanel, seller.id, buyerId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !currentConv) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId: currentConv.id,
      sender: 'buyer',
      text: chatInput,
      createdAt: new Date().toISOString(),
      delivery: 'sent'
    };
    chatService.saveMessage(msg);
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
  };

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
    else {
      daysStr = typedWH.days.map(d => (tSettings.days as any)[d]).join(', ');
    }

    return `${daysStr} · ${typedWH.startTime}–${typedWH.endTime}`;
  }, [seller.workingHours, language, tSettings]);

  const products = [
    { id: '1', title: 'Wireless Headphones', price: 59.99, image: '🎧', rating: 4.8, desc: 'Premium noise-cancelling headphones with up to 30 hours of battery life and studio-quality sound.' },
    { id: '2', title: 'Minimalist Wallet', price: 25.00, image: '💼', rating: 4.5, desc: 'RFID blocking slim wallet made from high-grade carbon fiber.' },
    { id: '3', title: 'Smart Watch X', price: 129.00, image: '⌚', rating: 4.9, desc: 'Full health tracking, GPS navigation, and 7-day battery life.' },
    { id: '4', title: 'Bamboo Cup', price: 18.50, image: '☕', rating: 4.2, desc: 'Eco-friendly reusable coffee cup made from organic bamboo fibers.' },
  ];

  const [reviews, setReviews] = useState<SellerReview[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('kirato-sales-reviews');
    if (stored) setReviews(JSON.parse(stored));
  }, []);

  const { avgRating, totalReviews } = useMemo(() => {
    const sellerReviews = reviews.filter(r => r.sellerId === seller.id);
    const sum = sellerReviews.reduce((acc, r) => acc + r.rating, 0);
    const count = sellerReviews.length;
    const finalCount = seller.baseReviewCount + count;
    const finalAvg = ((seller.baseRating * seller.baseReviewCount) + sum) / finalCount;
    return { avgRating: finalAvg.toFixed(1), totalReviews: finalCount };
  }, [reviews, seller.id]);

  const handleRateSubmit = () => {
    const newReview: SellerReview = {
      id: Math.random().toString(36).substr(2, 9),
      sellerId: seller.id,
      rating: userRating,
      comment: userComment,
      createdAt: new Date().toISOString()
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem('kirato-sales-reviews', JSON.stringify(updated));
    setShowRateModal(false);
    setUserRating(5);
    setUserComment('');
    triggerSuccess(ts.success.rated);
  };

  const handleReportSubmit = () => {
    const report: SellerReport = {
      id: Math.random().toString(36).substr(2, 9),
      sellerId: seller.id,
      reason: reportReason,
      description: reportDesc,
      createdAt: new Date().toISOString()
    };
    const reports = JSON.parse(localStorage.getItem('kirato-sales-reports') || '[]');
    localStorage.setItem('kirato-sales-reports', JSON.stringify([...reports, report]));
    setShowReportModal(false);
    setReportReason('scam');
    setReportDesc('');
    triggerSuccess(ts.success.reported);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const openProduct = (p: any) => {
    setSelectedProduct(p);
    setView('product');
  };

  if (view === 'product') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-24 relative">
         <button onClick={() => setView('browse')} className="flex items-center gap-1 text-xs font-bold text-rose-600 transition-transform active:translate-x-[-4px]">
           <ChevronLeft size={18} /> Back to Shop
         </button>
         <div className="aspect-square sm:aspect-video bg-white dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-8xl shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
           {selectedProduct?.image}
         </div>
         <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
               <h3 className="text-2xl font-black tracking-tight">{selectedProduct?.title}</h3>
               <span className="text-2xl font-black text-rose-600">${selectedProduct?.price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-900/20 w-fit px-3 py-1 rounded-full">
               <Star size={14} fill="currentColor" />
               <span className="text-xs font-black uppercase tracking-wider">{selectedProduct?.rating} (Verified Purchase)</span>
            </div>
         </div>
         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
           {selectedProduct?.desc}
         </p>
         <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => { setCartCount(c => c + 1); triggerSuccess("Item added to cart"); }}
              className="w-full h-14 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all"
            >
              Add to Cart <ShoppingCart size={20} />
            </button>
            <button 
              onClick={() => setShowChatPanel(true)}
              className="w-full h-14 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Contact Seller <MessageSquare size={20} />
            </button>
         </div>

         <button 
           onClick={() => setShowChatPanel(true)}
           className="fixed bottom-24 sm:bottom-10 right-5 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-rose-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 z-50 active:scale-90 transition-transform animate-in zoom-in duration-500"
           title={ts.chatFloatingBtn}
         >
           <MessageSquare size={24} fill="currentColor" className="text-white" />
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 max-w-7xl mx-auto relative">
      <button 
        onClick={() => setShowChatPanel(true)}
        className="fixed bottom-24 sm:bottom-10 right-5 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-rose-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 z-50 active:scale-90 transition-transform animate-in zoom-in duration-500"
        title={ts.chatFloatingBtn}
      >
        <MessageSquare size={24} fill="currentColor" className="text-white" />
      </button>

      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Check size={18} /> {successMsg}
        </div>
      )}

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
                {seller.logoUrl ? (
                  <img src={seller.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left pb-1">
                <h2 className="text-lg sm:text-3xl font-black tracking-tight text-white sm:text-slate-900 dark:text-white mb-1 sm:mb-2">{seller.shopName}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                   {seller.verificationStatus === 'verified' && (
                     <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full border border-blue-100 dark:border-blue-900/40">
                        <ShieldCheck size={12} className="fill-blue-600 text-white" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{ts.verified}</span>
                     </div>
                   )}
                   {seller.verificationStatus === 'pending' && (
                     <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-full border border-amber-100 dark:border-amber-900/40">
                        <Clock size={12} />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{ts.verificationPending}</span>
                     </div>
                   )}
                   <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full sm:bg-transparent">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-black">{avgRating}</span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold ml-1">({totalReviews})</span>
                   </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setShowRateModal(true)} className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-gray-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all active:scale-95">
                <ThumbsUp size={14} /> {ts.rateBtn}
              </button>
              <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-slate-900 text-gray-400 rounded-xl sm:rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all active:scale-95">
                <AlertTriangle size={18} />
              </button>
            </div>
          </div>

          {seller.description && (
            <p className="mt-4 sm:mt-8 text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl text-center sm:text-left mx-auto sm:mx-0 line-clamp-2 sm:line-clamp-none">
              {seller.description}
            </p>
          )}

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-50 dark:border-slate-700/50 flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
             {seller.city && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 rounded-xl">
                 <MapPin size={14} className="text-rose-500" />
                 <div><p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">{seller.city}</p></div>
               </div>
             )}
             {formattedWorkingHours && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 rounded-xl">
                 <Clock size={14} className="text-amber-500" />
                 <div><p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">{formattedWorkingHours}</p></div>
               </div>
             )}
          </div>
        </div>
      </section>

      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <h3 className="font-black text-lg sm:text-2xl tracking-tight">Products</h3>
          <div className="flex-1 max-w-md flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-800 h-10 sm:h-12 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none text-[11px] sm:text-xs font-medium focus:ring-0 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div onClick={() => openProduct(p)} className="h-32 sm:h-56 bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-4xl sm:text-7xl cursor-pointer group-hover:scale-105 transition-transform duration-500 relative">
                {p.image}
              </div>
              <div className="p-3 sm:p-5 space-y-2 sm:space-y-4 flex-1 flex flex-col">
                <div className="space-y-0.5">
                  <h4 onClick={() => openProduct(p)} className="font-black text-xs sm:text-base cursor-pointer hover:text-rose-600 transition-colors truncate">{p.title}</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 line-clamp-1 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm sm:text-lg font-black text-rose-600 tracking-tight">${p.price}</span>
                  <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-black"><Star size={10} fill="currentColor" /> {p.rating}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 sm:pt-2">
                   <button onClick={() => setShowChatPanel(true)} className="py-1.5 sm:py-2.5 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95">
                     {ts.contactBtn}
                   </button>
                   <button onClick={() => triggerSuccess("Request sent to seller")} className="py-1.5 sm:py-2.5 bg-rose-600 text-white rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">
                     {ts.requestBtn}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODALS & PANELS --- */}

      {/* Chat Panel - Bottom Sheet for Mobile, Modal for Desktop */}
      {showChatPanel && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowChatPanel(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] h-[85vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
              {/* Chat Header */}
              <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center"><MessageSquare size={22}/></div>
                    <div>
                       <h4 className="text-sm font-black tracking-tight">{seller.shopName}</h4>
                       <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${currentConv?.sellerPresence === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                            {currentConv?.sellerPresence === 'online' ? ts.online : ts.offline}
                          </span>
                          {currentConv?.handoffMode === 'ai' && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-purple-400 uppercase tracking-widest ml-2">
                              <Sparkles size={8}/> AI Active
                            </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setShowChatPanel(false)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-slate-600"><X size={24}/></button>
              </div>

              {/* Chat Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-gray-50/50 dark:bg-slate-950/30">
                 {chatMessages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
                      <MessageSquare size={40} className="mb-4" />
                      <p className="text-xs font-black uppercase tracking-widest">Start a conversation with {seller.shopName}</p>
                   </div>
                 ) : (
                   chatMessages.map(msg => (
                     <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl flex flex-col gap-1 shadow-sm ${
                          msg.sender === 'buyer' 
                            ? 'bg-rose-600 text-white rounded-tr-none' 
                            : msg.sender === 'ai'
                              ? 'bg-purple-600 text-white rounded-tl-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                        }`}>
                           <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                           <div className="flex items-center justify-between gap-4 mt-1 opacity-60">
                              {msg.sender === 'ai' && <span className="text-[7px] font-black uppercase tracking-widest flex items-center gap-1"><Sparkles size={8}/> AI Assistant</span>}
                              <span className="text-[8px] font-black ml-auto">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              {/* Chat Input */}
              <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                 <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-slate-800 rounded-[20px] shadow-inner">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder={tc.type} 
                      className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-3 font-bold" 
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="w-10 h-10 bg-rose-600 disabled:opacity-30 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0"
                    >
                      <Send size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowRateModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black tracking-tight">{ts.rateModal.title}</h4>
               <button onClick={() => setShowRateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setUserRating(s)} className="transition-transform active:scale-90">
                    <Star size={40} className={s <= userRating ? "text-amber-500" : "text-gray-200 dark:text-slate-700"} fill={s <= userRating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea value={userComment} onChange={e => setUserComment(e.target.value)} className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-medium text-sm" placeholder={ts.rateModal.placeholder} />
              <div className="flex gap-3">
                <button onClick={() => setShowRateModal(false)} className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all">{ts.cancel}</button>
                <button onClick={handleRateSubmit} className="flex-[2] h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">{ts.submit}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black tracking-tight flex items-center gap-2"><AlertTriangle className="text-rose-500" size={24} />{ts.reportModal.title}</h4>
               <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
            </div>
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.reportModal.reason}</label>
                 <select value={reportReason} onChange={e => setReportReason(e.target.value)} className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold">
                    {Object.entries(ts.reportModal.reasons).map(([key, label]) => (<option key={key} value={key}>{label as string}</option>))}
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.reportModal.description}</label>
                 <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="Describe the issue..." className="w-full h-32 p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-medium text-sm" />
               </div>
               <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowReportModal(false)} className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">{ts.cancel}</button>
                  <button onClick={handleReportSubmit} className="flex-1 h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">{ts.submit}</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicShop;