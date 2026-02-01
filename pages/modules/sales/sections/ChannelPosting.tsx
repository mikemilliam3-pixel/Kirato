
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { Send, Share2, Copy, ExternalLink, Zap, Info } from 'lucide-react';

const ChannelPosting: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].dashboard;

  return (
    <div className="space-y-6 pb-20">
      <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <Send size={40} className="mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-extrabold mb-2">Telegram Integration</h3>
        <p className="text-xs opacity-80 mb-8 px-6">Post products directly to your Telegram channel with specialized payment buttons.</p>
        <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          Connect Channel <ExternalLink size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-sm px-1">Active Deep Links</h3>
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span className="text-xs font-bold">Quick Buy Token</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Expires in 24h</span>
           </div>
           <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center gap-3">
              <span className="text-[10px] font-mono font-bold text-slate-500 truncate">t.me/kirato_bot?startapp=SHOP_X22</span>
              <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-blue-600 shadow-sm active:scale-90 transition-all">
                <Copy size={16} />
              </button>
           </div>
        </div>
      </div>

      <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-4">
        <Info size={20} className="text-indigo-500 mt-1" />
        <div>
          <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Pro Tip</h4>
          <p className="text-[10px] text-indigo-600/80 dark:text-indigo-500/80 leading-relaxed mt-1">
            Posting on weekends increases engagement by 25%. Schedule your next product drop for Saturday morning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelPosting;
