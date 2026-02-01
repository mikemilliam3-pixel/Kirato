
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { Tag, Plus, MoreHorizontal, CheckCircle2, XCircle, Calendar } from 'lucide-react';

const Promotions: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].promotions;

  const promos = [
    { code: 'SUMMER20', type: 'percentage', value: 20, usage: '124/500', active: true, expires: 'Jun 30' },
    { code: 'WELCOME10', type: 'fixed', value: 10, usage: '842/∞', active: true, expires: 'No Expiry' },
    { code: 'FREEBYE', type: 'free_shipping', value: 0, usage: '12/50', active: false, expires: 'Expired' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Marketing</h3>
        <button className="p-3 bg-rose-600 text-white rounded-xl shadow-lg active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {promos.map((p) => (
          <div key={p.code} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${p.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center">
                  <Tag size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-widest">{p.code}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{p.type.replace('_', ' ')}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${p.active ? 'text-emerald-500' : 'text-gray-400'}`}>
                {p.active ? t.active : t.expired}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-gray-50 dark:border-slate-700 pt-4">
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Discount</p>
                <h5 className="font-extrabold text-rose-600">{p.type === 'percentage' ? `${p.value}%` : `$${p.value}`}</h5>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Usage</p>
                <h5 className="font-extrabold">{p.usage}</h5>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Expires</p>
                <h5 className="font-extrabold text-slate-500">{p.expires}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
