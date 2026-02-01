
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { autoTranslations } from '../i18n';
import { Link, Globe, MessageCircle, Mail, Table, Check, ExternalLink, Settings2, RefreshCw } from 'lucide-react';

const Integrations: React.FC = () => {
  const { language } = useApp();

  const services = [
    { id: 'gs', name: 'Google Sheets', type: 'sheets', enabled: true, icon: Table, color: 'text-emerald-600' },
    { id: 'tg', name: 'Telegram Bot', type: 'telegram', enabled: true, icon: MessageCircle, color: 'text-blue-500' },
    { id: 'em', name: 'SendGrid Email', type: 'email', enabled: false, icon: Mail, color: 'text-blue-600' },
    { id: 'wh', name: 'Generic Webhooks', type: 'webhook', enabled: false, icon: Globe, color: 'text-slate-600' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-slate-900 rounded-[40px] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <h3 className="text-lg font-bold mb-2">Connected Apps</h3>
        <p className="text-xs text-slate-400 mb-6">Manage API keys and connections for external services.</p>
        <button className="w-full py-4 bg-cyan-600 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">
          Browse Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                  <svc.icon className={svc.color} size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{svc.name}</h4>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${svc.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{svc.enabled ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 bg-gray-50 dark:bg-slate-900 text-slate-400 rounded-xl">
                <Settings2 size={18} />
              </button>
            </div>
            
            <div className="flex gap-2">
              {svc.enabled ? (
                <>
                  <button className="flex-1 py-2.5 bg-gray-50 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-500 rounded-xl flex items-center justify-center gap-2">
                    <RefreshCw size={12} /> Test Connection
                  </button>
                  <button className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                    <Check size={16} />
                  </button>
                </>
              ) : (
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <ExternalLink size={14} /> Connect Service
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
