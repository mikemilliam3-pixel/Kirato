
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { travelTranslations } from '../i18n';
import { Share2, Link as LinkIcon, Copy, ShieldCheck, Globe, Eye, RefreshCw } from 'lucide-react';

const Share: React.FC = () => {
  const { language } = useApp();
  const t = travelTranslations[language];
  const [isPublic, setIsPublic] = useState(true);

  const shareLink = "https://kirato.ai/share/TR-P82X9-2024";

  return (
    <div className="space-y-6 pb-20">
      <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700 text-center">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-[24px] flex items-center justify-center mx-auto mb-6">
          <Share2 size={32} />
        </div>
        <h3 className="text-xl font-extrabold mb-2">Share your Trip</h3>
        <p className="text-xs text-gray-500 px-6">Generate a read-only link for your friends or family to see your itinerary and packing progress.</p>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-blue-500" />
              <span className="text-xs font-bold">Public Link</span>
            </div>
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${isPublic ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className={`space-y-4 transition-opacity ${isPublic ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3 overflow-hidden">
              <LinkIcon size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-500 truncate flex-1">{shareLink}</span>
              <button className="p-2 bg-white dark:bg-slate-800 rounded-lg text-amber-600 shadow-sm active:scale-90 transition-all">
                <Copy size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 text-slate-500">
                <Eye size={14} /> Preview
              </button>
              <button className="py-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 text-rose-500">
                <RefreshCw size={14} /> Revoke
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
          <ShieldCheck size={20} className="text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400">Secure Sharing</h4>
            <p className="text-[10px] text-blue-600/80 dark:text-blue-500/80 leading-relaxed mt-1">
              Shared users cannot edit your trip. Budget details are hidden by default unless you enable them in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
