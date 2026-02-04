import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  Search, Plus, MoreVertical, X, Image as ImageIcon, 
  DollarSign, Package, Layout, RefreshCw, Trash2, 
  Link as LinkIcon, FileText, Tag, Video, Globe,
  ShieldCheck, AlertCircle, Check, Upload, Play
} from 'lucide-react';
import { Product, ProductStatus, ProductVisibility } from '../types';
import { db, storage } from '../../../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PRODUCT_CATEGORIES = [
  'clothing', 'shoes', 'bags', 'electronics', 'home', 'beauty', 'kids', 'sports', 'auto', 'books', 'food', 'other'
];

interface ProductsProps {
  isDemo?: boolean;
}

const Products: React.FC<ProductsProps> = ({ isDemo = false }) => {
  const { language, user } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations] || salesTranslations['EN'];
  const tp = t.products;
  const tn = t.newProduct;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!isDemo);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Media upload states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Product>>({
    title: '',
    price: 0,
    stock: 0,
    category: 'electronics',
    status: 'active',
    visibility: 'public',
    shortDescription: '',
    fullDescription: '',
    tags: [],
    images: [], // Existing URLs
    videoUrl: '' // Existing URL
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isDemo) {
      const saved = localStorage.getItem('kirato-sales-products-demo');
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        const initial = [
          { id: '1', title: 'Wireless Headphones', price: 59.99, stock: 12, category: 'electronics', status: 'active', visibility: 'public', images: ['🎧'], shortDescription: 'Premium sound quality.', createdAt: new Date().toISOString(), sellerId: 'demo' },
          { id: '2', title: 'Smart Watch X', price: 129.00, stock: 5, category: 'electronics', status: 'active', visibility: 'public', images: ['⌚'], shortDescription: 'Health tracking features.', createdAt: new Date().toISOString(), sellerId: 'demo' },
        ];
        setProducts(initial as any);
        localStorage.setItem('kirato-sales-products-demo', JSON.stringify(initial));
      }
      setLoading(false);
      return;
    }

    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, "products"), 
      where("sellerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Products error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isDemo]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 10) {
      setMediaError("Max 10 images allowed");
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
    setMediaError(null);
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (imageFiles.length === 0 && (!editingProduct || (editingProduct.images?.length || 0) === 0)) {
      setMediaError("At least 1 product image is required.");
      return;
    }

    setIsSubmitting(true);

    if (isDemo) {
      const newProd = { 
        ...form, 
        id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        sellerId: 'demo'
      } as Product;
      
      const updated = editingProduct 
        ? products.map(p => p.id === editingProduct.id ? newProd : p)
        : [newProd, ...products];
      
      setProducts(updated);
      localStorage.setItem('kirato-sales-products-demo', JSON.stringify(updated));
      setIsModalOpen(false);
      setIsSubmitting(false);
      return;
    }

    try {
      let productId = editingProduct?.id;
      
      // Step 1: Create or Update Doc Shell
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          ...form,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, "products"), {
          ...form,
          sellerId: user?.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        productId = docRef.id;
      }

      if (!productId) throw new Error("No product ID");

      // Step 2: Handle Media Uploads
      const imageUrls = [...(form.images || [])];
      
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imgRef = ref(storage, `products/${user?.uid}/${productId}/images/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(imgRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        }
      }

      let finalVideoUrl = form.videoUrl || '';
      if (videoFile) {
        const vidRef = ref(storage, `products/${user?.uid}/${productId}/video/${Date.now()}_${videoFile.name}`);
        const snapshot = await uploadBytes(vidRef, videoFile);
        finalVideoUrl = await getDownloadURL(snapshot.ref);
      }

      // Step 3: Update Doc with Final URLs
      await updateDoc(doc(db, "products", productId), {
        images: imageUrls,
        videoUrl: finalVideoUrl,
        updatedAt: serverTimestamp()
      });

      setIsModalOpen(false);
      // Reset local file states
      setImageFiles([]);
      setVideoFile(null);
    } catch (err) {
      console.error("Save failed", err);
      setMediaError("Upload failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    if (isDemo) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('kirato-sales-products-demo', JSON.stringify(updated));
      return;
    }
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCopyLink = (p: Product) => {
    const link = `${window.location.origin}/#/modules/sales/shop/${user?.uid || 'demo'}?productId=${p.id}`;
    navigator.clipboard.writeText(link);
    alert(t.publicShop.success.linkCopied);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setForm(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (idx: number) => {
    setForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">{tp.inventory}</h3>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setForm({ title: '', price: 0, stock: 0, category: 'electronics', status: 'active', visibility: 'public', images: [], shortDescription: '', fullDescription: '', tags: [], videoUrl: '' }); 
            setImageFiles([]);
            setVideoFile(null);
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-xl shadow-lg active:scale-95 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <Plus size={18} /> {tn.title}
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 h-12 px-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={tp.search} 
            className="bg-transparent border-none text-xs font-bold focus:ring-0 w-full" 
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {['all', 'active', 'draft', 'outOfStock', 'archived'].map(s => (
          <button 
            key={s}
            onClick={() => setFilterStatus(s as any)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
              filterStatus === s 
                ? 'bg-rose-600 border-rose-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-gray-400 border-gray-100 dark:border-slate-700'
            }`}
          >
            {(tp as any)[s] || s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <RefreshCw className="animate-spin text-rose-500 mb-4" size={32} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 opacity-40">
          <Layout size={48} className="mx-auto mb-2" />
          <p className="text-xs font-bold uppercase">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map(p => (
            <div key={p.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-3xl overflow-hidden border border-gray-100 dark:border-slate-800">
                    {p.images[0]?.length < 100 ? p.images[0] : <img src={p.images[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setEditingProduct(p); setForm(p); setImageFiles([]); setVideoFile(null); setIsModalOpen(true); }} 
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <RefreshCw size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
               </div>
               
               <div className="mb-4">
                 <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{p.title}</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase">{(tp.categories as any)[p.category] || p.category}</p>
               </div>

               <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-rose-600 tracking-tight">${p.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">{p.stock} in stock</span>
                  </div>
               </div>

               <div className="pt-4 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest ${
                    p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                    p.status === 'out_of_stock' ? 'bg-amber-50 text-amber-600' : 
                    p.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {(tp as any)[p.status] || p.status.replace('_', ' ')}
                  </span>
                  <button onClick={() => handleCopyLink(p)} className="flex items-center gap-1 text-[9px] font-bold uppercase text-blue-600">
                    <LinkIcon size={12}/> {tp.productLink}
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPREHENSIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8 border-b border-gray-50 dark:border-slate-800 pb-4">
               <h4 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">{editingProduct ? tp.edit : tn.title}</h4>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-600 transition-colors"><X size={24}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-10">
               {/* BASIC INFO */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 px-1 text-gray-400">
                    <FileText size={16} />
                    <h5 className="text-[10px] font-black uppercase tracking-[2px]">{tn.basicInfo}</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.nameLabel} *</label>
                      <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder={tn.namePlaceholder} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.catLabel}</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-bold text-xs">
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{(tp.categories as any)[c] || c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.shortDescLabel}</label>
                    <textarea value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} placeholder={tn.shortDescPlaceholder} className="w-full h-16 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.fullDescLabel}</label>
                    <textarea value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} placeholder={tn.fullDescPlaceholder} className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.tagsLabel}</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={tagInput}
                         onChange={e => setTagInput(e.target.value)}
                         placeholder={tn.tagsPlaceholder} 
                         className="flex-1 h-10 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-xs font-bold" 
                       />
                       <button type="button" onClick={handleAddTag} className="px-4 bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase">{tn.tagsAdd}</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.tags?.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[9px] font-bold flex items-center gap-1 uppercase">
                          {tag} <button type="button" onClick={() => removeTag(idx)}><X size={10}/></button>
                        </span>
                      ))}
                    </div>
                  </div>
               </div>

               {/* PRICING & STOCK */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 px-1 text-gray-400">
                    <DollarSign size={16} />
                    <h5 className="text-[10px] font-black uppercase tracking-[2px]">{tn.pricing}</h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.priceLabel} ($) *</label>
                      <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-black text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.discountLabel}</label>
                      <input type="number" value={form.discount} onChange={e => setForm({...form, discount: parseInt(e.target.value)})} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-black text-xs" />
                    </div>
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">In Stock *</label>
                      <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} className="w-full h-12 px-4 bg-gray-50 dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-black text-xs" />
                    </div>
                  </div>
               </div>

               {/* MEDIA - UPDATED */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 px-1 text-gray-400">
                    <ImageIcon size={16} />
                    <h5 className="text-[10px] font-black uppercase tracking-[2px]">{tn.media}</h5>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">Product Images (Up to 10) *</label>
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-slate-900/50 hover:border-rose-500/50 transition-all cursor-pointer"
                    >
                       <input 
                         type="file" 
                         ref={imageInputRef} 
                         onChange={handleImageSelect} 
                         multiple 
                         accept="image/*" 
                         className="hidden" 
                       />
                       <Upload size={24} className="text-gray-300" />
                       <span className="text-[10px] font-black text-gray-400 uppercase">{tn.upload}</span>
                    </div>

                    {/* Previews */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                       {/* Existing Images (for editing) */}
                       {(form.images || []).map((url, idx) => (
                         <div key={`existing-${idx}`} className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 flex-shrink-0 relative overflow-hidden">
                            <img src={url} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeExistingImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg"
                            >
                              <X size={10} />
                            </button>
                         </div>
                       ))}
                       {/* New Selected Files */}
                       {imageFiles.map((file, idx) => {
                         const url = URL.createObjectURL(file);
                         return (
                           <div key={`new-${idx}`} className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl border border-rose-500 flex-shrink-0 relative overflow-hidden">
                              <img src={url} className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeImageFile(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg"
                              >
                                <X size={10} />
                              </button>
                           </div>
                         );
                       })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">Product Video</label>
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="h-20 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center gap-4 px-6 bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                       <input 
                         type="file" 
                         ref={videoInputRef} 
                         onChange={handleVideoSelect} 
                         accept="video/mp4,video/mov,video/webm" 
                         className="hidden" 
                       />
                       <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                          <Video size={20} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">
                           {videoFile ? videoFile.name : form.videoUrl ? "Existing Video Attached" : "Select Video File"}
                         </p>
                         <p className="text-[8px] font-bold text-gray-400 uppercase">MP4, MOV, WEBM</p>
                       </div>
                       {(videoFile || form.videoUrl) && (
                         <button 
                           type="button" 
                           onClick={(e) => { e.stopPropagation(); setVideoFile(null); setForm({...form, videoUrl: ''}); }}
                           className="p-2 text-rose-500"
                         >
                           <Trash2 size={16}/>
                         </button>
                       )}
                    </div>
                  </div>

                  {mediaError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600">
                       <AlertCircle size={14} />
                       <span className="text-[10px] font-bold uppercase">{mediaError}</span>
                    </div>
                  )}
               </div>

               {/* STATUS & VISIBILITY */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 px-1 text-gray-400">
                    <ShieldCheck size={16} />
                    <h5 className="text-[10px] font-black uppercase tracking-[2px]">{tn.statusMod}</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.statusLabel}</label>
                       <div className="flex p-1 bg-gray-50 dark:bg-slate-950 rounded-xl">
                          {['active', 'draft', 'out_of_stock', 'archived'].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setForm({...form, status: s as any})}
                              className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${form.status === s ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-gray-400'}`}
                            >
                              {(tp as any)[s] || s.replace('_', ' ')}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase ml-1 tracking-widest">{tn.visibilitySettings}</label>
                       <div className="flex p-1 bg-gray-50 dark:bg-slate-950 rounded-xl">
                          {['public', 'private', 'unlisted'].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setForm({...form, visibility: v as any})}
                              className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${form.visibility === v ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                            >
                              {(tp as any)[v] || v}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>

               <div className="flex gap-4 pt-8 border-t border-gray-50 dark:border-slate-800">
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  >
                    {tn.cancel}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : editingProduct ? tp.edit : tn.create}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;