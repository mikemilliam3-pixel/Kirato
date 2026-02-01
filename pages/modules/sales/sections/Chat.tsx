
import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { MessageSquare, Send, User, Bot, Sparkles, Phone, MoreHorizontal, Circle } from 'lucide-react';

const Chat: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language].chat;
  const [aiEnabled, setAiEnabled] = useState(true);

  const chats = [
    { id: '1', name: 'Botir E.', last: 'Is the watch still in stock?', unread: 2, time: '2m' },
    { id: '2', name: 'Sitora K.', last: 'Thank you for the fast delivery!', unread: 0, time: '1h' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      {/* AI Toggle Header */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${aiEnabled ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'}`}>
            <Sparkles size={20} fill={aiEnabled ? 'currentColor' : 'none'} />
          </div>
          <div>
            <h4 className="text-sm font-bold">{t.aiAssistant}</h4>
            <p className="text-[10px] text-gray-500 font-medium">{t.aiDesc}</p>
          </div>
        </div>
        <button 
          onClick={() => setAiEnabled(!aiEnabled)}
          className={`w-12 h-6 rounded-full p-1 transition-all ${aiEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${aiEnabled ? 'translate-x-6' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Active Conversations</h3>
        {chats.map((chat) => (
          <div key={chat.id} className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 relative active:scale-95 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-400">
               {chat.name.charAt(0)}
               <div className="absolute bottom-4 left-12 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-sm font-bold truncate">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
               </div>
               <p className="text-xs text-gray-500 truncate">{chat.last}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-2">
         <input type="text" placeholder={t.type} className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-2" />
         <button className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all">
           <Send size={18} />
         </button>
      </div>
    </div>
  );
};

export default Chat;
