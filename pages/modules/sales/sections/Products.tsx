
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  Search, Plus, MoreVertical, X, Image as ImageIcon, 
  Video, DollarSign, Info, Tag, Check, Layout, Sparkles, Eye, EyeOff, Globe,
  Upload, Trash2, RefreshCw, Copy, Share2, Link as LinkIcon
} from 'lucide-react';
import { Product, ProductStatus, ProductVisibility, IntegrationConfig } from '../types';

const PRODUCT_CATEGORIES = [
  'clothing', 'shoes', 'bags', 'electronics', 'home', 
  'beauty', 'kids', 'sports', 'auto', 'books', 'food', 'other'
];

const DEFAULT_PLATFORM_BOT = "kirato_market_bot";

const Products: React.FC = () => {
  const { language } = useApp();
  const moduleT = useMemo(() => salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'], [language]);
  const t = moduleT.products;
  const tForm = moduleT.newProduct;

  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Bot Context ---
  const botUsername = useMemo(() => {
    const saved = localStorage.getItem('kirato-sales-integrations');
    if (saved) {
      const integrations = JSON.parse(saved);
      if (integrations.tg?.connected && integrations.tg.botMode === 'own') {
        return integrations.tg.botUsername || DEFAULT_PLATFORM_BOT;
      }
    }
    return DEFAULT_PLATFORM_BOT;
  }, []);

  const generateDeepLink = (productId: string) => {
    const shopId = "seller_kirato";
    return `https://t.me/${botUsername}?startapp=shop_${shopId}_p_${productId}`;
  };

  const initialProductState: Partial<Product> = {
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'clothing',
    tags: [],
    price: 0,
    discount: 0,
    currency: 'USD',
    stock: 100,
    status: 'draft',
    visibility: 'public',
    approvalRequired: false,
    trialAvailable: false,
    trialDays: 7,
  };

  const [form, setForm] = useState<Partial<Product>>(initialProductState);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kirato-sales-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts([
        { 
          id: '1', 
          title: 'Wireless Headphones', 
          shortDescription: 'High quality sound',
          fullDescription: '# Best Headphones\n- Great Bass\n- Long Battery',
          category: 'electronics', 
          tags: ['audio', 'tech'],
          price: 59.99, 
          currency: 'USD',
          stock: 12, 
          status: 'active', 
          visibility: 'public',
          approvalRequired: false,
          trialAvailable: false,
          images: ['🎧'],
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sampleOutputFile, setSampleOutputFile] = useState<File | null>(null);

  const coverPreview = useMemo(() => coverFile ? URL.createObjectURL(coverFile) : null, [coverFile]);
  const galleryPreviews = useMemo(() => galleryFiles.map(f => URL.createObjectURL(f)), [galleryFiles]);
  const videoPreview = useMemo(() => videoFile ? URL.createObjectURL(videoFile) : null, [videoFile]);
  const sampleOutputPreview = useMemo(() => sampleOutputFile ? URL.createObjectURL(sampleOutputFile) : null, [sampleOutputFile]);

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title) newErrors.title = tForm.errors.name;
    if (!form.category) newErrors.category = tForm.errors.category;
    if (form.price === undefined || form.price < 0) newErrors.price = tForm.errors.price;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const finalStatus: ProductStatus = form.approvalRequired ? 'pending' : (form.status || 'draft');
    const newProduct: Product = {
      ...form as Product,
      id: Math.random().toString(36).substr(2, 9),
      status: finalStatus,
      createdAt: new Date().toISOString(),
      images: coverPreview ? [coverPreview, ...galleryPreviews] : ['📦']
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('kirato-sales-products', JSON.stringify(updated));
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setForm(initialProductState);
    setCoverFile(null);
    setGalleryFiles([]);
    setVideoFile(null);
    setSampleOutputFile(null);
    setErrors({});
  };

  const copyLink = (productId: string) => {
    const link = generateDeepLink(productId);
    navigator.clipboard.writeText(link);
    setSuccessMsg(moduleT.publicShop.success.linkCopied);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const addTag = () => {
    if (tagInput && !form.tags?.includes(tagInput)) {
      setForm({ ...form, tags: [...(form.tags || []), tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags?.filter(t => t !== tag) });
  };

  const filtered = products.filter(p => filter === 'all' || p.status === filter);

  const getStatusBadge = (status: ProductStatus) => {
    switch(status) {
      case 'active': return { label: t.published, color: 'bg-emerald-50 text-emerald-600' };
      case 'pending': return { label: t.pending, color: 'bg-blue-50 text-blue-600' };
      case 'draft': return { label: t.draft, color: 'bg-gray-100 text-gray-500' };
      case 'archived': return { label: t.archived, color: 'bg-rose-50 text-rose-600' };
      case 'out_of_stock': return { label: t.outOfStock, color: 'bg-amber-50 text-amber-600' };
      default: return { label: status as string, color: 'bg-gray-50 text-gray-400' };
    }
  };

  const filterStates: { id: string; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'active', label: t.active },
    { id: 'pending', label: t.pending },
    { id: 'draft', label: t.draft },
    { id: 'archived', label: t.archived },
    { id: 'out_of_stock', label: t.outOfStock }
  ];

  const FileInput = ({ 
    label, 
    accept = "image/*", 
    onChange, 
    preview, 
    icon: Icon = ImageIcon,
    multiple = false,
    onRemove
  }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group min-h-[140px] flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-rose-500/50 transition-all overflow-hidden">
        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            {accept.includes("video") ? (
              <video src={preview} className="w-full h-full object-cover" />
            ) : (
              <img src={preview} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button 
                 onClick={onRemove}
                 className="p-2 bg-white text-rose-600 rounded-xl shadow-lg active:scale-90 transition-transform"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2 p-6 w-full h-full">
            <Upload className="text-gray-300 group-hover:text-rose-500 transition-colors" size={32} />
            <span className="text-[10px] font-black uppercase text-gray-400">{tForm.upload}</span>
            <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={onChange} />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {successMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <Check size={18} /> {successMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-black text-xl md:text-2xl tracking-tight">{t.inventory}</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 h-12 bg-rose-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-rose-700 w-full sm:w-auto"
        >
          <Plus size={18} /> {t.add}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 h-14 px-5 rounded-[20px] border border-gray-100 dark:border-slate-700 shadow-sm transition-all focus-within:ring-2 focus-within:ring-rose-500/20">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder={t.search} className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
          {filterStates.map((s) => (
            <button 
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-5 h-14 rounded-[20px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border shrink-0 ${
                filter === s.id 
                  ? 'bg-rose-600 border-rose-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-gray-100 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product) => {
          const badge = getStatusBadge(product.status);
          const categories = t.categories as Record<string, string>;
          const translatedCategory = categories[product.category] || categories.other || product.category;
          
          return (
            <div key={product.id} className="p-5 md:p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-4 hover:shadow-xl transition-all group">
              <div className="w-full aspect-square bg-gray-50 dark:bg-slate-900 rounded-[24px] flex items-center justify-center text-5xl md:text-6xl shadow-inner group-hover:scale-105 transition-transform duration-500 relative">
                {product.images[0]?.length < 100 ? product.images[0] : <img src={product.images[0]} className="w-full h-full object-cover rounded-[24px]" alt={product.title} />}
                <span className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-sm sm:text-base md:text-lg truncate tracking-tight">{product.title}</h4>
                  <button className="text-gray-300 hover:text-rose-600 transition-colors shrink-0 ml-2">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-widest">{translatedCategory as React.ReactNode}</p>
              </div>

              {/* Product Deep Link Section */}
              <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-1.5">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.productLink}</span>
                   <button onClick={() => copyLink(product.id)} className="text-rose-600 hover:text-rose-500 transition-colors"><Copy size={12}/></button>
                 </div>
                 <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate">{generateDeepLink(product.id)}</p>
              </div>

              <div className="flex items-center justify-between pt-2 mt-auto">
                <span className="text-base sm:text-lg font-black text-rose-600 tracking-tight">${product.price}</span>
                <div className="flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full ${product.visibility === 'public' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                   <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
                     {((t as any)[product.visibility] || product.visibility) as React.ReactNode}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Modal Form - Kept as is --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[40px] p-0 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <h4 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center">
                  <Plus size={24} />
                </div>
                {tForm.title}
              </h4>
              <button onClick={resetForm} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-slate-600 transition-colors"><X size={28}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-12">
              <section className="space-y-6">
                <h5 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">{tForm.basicInfo}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.nameLabel}</label>
                    <input 
                      type="text" 
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className={`w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-sm ${errors.title ? 'ring-2 ring-rose-500' : ''}`} 
                      placeholder={tForm.namePlaceholder}
                    />
                    {errors.title && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.catLabel}</label>
                    <select 
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-sm"
                    >
                      {PRODUCT_CATEGORIES.map(catKey => (
                        <option key={catKey} value={catKey}>
                          {((t.categories as any)[catKey] || catKey) as React.ReactNode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.shortDescLabel}</label>
                  <textarea 
                    value={form.shortDescription}
                    onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full h-20 p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 text-sm font-medium leading-relaxed"
                    placeholder={tForm.shortDescPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.fullDescLabel}</label>
                  <textarea 
                    value={form.fullDescription}
                    onChange={e => setForm({ ...form, fullDescription: e.target.value })}
                    className="w-full h-48 p-5 bg-gray-50 dark:bg-slate-800 rounded-3xl border-none focus:ring-2 focus:ring-rose-500 text-sm font-medium leading-relaxed"
                    placeholder={tForm.fullDescPlaceholder}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.tagsLabel}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        {tag} <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addTag()}
                      className="flex-1 h-12 px-5 bg-gray-50 dark:bg-slate-800 rounded-xl border-none text-xs font-bold" 
                      placeholder={tForm.tagsPlaceholder}
                    />
                    <button onClick={addTag} className="px-4 bg-gray-100 dark:bg-slate-700 rounded-xl font-black text-[10px] uppercase">{tForm.tagsAdd}</button>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">{tForm.media}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FileInput 
                    label={tForm.coverLabel}
                    preview={coverPreview}
                    onChange={(e: any) => setCoverFile(e.target.files[0])}
                    onRemove={() => setCoverFile(null)}
                  />
                  <FileInput 
                    label={tForm.videoLabel}
                    accept="video/mp4,video/webm"
                    preview={videoPreview}
                    onChange={(e: any) => setVideoFile(e.target.files[0])}
                    onRemove={() => setVideoFile(null)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.galleryLabel}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryPreviews.map((p, i) => (
                      <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 group">
                        <img src={p} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        <button 
                          onClick={() => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-rose-500/50 transition-all">
                      <Plus className="text-gray-300" />
                      <span className="text-[8px] font-black uppercase text-gray-400 mt-1">{tForm.addMore}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={(e: any) => setGalleryFiles(prev => [...prev, ...Array.from(e.target.files as FileList)])} 
                      />
                    </label>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">{tForm.pricing}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.priceLabel}</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-4 text-gray-400" size={18} />
                       <input 
                        type="number" 
                        value={form.price}
                        onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                        className={`w-full h-12 pl-12 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs ${errors.price ? 'ring-2 ring-rose-500' : ''}`} 
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.discountLabel}</label>
                    <input 
                      type="number" 
                      value={form.discount}
                      onChange={e => setForm({ ...form, discount: parseFloat(e.target.value) })}
                      className="w-full h-12 px-5 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" 
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.currencyLabel}</label>
                    <select 
                      value={form.currency}
                      onChange={e => setForm({ ...form, currency: e.target.value })}
                      className="w-full h-12 px-5 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="UZS">UZS (so'm)</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800 rounded-[24px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                      <Layout size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black">{tForm.trialToggle}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{tForm.trialDesc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setForm({ ...form, trialAvailable: !form.trialAvailable })}
                    className={`w-14 h-7 rounded-full p-1 transition-all ${form.trialAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${form.trialAvailable ? 'translate-x-7' : ''}`} />
                  </button>
                </div>
              </section>

              <section className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h5 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">{tForm.statusMod}</h5>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{tForm.statusLabel}</label>
                          <select 
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value as any })}
                            className="w-full h-14 px-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-sm"
                          >
                            <option value="draft">{t.draft}</option>
                            <option value="active">{t.published}</option>
                            <option value="archived">{t.archived}</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                           <div className="flex items-center gap-3">
                              <Info size={16} className="text-rose-500" />
                              <span className="text-xs font-bold">{tForm.approvalLabel}</span>
                           </div>
                           <button 
                            onClick={() => setForm({ ...form, approvalRequired: !form.approvalRequired })}
                            className={`w-12 h-6 rounded-full p-1 transition-all ${form.approvalRequired ? 'bg-rose-500' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.approvalRequired ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h5 className="text-xs font-black uppercase tracking-[3px] text-gray-400 border-l-4 border-rose-600 pl-3">{tForm.visibilitySettings}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'public', icon: Globe, label: t.public },
                          { id: 'private', icon: EyeOff, label: t.private },
                          { id: 'unlisted', icon: Eye, label: t.unlisted }
                        ].map(v => (
                          <button 
                            key={v.id}
                            onClick={() => setForm({ ...form, visibility: v.id as any })}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[24px] border-2 transition-all ${
                              form.visibility === v.id 
                                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-600 text-rose-600 shadow-sm' 
                                : 'bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-800 text-gray-400'
                            }`}
                          >
                            <v.icon size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
              </section>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-slate-800 bg-gray-100/50 dark:bg-slate-900/50 flex gap-4 shrink-0">
               <button 
                onClick={resetForm}
                className="flex-1 h-14 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-500 rounded-2xl text-sm font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {tForm.cancel}
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] h-14 bg-rose-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all hover:bg-rose-700 flex items-center justify-center gap-2"
              >
                <Check size={20} /> {tForm.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
