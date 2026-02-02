
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  Settings as SettingsIcon, Store, DollarSign, Bell, ShieldCheck, 
  Globe, Image as ImageIcon, MapPin, Clock, Send, Phone, Mail, 
  Check, Upload, Calendar, ShieldAlert, AlertCircle, Info, XCircle, 
  FileText, Trash2, Eye, User, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';
import { ShopProfile, ShopWorkingHours, DayOfWeek, VerificationStatus, SellerType, VerificationDocument, DocumentType } from '../types';

const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour}:${min}`;
});

const Settings: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const ts = t.settings;
  const tv = ts.verification;

  const [profile, setProfile] = useState<ShopProfile>(() => {
    const saved = localStorage.getItem('kirato-sales-shop-profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Data migration
      if (typeof parsed.workingHours === 'string' || !parsed.workingHours) {
        parsed.workingHours = {
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
          startTime: '09:00',
          endTime: '20:00'
        };
      }
      if (!parsed.verificationStatus) parsed.verificationStatus = 'unverified';
      if (!parsed.sellerType) parsed.sellerType = 'individual';
      if (!parsed.verificationDocs) parsed.verificationDocs = [];
      return parsed;
    }
    return {
      shopName: 'Kirato Premium Gadgets',
      description: 'We sell the best AI-integrated gadgets in Uzbekistan.',
      city: 'Tashkent',
      workingHours: {
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        startTime: '09:00',
        endTime: '20:00'
      },
      telegram: '@kirato_admin',
      phone: '+998 90 123 45 67',
      verificationStatus: 'unverified',
      sellerType: 'individual',
      verificationDocs: []
    };
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(ts.success);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [supportMode, setSupportMode] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    // Hidden support review mode toggle
    const isSupport = localStorage.getItem('kirato-support-mode') === 'true';
    setSupportMode(isSupport);
  }, []);

  const handleSave = (updatedProfile?: ShopProfile) => {
    const toSave = updatedProfile || profile;
    localStorage.setItem('kirato-sales-shop-profile', JSON.stringify(toSave));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    window.dispatchEvent(new Event('shop-profile-updated'));
  };

  const handleFileUpload = (field: 'logoUrl' | 'bannerUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Document Upload Logic ---
  const handleDocUpload = (type: DocumentType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File too large (Max 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newDoc: VerificationDocument = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        previewUrl: reader.result as string
      };

      setProfile(prev => ({
        ...prev,
        verificationDocs: [
          ...(prev.verificationDocs || []).filter(d => d.type !== type),
          newDoc
        ]
      }));
    };
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  const removeDoc = (type: DocumentType) => {
    setProfile(prev => ({
      ...prev,
      verificationDocs: (prev.verificationDocs || []).filter(d => d.type !== type)
    }));
  };

  const handleSubmitVerification = () => {
    const docs = profile.verificationDocs || [];
    const hasIdFront = docs.some(d => d.type === 'id_front');
    const hasCert = docs.some(d => d.type === 'business_certificate');

    if (!hasIdFront || (profile.sellerType === 'business' && !hasCert)) {
      setErrorMsg(tv.missingDocs);
      return;
    }

    const updated = { 
      ...profile, 
      verificationStatus: 'pending' as VerificationStatus,
      verificationSubmittedAt: new Date().toISOString()
    };
    setProfile(updated);
    setSuccessMessage(tv.requestSent);
    setIsRequesting(false);
    handleSave(updated);
  };

  // --- UI Helpers ---
  const toggleDay = (day: DayOfWeek) => {
    const currentWH = profile.workingHours as ShopWorkingHours;
    const newDays = currentWH.days.includes(day)
      ? currentWH.days.filter(d => d !== day)
      : [...currentWH.days, day];
    
    setProfile({
      ...profile,
      workingHours: { ...currentWH, days: newDays }
    });
  };

  const setPreset = (preset: 'monFri' | 'monSat' | 'everyday') => {
    let days: DayOfWeek[] = [];
    if (preset === 'monFri') days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    if (preset === 'monSat') days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (preset === 'everyday') days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    setProfile({
      ...profile,
      workingHours: { ...(profile.workingHours as ShopWorkingHours), days }
    });
  };

  // --- Support Actions (Hidden Mode) ---
  const supportApprove = () => {
    const updated = { 
      ...profile, 
      verificationStatus: 'verified' as VerificationStatus,
      verifiedAt: new Date().toISOString()
    };
    setProfile(updated);
    setSuccessMessage("Approved");
    handleSave(updated);
  };

  const supportReject = () => {
    const updated = { 
      ...profile, 
      verificationStatus: 'rejected' as VerificationStatus,
      verificationNote: adminNote || 'Documents invalid or incomplete.'
    };
    setProfile(updated);
    setSuccessMessage("Rejected");
    handleSave(updated);
  };

  const workingHours = profile.workingHours as ShopWorkingHours;

  const formattedWHSummary = useMemo(() => {
    const wh = profile.workingHours as ShopWorkingHours;
    if (!wh.days.length) return ts.closed;
    let daysStr = "";
    if (wh.days.length === 7) daysStr = ts.presets.everyday;
    else if (wh.days.length === 5 && !['sat', 'sun'].some(d => wh.days.includes(d as DayOfWeek))) daysStr = ts.presets.monFri;
    else if (wh.days.length === 6 && !wh.days.includes('sun')) daysStr = ts.presets.monSat;
    else daysStr = wh.days.map(d => (ts.days as any)[d]).join(', ');
    return `${daysStr} · ${wh.startTime}–${wh.endTime}`;
  }, [profile.workingHours, language, ts]);

  const DocUploadCard = ({ type, label, required = false }: { type: DocumentType, label: string, required?: boolean }) => {
    const doc = (profile.verificationDocs || []).find(d => d.type === type);
    const isPending = profile.verificationStatus === 'pending';
    const isVerified = profile.verificationStatus === 'verified';
    const disabled = isPending || isVerified;

    return (
      <div className="space-y-1.5 flex-1 min-w-[240px]">
        <div className="flex justify-between px-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label} {required && '*'}</label>
          {doc && <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1"><Check size={10} /> Uploaded</span>}
        </div>
        
        <div className={`relative h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50 dark:bg-slate-900/50 ${doc ? 'border-emerald-500/30' : 'border-gray-200 dark:border-slate-700'} ${!disabled && 'hover:border-rose-500/50 cursor-pointer'}`}>
          {doc ? (
            <div className="absolute inset-0 flex items-center gap-3 px-4">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {doc.fileType.startsWith('image') ? (
                   <img src={doc.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                   <FileText size={20} className="text-blue-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                 <p className="text-[10px] font-black truncate">{doc.fileName}</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!disabled && (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => removeDoc(type)} className="p-2 bg-white dark:bg-slate-800 rounded-lg text-rose-500 shadow-sm"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          ) : (
            <label className={`w-full h-full flex flex-col items-center justify-center gap-1 ${disabled ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}>
              <Upload size={18} className="text-gray-300" />
              <span className="text-[8px] font-black uppercase text-gray-400">{tv.fileRequirements}</span>
              {!disabled && <input type="file" className="hidden" accept="image/*,application/pdf" onChange={e => handleDocUpload(type, e)} />}
            </label>
          )}
        </div>
      </div>
    );
  };

  const getVerificationUI = () => {
    const status = profile.verificationStatus || 'unverified';
    const isPending = status === 'pending';
    const isVerified = status === 'verified';
    const isRejected = status === 'rejected';

    const badges = {
      unverified: { icon: ShieldAlert, color: 'text-gray-500', bg: 'bg-gray-50', label: tv.unverified },
      pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: tv.pending },
      verified: { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', label: tv.verified },
      rejected: { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50', label: tv.rejected },
    };
    const current = badges[status];
    
    return (
      <div className="p-5 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 px-1">{tv.title}</h3>
        
        {/* Status Badge */}
        <div className={`p-5 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 ${current.bg} dark:bg-opacity-10 border border-transparent dark:border-slate-700`}>
           <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${current.bg} dark:bg-slate-800 shadow-sm`}>
                <current.icon className={current.color} size={32} />
              </div>
              <div>
                 <p className={`text-sm font-black uppercase tracking-wider ${current.color}`}>{current.label}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase">Kirato Marketplace Verification</p>
              </div>
           </div>
           
           {(status === 'unverified') && !isRequesting && (
             <button 
               onClick={() => setIsRequesting(true)}
               className="w-full sm:w-auto px-8 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               {tv.requestBtn}
             </button>
           )}

           {isRejected && !isRequesting && (
             <button 
               onClick={() => setIsRequesting(true)}
               className="w-full sm:w-auto px-8 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               {tv.resubmitBtn}
             </button>
           )}
        </div>

        {/* Informational Messages */}
        {isPending && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
             <Clock className="text-amber-500 shrink-0" size={16} />
             <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
               {tv.pendingMessage}
             </p>
          </div>
        )}

        {isRejected && profile.verificationNote && !isRequesting && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex gap-3">
             <Info className="text-rose-500 shrink-0" size={16} />
             <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
               {tv.adminNote}: {profile.verificationNote}
             </p>
          </div>
        )}

        {isVerified && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex gap-3">
             <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
             <div>
               <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Verified Seller</p>
               {profile.verifiedAt && <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Approved on {new Date(profile.verifiedAt).toLocaleDateString()}</p>}
             </div>
          </div>
        )}

        {/* Verification Form (Docs) */}
        {(isRequesting || isPending || isVerified || isRejected) && (
          <div className="space-y-6 pt-4 animate-in slide-in-from-top-2 duration-300">
            {/* Seller Type Selection - Read Only when pending/verified */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tv.sellerType}</label>
               <div className="flex p-1 bg-gray-50 dark:bg-slate-900 rounded-2xl">
                  <button 
                    disabled={isPending || isVerified}
                    onClick={() => setProfile({...profile, sellerType: 'individual'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${profile.sellerType === 'individual' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-md' : 'text-gray-400'}`}
                  >
                    <User size={14} /> {tv.individual}
                  </button>
                  <button 
                    disabled={isPending || isVerified}
                    onClick={() => setProfile({...profile, sellerType: 'business'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${profile.sellerType === 'business' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-md' : 'text-gray-400'}`}
                  >
                    <Briefcase size={14} /> {tv.business}
                  </button>
               </div>
            </div>

            {/* Document Uploads - Grid layout */}
            <div className="flex flex-wrap gap-4">
               <DocUploadCard type="id_front" label={tv.uploadIdFront} required />
               <DocUploadCard type="id_back" label={tv.uploadIdBack} />
               {profile.sellerType === 'business' && (
                 <DocUploadCard type="business_certificate" label={tv.uploadBusinessCert} required />
               )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-rose-100 dark:border-rose-900/40">
                <ShieldAlert size={14} /> {errorMsg}
              </div>
            )}

            {isRequesting && (
              <div className="flex gap-3 pt-2">
                 <button onClick={() => setIsRequesting(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-900 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">{ts.cancel}</button>
                 <button onClick={handleSubmitVerification} className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all">{tv.submitBtn}</button>
              </div>
            )}
          </div>
        )}

        {/* Support Only - Hidden Admin Review Mode */}
        {supportMode && isPending && (
          <div className="p-6 bg-slate-900 rounded-[32px] border-4 border-cyan-500 shadow-2xl animate-in zoom-in duration-300">
             <h4 className="text-cyan-400 font-black text-xs uppercase tracking-[4px] mb-6 flex items-center gap-2">
               <ShieldCheck size={18} /> {tv.supportReview}
             </h4>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{tv.adminNote}</label>
                   <textarea 
                     value={adminNote}
                     onChange={e => setAdminNote(e.target.value)}
                     className="w-full p-4 bg-slate-800 rounded-2xl border-none text-white text-xs font-bold"
                     placeholder="Explain why rejected..."
                   />
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={supportReject}
                     className="flex-1 h-12 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                   >
                     {tv.adminReject}
                   </button>
                   <button 
                     onClick={supportApprove}
                     className="flex-1 h-12 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                   >
                     {tv.adminVerify}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 max-w-5xl mx-auto animate-in fade-in duration-500">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Check size={18} /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Shop Information Section */}
          <div className="p-4 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6 md:space-y-8">
            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center">
                <Store size={22} />
              </div>
              {ts.shopProfile}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 md:gap-4 items-center">
               <div className="space-y-1.5 flex flex-col items-center sm:items-start shrink-0">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Logo</label>
                  <div className="relative group w-20 h-20 md:w-24 md:h-24">
                    <div className="w-full h-full bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-rose-500/50">
                      {profile.logoUrl ? (
                        <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-sm">
                        <Upload size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload('logoUrl', e)} />
                      </label>
                    </div>
                  </div>
               </div>

               <div className="space-y-1.5 w-full">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner</label>
                  <div className="relative group h-20 md:h-24 w-full">
                    <div className="w-full h-full bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-rose-500/50">
                      {profile.bannerUrl ? (
                        <img src={profile.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-sm">
                        <Upload size={18} />
                        <span className="text-[8px] font-black uppercase mt-1">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload('bannerUrl', e)} />
                      </label>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.shopName}</label>
                <input 
                  type="text" 
                  value={profile.shopName}
                  onChange={e => setProfile({...profile, shopName: e.target.value})}
                  className="w-full h-12 md:h-14 px-4 md:px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.description}</label>
                <textarea 
                  value={profile.description}
                  onChange={e => setProfile({...profile, description: e.target.value})}
                  className="w-full p-4 md:p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-medium text-sm h-24" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.city}</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-[14px] text-gray-400" />
                      <input 
                        type="text" 
                        value={profile.city}
                        onChange={e => setProfile({...profile, city: e.target.value})}
                        className="w-full h-11 pl-11 pr-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" 
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{ts.workingHours}</label>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none space-y-4">
                       <div className="flex items-center gap-2 mb-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{formattedWHSummary}</span>
                       </div>
                       
                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{ts.selectDays}</p>
                          <div className="flex flex-wrap gap-1.5">
                             {DAYS.map(day => (
                               <button
                                 key={day}
                                 onClick={() => toggleDay(day)}
                                 className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                                   workingHours.days.includes(day)
                                     ? 'bg-rose-600 text-white'
                                     : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'
                                 }`}
                               >
                                 {(ts.days as any)[day]}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          <button onClick={() => setPreset('monFri')} className="text-[8px] font-black uppercase text-rose-600 hover:underline">{ts.presets.monFri}</button>
                          <button onClick={() => setPreset('monSat')} className="text-[8px] font-black uppercase text-rose-600 hover:underline">{ts.presets.monSat}</button>
                          <button onClick={() => setPreset('everyday')} className="text-[8px] font-black uppercase text-rose-600 hover:underline">{ts.presets.everyday}</button>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                             <label className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{ts.startTime}</label>
                             <select
                               value={workingHours.startTime}
                               onChange={e => setProfile({ ...profile, workingHours: { ...workingHours, startTime: e.target.value }})}
                               className="w-full h-9 px-2 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold border-gray-100 dark:border-slate-700 focus:ring-rose-500"
                             >
                               {TIME_OPTIONS.map(time => <option key={`start-${time}`} value={time}>{time}</option>)}
                             </select>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[8px] font-black text-gray-400 uppercase tracking-wider">{ts.endTime}</label>
                             <select
                               value={workingHours.endTime}
                               onChange={e => setProfile({ ...profile, workingHours: { ...workingHours, endTime: e.target.value }})}
                               className="w-full h-9 px-2 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold border-gray-100 dark:border-slate-700 focus:ring-rose-500"
                             >
                               {TIME_OPTIONS.map(time => <option key={`end-${time}`} value={time}>{time}</option>)}
                             </select>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
           {/* Verification Section */}
           {getVerificationUI()}

           <div className="p-4 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-4 md:space-y-6">
              <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 px-1">{ts.contact}</h3>
              <div className="space-y-3 md:space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Send size={12} /> Telegram</label>
                    <input 
                      type="text" 
                      value={profile.telegram}
                      onChange={e => setProfile({...profile, telegram: e.target.value})}
                      className="w-full h-10 md:h-12 px-3 md:px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none font-bold text-xs" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Phone size={12} /> Phone</label>
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="w-full h-10 md:h-12 px-3 md:px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none font-bold text-xs" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2"><Mail size={12} /> Email</label>
                    <input 
                      type="text" 
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full h-10 md:h-12 px-3 md:px-4 bg-gray-50 dark:bg-slate-900 rounded-xl border-none font-bold text-xs" 
                    />
                 </div>
              </div>
           </div>

           <div className="p-4 md:p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-3 md:space-y-4">
              <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400 px-1">Marketplace Settings</h3>
              {[
                { icon: DollarSign, label: 'Currency', value: 'USD ($)', color: 'text-emerald-500' },
                { icon: Bell, label: 'Notifications', value: 'Telegram + Email', color: 'text-orange-500' },
                { icon: ShieldCheck, label: 'Auto-Payouts', value: 'Enabled', color: 'text-purple-500' },
              ].map((item) => (
                <div key={item.label} className="p-3 md:p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between shadow-sm active:scale-95 transition-all">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon size={16} className={item.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase truncate">{item.label}</p>
                      <p className="text-[10px] md:text-xs font-black truncate">{item.value}</p>
                    </div>
                  </div>
                  <button className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase ml-2">Edit</button>
                </div>
              ))}
           </div>

           <button 
             onClick={() => handleSave()}
             className="w-full py-4 md:py-5 bg-rose-600 text-white rounded-[20px] md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all hover:bg-rose-700 flex items-center justify-center gap-2 md:gap-3"
           >
             <Check size={18} /> {ts.saveChanges}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
