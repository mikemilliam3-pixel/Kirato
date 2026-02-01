
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { smmTranslations } from '../i18n';
import { mediaService } from '../../../../lib/ai/media.service';
import { 
  Sparkles, Copy, FolderPlus, RefreshCw, 
  Image as ImageIcon, Video, FileText, 
  Maximize, LayoutGrid, Monitor, Clock,
  Download, ExternalLink, AlertCircle,
  Info, ChevronDown, ChevronUp, Instagram, 
  Send, Smartphone, Hash, Calendar, Tag, Link as LinkIcon,
  Upload, X, FileImage
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
  const [deadline, setDeadline] = useState('');
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
          // Note: In this environment we simulate the fetch call
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
      setUploadError('Invalid file type. Please upload PNG, JPEG or WEBP.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File is too large. Max size is 20MB.');
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
    let prefix = 'media';
    if (res.genMode === 'image') prefix = 'text-to-image';
    else if (res.genMode === 't2v') prefix = 'text-to-video';
    else if (res.genMode === 'i2v') prefix = 'image-to-video';
    
    const filename = `kirato-${prefix}-${Date.now()}.${ext}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.target = '_blank';
      link.click();
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      if (mode === 'post') {
        // Post generator remains mock for now as per instructions
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
          // Assume image upload is handled or we use a temporary URL for the simulation
          const tempUrl = filePreview || 'https://kirato-storage.local/temp.png';
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
    <div className="grid grid-cols-2 gap-3 mt-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
          <Maximize size={10} /> {t.aspectRatio}
        </label>
        <select 
          value={aspect}
          onChange={(e) => setAspect(e.target.value)}
          className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
        >
          {['1:1', '4:5', '9:16', '16:9', '3:2', '2:3'].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
          <LayoutGrid size={10} /> {t.quality}
        </label>
        <select 
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
        >
          {mode === 'image' && <option value="draft">{t.qualityLevels.draft}</option>}
          <option value="standard">{t.qualityLevels.standard}</option>
          <option value="high">{t.qualityLevels.high}</option>
        </select>
      </div>
      {(mode === 't2v' || mode === 'i2v') && (
        <>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Monitor size={10} /> {t.resolution}
            </label>
            <select 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
              <Clock size={10} /> {t.duration}
            </label>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
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
    <div className="space-y-6">
      {/* Explainer Header */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
            <Info size={18} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-purple-900 dark:text-purple-200">{t.postExplainer.title}</h4>
            <p className="text-[10px] font-medium text-purple-700/70 dark:text-purple-300/60">{t.postExplainer.subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
          {[t.postExplainer.bullet1, t.postExplainer.bullet2, t.postExplainer.bullet3].map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase">
              <div className="w-1 h-1 bg-purple-400 rounded-full" /> {b}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700 space-y-5">
        {/* Platform Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.platform}</label>
          <div className="flex p-1 bg-gray-50 dark:bg-slate-900 rounded-xl">
            {[
              { id: 'Telegram', icon: Send },
              { id: 'Instagram', icon: Instagram },
              { id: 'TikTok', icon: Smartphone },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                  platform === p.id ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-gray-400'
                }`}
              >
                <p.icon size={14} /> {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Post Type & CTA */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.postType}</label>
            <select 
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.keys(t.postTypes).map(k => <option key={k} value={k}>{(t.postTypes as any)[k]}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.cta}</label>
            <select 
              value={ctaType}
              onChange={(e) => setCtaType(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.keys(t.ctas).map(k => <option key={k} value={k}>{(t.ctas as any)[k]}</option>)}
            </select>
          </div>
        </div>

        {/* Main Topic */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.promptLabel}</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-xs border-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder={t.promptHelper}
          />
        </div>

        {/* Optional Details Collapsible */}
        <div className="space-y-2 border-t border-gray-50 dark:border-slate-700/50 pt-4">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-500"
          >
            <span className="flex items-center gap-2"><Tag size={14} /> {t.addDetails}</span>
            {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          
          {showDetails && (
            <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.price}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-xs">$</span>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 pl-6 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" placeholder="100" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.discount}</label>
                <input type="text" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" placeholder="20%" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.link}</label>
                <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" placeholder="shop.com/buy" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.brand}</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none" placeholder="Brand Name" />
              </div>
            </div>
          )}
        </div>

        {/* Output Controls */}
        <div className="space-y-4 border-t border-gray-50 dark:border-slate-700/50 pt-4">
           <h5 className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.outputSettings}</h5>
           <div className="grid grid-cols-3 gap-3">
             <div className="space-y-1">
               <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.variantCount}</label>
               <select value={variantCount} onChange={e => setVariantCount(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] border-none">
                 <option value="3">3</option>
                 <option value="5">5</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.length}</label>
               <select value={length} onChange={e => setLength(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] border-none">
                 <option value="short">{t.lengths.short}</option>
                 <option value="medium">{t.lengths.medium}</option>
                 <option value="long">{t.lengths.long}</option>
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{t.hashtags}</label>
               <select value={hashtagsEnabled} onChange={e => setHashtagsEnabled(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] border-none">
                 <option value="off">Off</option>
                 <option value="on">On</option>
                 <option value="auto">Auto</option>
               </select>
             </div>
           </div>
        </div>

        {/* Live Preview Format Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50">
           <div className="flex items-center justify-between mb-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.previewFormat}</h5>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <div className={`w-1.5 h-1.5 rounded-full ${platform === 'Telegram' ? 'bg-blue-400' : platform === 'Instagram' ? 'bg-pink-400' : 'bg-cyan-400'}`} />
                {platform}
              </div>
           </div>
           <div className="space-y-2 opacity-60 pointer-events-none">
              <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="pt-2 flex gap-2">
                 <div className="h-1.5 w-12 bg-purple-100 dark:bg-purple-900/30 rounded" />
                 <div className="h-1.5 w-16 bg-purple-100 dark:bg-purple-900/30 rounded" />
              </div>
           </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-4 bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-200 dark:shadow-none"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {t.generate}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {[
          { id: 'post', icon: FileText, label: t.modes.post },
          { id: 'image', icon: ImageIcon, label: t.modes.image },
          { id: 't2v', icon: Video, label: t.modes.t2v },
          { id: 'i2v', icon: Sparkles, label: t.modes.i2v },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as GenMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 justify-center ${
              mode === item.id 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-purple-600'
            }`}
          >
            <item.icon size={14} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {mode === 'post' ? renderPostGenerator() : (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
          {mode === 'i2v' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Source Image</label>
              
              {!filePreview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer py-10 px-6 bg-gray-50 dark:bg-slate-900 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                    uploadError ? 'border-rose-300 bg-rose-50 dark:bg-rose-900/10' : 'border-gray-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-purple-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Click or drag image to upload</p>
                  <p className="text-[10px] text-gray-400 font-medium">PNG, JPG, WEBP • Max 20MB</p>
                  
                  {uploadError && (
                    <div className="mt-4 px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center gap-2">
                      <AlertCircle size={12} className="text-rose-600" />
                      <span className="text-[10px] font-bold text-rose-600">{uploadError}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative p-3 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shrink-0">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold truncate">{selectedFile?.name}</h5>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {(selectedFile?.size || 0 / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={removeFile}
                      className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
              {mode === 'image' ? 'Image Prompt' : 'Video Prompt'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl text-xs border-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              placeholder="Describe the visuals..."
            />
          </div>

          {mode === 'image' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.negativePrompt}</label>
              <input 
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs border-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. blurry, low quality, watermarks..."
              />
            </div>
          )}

          {renderSharedControls()}

          <button 
            onClick={handleGenerate}
            disabled={loading || (mode === 'i2v' && !selectedFile) || !prompt}
            className="w-full py-4 bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-200 dark:shadow-none"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {t.generate}
          </button>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-6">
        <h3 className="font-bold text-sm px-1 flex items-center gap-2">
          {t.variants}
          {results.length > 0 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded-full text-[10px] text-gray-400">{results.length}</span>}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res) => (
            <div key={res.id} className="p-5 bg-white dark:bg-slate-800 rounded-[28px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group">
              <div className="flex justify-between items-center mb-4">
                {res.platform && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[9px] font-extrabold uppercase text-purple-600">
                    {res.platform === 'Telegram' ? <Send size={10}/> : res.platform === 'Instagram' ? <Instagram size={10}/> : <Smartphone size={10}/>}
                    {res.platform}
                  </div>
                )}
                {res.content && (
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{res.content.length} {t.charCount}</span>
                )}
              </div>

              {res.type === 'text' && (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                  {res.content}
                </p>
              )}

              {res.status !== 'done' ? (
                <div className="h-48 sm:h-64 bg-gray-50 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3">
                  {res.status === 'failed' ? (
                    <>
                      <AlertCircle className="text-rose-500" size={32} />
                      <p className="text-[10px] font-bold text-rose-500 uppercase">{t.status.failed}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold text-purple-600 uppercase animate-pulse">
                        {res.status === 'queued' ? t.status.queued : t.status.running}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {res.type === 'image' && (
                    <div className="relative overflow-hidden rounded-2xl mb-4 h-48 sm:h-64 bg-gray-100 dark:bg-slate-900">
                      <img src={res.url} alt="Generated" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button 
                          onClick={() => handleDownload(res.url!, res)}
                          className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl text-purple-600 shadow-lg"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  {res.type === 'video' && (
                    <div className="relative overflow-hidden rounded-2xl mb-4 h-48 sm:h-64 bg-black group">
                      <video 
                        src={res.url} 
                        className="w-full h-full object-contain" 
                        controls 
                        loop
                      />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => handleDownload(res.url!, res)}
                          className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl text-purple-600 shadow-lg"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2 border-t border-gray-50 dark:border-slate-700 pt-4 mt-auto">
                {res.type === 'text' ? (
                  <>
                    <button className="flex-1 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <Copy size={14} className="text-purple-600" /> {t.copy}
                    </button>
                    <button className="flex-1 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <FolderPlus size={14} className="text-purple-600" /> {t.save}
                    </button>
                    <button className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-purple-600">
                      <Calendar size={14} />
                    </button>
                  </>
                ) : res.status === 'done' ? (
                  <>
                    <button className="flex-1 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                      <FolderPlus size={14} className="text-purple-600" /> {t.save}
                    </button>
                    <button 
                       onClick={() => handleDownload(res.url!, res)}
                       className="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex-1 py-2.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Processing...
                  </div>
                )}
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 opacity-40">
              <Sparkles size={48} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-[4px]">Nothing generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;
