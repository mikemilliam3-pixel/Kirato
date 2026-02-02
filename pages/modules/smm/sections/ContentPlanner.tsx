import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { 
  Calendar as CalendarIcon, Plus, Filter, Instagram, 
  Send, Facebook, Globe, Link as LinkIcon, 
  Trash2, RefreshCw, CheckCircle2, Clock, 
  AlertCircle, X, ExternalLink, Settings2, MoreVertical
} from 'lucide-react';
import * as publishApi from '../../../../api/smm/publish';

type Platform = 'Telegram' | 'Instagram' | 'Facebook';
type PostStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

interface Integration {
  id: Platform;
  connected: boolean;
  details: any;
}

interface PlannerPost {
  id: string;
  platforms: Platform[];
  caption: string;
  mediaUrl?: string;
  scheduledAt: string; // ISO string
  status: PostStatus;
  createdAt: string;
}

const ContentPlanner: React.FC = () => {
  const { language } = useApp();
  const moduleT = smmTranslations[language as keyof typeof smmTranslations] || smmTranslations['EN'];
  const t = moduleT.planner;

  // --- STATE ---
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem('kirato-smm-integrations');
    return saved ? JSON.parse(saved) : [
      { id: 'Telegram', connected: false, details: null },
      { id: 'Instagram', connected: false, details: null },
      { id: 'Facebook', connected: false, details: null },
    ];
  });

  const [posts, setPosts] = useState<PlannerPost[]>(() => {
    const saved = localStorage.getItem('kirato-smm-planner-posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isIntegrateModalOpen, setIsIntegrateModalOpen] = useState<Platform | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<'All' | Platform>('All');

  // New Post Form State
  const [newPost, setNewPost] = useState<Partial<PlannerPost>>({
    platforms: [],
    caption: '',
    mediaUrl: '',
    scheduledAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  });

  // Integration Form State
  const [tempDetails, setTempDetails] = useState<any>({});

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('kirato-smm-integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('kirato-smm-planner-posts', JSON.stringify(posts));
  }, [posts]);

  // --- PUBLISHING LOGIC ---
  const performPublish = useCallback(async (post: PlannerPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'sending' } : p));

    try {
      const results = await Promise.all(post.platforms.map(platform => {
        const integration = integrations.find(i => i.id === platform);
        const payload = { 
          caption: post.caption, 
          mediaUrl: post.mediaUrl, 
          integrationRef: integration?.details 
        };

        if (platform === 'Telegram') return publishApi.publishToTelegram(payload);
        if (platform === 'Instagram') return publishApi.publishToInstagram(payload);
        return publishApi.publishToFacebook(payload);
      }));

      const allSent = results.every(r => r.status === 'sent');
      setPosts(prev => prev.map(p => p.id === post.id ? { 
        ...p, 
        status: allSent ? 'sent' : 'failed' 
      } : p));
    } catch (e) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'failed' } : p));
    }
  }, [integrations]);

  // --- AUTOMATION LOOP ---
  useEffect(() => {
    const worker = setInterval(() => {
      const now = new Date();
      const duePosts = posts.filter(p => 
        p.status === 'scheduled' && new Date(p.scheduledAt) <= now
      );

      duePosts.forEach(post => performPublish(post));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(worker);
  }, [posts, performPublish]);

  // --- HANDLERS ---
  const handleConnect = (p: Platform) => {
    setIntegrations(prev => prev.map(i => i.id === p ? { 
      ...i, 
      connected: true, 
      details: tempDetails 
    } : i));
    setIsIntegrateModalOpen(null);
    setTempDetails({});
  };

  const handleDisconnect = (p: Platform) => {
    setIntegrations(prev => prev.map(i => i.id === p ? { ...i, connected: false, details: null } : i));
  };

  const handleAddPost = (isImmediate: boolean) => {
    if (!newPost.caption || !newPost.platforms?.length) return;

    const post: PlannerPost = {
      id: Math.random().toString(36).substr(2, 9),
      platforms: newPost.platforms as Platform[],
      caption: newPost.caption as string,
      mediaUrl: newPost.mediaUrl,
      scheduledAt: newPost.scheduledAt as string,
      status: isImmediate ? 'sending' : 'scheduled',
      createdAt: new Date().toISOString()
    };

    setPosts([post, ...posts]);
    setIsPostModalOpen(false);
    setNewPost({ platforms: [], caption: '', mediaUrl: '', scheduledAt: new Date(Date.now() + 3600000).toISOString().slice(0, 16) });

    if (isImmediate) performPublish(post);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filteredPosts = posts.filter(p => filterPlatform === 'All' || p.platforms.includes(filterPlatform));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="font-black text-xl md:text-2xl tracking-tight flex items-center gap-3">
          <CalendarIcon className="text-purple-600" />
          {moduleT.sections.planner}
        </h3>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 h-12 bg-purple-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-purple-700"
        >
          <Plus size={20} />
          {t.addPost}
        </button>
      </div>

      {/* Integrations Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                item.id === 'Telegram' ? 'bg-blue-50 text-blue-500' : 
                item.id === 'Instagram' ? 'bg-pink-50 text-pink-500' : 'bg-indigo-50 text-indigo-500'
              } dark:bg-slate-900`}>
                {item.id === 'Telegram' ? <Send size={20} /> : item.id === 'Instagram' ? <Instagram size={20} /> : <Facebook size={20} />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{item.id}</p>
                <p className={`text-[10px] font-bold ${item.connected ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {item.connected ? t.connected : t.notConnected}
                </p>
              </div>
            </div>
            {item.connected ? (
              <button onClick={() => handleDisconnect(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors">
                <Trash2 size={18} />
              </button>
            ) : (
              <button onClick={() => setIsIntegrateModalOpen(item.id)} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {t.connect}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {['All', 'Telegram', 'Instagram', 'Facebook'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p as any)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0 ${
              filterPlatform === p 
                ? 'bg-purple-600 border-purple-600 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-800 text-slate-400 border-gray-100 dark:border-slate-700 hover:text-slate-600'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-20 text-center bg-white dark:bg-slate-800 rounded-[32px] border border-dashed border-gray-200 dark:border-slate-700">
            <Clock size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.noPosts}</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {post.platforms.map(p => (
                    <span key={p} className="px-2 py-0.5 bg-gray-50 dark:bg-slate-900 text-[8px] font-black uppercase tracking-widest text-slate-500 rounded">
                      {p}
                    </span>
                  ))}
                  <span className={`ml-auto md:ml-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                    post.status === 'sent' ? 'bg-emerald-50 text-emerald-500' :
                    post.status === 'failed' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {t.status[post.status]}
                  </span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{post.caption}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                  {new Date(post.scheduledAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-50 dark:border-slate-700 pt-4 md:pt-0 md:pl-4">
                 <button 
                   onClick={() => performPublish(post)}
                   disabled={post.status === 'sending' || post.status === 'sent'}
                   className="p-2.5 bg-gray-50 dark:bg-slate-900 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30"
                 >
                   <RefreshCw size={18} className={post.status === 'sending' ? 'animate-spin' : ''} />
                 </button>
                 <button onClick={() => handleDeletePost(post.id)} className="p-2.5 bg-gray-50 dark:bg-slate-900 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Creation Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-black tracking-tight">{t.addPost}</h4>
                <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.platforms}</label>
                  <div className="flex gap-2">
                    {['Telegram', 'Instagram', 'Facebook'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setNewPost(prev => ({
                          ...prev, 
                          platforms: prev.platforms?.includes(p as any) 
                            ? prev.platforms.filter(x => x !== p) 
                            : [...(prev.platforms || []), p as any]
                        }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                          newPost.platforms?.includes(p as any) ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 border-transparent text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.caption}</label>
                  <textarea 
                    value={newPost.caption}
                    onChange={e => setNewPost({...newPost, caption: e.target.value})}
                    placeholder="Write something engaging..."
                    className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.scheduledAt}</label>
                  <input 
                    type="datetime-local" 
                    value={newPost.scheduledAt}
                    onChange={e => setNewPost({...newPost, scheduledAt: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border-none text-xs font-bold"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => handleAddPost(false)} 
                    className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[2px] active:scale-95 transition-all"
                  >
                    {t.schedule}
                  </button>
                  <button 
                    onClick={() => handleAddPost(true)} 
                    className="flex-1 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] shadow-lg shadow-purple-200 dark:shadow-none active:scale-95 transition-all"
                  >
                    {t.sendNow}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPlanner;