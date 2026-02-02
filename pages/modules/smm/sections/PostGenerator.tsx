import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { mediaService } from '../../../../lib/ai/media.service';
import { 
  Sparkles, Copy, FolderPlus, RefreshCw, 
  Image as ImageIcon, Video, FileText, 
  Maximize, LayoutGrid, Monitor, Clock,
  Download, AlertCircle,
  Info, ChevronDown, ChevronUp, Instagram, 
  Send, Smartphone, Tag,
  Upload, X
} from 'lucide-react';

type GenMode = 'post' | 'image' | 't2v' | 'i2v';
type JobStatus = 'queued' | 'running' | 'done' | 'failed';

interface GenResult {
  id: string;
  type: 'text' | 'image' | 'video';
  url?: string;
  content?: string;
  platform?: string;
  status: JobStatus;
  genMode?: GenMode;
}

const PostGenerator: React.FC = () => {
  const { language } = useApp();
  const t = smmTranslations[language].generator;
  
  const [mode, setMode] = useState<GenMode>('post');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenResult[]>([]);
  
  // Post Mode Specific State
  const [platform, setPlatform] = useState('Telegram');
  const [postType, setPostType] = useState('promo');
  const [showDetails, setShowDetails] = useState(false);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [link, setLink] = useState('');
  const [brand, setBrand] = useState('');
  const [variantCount, setVariantCount] = useState('3');
  const [length, setLength] = useState('medium');
  const [hashtagsEnabled, setHashtagsEnabled] = useState('auto');
  const [ctaType, setCtaType] = useState('buy');

  // Shared Media State
  const [aspect, setAspect] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [resolution, setResolution] = useState('720p');
  const [duration, setDuration] = useState('4s');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  
  // Image to Video Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status polling for active jobs
  useEffect(() => {
    const timer = setInterval(async () => {
      const activeJobs = results.filter(r => r.status === 'queued' || r.status === 'running');
      if (activeJobs.length === 0) return;

      for (const job of activeJobs) {
        try {
          const statusUpdate = await mediaService.getJobStatus(job.id);
          if (statusUpdate.status !== job.status) {
            setResults(prev => prev.map(r => r.id === job.id ? { 
              ...r, 
              status: statusUpdate.status as JobStatus,
              url: statusUpdate.resultUrl 
            } : r));
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [results]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file?: File) => {
    setUploadError(null);
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid type. Use PNG, JPG or WEBP.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File too large. Max 20MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async (url: string, res: GenResult) => {
    const ext = res.type === 'image' ? 'png' : 'mp4';
    const filename = `kirato-${res.id}.${ext}`;
    try {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.target = '_blank';
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (mode === 'post') {
        const count = parseInt(variantCount);
        const newResults: GenResult[] = Array.from({ length: count }).map((_, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          status: 'done',
          platform: platform,
          genMode: 'post',
          content: `🚀 ${brand ? brand + ' - ' : ''}${postType.toUpperCase()}! ${prompt}. ${price ? 'Price: ' : ''}${price} ${discount ? '(' + discount + ' OFF)' : ''}. ${link ? 'Order here: ' : ''}${link}. #SMM #Business #${platform}`
        }));
        setResults([...newResults, ...results]);
      } else {
        let job;
        if (mode === 'image') {
          job = await mediaService.createTextToImageJob(prompt, aspect, quality);
        } else if (mode === 't2v') {
          job = await mediaService.createTextToVideoJob(prompt, aspect, quality, resolution, duration);
        } else if (mode === 'i2v') {
          const tempUrl = filePreview || '';
          job = await mediaService.createImageToVideoJob(tempUrl, prompt, aspect, quality, resolution, duration);
        }

        if (job) {
          const newResult: GenResult = {
            id: job.id,
            type: mode === 'image' ? 'image' : 'video',
            status: job.status as JobStatus,
            genMode: mode,
            url: job.resultUrl
          };
          setResults([newResult, ...results]);
        }
      }
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setLoading(false);
    }
  };

  const renderSharedControls = () => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
      <div className="space-y-2">
        <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1 tracking-widest">
          <Maximize size={12} /> {t.aspectRatio}
        </label>
        <select 
          value={aspect}
          onChange={(e) => setAspect(e.target.value)}
          className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
        >
          {['1:1', '4:5', '9:16', '16:9', '3:2', '2:3'].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1 tracking-widest">
          <LayoutGrid size={12} /> {t.quality}
        </label>
        <select 
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
        >
          {mode === 'image' && <option value="draft">{t.qualityLevels.draft}</option>}
          <option value="standard">{t.qualityLevels.standard}</option>
          <option value="high">{t.qualityLevels.high}</option>
        </select>
      </div>
      {(mode === 't2v' || mode === 'i2v') && (
        <>
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1 tracking-widest">
              <Monitor size={12} /> {t.resolution}
            </label>
            <select 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1 tracking-widest">
              <Clock size={12} /> {t.duration}
            </label>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              <option value="4s">4s</option>
              <option value="6s">6s</option>
              <option value="8s">8s</option>
            </select>
          </div>
        </>
      )}
    </div>
  );

  const renderPostGenerator = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Explainer Header - Responsive Padding */}
      <div className="p-5 sm:p-7 md:p-8 bg-purple-50 dark:bg-purple-900/10 rounded-[32px] border border-purple-100 dark:border-purple-800/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <Info size={24} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-black text-purple-900 dark:text-purple-200 tracking-tight truncate">{t.postExplainer.title}</h4>
            <p className="text-[10px] sm:text-[11px] md:text-xs font-bold text-purple-700/70 dark:text-purple-300/60 line-clamp-1 sm:line-clamp-none">{t.postExplainer.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {[t.postExplainer.bullet1, t.postExplainer.bullet2, t.postExplainer.bullet3].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-white/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-white/50 dark:border-transparent">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" /> {b}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-8 md:p-10 bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
        {/* Platform Selector */}
        <div className="space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.platform}</label>
          <div className="flex p-1 bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: 'Telegram', icon: Send },
              { id: 'Instagram', icon: Instagram },
              { id: 'TikTok', icon: Smartphone },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex-1 min-w-[90px] py-3.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all tracking-widest shrink-0 ${
                  platform === p.id ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-md' : 'text-gray-400 hover:text-slate-600'
                }`}
              >
                <p.icon size={16} /> {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Post Type & CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.postType}</label>
            <select 
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {Object.keys(t.postTypes).map(k => <option key={k} value={k}>{(t.postTypes as any)[k]}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.cta}</label>
            <select 
              value={ctaType}
              onChange={(e) => setCtaType(e.target.value)}
              className="w-full h-12 sm:h-14 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-sm border-none focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {Object.keys(t.ctas).map(k => <option key={k} value={k}>{(t.ctas as any)[k]}</option>)}
            </select>
          </div>
        </div>

        {/* Main Topic TextArea */}
        <div className="space-y-2">
          <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.promptLabel}</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 sm:p-5 bg-gray-50 dark:bg-slate-900 rounded-[24px] text-sm md:text-base border-none focus:ring-2 focus:ring-purple-500 min-h-[120px] sm:min-h-[140px] font-medium leading-relaxed"
            placeholder={t.promptHelper}
          />
        </div>

        {/* Details Section */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-700/50 pt-6">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-widest hover:text-purple-600 transition-colors"
          >
            <span className="flex items-center gap-2"><Tag size={16} /> {t.addDetails}</span>
            {showDetails ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
          </button>
          
          {showDetails && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.price}</label>
                <div className="relative">
                  <span className="absolute left-3 top-[13px] text-gray-400 text-xs font-bold">$</span>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full h-11 pl-7 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold" placeholder="100" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.discount}</label>
                <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold" placeholder="20%" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.link}</label>
                <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold" placeholder="shop.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.brand}</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold" placeholder="Brand" />
              </div>
            </div>
          )}
        </div>

        {/* Output Settings Grid */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-700/50 pt-6">
           <h5 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.outputSettings}</h5>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
             <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.variantCount}</label>
               <select value={variantCount} onChange={e => setVariantCount(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold">
                 <option value="3">3 Variants</option>
                 <option value="5">5 Variants</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.length}</label>
               <select value={length} onChange={e => setLength(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold">
                 <option value="short">{t.lengths.short}</option>
                 <option value="medium">{t.lengths.medium}</option>
                 <option value="long">{t.lengths.long}</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{t.hashtags}</label>
               <select value={hashtagsEnabled} onChange={e => setHashtagsEnabled(e.target.value)} className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none font-bold">
                 <option value="off">Off</option>
                 <option value="on">On</option>
                 <option value="auto">Auto</option>
               </select>
             </div>
           </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full h-16 bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-[24px] text-base font-black uppercase tracking-[2px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-purple-200 dark:shadow-none hover:bg-purple-700"
        >
          {loading ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
          {t.generate}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-24 max-w-7xl mx-auto">
      {/* Mode Switcher - Responsive width */}
      <div className="max-w-3xl mx-auto flex p-1.5 bg-white dark:bg-slate-800 rounded-[28px] shadow-sm border border-gray-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {[
          { id: 'post', icon: FileText, label: t.modes.post },
          { id: 'image', icon: ImageIcon, label: t.modes.image },
          { id: 't2v', icon: Video, label: t.modes.t2v },
          { id: 'i2v', icon: Sparkles, label: t.modes.i2v },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as GenMode)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[1px] transition-all whitespace-nowrap flex-1 justify-center shrink-0 ${
              mode === item.id 
                ? 'bg-purple-600 text-white shadow-xl' 
                : 'text-gray-400 hover:text-purple-600'
            }`}
          >
            <item.icon size={16} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {mode === 'post' ? renderPostGenerator() : (
        <div className="p-5 sm:p-8 md:p-10 bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700 space-y-6">
          {mode === 'i2v' && (
            <div className="space-y-3">
              <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Source Image</label>
              
              {!filePreview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer py-10 sm:py-14 px-6 sm:px-8 bg-gray-50 dark:bg-slate-900 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center transition-all ${
                    uploadError ? 'border-rose-300' : 'border-gray-200 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <Upload size={28} className="text-purple-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1 tracking-tight text-center">Click or drag image</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">PNG, JPG • Max 20MB</p>
                </div>
              ) : (
                <div className="relative p-3 sm:p-4 bg-gray-50 dark:bg-slate-900 rounded-[32px] border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shrink-0 shadow-lg">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs sm:text-sm font-black truncate tracking-tight">{selectedFile?.name}</h5>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase mt-1">
                        {(selectedFile?.size ? selectedFile.size / (1024 * 1024) : 0).toFixed(2)} MB
                      </p>
                    </div>
                    <button onClick={removeFile} className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-2xl text-rose-500 shadow-md flex items-center justify-center active:scale-90 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">
              {mode === 'image' ? 'Image Prompt' : 'Video Prompt'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 sm:p-5 bg-gray-50 dark:bg-slate-900 rounded-[28px] text-sm md:text-base border-none focus:ring-2 focus:ring-purple-500 min-h-[100px] sm:min-h-[120px] leading-relaxed font-medium"
              placeholder="Describe what you want to see in detail..."
            />
          </div>

          {renderSharedControls()}

          <button 
            onClick={handleGenerate}
            disabled={loading || (mode === 'i2v' && !selectedFile) || !prompt}
            className="w-full h-16 bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-[24px] text-base font-black uppercase tracking-[2px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-purple-200 dark:shadow-none hover:bg-purple-700"
          >
            {loading ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
            {t.generate}
          </button>
        </div>
      )}

      {/* Results Section - Desktop Optimized Grid */}
      <div className="space-y-6">
        <h3 className="font-black text-sm sm:text-base md:text-lg px-2 flex items-center gap-3 tracking-tight">
          {t.variants}
          {results.length > 0 && <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-black text-purple-600">{results.length}</span>}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((res) => (
            <div key={res.id} className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col group hover:shadow-xl transition-all h-full">
              <div className="flex justify-between items-center mb-5">
                {res.platform && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-purple-600">
                    {res.platform === 'Telegram' ? <Send size={12}/> : res.platform === 'Instagram' ? <Instagram size={12}/> : <Smartphone size={12}/>}
                    {res.platform}
                  </div>
                )}
                {res.content && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{res.content.length} {t.charCount}</span>}
              </div>

              {res.type === 'text' && (
                <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-6 flex-1 italic bg-gray-50 dark:bg-slate-900/30 p-4 sm:p-5 rounded-[24px] border border-transparent dark:border-slate-700/50">
                  {res.content}
                </p>
              )}

              {res.status !== 'done' ? (
                <div className="aspect-square bg-gray-50 dark:bg-slate-900 rounded-[32px] flex flex-col items-center justify-center gap-4 border border-gray-100 dark:border-slate-700">
                  {res.status === 'failed' ? (
                    <AlertCircle className="text-rose-500" size={48} />
                  ) : (
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest animate-pulse">{res.status}</p>
                </div>
              ) : (
                <>
                  {res.type === 'image' && (
                    <div className="relative overflow-hidden rounded-[28px] mb-6 aspect-square bg-gray-100 dark:bg-slate-900 shadow-inner group-hover:shadow-none transition-all">
                      <img src={res.url} alt="Gen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <button onClick={() => handleDownload(res.url!, res)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl text-purple-600 shadow-xl flex items-center justify-center active:scale-90 transition-all opacity-0 group-hover:opacity-100">
                        <Download size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2 sm:gap-3 border-t border-gray-50 dark:border-slate-700/50 pt-5 sm:pt-6 mt-auto">
                <button className="flex-1 h-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-95 text-slate-600 dark:text-slate-300">
                  <Copy size={16} className="text-purple-600" /> {t.copy}
                </button>
                <button className="flex-1 h-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-95 text-slate-600 dark:text-slate-300">
                  <FolderPlus size={16} className="text-purple-600" /> {t.save}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;