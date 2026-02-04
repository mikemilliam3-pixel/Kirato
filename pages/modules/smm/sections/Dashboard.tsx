import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { 
  Calendar, Sparkles, FolderHeart, MessageSquareCode, 
  Clock, ChevronRight, Plus, CalendarRange, RefreshCw,
  LogIn, AlertCircle
} from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { 
  collection, query, where, onSnapshot, limit, orderBy 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { language, user, isLoggedIn, openAuth } = useApp();
  const navigate = useNavigate();
  const moduleT = smmTranslations[language as keyof typeof smmTranslations] || smmTranslations['EN'];
  const t = moduleT.dashboard;

  const [metrics, setMetrics] = useState({
    scheduledCount: 0,
    draftCount: 0,
    libraryCount: 0,
    activeVoice: t.none
  });
  const [nextPost, setNextPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    // 1. Listen to Scheduled Count
    const qScheduled = query(
      collection(db, "smm_posts"),
      where("ownerId", "==", user.uid),
      where("status", "==", "scheduled")
    );
    const unsubScheduled = onSnapshot(qScheduled, (snap) => {
      setMetrics(prev => ({ ...prev, scheduledCount: snap.size }));
    }, (err) => console.warn("Scheduled count listener error:", err.message));

    // 2. Listen to Drafts Count
    const qDrafts = query(
      collection(db, "smm_posts"),
      where("ownerId", "==", user.uid),
      where("status", "==", "draft")
    );
    const unsubDrafts = onSnapshot(qDrafts, (snap) => {
      setMetrics(prev => ({ ...prev, draftCount: snap.size }));
    }, (err) => console.warn("Drafts count listener error:", err.message));

    // 3. Listen to Library Count
    const qAssets = query(
      collection(db, "smm_assets"),
      where("ownerId", "==", user.uid)
    );
    const unsubAssets = onSnapshot(qAssets, (snap) => {
      setMetrics(prev => ({ ...prev, libraryCount: snap.size }));
    }, (err) => console.warn("Assets listener error:", err.message));

    // 4. Listen to Active Voice
    const qVoice = query(
      collection(db, "smm_voices"),
      where("ownerId", "==", user.uid),
      where("isActive", "==", true),
      limit(1)
    );
    const unsubVoice = onSnapshot(qVoice, (snap) => {
      if (!snap.empty) {
        setMetrics(prev => ({ ...prev, activeVoice: snap.docs[0].data().name }));
      } else {
        setMetrics(prev => ({ ...prev, activeVoice: t.none }));
      }
    }, (err) => console.warn("Voice listener error:", err.message));

    // 5. Listen to Nearest Scheduled Post (Requires Composite Index)
    const qNext = query(
      collection(db, "smm_posts"),
      where("ownerId", "==", user.uid),
      where("status", "==", "scheduled"),
      orderBy("scheduledAt", "asc"),
      limit(1)
    );
    
    const unsubNext = onSnapshot(qNext, (snap) => {
      if (!snap.empty) {
        setNextPost({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setNextPost(null);
      }
      setLoading(false);
      setIndexError(false);
    }, (err) => {
      console.error("Next post listener error:", err);
      if (err.code === 'failed-precondition') {
        setIndexError(true);
      }
      setLoading(false);
    });

    return () => {
      unsubScheduled();
      unsubDrafts();
      unsubAssets();
      unsubVoice();
      unsubNext();
    };
  }, [isLoggedIn, user, t.none]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-[28px] flex items-center justify-center mb-6 shadow-inner">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">
          {smmTranslations[language].planner.loginRequired}
        </h2>
        <button 
          onClick={() => openAuth('signin')}
          className="mt-6 flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
        >
          <LogIn size={18} /> {smmTranslations[language].planner.connect}
        </button>
      </div>
    );
  }

  const kpis = [
    { 
      label: t.scheduled, 
      value: metrics.scheduledCount.toString(), 
      icon: Calendar, 
      color: "text-purple-600", 
      bg: "bg-purple-50 dark:bg-purple-900/20",
      path: "/modules/smm/content-planner"
    },
    { 
      label: t.generated, 
      value: metrics.draftCount.toString(), 
      icon: Sparkles, 
      color: "text-amber-600", 
      bg: "bg-amber-50 dark:bg-amber-900/20",
      path: "/modules/smm/post-generator"
    },
    { 
      label: t.saved, 
      value: metrics.libraryCount.toString(), 
      icon: FolderHeart, 
      color: "text-pink-600", 
      bg: "bg-pink-50 dark:bg-pink-900/20",
      path: "/modules/smm/asset-library"
    },
    { 
      label: t.activeVoice, 
      value: metrics.activeVoice, 
      icon: MessageSquareCode, 
      color: "text-blue-600", 
      bg: "bg-blue-50 dark:bg-blue-900/20",
      path: "/modules/smm/brand-voice"
    },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-purple-500 mb-4" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {indexError && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-black text-amber-800 dark:text-amber-200 uppercase tracking-widest">Database Optimization Required</p>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-1 uppercase">Please check browser console for the direct link to create missing Firestore indexes. Features will be limited until complete.</p>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <button 
            key={idx} 
            onClick={() => navigate(kpi.path)}
            className="p-4 sm:p-5 md:p-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/50 text-left active:scale-[0.98]"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${kpi.bg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
              <kpi.icon size={22} className={kpi.color} />
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{kpi.value}</h4>
          </button>
        ))}
      </div>

      {/* Next Scheduled Card */}
      <div className="p-5 sm:p-6 bg-purple-600 text-white rounded-[32px] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 group">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
             <Clock size={24} className={nextPost ? "animate-pulse" : ""} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t.nextScheduled}</p>
            <h4 className="text-sm sm:text-base font-black truncate">
              {nextPost ? (nextPost.topic || nextPost.content?.substring(0, 40) + '...') : (indexError ? "Indexing..." : t.none)}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
           {nextPost && (
             <div className="text-right">
                <p className="text-[10px] font-black uppercase">{nextPost.platform}</p>
                <p className="text-xs font-bold opacity-80">
                  {nextPost.scheduledAt?.toDate ? nextPost.scheduledAt.toDate().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </p>
             </div>
           )}
           <button 
            onClick={() => navigate('/modules/smm/content-planner')}
            className="p-3 bg-white text-purple-600 rounded-xl hover:scale-110 transition-transform active:scale-95 shadow-lg"
           >
              <ChevronRight size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.quickActions}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/modules/smm/post-generator')}
              className="flex items-center gap-4 p-5 sm:p-6 bg-purple-600 text-white rounded-[24px] sm:rounded-[32px] active:scale-95 transition-all shadow-lg shadow-purple-200 dark:shadow-none hover:bg-purple-700 h-16 sm:h-20"
            >
              <Plus size={24} />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest">{t.createPost}</span>
            </button>
            <button 
              onClick={() => navigate('/modules/smm/content-planner')}
              className="flex items-center gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[24px] sm:rounded-[32px] active:scale-95 transition-all shadow-sm hover:shadow-md h-16 sm:h-20"
            >
              <CalendarRange size={24} className="text-purple-600" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{t.openPlanner}</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-black text-sm sm:text-base md:text-lg mb-4 px-1 tracking-tight">{t.thisWeek}</h3>
          <div className="space-y-3">
            {!nextPost ? (
              <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-widest">{indexError ? "Database Syncing..." : "No upcoming posts"}</p>
              </div>
            ) : (
              <div 
                onClick={() => navigate('/modules/smm/content-planner')}
                className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-slate-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                    <Clock size={20} className="text-slate-400 group-hover:text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate tracking-tight">
                      {nextPost.topic || nextPost.content?.substring(0, 30)}...
                    </p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {nextPost.platform} • {nextPost.scheduledAt?.toDate ? nextPost.scheduledAt.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 shrink-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;