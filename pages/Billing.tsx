
import React, { useState, useEffect, useMemo } from 'react';
import { useApp, SUBSCRIPTION_PLANS } from '../context/AppContext';
import { 
  Coins, TrendingUp, TrendingDown, RefreshCw, Clock, 
  Zap, Star, ShieldCheck, Crown, Info, Check, 
  ArrowRight, ToggleLeft, ToggleRight, AlertCircle, ShoppingBag, Terminal
} from 'lucide-react';
import { CreditTransaction, CreditWallet, PlanId, CreditPack } from '../types';
import PageHeader from '../components/ui/PageHeader';

const CREDIT_PACKS: CreditPack[] = [
  { id: 'pack-s', name: 'Small Pack', credits: 100, price: 5 },
  { id: 'pack-m', name: 'Medium Pack', credits: 500, price: 20 },
  { id: 'pack-l', name: 'Large Pack', credits: 2000, price: 70 },
];

const PLAN_FEATURES = {
  free: ['Basic AI Tools', 'Standard Support', 'Public Shop Access'],
  starter: ['Advanced AI Tools', 'Priority Support', 'Ad-free Experience', '5 Social Channels'],
  pro: ['Unlimited AI Tools', 'Personal Manager', 'API Access', '20 Social Channels'],
  business: ['Custom Solutions', 'White Labeling', 'Team Accounts', 'Unlimited Channels']
};

const Billing: React.FC = () => {
  const { t, credits, subscription, changePlan, updateSubscription, grantCredits } = useApp();
  const [ledger, setLedger] = useState<CreditTransaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'grant' | 'spend' | 'subscription' | 'packs'>('all');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const isDev = localStorage.getItem('kirato-dev-mode') === 'true' || localStorage.getItem('kirato-support-mode') === 'true';
    setDevMode(isDev);
    
    const loadLedger = () => {
      const data = localStorage.getItem('kirato-credit-ledger');
      if (data) setLedger(JSON.parse(data));
    };
    loadLedger();
    window.addEventListener('storage', loadLedger);
    return () => window.removeEventListener('storage', loadLedger);
  }, []);

  const stats = useMemo(() => {
    const walletData = localStorage.getItem('kirato-credit-wallet');
    const wallet: CreditWallet = walletData ? JSON.parse(walletData) : { lifetimeEarned: 0, lifetimeSpent: 0 };
    return wallet;
  }, [credits]);

  const filteredLedger = ledger.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'grant') return tx.type === 'grant' || tx.type === 'refund';
    if (filter === 'spend') return tx.type === 'spend';
    if (filter === 'subscription') return tx.reason.includes('subscription');
    if (filter === 'packs') return tx.reason.includes('pack');
    return true;
  });

  const activePlan = (SUBSCRIPTION_PLANS as any)[subscription.planId];

  const handleBuyCredits = (pack: CreditPack) => {
    if (devMode) {
      grantCredits(pack.credits, 'credit_pack_purchase', { packId: pack.id });
    } else {
      setShowComingSoon(true);
    }
  };

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title={t('common.billing')} 
        subtitle="Credits & Subscriptions"
        rightSlot={devMode && (
          <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg border border-amber-100 dark:border-amber-900/30">
            <Terminal size={12} />
            <span className="text-[8px] font-black uppercase">Dev</span>
          </div>
        )}
      />
      
      <div className="max-w-6xl mx-auto w-full px-4 py-4 animate-in fade-in duration-500 space-y-6 pb-24">
        {/* Top Section: Balance & Current Plan - More Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Wallet Balance Card - Height Optimized */}
          <div className="lg:col-span-1 p-5 bg-blue-600 rounded-[28px] text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-40 group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[2px] opacity-70 mb-1">{t('common.available')}</p>
              <h2 className="text-3xl font-black">{credits}</h2>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5 text-[8px] font-bold opacity-60 uppercase">
                 <Clock size={10} /> Sync: Now
              </div>
              <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Details</button>
            </div>
          </div>

          {/* Current Plan Details Card - Compressed */}
          <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-[28px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 md:gap-8">
            <div className="flex-1 space-y-3">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('common.currentPlan')}</h3>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-widest">{subscription.status}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                     {subscription.planId === 'free' ? <Zap size={20} /> : subscription.planId === 'starter' ? <Star size={20} /> : subscription.planId === 'pro' ? <ShieldCheck size={20} /> : <Crown size={20} />}
                  </div>
                  <div>
                     <h4 className="text-base font-black text-slate-900 dark:text-white capitalize">{activePlan.name}</h4>
                     <p className="text-[10px] font-bold text-gray-400">{activePlan.monthlyCredits} {t('common.monthlyCredits')}</p>
                  </div>
               </div>
               <button 
                 onClick={scrollToPlans}
                 className="px-4 h-9 bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {t('common.upgradePlan')} <ArrowRight size={12}/>
               </button>
            </div>

            <div className="flex-1 space-y-3 md:border-l md:border-gray-50 dark:md:border-slate-800 md:pl-5">
               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('common.nextRenewal')}</span>
                     <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{new Date(subscription.renewsAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('common.autoRenew')}</span>
                     <button 
                       onClick={() => updateSubscription({ autoRenew: !subscription.autoRenew })}
                       className={`w-9 h-4.5 rounded-full p-0.5 transition-all ${subscription.autoRenew ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                     >
                       <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${subscription.autoRenew ? 'translate-x-4' : ''}`} />
                     </button>
                  </div>
               </div>
               <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl flex items-start gap-2">
                  <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-blue-700 dark:text-blue-300 leading-tight">
                    Plan resets monthly; credits carry over.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans Selector - Denser Layout */}
        <section id="plans-section" className="space-y-4">
          <div className="text-center">
             <h3 className="text-xl font-black tracking-tight">{t('common.plans')}</h3>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[1px]">Scale your productivity</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {Object.values(SUBSCRIPTION_PLANS).map((plan: any) => {
               const isCurrent = subscription.planId === plan.id;
               const Icon = plan.id === 'free' ? Zap : plan.id === 'starter' ? Star : plan.id === 'pro' ? ShieldCheck : Crown;
               
               return (
                 <div key={plan.id} className={`p-4 bg-white dark:bg-slate-900 rounded-[24px] border-2 transition-all flex flex-col ${isCurrent ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10' : 'border-gray-100 dark:border-slate-800 shadow-sm opacity-95 hover:opacity-100'}`}>
                    <div className="mb-4">
                       <div className={`w-8 h-8 ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-slate-800 text-slate-400'} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon size={16} />
                       </div>
                       <h4 className="text-sm font-black mb-0.5 capitalize">{plan.name}</h4>
                       <div className="flex items-baseline gap-0.5">
                          <span className="text-lg font-black">${plan.monthlyPrice}</span>
                          <span className="text-[8px] font-black text-gray-400 uppercase">/mo</span>
                       </div>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                       <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{plan.monthlyCredits} Cr.</p>
                       <ul className="space-y-1.5 overflow-hidden">
                          {PLAN_FEATURES[plan.id as keyof typeof PLAN_FEATURES].slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[9px] font-bold text-slate-600 dark:text-slate-400 line-clamp-1">
                               <Check size={10} className="text-emerald-500 shrink-0 mt-0.5" />
                               {feat}
                            </li>
                          ))}
                       </ul>
                    </div>

                    <button 
                      disabled={isCurrent}
                      onClick={() => changePlan(plan.id as PlanId)}
                      className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        isCurrent 
                          ? 'bg-gray-50 dark:bg-slate-800 text-slate-400' 
                          : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isCurrent ? t('common.current') : t('common.upgrade')}
                    </button>
                 </div>
               );
             })}
          </div>
        </section>

        {/* Credit Packs - Compact Horizontal List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-base font-black tracking-tight">{t('common.creditPacks')}</h3>
             <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-[8px] font-black text-amber-700 uppercase">{t('common.comingSoon')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
             {CREDIT_PACKS.map(pack => (
               <div key={pack.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between group shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                       <Coins size={16} />
                    </div>
                    <div>
                       <h5 className="text-[10px] font-black text-gray-500 uppercase">{pack.name}</h5>
                       <p className="text-sm font-black text-slate-900 dark:text-white">{pack.credits} Credits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${pack.price}</span>
                    <button 
                      onClick={() => handleBuyCredits(pack)}
                      className="px-3 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      {devMode ? 'Add' : 'Buy'}
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Transaction History - Simplified Rows */}
        <div className="space-y-3 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.transactions')}</h3>
            <div className="flex bg-gray-50 dark:bg-slate-950 p-0.5 rounded-lg overflow-x-auto no-scrollbar">
               {(['all', 'grant', 'spend', 'subscription', 'packs'] as const).map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f)}
                   className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   {t(`common.${f}`) || f}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            {filteredLedger.length === 0 ? (
              <div className="py-12 text-center opacity-30">
                 <p className="text-[10px] font-black uppercase tracking-widest">No history</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                 {filteredLedger.map((tx) => (
                   <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} dark:bg-slate-800`}>
                            {tx.amount > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-1">
                              {t(`common.${tx.reason}`) || tx.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase">{new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                         </div>
                      </div>
                      <div className={`text-right ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         <p className="text-xs font-black">{tx.amount > 0 ? '+' : ''}{tx.amount}</p>
                         {tx.metadata?.planId && (
                           <p className="text-[7px] font-black uppercase tracking-widest opacity-60">
                             {tx.metadata.planId}
                           </p>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Modal - Refined Size */}
        {showComingSoon && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowComingSoon(false)} />
            <div className="relative w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
               <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
               </div>
               <h4 className="text-lg font-black mb-1 tracking-tight">{t('common.comingSoon')}</h4>
               <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{t('common.paymentComingSoon')}.</p>
               <button 
                 onClick={() => setShowComingSoon(false)}
                 className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
               >
                 OK
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
