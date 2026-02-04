import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { 
  Calendar as CalendarIcon, Plus, Instagram, 
  Send, Facebook, Trash2, RefreshCw, Clock, 
  X, CheckCircle2, LogIn, AlertCircle, 
  Upload, Image as ImageIcon, Heart, MessageCircle,
  Share2, FileText, Sparkles, Wand2
} from 'lucide-react';
import { db, storage } from '../../../../lib/firebase';
import { 
  collection, query, where, onSnapshot, addDoc, 
  deleteDoc, doc, serverTimestamp, orderBy, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Platform = 'telegram' | 'instagram' | 'facebook';
type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

interface SmmPost {
  id: string;
  platform: Platform;
  content: string;
  status: PostStatus;
  scheduledAt: any; // Firestore Timestamp
  publishResult?: { platformPostId?: string, error?: string };
  createdAt: any;
  mediaUrls?: string[];
  topic?: string;
}

interface IntegrationData {
  ownerId: string;
  telegram?: { channelIdOrUsername: string, isConnected: boolean, connectedAt: any };
  meta?: { facebookPageId?: string, instagramBusinessAccountId?: string, isConnected: boolean, connectedAt: any };
}

const ContentPlanner: React.FC = () => {
  const { language, user, isLoggedIn, openAuth } = useApp();
  const moduleT = smmTranslations[language as keyof typeof smmTranslations] || smmTranslations['EN'];
  const t = moduleT.planner;

  // --- STATE ---
  const [posts, setPosts] = useState<SmmPost[]>([]);
  const [integration, setIntegration] = useState<IntegrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  
  // --- MODAL FORM STATE ---
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['telegram']);
  const [postCaption, setPostCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- AI PANEL STATE ---
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'sales'>('casual');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- REAL-TIME SYNC ---
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    const unsubIntegration = onSnapshot(doc(db, "smm_integrations", user.uid), (snap) => {
      if (snap.exists()) setIntegration(snap.data() as IntegrationData);
      else setIntegration(null);
    });

    const q = query(
      collection(db, "smm_posts"), 
      where("ownerId", "==", user.uid),
      orderBy("scheduledAt", "asc")
    );

    const unsubPosts = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as SmmPost));
      setPosts(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listener error:", error);
      setLoading(false);
    });

    return () => {
      unsubIntegration();
      unsubPosts();
    };
  }, [isLoggedIn, user]);

  // --- HANDLERS ---

  // Fix: Defined triggerSuccess to resolve "Cannot find name 'triggerSuccess'" error
  const triggerSuccess = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setMediaFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews(prev => [...prev, ...newPreviews]);
    setValidationError(null);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
    setValidationError(null);
  };

  const handleAddPost = async () => {
    if (!isLoggedIn) {
      openAuth('signin');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setValidationError("Please select at least one platform.");
      return;
    }

    if (!postCaption.trim() && mediaFiles.length === 0) {
      setValidationError("Post must have a caption or at least one media file.");
      return;
    }

    const scheduleDate = new Date(scheduledAt);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      setValidationError("Scheduled time must be in the future.");
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);
    try {
      const uploadedUrls: string[] = [];
      for (const file of mediaFiles) {
        const fileRef = ref(storage, `smm/${user?.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      for (const platform of selectedPlatforms) {
        await addDoc(collection(db, "smm_posts"), {
          ownerId: user?.uid,
          platform,
          content: postCaption,
          status: 'scheduled',
          mediaUrls: uploadedUrls,
          scheduledAt: Timestamp.fromDate(scheduleDate),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setIsPostModalOpen(false);
      resetForm();
      triggerSuccess();
    } catch (e) {
      console.error("Save failed", e);
      setValidationError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiCaption = async () => {
    if (!aiTopic.trim()) return;
    
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          tone: aiTone,
          language: language
        })
      });

      const data = await res.json();
      if (data.caption) {
        setPostCaption(data.caption);
        setIsAiPanelOpen(false);
        setAiTopic('');
      } else {
        throw new Error("No caption returned");
      }
    } catch (err) {
      console.error("AI Generation failed", err);
      setValidationError("AI generation failed. Please try again later.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const resetForm = () => {
    setPostCaption('');
    setSelectedPlatforms(['telegram']);
    mediaPreviews.forEach(url => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviews([]);
    setValidationError(null);
    setIsAiPanelOpen(false);
    const now = new Date();
    // Fix: Completed truncated resetForm logic
    now.setHours(now.getHours() + 1, 0, 0, 0);
    setScheduledAt(now.toISOString().slice(0, 16));
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Delete this scheduled post?")) return;
    try {
      await deleteDoc(doc(db, "smm_posts", id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-[28px] flex items-center justify-center mb-6 shadow-inner">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">
          {t.loginRequired}
        </h2>
        <button 
          onClick={() => openAuth('signin')}
          className="mt-6 flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
        >
          <LogIn size={18} /> {t.connect}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-32 max-w-7xl mx-auto">
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 size={18} /> {t.success}
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <h3 className="text-2xl font-black tracking-tight">{t.history}</h3>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
        >
          <Plus size={18} /> {t.addPost}
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin text-purple-500 mb-4" size={32} />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-[40px] border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
          <CalendarIcon size={64} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xs font-black uppercase tracking-widest">{t.noPosts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 rounded-xl">
                    {post.platform === 'telegram' ? <Send size={14} className="text-blue-500"/> : post.platform === 'instagram' ? <Instagram size={14} className="text-pink-500"/> : <Facebook size={14} className="text-blue-600"/>}
                    <span className="text-[10px] font-black uppercase text-slate-500">{post.platform}</span>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                    <img src={post.mediaUrls[0]} className="w-full h-full object-cover" alt="Post content" />
                  </div>
                )}
                
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-4 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-purple-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {post.scheduledAt?.toDate ? post.scheduledAt.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                  post.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 
                  post.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {(t.status as any)[post.status] || post.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Creation Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPostModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto animate-in zoom-in-95 duration-200">
             
             <div className="flex-1 p-8 md:p-12 overflow-y-auto border-r border-gray-100 dark:border-slate-800 space-y-8 no-scrollbar">
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-black tracking-tight">{t.addPost}</h4>
                  <button onClick={() => setIsPostModalOpen(false)} className="md:hidden p-2 text-slate-400"><X size={24}/></button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.platforms}</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'telegram', icon: Send, color: 'text-blue-500' },
                      { id: 'instagram', icon: Instagram, color: 'text-pink-500' },
                      { id: 'facebook', icon: Facebook, color: 'text-blue-600' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id as Platform)}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                          selectedPlatforms.includes(p.id as Platform)
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 opacity-60'
                        }`}
                      >
                        <p.icon size={20} className={p.color} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{p.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.caption}</label>
                    <button 
                      onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                      className="flex items-center gap-1.5 text-[9px] font-black text-purple-600 uppercase tracking-widest hover:underline"
                    >
                      <Sparkles size={12} /> AI Magic
                    </button>
                  </div>
                  
                  {isAiPanelOpen && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{t.topic}</label>
                        <input 
                          type="text" 
                          value={aiTopic}
                          onChange={e => setAiTopic(e.target.value)}
                          placeholder="What is this post about?" 
                          className="w-full h-10 px-4 bg-white dark:bg-slate-800 rounded-xl border-none text-xs font-bold focus:ring-1 focus:ring-purple-500" 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex gap-2">
                           {['casual', 'professional', 'sales'].map((tone) => (
                             <button 
                              key={tone}
                              onClick={() => setAiTone(tone as any)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${aiTone === tone ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 bg-white dark:bg-slate-800'}`}
                             >
                               {tone}
                             </button>
                           ))}
                         </div>
                         <button 
                          disabled={isAiGenerating || !aiTopic.trim()}
                          onClick={generateAiCaption}
                          className="h-9 px-4 bg-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 flex items-center gap-2"
                         >
                           {isAiGenerating ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>}
                           Generate
                         </button>
                      </div>
                    </div>
                  )}

                  <textarea 
                    value={postCaption}
                    onChange={e => setPostCaption(e.target.value)}
                    className="w-full h-40 p-5 bg-gray-50 dark:bg-slate-950 rounded-3xl border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium leading-relaxed resize-none"
                    placeholder="Enter your post content..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Media</label>
                  <div className="flex flex-wrap gap-3">
                    {mediaPreviews.map((url, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => removeMedia(i)} className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={20}/></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1 hover:border-purple-500 hover:bg-purple-50 transition-all text-slate-400 hover:text-purple-600"
                    >
                      <Upload size={24} />
                      <span className="text-[8px] font-black uppercase">Upload</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleMediaUpload} multiple accept="image/*,video/*" className="hidden" />
                  </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.scheduledAt}</label>
                   <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="datetime-local" 
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-gray-50 dark:bg-slate-950 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 font-bold text-sm"
                      />
                   </div>
                </div>

                {validationError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center gap-3 border border-rose-100 dark:border-rose-900/40">
                    <AlertCircle size={18} />
                    <p className="text-[10px] font-black uppercase tracking-widest">{validationError}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => setIsPostModalOpen(false)}
                    className="flex-1 py-5 bg-gray-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest"
                   >
                     Cancel
                   </button>
                   <button 
                    disabled={isSubmitting}
                    onClick={handleAddPost}
                    className="flex-[2] py-5 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     {isSubmitting ? <RefreshCw className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                     {t.schedule}
                   </button>
                </div>
             </div>

             <div className="hidden md:flex w-[400px] bg-gray-50 dark:bg-slate-950/50 flex-col items-center justify-center p-12">
                <div className="w-full max-w-[280px] aspect-[9/18.5] bg-white dark:bg-slate-900 rounded-[3rem] border-[8px] border-gray-900 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 dark:border-slate-800 rounded-b-2xl z-20" />
                   
                   <div className="pt-8 pb-3 px-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black text-white">K</div>
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Kirato Preview</span>
                   </div>

                   <div className="flex-1 overflow-y-auto no-scrollbar">
                      <div className="p-4 space-y-4">
                         {mediaPreviews.length > 0 ? (
                           <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
                              <img src={mediaPreviews[0]} className="w-full h-full object-cover" />
                           </div>
                         ) : (
                           <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-slate-800/50 flex items-center justify-center">
                              <ImageIcon size={32} className="text-gray-300" />
                           </div>
                         )}

                         <div className="space-y-2 px-1">
                            <p className="text-[10px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {postCaption || "Your caption will appear here..."}
                            </p>
                            <div className="flex items-center gap-3 text-slate-300">
                               <Heart size={14} />
                               <MessageCircle size={14} />
                               <Share2 size={14} />
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="h-10 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800 flex items-center justify-around">
                      <div className="w-4 h-4 rounded-sm border-2 border-gray-100 dark:border-slate-800" />
                      <div className="w-4 h-4 rounded-sm border-2 border-gray-100 dark:border-slate-800" />
                      <div className="w-4 h-4 rounded-sm border-2 border-gray-100 dark:border-slate-800" />
                   </div>
                </div>
                <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Dynamic Mobile Preview</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix: Added default export for ContentPlanner to resolve import error in SMMPage
export default ContentPlanner;
