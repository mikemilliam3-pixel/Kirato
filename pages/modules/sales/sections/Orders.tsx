
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Truck, Package, 
  ShieldAlert, ShieldCheck, AlertCircle, Info, Send, X 
} from 'lucide-react';
import { Order, OrderStatus, Carrier, PayoutStatus, DisputeReason } from '../types';

const Orders: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations]?.orders || salesTranslations['EN'].orders;

  // Mock initial orders with new escrow fields
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '#8842', 
      customerName: 'Anvar Toshov', 
      customerId: 'u1',
      total: 120.50, 
      items: [{ productId: '1', title: 'Wireless Headphones', price: 59.99, quantity: 2 }], 
      status: 'pending', 
      paymentStatus: 'paid',
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
      paymentStatus: 'paid',
      payoutStatus: 'on_hold',
      shippedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
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
      paymentStatus: 'paid',
      payoutStatus: 'eligible',
      shippedAt: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
      createdAt: new Date(Date.now() - 950400000).toISOString()
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Form states
  const [shipForm, setShipForm] = useState({ tracking: '', carrier: 'DHL' as Carrier });
  const [disputeForm, setDisputeForm] = useState({ reason: 'not_received' as DisputeReason, description: '' });

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

  const handleConfirmReceipt = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'delivered',
      payoutStatus: 'eligible',
      payoutEligibleAt: new Date().toISOString()
    } : o));
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

  const handleReleasePayout = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      payoutStatus: 'released',
      payoutReleasedAt: new Date().toISOString()
    } : o));
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

  const getPayoutStatusColor = (status: PayoutStatus) => {
    switch(status) {
      case 'on_hold': return 'text-amber-600';
      case 'eligible': return 'text-blue-600';
      case 'released': return 'text-emerald-600';
      case 'frozen': return 'text-rose-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-xl md:text-2xl tracking-tight">All Orders</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-full">
           <ShieldCheck size={14} className="text-blue-500" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secured by Kirato Escrow</span>
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
                   <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     {order.paymentStatus === 'paid' ? 'Paid & Protected' : 'Awaiting Payment'}
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
                <button className="text-[10px] font-black text-blue-600 uppercase">Track</button>
              </div>
            )}

            {/* Escrow Status Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 gap-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={20} className="text-blue-500" />
                 <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payout Status</p>
                    <p className={`text-xs font-black uppercase tracking-wider ${getPayoutStatusColor(order.payoutStatus)}`}>
                      {t.payoutStatus[order.payoutStatus]}
                    </p>
                 </div>
              </div>

              {/* Action Buttons based on order state */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => { setSelectedOrder(order); setShowShipModal(true); }}
                    className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                  >
                    {t.actions.markAsShipped}
                  </button>
                )}
                {order.status === 'shipped' && (
                  <>
                    <button 
                      onClick={() => handleConfirmReceipt(order.id)}
                      className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md whitespace-nowrap"
                    >
                      {t.actions.confirmReceipt}
                    </button>
                    <button 
                      onClick={() => { setSelectedOrder(order); setShowDisputeModal(true); }}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all whitespace-nowrap"
                    >
                      {t.actions.reportProblem}
                    </button>
                  </>
                )}
                {order.payoutStatus === 'eligible' && (
                  <button 
                    onClick={() => handleReleasePayout(order.id)}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md whitespace-nowrap"
                  >
                    {t.actions.confirmPayout}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mark Shipped Modal */}
      {showShipModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShipModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
              <Truck className="text-rose-600" />
              {t.actions.markAsShipped}
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.actions.selectCarrier}</label>
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.actions.trackingRequired}</label>
                <input 
                  type="text" 
                  value={shipForm.tracking}
                  onChange={e => setShipForm({ ...shipForm, tracking: e.target.value })}
                  placeholder="e.g. TRK78239011"
                  className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex gap-3 mt-4">
                <Info size={16} className="text-blue-500 shrink-0" />
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 leading-relaxed">Funds remain in escrow until the buyer confirms delivery or 14 days pass.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowShipModal(false)}
                  className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleMarkShipped(selectedOrder)}
                  className="flex-1 h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDisputeModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black mb-6 flex items-center gap-3">
              <ShieldAlert className="text-rose-600" />
              {t.actions.reportProblem}
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason</label>
                <select 
                  value={disputeForm.reason}
                  onChange={e => setDisputeForm({ ...disputeForm, reason: e.target.value as DisputeReason })}
                  className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold"
                >
                  {Object.entries(t.disputeReasons).map(([key, label]) => (
                    <option key={key} value={key}>{label as string}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={disputeForm.description}
                  onChange={e => setDisputeForm({ ...disputeForm, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  className="w-full h-32 p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-medium text-sm"
                />
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex gap-3">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-700 dark:text-rose-400 leading-relaxed">Once reported, payment is frozen until resolved by the Kirato Support team.</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleOpenDispute(selectedOrder.id)}
                  className="flex-1 h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
