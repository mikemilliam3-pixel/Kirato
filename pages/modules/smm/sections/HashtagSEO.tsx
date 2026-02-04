import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { Hash, Search, Copy, Check, Save } from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const HashtagSEO: React.FC = () => {
  const { language, user } = useApp();
  const t = smmTranslations[language].hashtag;
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const handleFind = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentSet(['#business', '#growth', '#strategy', '#marketing', '#ai', '#future', '#trends']);
      setLoading(false);
      setSaved(false);
    }, 1000);
  };

  const handleSave = async () => {
    if (!user || currentSet.length === 0) return;
    try {
      await addDoc(collection(db, "smm_assets"), {
        ownerId: user.uid,
        title: "Trending Tags " + new Date().toLocaleDateString(),
        type: 'hashtag',
        content: currentSet.join(' '),
        tags: ['seo', 'hashtags'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSaved(true);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl mb-4">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search keywords..." 
            className="bg-transparent border-none text-xs focus:ring-0 w-full font-medium"
          />
        </div>
        <button 
          onClick={handleFind}
          className="w-full py-4 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          {loading ? 'Finding...' : 'Find Best Tags'}
        </button>
      </div>

      {currentSet.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Generated Set</span>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saved} className={`p-2 rounded-lg transition-colors ${saved ? 'text-emerald-500' : 'text-slate-300 hover:text-purple-600'}`}>
                  {saved ? <Check size={18}/> : <Save size={18} />}
                </button>
                <button onClick={() => navigator.clipboard.writeText(currentSet.join(' '))} className="p-2 text-slate-300 hover:text-purple-600 transition-colors">
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSet.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagSEO;