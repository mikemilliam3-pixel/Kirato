
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { freelancerTranslations } from '../i18n';
import { Plus, Image as ImageIcon, ExternalLink, Hash, Star } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { language } = useApp();
  const tc = freelancerTranslations[language].common;

  const items = [
    { id: '1', title: 'Fintech Dashboard', tags: ['React', 'D3.js'], type: 'UI/UX' },
    { id: '2', title: 'E-commerce App', tags: ['Next.js', 'Stripe'], type: 'Fullstack' },
    { id: '3', title: 'Crypto Wallet', tags: ['Blockchain', 'Security'], type: 'Web3' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-lg">Projects</h3>
        <button className="p-3 bg-emerald-600 text-white rounded-2xl active:scale-90 transition-all shadow-lg">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="h-40 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
              <ImageIcon size={40} className="text-slate-300" />
              <div className="absolute top-3 right-3">
                <button className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg text-slate-500">
                  <ExternalLink size={16} />
                </button>
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded shadow-sm">
                {item.type}
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-sm mb-3">{item.title}</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-slate-900 rounded-lg text-[9px] font-bold text-gray-500 uppercase flex items-center gap-0.5">
                    <Hash size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
