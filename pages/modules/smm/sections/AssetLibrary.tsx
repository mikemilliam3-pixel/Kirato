import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
// Fixed: Added missing 'Copy' icon to the lucide-react imports
import { Library, Search, Filter, Star, FileText, Image as ImageIcon, MoreVertical, Trash2, Download, Hash, RefreshCw, Copy } from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';

const AssetLibrary: React.FC = () => {
  const { language, user } = useApp();
  const t = smmTranslations[language].library;

  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "smm_assets"), 
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setAssets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete asset?")) return;
    await deleteDoc(doc(db, "smm_assets", id));
  };

  const filtered = assets.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" placeholder="Search assets..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 font-medium" 
          />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-purple-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
           <Library size={48} className="mx-auto mb-4" />
           <p className="text-xs font-black uppercase tracking-widest">Library empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(asset => (
            <div key={asset.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm relative group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  asset.type === 'image' ? 'bg-blue-50 text-blue-600' : 
                  asset.type === 'hashtag' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {asset.type === 'image' ? <ImageIcon size={22} /> : asset.type === 'hashtag' ? <Hash size={22} /> : <FileText size={22} />}
                </div>
                <button onClick={() => handleDelete(asset.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h5 className="text-sm font-black mb-1 truncate text-slate-900 dark:text-white uppercase tracking-tight">{asset.title}</h5>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                {new Date(asset.createdAt?.toDate ? asset.createdAt.toDate() : Date.now()).toLocaleDateString()}
              </p>
              
              {asset.content && <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">"{asset.content}"</p>}
              {asset.url && (
                <div className="rounded-xl overflow-hidden aspect-video bg-gray-50 mb-4 border border-gray-100 dark:border-slate-700">
                  <img src={asset.url} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(asset.content || asset.url)}
                  className="flex-1 py-2 bg-gray-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase text-slate-500 flex items-center justify-center gap-2"
                >
                  <Copy size={12} /> Copy
                </button>
                {asset.url && (
                  <a href={asset.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
                    <Download size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetLibrary;