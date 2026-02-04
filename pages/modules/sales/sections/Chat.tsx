import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { salesTranslations } from '../i18n';
import { 
  MessageSquare, Send, User, Bot, Sparkles, Phone, 
  MoreHorizontal, Circle, ArrowLeft, Zap, HandMetal,
  Settings2, Power, BrainCircuit, RefreshCw
} from 'lucide-react';
import { chatService } from '../chatService';
import { Conversation, Message } from '../types';

const Chat: React.FC = () => {
  const { language } = useApp();
  const t = salesTranslations[language as keyof typeof salesTranslations]?.chat || salesTranslations['EN'].chat;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversations(chatService.getConversations());
    
    chatService.onMessage((data) => {
      if (data.type === 'NEW_MESSAGE' || data.type === 'NEW_CONVERSATION' || data.type === 'CONVERSATION_UPDATED') {
        setConversations(chatService.getConversations());
        if (activeConv && data.payload.conversationId === activeConv.id) {
          setMessages(chatService.getMessages(activeConv.id));
        }
      }
    });
  }, [activeConv]);

  useEffect(() => {
    if (activeConv) {
      setMessages(chatService.getMessages(activeConv.id));
      // Mark as online and take over
      chatService.updateConversation(activeConv.id, { 
        sellerPresence: 'online', 
        handoffMode: 'seller',
        unreadCount: 0 
      });
      
      // Heartbeat to keep online status (simplified)
      const timer = setInterval(() => {
        chatService.updateConversation(activeConv.id, { sellerPresence: 'online' });
      }, 30000);
      return () => {
        clearInterval(timer);
        chatService.updateConversation(activeConv.id, { sellerPresence: 'offline' });
      };
    }
  }, [activeConv?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId: activeConv.id,
      sender: 'seller',
      text: inputText,
      createdAt: new Date().toISOString(),
      delivery: 'sent'
    };
    
    chatService.saveMessage(msg);
    setMessages(prev => [...prev, msg]);
    setInputText('');
  };

  const suggestReply = async () => {
    if (!activeConv) return;
    setIsSuggesting(true);
    try {
      const suggestion = await chatService.getAiSuggestion(activeConv.id);
      setInputText(suggestion);
    } finally {
      setIsSuggesting(false);
    }
  };

  const returnToAi = () => {
    if (!activeConv) return;
    chatService.updateConversation(activeConv.id, { handoffMode: 'ai' });
    setActiveConv(null);
  };

  if (activeConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-220px)] sm:h-[calc(100vh-280px)] animate-in slide-in-from-right duration-300">
        {/* Active Chat Header */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveConv(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl focus:outline-none focus:ring-0">
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-black text-blue-600">
              {activeConv.buyerDisplayName?.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-black truncate max-w-[120px]">{activeConv.buyerDisplayName}</h4>
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${activeConv.handoffMode === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {activeConv.handoffMode === 'ai' ? t.aiMode : t.sellerMode}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={returnToAi}
               className="p-2.5 bg-gray-50 dark:bg-slate-900 text-slate-500 rounded-xl hover:text-purple-600 transition-colors focus:outline-none focus:ring-0"
               title={t.returnToAi}
             >
               <BrainCircuit size={20} />
             </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-4 px-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl flex flex-col gap-1 shadow-sm ${
                msg.sender === 'buyer'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                  : msg.sender === 'ai'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-rose-600 text-white rounded-tr-none'
              }`}>
                <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
                <div className="flex items-center justify-between gap-4 mt-1 opacity-60">
                   {msg.sender === 'ai' && <span className="text-[7px] font-black uppercase tracking-widest flex items-center gap-1"><Sparkles size={8}/> AI Answer</span>}
                   <span className="text-[8px] font-black ml-auto">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button 
              onClick={suggestReply}
              disabled={isSuggesting}
              className="flex-1 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 focus:outline-none focus:ring-0"
            >
              {isSuggesting ? <RefreshCw size={14} className="animate-spin"/> : <Sparkles size={14}/>}
              {t.suggestReply}
            </button>
            <button className="h-10 px-4 bg-gray-50 dark:bg-slate-800 text-slate-400 rounded-xl transition-all focus:outline-none focus:ring-0">
              <Phone size={16} />
            </button>
          </div>
          <div className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder={t.type} 
              className="flex-1 bg-transparent border-none text-xs focus:ring-0 focus:outline-none px-2 font-bold" 
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0 focus:outline-none focus:ring-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      {/* Search & Stats */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">{t.title}</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{conversations.length} Active</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-900/30">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest">{t.online}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
             <MessageSquare size={48} className="mb-4" />
             <p className="text-xs font-black uppercase tracking-widest">{t.noConversations}</p>
          </div>
        ) : (
          conversations.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveConv(chat)}
              className="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 flex items-center gap-4 relative active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-slate-400 shrink-0">
                 {chat.buyerDisplayName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-black truncate tracking-tight">{chat.buyerDisplayName}</h4>
                    <span className="text-[8px] text-gray-400 font-black uppercase">{new Date(chat.lastMessageAt).toLocaleDateString()}</span>
                 </div>
                 <p className="text-xs text-gray-500 truncate font-medium">{chat.lastMessageText || '...'}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-rose-200 dark:shadow-none">
                  {chat.unreadCount}
                </div>
              )}
              {chat.handoffMode === 'ai' && (
                <div className="absolute top-2 right-2 text-purple-400">
                  <Sparkles size={12} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chat;