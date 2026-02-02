
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
// Fixed: Added RefreshCw to imports
import { 
  ShieldAlert, ShieldCheck, Clock, CheckCircle2, XCircle, Search, 
  Filter, ChevronRight, User, Briefcase, FileText, ExternalLink, 
  ArrowLeft, Info, AlertTriangle, Eye, RefreshCw
} from 'lucide-react';
import { ShopProfile, VerificationStatus, VerificationDocument, VerificationHistoryItem } from '../types';

const SupportInbox: React.FC = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.supportInbox;

  const [supportMode, setSupportMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState<ShopProfile[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<ShopProfile | null>(null);
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    const mode = localStorage.getItem('kirato-support-mode') === 'true';
    setSupportMode(mode);
    if (!mode) {
      setTimeout(() => navigate('/modules/sales/dashboard'), 2000);
    } else {
      loadRequests();
    }
  }, [navigate]);

  const loadRequests = () => {
    setLoading(true);
    // In a multi-seller app, we'd fetch a list. 
    // For this single-seller demo, we use the main profile storage as a single-item array.
    const profileStr = localStorage.getItem('kirato-sales-shop-profile');
    if (profileStr) {
      setSellers([JSON.parse(profileStr)]);
    }
    setLoading(false);
  };

  const handleAction = (status: VerificationStatus) => {
    if (!selectedSeller) return;
    if (status === 'rejected' && !rejectNote.trim()) return;

    const historyItem: VerificationHistoryItem = {
      action: status === 'verified' ? 'approved' : 'rejected',
      at: new Date().toISOString(),
      note: status === 'rejected' ? rejectNote : undefined
    };

    const updatedSeller: ShopProfile = {
      ...selectedSeller,
      verificationStatus: status,
      verifiedAt: status === 'verified' ? new Date().toISOString() : selectedSeller.verifiedAt,
      verificationNote: status === 'rejected' ? rejectNote : undefined,
      verificationHistory: [historyItem, ...(selectedSeller.verificationHistory || [])]
    };

    // Update global storage
    localStorage.setItem('kirato-sales-shop-profile', JSON.stringify(updatedSeller));
    window.dispatchEvent(new Event('shop-profile-updated'));
    
    // Refresh local list
    setSellers(prev => prev.map(s => s.shopName === updatedSeller.shopName ? updatedSeller : s));
    setSelectedSeller(null);
    setRejectNote('');
  };

  const filteredSellers = sellers.filter(s => {
    const matchesFilter = filter === 'all' || s.verificationStatus === filter;
    const matchesSearch = !search || s.shopName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!supportMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-black mb-2">{ts.notAuthorized}</h2>
        <p className="text-slate-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {selectedSeller ? (
        <div className="animate-in slide-in-from-right duration-300 space-y-6">
           {/* Detail View Header */}
           <div className="flex items-center justify-between">
              <button onClick={() => setSelectedSeller(null)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-rose-600 transition-colors">
                <ArrowLeft size={16} /> {ts.detail.back}
              </button>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop Name:</span>
                 <h4 className="text-sm font-black text-slate-900 dark:text-white">{selectedSeller.shopName}</h4>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Seller Summary & Documents */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{ts.detail.sellerInfo}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{ts.list.type}</p>
                          <div className="flex items-center gap-2 text-xs font-bold">
                             {selectedSeller.sellerType === 'business' ? <Briefcase size={14} className="text-blue-500" /> : <User size={14} className="text-emerald-500" />}
                             {selectedSeller.sellerType === 'business' ? t.settings.verification.business : t.settings.verification.individual}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{ts.list.submitted}</p>
                          <p className="text-xs font-bold">{selectedSeller.verificationSubmittedAt ? new Date(selectedSeller.verificationSubmittedAt).toLocaleString() : 'N/A'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{ts.detail.documents}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {(selectedSeller.verificationDocs || []).map(doc => (
                         <div key={doc.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 space-y-3 group relative">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                                     {doc.fileType.startsWith('image') ? <Eye size={18} className="text-blue-500" /> : <FileText size={18} className="text-rose-500" />}
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">{doc.type.replace('_', ' ')}</p>
                                     <p className="text-[11px] font-bold truncate">{doc.fileName}</p>
                                  </div>
                               </div>
                            </div>
                            
                            {doc.fileType.startsWith('image') ? (
                               <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white">
                                  <img src={doc.previewUrl} className="w-full h-full object-contain" alt="Document" />
                               </div>
                            ) : (
                               <div className="py-8 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200">
                                  <FileText size={32} className="text-gray-300" />
                                  <span className="text-[10px] font-black uppercase mt-2">PDF Document</span>
                               </div>
                            )}

                            <button 
                              onClick={() => window.open(doc.previewUrl)}
                              className="w-full py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                               <ExternalLink size={14} /> View Full
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Review Sidebar */}
              <div className="space-y-6">
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{ts.detail.actions}</h3>
                    
                    {selectedSeller.verificationStatus === 'pending' ? (
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{t.settings.verification.adminNote}</label>
                            <textarea 
                              value={rejectNote}
                              onChange={e => setRejectNote(e.target.value)}
                              className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-xs font-bold"
                              placeholder={ts.detail.notePlaceholder}
                            />
                         </div>
                         <div className="grid grid-cols-1 gap-3">
                            <button 
                              onClick={() => handleAction('verified')}
                              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all"
                            >
                               <ShieldCheck size={18} className="inline mr-2" /> {ts.detail.approve}
                            </button>
                            <button 
                              onClick={() => handleAction('rejected')}
                              disabled={!rejectNote.trim()}
                              className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] active:scale-95 transition-all disabled:opacity-50"
                            >
                               <XCircle size={18} className="inline mr-2" /> {ts.detail.reject}
                            </button>
                         </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 flex items-center justify-center text-[10px] font-black uppercase text-gray-400">
                        Status: {selectedSeller.verificationStatus}
                      </div>
                    )}
                 </div>

                 {/* History / Log */}
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{ts.detail.history}</h3>
                    <div className="space-y-4">
                       {(selectedSeller.verificationHistory || []).map((h, i) => (
                         <div key={i} className="flex gap-3 relative before:absolute before:left-[9px] before:top-4 before:bottom-0 before:w-[1px] before:bg-gray-100 last:before:hidden">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                              h.action === 'approved' ? 'bg-emerald-500' : h.action === 'rejected' ? 'bg-rose-500' : 'bg-blue-500'
                            }`}>
                               <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                            <div className="space-y-1 pb-4">
                               <p className="text-[10px] font-black uppercase tracking-widest">{h.action}</p>
                               <p className="text-[8px] font-bold text-gray-400">{new Date(h.at).toLocaleString()}</p>
                               {h.note && <p className="text-[10px] font-bold text-slate-500 mt-1 italic">"{h.note}"</p>}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500 space-y-6">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-tight">{ts.title}</h3>
              <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                 {['pending', 'verified', 'rejected', 'all'].map(f => (
                   <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400'}`}
                   >
                     {ts.filters[f as keyof typeof ts.filters]}
                   </button>
                 ))}
              </div>
           </div>

           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.products.search || "Search by shop..."}
                className="w-full h-14 pl-12 pr-6 bg-white dark:bg-slate-800 rounded-[20px] border border-gray-100 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-rose-500/20 font-bold"
              />
           </div>

           {loading ? (
             <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw size={32} className="text-rose-500 animate-spin" />
             </div>
           ) : filteredSellers.length === 0 ? (
             <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
                <ShieldCheck size={48} className="text-gray-300 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No verification requests found</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSellers.map((seller, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedSeller(seller)}
                    className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer active:scale-[0.98] group"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-800">
                           {seller.logoUrl ? <img src={seller.logoUrl} className="w-full h-full object-cover rounded-2xl" /> : <User size={24} className="text-gray-300" />}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          seller.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-600' : 
                          seller.verificationStatus === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                           {seller.verificationStatus}
                        </span>
                     </div>
                     <h4 className="text-lg font-black tracking-tight mb-1 group-hover:text-rose-600 transition-colors">{seller.shopName}</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{seller.city || 'Location N/A'} • {seller.sellerType}</p>
                     
                     <div className="pt-4 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                           <Clock size={12} />
                           {seller.verificationSubmittedAt ? new Date(seller.verificationSubmittedAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-rose-600 transition-all" />
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SupportInbox;
