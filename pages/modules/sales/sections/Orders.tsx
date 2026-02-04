
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Truck, Package, 
  ShieldAlert, ShieldCheck, AlertCircle, Info, Send, X, Key
} from 'lucide-react';
import { Order, OrderStatus, Carrier, PayoutStatus, DisputeReason } from '../types';

const Orders: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations]?.orders || salesTranslations['EN'].orders;

  // Mock initial orders with Trust System fields
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '#8842', 
      customerName: 'Anvar Toshov', 
      customerId: 'u1',
      total: 120.50, 
      items: [{ productId: '1', title: 'Wireless Headphones', price: 59.99, quantity: 2 }], 
      status: 'pending', 
      paymentStatus: 'held',
      deliveryCode: '123456',
      deliveryConfirmed: false,
      payoutStatus: 'on_hold',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    { 
      id: '#8841', 
      customerName: 'Sitora Karimova', 
      customerId: 'u2',
      total: 45.00, 
      items: [{ productId: '2', title: 'Smart Watch X', price: 45.00, quantity: 1 }], 
      status: 'shipped', 
      paymentStatus: 'held',
      deliveryCode: '654321',
      deliveryConfirmed: false,
      payoutStatus: 'on_hold',
      shippedAt: new Date(Date.now() - 172800000).toISOString(),
      trackingNumber: 'TRK123456',
      carrier: 'DHL',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    { 
      id: '#8840', 
      customerName: 'Botir Ergashev', 
      customerId: 'u3',
      total: 210.00, 
      items: [], 
      status: 'delivered', 
      paymentStatus: 'released',
      deliveryConfirmed: true,
      deliveryConfirmedAt: new Date(Date.now() - 864000000).toISOString(),
      payoutStatus: 'released',
      shippedAt: new Date(Date.now() - 864000000).toISOString(),
      createdAt: new Date(Date.now() - 950400000).toISOString()
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Form states
  const [shipForm, setShipForm] = useState({ tracking: '', carrier: 'DHL' as Carrier });
  const [disputeForm, setDisputeForm] = useState({ reason: 'not_received' as DisputeReason, description: '' });
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleMarkShipped = (order: Order) => {
    if (!shipForm.tracking) return;
    
    setOrders(prev => prev.map(o => o.id === order.id ? {
      ...o,
      status: 'shipped',
      shippedAt: new Date().toISOString(),
      trackingNumber: shipForm.tracking,
      carrier: shipForm.carrier
    } : o));
    
    setShowShipModal(false);
    setSelectedOrder(null);
    setShipForm({ tracking: '', carrier: 'DHL' });
  };

  const handleConfirmDelivery = (order: Order) => {
    if (verifyCode === order.deliveryCode) {
      setOrders(prev => prev.map(o => o.id === order.id ? {
        ...o,
        status: 'delivered',
        paymentStatus: 'released',
        deliveryConfirmed: true,
        deliveryConfirmedAt: new Date().toISOString(),
        payoutStatus: 'released'
      } : o));
      setShowVerifyModal(false);
      setSelectedOrder(null);
      setVerifyCode('');
      setVerifyError(null);
    } else {
      setVerifyError("Invalid delivery code. Please check with the buyer.");
    }
  };

  const handleOpenDispute = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'disputed',
      payoutStatus: 'frozen',
      dispute: {
        reason: disputeForm.reason,
        description: disputeForm.description,
        createdAt: new Date().toISOString()
      }
    } : o));
    setShowDisputeModal(false);
    setDisputeForm({ reason: 'not_received', description: '' });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'processing': return <Package size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-indigo-500" />;
      case 'delivered': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'disputed': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <XCircle size={16} className="text-rose-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20';
      case 'processing': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20';
      case 'shipped': return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20';
      case 'disputed': return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20';
      default: return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'held': return 'bg-amber-100 text-amber-600';
      case 'released': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-xl md:text-2xl tracking-tight">All Orders</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-full">
           <ShieldCheck size={14} className="text-blue-500" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secured by Kirato Trust</span>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm relative group overflow-hidden transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-3">
                    {order.id}
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {t.status[order.status]}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">{order.customerName} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-gray-50 dark:border-slate-700 pl-4 md:pl-0 md:pr-4">
                <p className="text-xl font-black text-rose-600">${order.total}</p>
                <div className="flex items-center md:justify-end gap-1.5 mt-1">
                   <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'released' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     Payment: {order.paymentStatus?.toUpperCase()}
                   </span>
                </div>
              </div>
            </div>

            {/* Shipment Info Panel */}
            {order.status === 'shipped' && order.trackingNumber && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{order.carrier} Tracking</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.trackingNumber}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[8px] font-black rounded-lg uppercase">Awaiting Code</div>
              </div>
            )}

            {/* Trust System Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 gap-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={20} className={order.deliveryConfirmed ? "text-emerald-500" : "text-blue-500"} />
                 <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Trust Status</p>
                    <p className={`text-xs font-black uppercase tracking-wider ${order.deliveryConfirmed ? "text-emerald-600" : "text-amber-600"}`}>
                      {order.deliveryConfirmed ? "DELIVERY CONFIRMED" : "ESCROW ACTIVE (HELD)"}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => { setSelectedOrder(order); setShowShipModal(true); }}
                    className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                  >
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <>
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowVerifyModal(true); }}
                      className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md whitespace-nowrap flex items-center gap-2"
                    >
                      <Key size={14} /> Mark as Delivered
                    </button>
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowDisputeModal(true); }}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all whitespace-nowrap"
                    >
                      Report Issue
                    </button>
                  </>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Payment Released</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Code Modal */}
      {showVerifyModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
                 <Key className="text-emerald-500" /> Verify Code
               </h4>
               <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
              Ask the buyer for the 6-digit confirmation code sent to their Telegram. Entering it releases the escrowed funds to your wallet.
            </p>

            <div className="space-y-4">
               <input 
                type="text" 
                maxLength={6}
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full h-16 text-center text-3xl font-black tracking-[10px] bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500"
               />
               {verifyError && (
                 <div className="flex items-center gap-2 text-rose-500 justify-center">
                   <AlertCircle size={14} />
                   <span className="text-[10px] font-black uppercase">{verifyError}</span>
                 </div>
               )}
               <button 
                onClick={() => handleConfirmDelivery(selectedOrder)}
                className="w-full h-14 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all"
               >
                 Confirm Delivery
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipped Modal */}
      {showShipModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShipModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
              <Truck className="text-rose-600" />
              Mark as Shipped
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Carrier</label>
                <select 
                  value={shipForm.carrier}
                  onChange={e => setShipForm({ ...shipForm, carrier: e.target.value as Carrier })}
                  className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold"
                >
                  <option value="DHL">DHL Express</option>
                  <option value="UPS">UPS Tracking</option>
                  <option value="Local">Local Delivery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tracking Number</label>
                <input 
                  type="text" 
                  value={shipForm.tracking}
                  onChange={e => setShipForm({ ...shipForm, tracking: e.target.value })}
                  placeholder="e.g. TRK78239011"
                  className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowShipModal(false)} className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500">Cancel</button>
                <button onClick={() => handleMarkShipped(selectedOrder)} className="flex-1 h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
