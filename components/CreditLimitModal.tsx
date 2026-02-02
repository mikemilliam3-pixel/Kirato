
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertCircle, Coins, X } from 'lucide-react';

interface CreditLimitModalProps {
  required: number;
  available: number;
  onClose: () => void;
}

const CreditLimitModal: React.FC<CreditLimitModalProps> = ({ required, available, onClose }) => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h4 className="text-xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">{t('common.notEnoughCredits')}</h4>
        
        <div className="bg-gray-50 dark:bg-slate-950 rounded-2xl p-4 mb-8 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.required')}</p>
            <p className="text-lg font-black text-rose-500">{required}</p>
          </div>
          <div className="space-y-1 border-l border-gray-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.available')}</p>
            <p className="text-lg font-black text-blue-500">{available}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => { navigate('/billing'); onClose(); }}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Coins size={14} /> {t('common.goToBilling')}
          </button>
          <button 
            onClick={onClose}
            className="w-full py-3 text-slate-400 font-bold uppercase text-[10px]"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditLimitModal;