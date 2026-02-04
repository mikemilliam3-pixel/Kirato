import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { UserCheck, Plus, CheckCircle2, MoreVertical, Edit3, X, Trash2, RefreshCw } from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';

const BrandVoice: React.FC = () => {
  const { language, user } = useApp();
  const t = smmTranslations[language].voice;

  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', audience: '', tone: '' });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "smm_voices"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setVoices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !form.name) return;
    try {
      await addDoc(collection(db, "smm_voices"), {
        ownerId: user.uid,
        ...form,
        isActive: voices.length === 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setForm({ name: '', audience: '', tone: '' });
    } catch (e) { console.error(e); }
  };

  const setVoiceActive = async (id: string) => {
    if (!user) return;
    const batch = writeBatch(db);
    voices.forEach(v => {
      batch.update(doc(db, "smm_voices", v.id), { isActive: v.id === id });
    });
    await batch.commit();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete voice?")) return;
    await deleteDoc(doc(db, "smm_voices", id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Voices Profiles</h3>
        <button onClick={() => setIsModalOpen(true)} className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <RefreshCw className="animate-spin mx-auto text-purple-500" />
        ) : voices.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
             <p className="text-[10px] font-black uppercase tracking-widest">No profiles created</p>
          </div>
        ) : (
          voices.map(v => (
            <div key={v.id} className={`p-5 bg-white dark:bg-slate-800 rounded-3xl border-2 transition-all relative overflow-hidden ${v.isActive ? 'border-purple-600 shadow-md' : 'border-gray-100 dark:border-slate-700 opacity-70'}`}>
              <div className="absolute top-0 right-0 p-4 flex gap-2">
                {v.isActive && <CheckCircle2 size={20} className="text-purple-600" />}
                <button onClick={() => handleDelete(v.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.isActive ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-gray-100 text-slate-400'}`}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.name}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${v.isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {v.isActive ? 'Active Profile' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">Audience</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{v.audience}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">Tone</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{v.tone}</span>
                </div>
              </div>
              {!v.isActive && (
                <button 
                  onClick={() => setVoiceActive(v.id)}
                  className="w-full py-2 mt-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-purple-600 hover:text-white transition-all"
                >
                  Set as Active
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black mb-6">New Voice Profile</h4>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Profile Name (e.g. Luxury)" 
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none font-bold text-xs" 
              />
              <input 
                type="text" placeholder="Audience (e.g. Tech Fans)" 
                value={form.audience} onChange={e => setForm({...form, audience: e.target.value})}
                className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none font-bold text-xs" 
              />
              <input 
                type="text" placeholder="Tone (e.g. Friendly)" 
                value={form.tone} onChange={e => setForm({...form, tone: e.target.value})}
                className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none font-bold text-xs" 
              />
              <button 
                onClick={handleCreate}
                className="w-full h-14 bg-purple-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandVoice;