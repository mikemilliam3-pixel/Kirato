import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  ShieldAlert, ShieldCheck, Clock, XCircle, Search, 
  ChevronRight, User, Building, FileText, 
  ArrowLeft, Info, AlertTriangle, RefreshCw, Store
} from 'lucide-react';
import { VerificationStatus, VerificationHistoryItem } from '../types';
import { db } from '../../../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const SupportInbox: React.FC = () => {
  const { language, user } = useApp();
  const navigate = useNavigate();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.supportInbox;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [rejectNote, setRejectNote] = useState('');

  // Explicit check for admin role
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        if (!isAdmin) navigate('/modules/sales/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      const q = query(collection(db, "sellerApplications"));
      const unsub = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          shopName: (doc.data() as any).shopName || (doc.data() as any).storeName || 'Unknown Shop',
          verificationStatus: (doc.data() as any).status
        }));
        setSellers(apps);
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error("Support inbox listener error:", err);
        setError("Permission denied. You must be an admin to view this.");
        setLoading(false);
      });
      return unsub;
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedSeller) return;
    if (status === 'rejected' && !rejectNote.trim()) return;

    try {
      const appRef = doc(db, "sellerApplications", selectedSeller.id);
      const userRef = doc(db, "users", selectedSeller.id);

      await updateDoc(appRef, {
        status: status,
        verifiedAt: status === 'approved' ? new Date().toISOString() : null,
        verificationNote: status === 'rejected' ? rejectNote : null,
        updatedAt: serverTimestamp()
      });

      await updateDoc(userRef, {
        sellerStatus: status,
        sellerStatusUpdatedAt: serverTimestamp()
      });
      
      setSelectedSeller(null);
      setRejectNote('');
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  const filteredSellers = sellers.filter(s => {
    const matchesFilter = filter === 'all' || s.verificationStatus === filter;
    const matchesSearch = !search || s.shopName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isAdmin) {
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
           <div className="flex items-center justify-between">
              <button onClick={() => setSelectedSeller(null)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-rose-600 transition-colors">
                <ArrowLeft size={16} /> {ts.detail.back}
              </button>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store ID:</span>
                 <h4 className="text-sm font-black text-slate-900 dark:text-white">{selectedSeller.id}</h4>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Application Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Shop Name</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{selectedSeller.shopName}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Category</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{selectedSeller.category}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{selectedSeller.phone || 'N/A'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Submitted At</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {selectedSeller.createdAt?.toDate ? selectedSeller.createdAt.toDate().toLocaleString() : 'Just now'}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-gray-50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                    <FileText size={48} className="text-gray-300 mb-4" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No detailed documents uploaded</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{ts.detail.actions}</h3>
                    
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Admin Notes</label>
                          <textarea 
                            value={rejectNote}
                            onChange={e => setRejectNote(e.target.value)}
                            className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-xs font-bold"
                            placeholder="Reason for rejection or approval note..."
                          />
                       </div>
                       <div className="grid grid-cols-1 gap-3">
                          <button 
                            onClick={() => handleAction('approved')}
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all"
                          >
                             <ShieldCheck size={18} className="inline mr-2" /> Approve Application
                          </button>
                          <button 
                            onClick={() => handleAction('rejected')}
                            className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] active:scale-95 transition-all"
                          >
                             <XCircle size={18} className="inline mr-2" /> Reject Application
                          </button>
                       </div>
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
                 {['pending', 'approved', 'rejected', 'all'].map(f => (
                   <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400'}`}
                   >
                     {f}
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
                placeholder="Search by store name..."
                className="w-full h-14 pl-12 pr-6 bg-white dark:bg-slate-800 rounded-[20px] border border-gray-100 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-rose-500/20 font-bold text-sm"
              />
           </div>

           {loading ? (
             <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw size={32} className="text-rose-500 animate-spin" />
             </div>
           ) : error ? (
             <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[32px] border border-rose-100 dark:border-rose-900/30">
                <ShieldAlert size={48} className="text-rose-500 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-rose-600">{error}</p>
             </div>
           ) : filteredSellers.length === 0 ? (
             <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
                <Building size={48} className="text-gray-300 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No applications found</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSellers.map((seller) => (
                  <div 
                    key={seller.id} 
                    onClick={() => setSelectedSeller(seller)}
                    className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer active:scale-[0.98] group"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-800">
                           <Store size={24} className="text-gray-300" />
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          seller.verificationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          seller.verificationStatus === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                           {seller.verificationStatus}
                        </span>
                     </div>
                     <h4 className="text-lg font-black tracking-tight mb-1 group-hover:text-rose-600 transition-colors">{seller.shopName}</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{seller.category} • {seller.phone || 'No phone'}</p>
                     
                     <div className="pt-4 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                           <Clock size={12} />
                           {seller.createdAt?.toDate ? seller.createdAt.toDate().toLocaleDateString() : 'N/A'}
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