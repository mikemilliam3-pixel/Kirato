import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, X, MessageSquare, Bot, User, Check, Clock } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ProductChatProps {
  sellerId: string;
  sellerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductChat: React.FC<ProductChatProps> = ({ sellerId, sellerName, isOpen, onClose }) => {
  const { user } = useApp();
  const buyerId = user?.uid || 'guest';
  const convId = `seller:${sellerId}|buyer:${buyerId}`;
  const storageKey = `kirato_chat_${convId}`;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Load messages & Setup Sync
  useEffect(() => {
    const loadMessages = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved));
    };

    loadMessages();

    // Setup BroadcastChannel for cross-tab sync
    broadcastRef.current = new BroadcastChannel('kirato-product-chat');
    broadcastRef.current.onmessage = (event) => {
      if (event.data.convId === convId) {
        loadMessages();
      }
    };

    // Also listen to storage events (fallback for some browsers)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) loadMessages();
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      broadcastRef.current?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [convId, storageKey]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: buyerId,
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    
    // Notify other tabs
    broadcastRef.current?.postMessage({ convId, type: 'NEW_MESSAGE' });
    
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] h-[80vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600">
              <User size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight">{sellerName}</h4>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-xl hover:text-rose-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-gray-50/50 dark:bg-slate-950/30"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
              <MessageSquare size={48} className="mb-4 text-rose-500" />
              <p className="text-xs font-black uppercase tracking-[2px]">No messages yet</p>
              <p className="text-[10px] font-bold mt-2">Start the conversation about this product!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === buyerId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl flex flex-col gap-1 shadow-sm ${
                    isMe 
                      ? 'bg-rose-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-slate-700'
                  }`}>
                    <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 opacity-60">
                      <span className="text-[8px] font-black uppercase">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <Check size={10} />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="bg-gray-50 dark:bg-slate-800 p-2 rounded-2xl flex items-center gap-2 border border-gray-100 dark:border-slate-700">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 px-2"
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-rose-600 disabled:opacity-30 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductChat;