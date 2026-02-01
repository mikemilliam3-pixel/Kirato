
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { healthTranslations } from '../i18n';
import { Send, User, Bot, AlertCircle } from 'lucide-react';

const QAChat: React.FC = () => {
  const { language } = useApp();
  const t = healthTranslations[language].disclaimer;

  const messages = [
    { sender: 'bot', text: "Hello! I'm your health assistant. How can I help you today with general wellness tips?", time: '10:00 AM' },
    { sender: 'user', text: "What are some good tips for better sleep?", time: '10:01 AM' },
    { sender: 'bot', text: "For better sleep, try maintaining a consistent schedule, avoiding screens 1 hour before bed, and keeping your room cool and dark.", time: '10:01 AM' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex flex-col gap-1 ${
              msg.sender === 'user' 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm'
            }`}>
              <p className="text-xs leading-relaxed">{msg.text}</p>
              <span className="text-[8px] opacity-60 self-end font-bold">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {['Sleep', 'Stress', 'Hydration', 'Exercise'].map(tag => (
            <button key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-500">
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800">
          <input 
            type="text" 
            placeholder="Ask a wellness question..." 
            className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-2"
          />
          <button className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QAChat;
