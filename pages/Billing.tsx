
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
  free: ['Basic AI Tools', 'Standard Support', 'Public Shop Access', 'Community Forum'],
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
    <div className="flex flex-col min-h-full w-full">
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
      
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-in fade-in duration-500 space-y-8 md:space-y-12 pb-[calc(90px+env(safe-area-inset-bottom))]">
        
        {/* Section A: Summary - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Wallet Balance Card */}
          <div className="p-5 sm:p-6 lg:p-8 bg-blue-600 rounded-[32px] text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px] group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[2px] opacity-70 mb-2">{t('common.available')}</p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">{credits}</h2>
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                   <Coins size={24} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase">
                 <Clock size={12} /> Sync: Real-time
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Wallet Analytics</button>
            </div>
          </div>

          {/* Current Plan Details Card */}
          <div className="p-5 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 md:gap-8">
            <div className="flex-1 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">{t('common.currentPlan')}</h3>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{subscription.status}</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                     {subscription.planId === 'free' ? <Zap size={24} /> : subscription.planId === 'starter' ? <Star size={24} /> : subscription.planId === 'pro' ? <ShieldCheck size={24} /> : <Crown size={24} />}
                  </div>
                  <div>
                     <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white capitalize">{activePlan.name}</h4>
                     <p className="text-[11px] font-bold text-gray-400">{activePlan.monthlyCredits} {t('common.monthlyCredits')}</p>
                  </div>
               </div>
               <button 
                 onClick={scrollToPlans}
                 className="w-full sm:w-auto px-6 h-11 bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 border border-gray-100 dark:border-slate-700"
               >
                 {t('common.upgradePlan')} <ArrowRight size={14}/>
               </button>
            </div>

            <div className="hidden sm:block w-px bg-gray-50 dark:bg-slate-800" />

            <div className="flex-1 space-y-4">
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.nextRenewal')}</span>
                     <span className="text-xs font-black text-slate-800 dark:text-slate-100">{new Date(subscription.renewsAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.autoRenew')}</span>
                     <button 
                       onClick={() => updateSubscription({ autoRenew: !subscription.autoRenew })}
                       className={`w-10 h-5.5 rounded-full p-1 transition-all ${subscription.autoRenew ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                     >
                       <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${subscription.autoRenew ? 'translate-x-4.5' : ''}`} />
                     </button>
                  </div>
               </div>
               <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex items-start gap-2.5">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 leading-tight uppercase">
                    Plan resets monthly; unused credits carry over to next month.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Section B: Subscription Plans - Responsive Grid */}
        <section id="plans-section" className="space-y-6 sm:space-y-8">
          <div className="text-center px-4">
             <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{t('common.plans')}</h3>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-[2px] mt-1">Scale your productivity with flexible limits</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
             {Object.values(SUBSCRIPTION_PLANS).map((plan: any) => {
               const isCurrent = subscription.planId === plan.id;
               const Icon = plan.id === 'free' ? Zap : plan.id === 'starter' ? Star : plan.id === 'pro' ? ShieldCheck : Crown;
               const features = PLAN_FEATURES[plan.id as keyof typeof PLAN_FEATURES] || [];
               
               return (
                 <div key={plan.id} className={`p-6 bg-white dark:bg-slate-900 rounded-[32px] border-2 transition-all flex flex-col h-full group ${isCurrent ? 'border-blue-500 shadow-xl ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-900/50'}`}>
                    <div className="mb-6">
                       <div className={`w-10 h-10 ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500'} rounded-xl flex items-center justify-center mb-4 transition-colors`}>
                          <Icon size={20} />
                       </div>
                       <h4 className="text-base font-black mb-1 capitalize text-slate-900 dark:text-white">{plan.name}</h4>
                       <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">${plan.monthlyPrice}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase">/month</span>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                       <div className="h-px bg-gray-50 dark:bg-slate-800" />
                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{plan.monthlyCredits} Credits / Month</p>
                       <ul className="space-y-3">
                          {features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-tight">
                               <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                                 <Check size={10} className="text-emerald-500" />
                               </div>
                               <span className="line-clamp-2">{feat}</span>
                            </li>
                          ))}
                       </ul>
                    </div>

                    <button 
                      disabled={isCurrent}
                      onClick={() => changePlan(plan.id as PlanId)}
                      className={`w-full h-12 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${
                        isCurrent 
                          ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isCurrent ? t('common.current') : t('common.upgrade')}
                    </button>
                 </div>
               );
             })}
          </div>
        </section>

        {/* Section C: Credit Packs - Responsive Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
             <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight">{t('common.creditPacks')}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">One-time refill when you need more power</p>
             </div>
             <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/10 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-widest border border-amber-100 dark:border-amber-900/30 w-fit">{t('common.comingSoon')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
             {CREDIT_PACKS.map(pack => (
               <div key={pack.id} className="p-4 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                       <Coins size={20} />
                    </div>
                    <div className="min-w-0">
                       <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{pack.name}</h5>
                       <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">{pack.credits} Credits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pl-4">
                    <span className="text-base font-black text-slate-900 dark:text-white">${pack.price}</span>
                    <button 
                      onClick={() => handleBuyCredits(pack)}
                      className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                    >
                      {devMode ? 'Add' : 'Buy'}
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Section D: Transaction History - Responsive List */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1">
            <div className="space-y-1">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('common.transactions')}</h3>
               <p className="text-[9px] font-bold text-gray-400 uppercase">Recent credits usage and refills</p>
            </div>
            <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-slate-950 p-1 rounded-xl w-fit">
               {(['all', 'grant', 'spend', 'subscription', 'packs'] as const).map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f)}
                   className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                   {t(`common.${f}`) || f}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            {filteredLedger.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center opacity-30">
                 <RefreshCw size={40} className="mb-4 text-gray-300" />
                 <p className="text-[10px] font-black uppercase tracking-[3px]">No matching records found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                 {filteredLedger.map((tx) => (
                   <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} dark:bg-slate-800 group-hover:scale-105 transition-transform`}>
                            {tx.amount > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate pr-2">
                              {t(`common.${tx.reason}`) || tx.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <p className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</p>
                               <span className="w-1 h-1 bg-gray-200 dark:bg-slate-700 rounded-full" />
                               <p className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">{new Date(tx.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                            </div>
                         </div>
                      </div>
                      <div className={`text-right shrink-0 pl-4 ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         <p className="text-sm sm:text-base font-black tracking-tight">{tx.amount > 0 ? '+' : ''}{tx.amount}</p>
                         {tx.metadata?.planId && (
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-60">
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

        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowComingSoon(false)} />
            <div className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center border border-gray-100 dark:border-slate-800">
               <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShoppingBag size={40} />
               </div>
               <h4 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">{t('common.comingSoon')}</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                 {t('common.paymentComingSoon')}. We are currently finalizing our local payment partner integration.
               </p>
               <button 
                 onClick={() => setShowComingSoon(false)}
                 className="w-full h-12 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
               >
                 Got it
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
