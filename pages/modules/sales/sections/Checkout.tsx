import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ShieldCheck, ChevronLeft, CreditCard, Lock, ArrowRight, 
  Truck, Building, AlertCircle, CheckCircle2 
} from 'lucide-react';

type PaymentMethod = 'card' | 'cash' | 'transfer';

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, language, t: globalT } = useApp();
  const navigate = useNavigate();
  
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const tc = t.checkout;
  const tf = t.checkout.fields;

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Save order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), {
        buyerId: user.uid,
        items: items.map(i => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          sellerId: i.product.sellerId
        })),
        total: subtotal,
        paymentMethod: method,
        paymentData: method === 'card' ? { 
           cardholderName: formData.cardName,
           last4: formData.cardNumber?.slice(-4) 
        } : formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('kirato_last_order', JSON.stringify({ id: orderRef.id, deliveryCode }));
      
      clearCart();
      navigate('/modules/sales/order-success');
    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, val: string) => setFormData((prev: any) => ({ ...prev, [key]: val }));

  if (items.length === 0) {
    navigate('/modules/sales/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 pb-24 px-4 sm:px-0">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-bold text-rose-600">
        <ChevronLeft size={18} /> {globalT('common.back')}
      </button>

      <div className="space-y-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3">
          <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <p className="text-[10px] font-bold text-slate-500 leading-tight uppercase">{tc.escrow_note}</p>
        </div>

        {/* Payment Selector */}
        <div className="space-y-3">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.payment_method}</label>
           <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: tc.payment_methods.card, icon: CreditCard },
                { id: 'cash', label: tc.payment_methods.cash_on_delivery, icon: Truck },
                { id: 'transfer', label: tc.payment_methods.bank_transfer, icon: Building }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => { setMethod(m.id as any); setFormData({}); }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 h-24 ${method === m.id ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-900/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-400'}`}
                >
                  <m.icon size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{m.label}</span>
                </button>
              ))}
           </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
             {method === 'card' && (
               <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.full_name}</label>
                    <input required type="text" onChange={e => updateForm('cardName', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.card_number}</label>
                    <input required type="text" maxLength={16} onChange={e => updateForm('cardNumber', e.target.value)} placeholder="0000 0000 0000 0000" className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.expiry}</label>
                      <input required type="text" placeholder="MM/YY" className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.cvc}</label>
                      <input required type="password" maxLength={3} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                    </div>
                  </div>
               </div>
             )}

             {method === 'cash' && (
               <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.full_name}</label>
                    <input required type="text" onChange={e => updateForm('fullName', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.address}</label>
                    <textarea required onChange={e => updateForm('address', e.target.value)} className="w-full h-24 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.city}</label>
                      <input required type="text" onChange={e => updateForm('city', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.phone}</label>
                      <input required type="tel" onChange={e => updateForm('phone', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                    </div>
                  </div>
               </div>
             )}

             {method === 'transfer' && (
               <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 leading-tight uppercase">Transfer: 9860 1200 4567 8901 (Anvar T.)</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.transaction_id}</label>
                    <input required type="text" onChange={e => updateForm('refId', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{tf.receipt_link}</label>
                    <input type="text" onChange={e => updateForm('receipt', e.target.value)} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                  </div>
               </div>
             )}
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 flex justify-between items-center">
             <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.cart.estimated_total}</p>
               <h4 className="text-2xl font-black text-rose-600">${subtotal.toFixed(2)}</h4>
             </div>
             <button 
              type="submit"
              disabled={loading}
              className="h-14 px-8 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{tc.place_order} <Lock size={14} /></>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;