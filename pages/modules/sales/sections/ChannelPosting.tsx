import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  Send, Instagram, Plus, Settings2, CheckCircle2, 
  XCircle, ArrowRight, ExternalLink, X, Info, 
  Copy, Bot, Trash2, Lock
} from 'lucide-react';
import { Product, IntegrationConfig } from '../types';

interface ScheduledPost {
  id: string;
  productId: string;
  platform: 'Telegram' | 'Instagram';
  scheduledAt: string;
  status: 'pending' | 'sent';
}

const DEFAULT_PLATFORM_BOT = "kiratoai_bot";

const ChannelPosting: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const tc = t.channel;

  // --- STATE ---
  const [integrations, setIntegrations] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('kirato-sales-integrations');
    return saved ? JSON.parse(saved) : {
      tg: { connected: false, botToken: '', channelUsername: '' },
      ig: { connected: false, username: '', accessToken: '', igBusinessId: '' }
    };
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [activeModal, setActiveModal] = useState<'tg' | 'ig' | 'post' | null>(null);
  
  // Forms
  const [tgForm, setTgForm] = useState({ 
    botToken: integrations.tg.botToken || '',
    channelUsername: integrations.tg.channelUsername || '' 
  });
  
  const [igForm, setIgForm] = useState({
    username: integrations.ig.username || '',
    accessToken: integrations.ig.accessToken || '',
    igBusinessId: integrations.ig.igBusinessId || ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('kirato-sales-integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    const saved = localStorage.getItem('kirato-sales-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const maskToken = (token: string) => {
    if (!token || token.length < 10) return token;
    return `${token.substring(0, 6)}...${token.substring(token.length - 4)}`;
  };

  // --- HANDLERS ---
  const handleTgConnect = () => {
    if (!tgForm.botToken.includes(':')) {
      setError(tc.validation.invalidToken);
      return;
    }
    if (!tgForm.channelUsername.startsWith('@')) {
      setError(tc.validation.invalidChannel);
      return;
    }

    setIntegrations(prev => ({
      ...prev,
      tg: {
        connected: true,
        botToken: tgForm.botToken,
        channelUsername: tgForm.channelUsername,
        connectedAt: new Date().toISOString()
      }
    }));
    setActiveModal(null);
    setError(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleIgConnect = () => {
    let cleanUsername = igForm.username.trim();
    if (!cleanUsername) {
      setError(tc.validation.usernameRequired);
      return;
    }
    if (!cleanUsername.startsWith('@')) {
      cleanUsername = `@${cleanUsername}`;
    }

    setIntegrations(prev => ({
      ...prev,
      ig: {
        connected: true,
        username: cleanUsername,
        accessToken: igForm.accessToken.trim(),
        igBusinessId: igForm.igBusinessId.trim(),
        accountName: `Instagram: ${cleanUsername}`,
        postType: 'feed',
        connectedAt: prev.ig.connected ? prev.ig.connectedAt : new Date().toISOString()
      }
    }));
    setActiveModal(null);
    setError(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDisconnect = (key: 'tg' | 'ig') => {
    setIntegrations(prev => ({
      ...prev,
      [key]: { connected: false }
    }));
    if (key === 'ig') {
      setIgForm({ username: '', accessToken: '', igBusinessId: '' });
    } else {
      setTgForm({ botToken: '', channelUsername: '' });
    }
  };

  const openIgModal = () => {
    setIgForm({
      username: integrations.ig.username || '',
      accessToken: integrations.ig.accessToken || '',
      igBusinessId: integrations.ig.igBusinessId || ''
    });
    setError(null);
    setActiveModal('ig');
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-32 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-2xl font-black tracking-tight">{tc.title}</h3>
        <p className="text-sm text-slate-500 font-medium">{tc.subtitle}</p>
      </div>

      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 size={18} /> {t.settings.success}
        </div>
      )}

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Telegram Card */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Send size={28} />
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${integrations.tg.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
              {integrations.tg.connected ? tc.status.connected : tc.status.notConnected}
            </span>
          </div>
          
          <div className="flex-1 space-y-2 mb-8">
            <h4 className="text-lg font-black tracking-tight">{tc.telegram.title}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{tc.telegram.desc}</p>
            {integrations.tg.connected && (
              <div className="pt-2 space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Token: {maskToken(integrations.tg.botToken)}</p>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Channel: {integrations.tg.channelUsername}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {integrations.tg.connected ? (
              <>
                <button 
                  onClick={() => setActiveModal('tg')}
                  className="flex-1 h-12 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  {tc.actions.manage}
                </button>
                <button 
                  onClick={() => handleDisconnect('tg')}
                  className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveModal('tg')}
                className="w-full h-12 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {tc.actions.connect}
              </button>
            )}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-2xl flex items-center justify-center shrink-0">
              <Instagram size={28} />
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${integrations.ig.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
              {integrations.ig.connected ? tc.status.connected : tc.status.notConnected}
            </span>
          </div>
          
          <div className="flex-1 space-y-2 mb-8">
            <h4 className="text-lg font-black tracking-tight">{tc.instagram.title}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{tc.instagram.desc}</p>
            {integrations.ig.connected && (
              <div className="pt-2">
                <p className="text-[9px] font-black text-pink-600 uppercase tracking-widest">{integrations.ig.username}</p>
                {integrations.ig.connectedAt && <p className="text-[7px] text-gray-400 uppercase font-black">Connected: {new Date(integrations.ig.connectedAt).toLocaleDateString()}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {integrations.ig.connected ? (
              <>
                <button 
                  onClick={openIgModal}
                  className="flex-1 h-12 bg-pink-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  {tc.actions.manage}
                </button>
                <button 
                  onClick={() => handleDisconnect('ig')}
                  className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={openIgModal}
                className="w-full h-12 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {tc.actions.connect}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Telegram Config Modal (Simplified) */}
      {activeModal === 'tg' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-xl font-black tracking-tight">{tc.telegram.title}</h4>
               <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.telegram.botToken}</label>
                  <input 
                    type="password" 
                    value={tgForm.botToken}
                    onChange={e => setTgForm({...tgForm, botToken: e.target.value})}
                    placeholder="123456789:ABCDefgh..."
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-xs"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.telegram.channelUsername}</label>
                  <input 
                    type="text" 
                    value={tgForm.channelUsername}
                    onChange={e => setTgForm({...tgForm, channelUsername: e.target.value})}
                    placeholder="@my_channel"
                    className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-xs"
                  />
               </div>

               {error && <p className="text-[10px] font-black text-rose-500 uppercase px-1">{error}</p>}

               <div className="pt-4">
                  <button 
                    onClick={handleTgConnect}
                    className="w-full h-14 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    {tc.actions.connect}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Modal (Manual Connection Form) */}
      {activeModal === 'ig' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-xl flex items-center justify-center">
                      <Instagram size={24} />
                   </div>
                   <h4 className="text-xl font-black tracking-tight">{tc.instagram.title}</h4>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24}/></button>
             </div>

             <div className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.instagram.username} *</label>
                   <input 
                     type="text" 
                     value={igForm.username}
                     onChange={e => setIgForm({...igForm, username: e.target.value})}
                     placeholder="@mybusiness"
                     className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-pink-500 font-bold text-xs"
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.instagram.accessToken}</label>
                   <div className="relative">
                      <input 
                        type="password" 
                        value={igForm.accessToken}
                        onChange={e => setIgForm({...igForm, accessToken: e.target.value})}
                        placeholder="EAA..."
                        className="w-full h-12 pl-4 pr-10 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-pink-500 font-bold text-xs"
                      />
                      <Lock size={14} className="absolute right-3 top-4 text-gray-300" />
                   </div>
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider ml-1">{tc.instagram.tokenHint}</p>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tc.instagram.businessId}</label>
                   <input 
                     type="text" 
                     value={igForm.igBusinessId}
                     onChange={e => setIgForm({...igForm, igBusinessId: e.target.value})}
                     placeholder="1784..."
                     className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-pink-500 font-bold text-xs"
                   />
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider ml-1">{tc.instagram.idHint}</p>
                </div>

                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex gap-3">
                   <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 leading-relaxed italic">
                     {tc.instagram.oauthNote}
                   </p>
                </div>

                {error && <p className="text-[10px] font-black text-rose-500 uppercase px-1">{error}</p>}

                <div className="pt-4 grid grid-cols-1 gap-3">
                   <button 
                     onClick={handleIgConnect}
                     className="w-full h-14 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                   >
                     {integrations.ig.connected ? tc.actions.save : tc.actions.connect}
                   </button>
                   {integrations.ig.connected && (
                     <button 
                       onClick={() => { handleDisconnect('ig'); setActiveModal(null); }}
                       className="w-full py-3 text-rose-500 font-black uppercase text-[10px] tracking-widest"
                     >
                       {tc.actions.disconnect}
                     </button>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPosting;
