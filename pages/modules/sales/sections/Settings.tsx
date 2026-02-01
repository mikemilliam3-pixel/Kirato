
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { Settings as SettingsIcon, Store, DollarSign, Bell, ShieldCheck, Globe, Image as ImageIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Store className="text-rose-600" size={20} /> Shop Identity
          </h3>
          
          <div className="flex flex-col items-center py-6 bg-gray-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 mb-3 shadow-md">
              <ImageIcon size={32} />
            </div>
            <button className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Change Logo</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Shop Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold" defaultValue="Kirato Premium Gadgets" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Shop Description</label>
              <textarea className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none h-24" defaultValue="We sell the best AI-integrated gadgets in Uzbekistan." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm px-1 uppercase tracking-widest text-gray-400">Configuration</h3>
            {[
              { icon: DollarSign, label: 'Currency', value: 'USD ($)', color: 'text-emerald-500' },
              { icon: Globe, label: 'Custom Domain', value: 'shop.kirato.ai', color: 'text-blue-500' },
              { icon: Bell, label: 'Notifications', value: 'Telegram + Email', color: 'text-orange-500' },
              { icon: ShieldCheck, label: 'Auto-Checkout', value: 'Enabled', color: 'text-purple-500' },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between shadow-sm active:scale-98 transition-all hover:border-rose-100 dark:hover:border-rose-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.label}</p>
                    <p className="text-xs font-bold">{item.value}</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-blue-600">Edit</button>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all hover:bg-slate-800">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
