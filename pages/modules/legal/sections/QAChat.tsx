
import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { legalTranslations } from '../i18n';
import { Send, User, Bot, ShieldCheck, Info } from 'lucide-react';

const QAChat: React.FC = () => {
  const { language } = useApp();
  const t = legalTranslations[language].disclaimer;

  const messages = [
    { sender: 'bot', text: "Hello! I can provide general legal information based on standard practices. How can I help you today?", time: '2:30 PM' },
    { sender: 'user', text: "What is an NDA and why do I need one?", time: '2:31 PM' },
    { sender: 'bot', text: "A Non-Disclosure Agreement (NDA) is a legal contract that protects confidential information. It ensures that sensitive business details shared with another party are not leaked or misused.", time: '2:31 PM' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl flex flex-col gap-1 ${
              msg.sender === 'user' 
              ? 'bg-rose-600 text-white rounded-tr-none shadow-md shadow-rose-200 dark:shadow-none' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm'
            }`}>
              <p className="text-xs leading-relaxed">{msg.text}</p>
              <span className="text-[8px] opacity-60 self-end font-bold font-mono">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {['NDA', 'Liability', 'IP Rights', 'Termination'].map(tag => (
            <button key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-500">
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
          <input 
            type="text" 
            placeholder="Ask a legal info question..." 
            className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-2"
          />
          <button className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QAChat;
