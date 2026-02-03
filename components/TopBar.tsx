import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Share2, MoreVertical } from 'lucide-react';

interface TopBarProps {
  title: string;
  hideMenu?: boolean;
  rightSlot?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ title, hideMenu = false, rightSlot }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useApp();

  const handleShare = () => {
    const productId = searchParams.get('productId');
    const domain = window.location.origin;
    
    // Construct the URL to share
    // Use requested format for products, otherwise fallback to current full URL
    const shareUrl = productId 
      ? `${domain}/#/product/${productId}` 
      : window.location.href;

    const shareText = `Check this out on Kirato AI: ${title}`;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

    // 1. Attempt Telegram WebApp Native Share
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.ready) {
      try {
        tg.openTelegramLink(telegramShareUrl);
      } catch (err) {
        window.open(telegramShareUrl, "_blank");
      }
    } else {
      // 2. Standard Browser Fallback
      window.open(telegramShareUrl, "_blank");
    }

    // 3. Clipboard Fallback (Useful for desktop or restricted environments)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {
        // Ultimate fallback
        prompt("Copy link to share:", shareUrl);
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 md:mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 active:scale-90 transition-all border border-gray-100 dark:border-slate-800 hover:shadow-md shadow-sm shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft size={20} className="sm:size-6" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-none leading-none tracking-tight">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[2px]">Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {rightSlot}
        <button 
          onClick={handleShare}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
        >
          <Share2 size={16} /> Share
        </button>
        {!hideMenu && (
          <button className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-all shadow-sm active:scale-95">
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;