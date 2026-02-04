import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import PageHeader from '../../components/ui/PageHeader';
import { Check, X, Store, User, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const SellerApplications: React.FC = () => {
  const { user } = useApp();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Guard: Only admins allowed
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const q = query(collection(db, "sellerApplications"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, (snapshot) => {
      setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Admin applications listener error:", err);
      setError("Failed to load applications. Permission denied.");
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'deny') => {
    setProcessingId(id);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      const idToken = await currentUser.getIdToken();
      const endpoint = `/api/admin/sellers/${action}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          applicationId: id,
          reason: action === 'deny' ? 'Documentation insufficient' : undefined 
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Server error');
      }

    } catch (error) {
      console.error("Action failed", error);
      alert(error instanceof Error ? error.message : "System error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Seller Applications" subtitle="Pending Review" />
      
      <div className="max-w-4xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[32px] text-center border border-rose-100 dark:border-rose-900/30">
            <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
            <p className="text-sm font-black text-rose-600 uppercase tracking-widest">{error}</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-20 text-center border border-dashed border-gray-200 dark:border-slate-800">
            <ShieldCheck size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">No pending applications</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {apps.map((app) => (
              <div key={app.id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Store size={28} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black tracking-tight truncate">{app.shopName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                         <User size={12}/> {app.userId?.substring(0, 8)}...
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    disabled={!!processingId}
                    onClick={() => handleAction(app.id, 'deny')}
                    className="flex-1 sm:flex-none h-12 px-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {processingId === app.id ? '...' : <X size={18}/>}
                  </button>
                  <button 
                    disabled={!!processingId}
                    onClick={() => handleAction(app.id, 'approve')}
                    className="flex-1 sm:flex-none h-12 px-8 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {processingId === app.id ? '...' : <Check size={18} className="inline mr-1"/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplications;