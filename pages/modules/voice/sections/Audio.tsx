
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { voiceTranslations } from '../i18n';
import { Music, Play, Pause, Search, Filter, Plus, Disc, MoreVertical, Clock } from 'lucide-react';

const Audio: React.FC = () => {
  const { language } = useApp();
  const [playing, setPlaying] = useState<string | null>(null);

  const assets = [
    { id: '1', title: 'Sarah - Intro Take 3', type: 'recording', duration: '0:12', size: '2.4MB' },
    { id: '2', title: 'Corporate Upbeat Bed', type: 'music', duration: '2:30', size: '15MB' },
    { id: '3', title: 'Impact Swoosh SFX', type: 'sfx', duration: '0:02', size: '0.5MB' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search assets..." className="bg-transparent border-none text-xs focus:ring-0 w-full" />
        </div>
        <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-slate-400">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPlaying(playing === asset.id ? null : asset.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  playing === asset.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                }`}
              >
                {playing === asset.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <div className="flex-1">
                <h4 className="text-sm font-bold truncate pr-4">{asset.title}</h4>
                <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Disc size={10} /> {asset.type}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {asset.duration}</span>
                </div>
              </div>
              <button className="text-slate-300"><MoreVertical size={18} /></button>
            </div>
            
            {playing === asset.id && (
              <div className="px-2 pb-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="h-8 bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-between px-3 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-orange-300 rounded-full animate-pulse" 
                      style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.05}s` }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl text-gray-400 font-bold flex items-center justify-center gap-2">
        <Plus size={20} /> Add Asset
      </button>
    </div>
  );
};

export default Audio;
