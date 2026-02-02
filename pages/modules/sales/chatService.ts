
import { Conversation, Message, MessageSender, HandoffMode, SellerPresence } from './types';

const STORAGE_CONVERSATIONS = 'kirato-sales-conversations';
const STORAGE_MESSAGES = 'kirato-sales-messages';
const CHANNEL_NAME = 'kirato-sales-chat-broadcast';

class ChatService {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
  }

  onMessage(callback: (data: { type: string; payload: any }) => void) {
    this.channel.onmessage = (event) => callback(event.data);
  }

  getConversations(): Conversation[] {
    const data = localStorage.getItem(STORAGE_CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  }

  getMessages(conversationId: string): Message[] {
    const data = localStorage.getItem(STORAGE_MESSAGES);
    const allMessages: Message[] = data ? JSON.parse(data) : [];
    return allMessages.filter(m => m.conversationId === conversationId);
  }

  getConversation(id: string): Conversation | undefined {
    return this.getConversations().find(c => c.id === id);
  }

  saveMessage(message: Message) {
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_MESSAGES) || '[]');
    allMessages.push(message);
    localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(allMessages));

    // Update conversation metadata
    const conversations = this.getConversations();
    const updated = conversations.map(c => {
      if (c.id === message.conversationId) {
        return {
          ...c,
          lastMessageAt: message.createdAt,
          lastMessageText: message.text,
          unreadCount: message.sender === 'buyer' ? c.unreadCount + 1 : 0
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify(updated));

    this.channel.postMessage({ type: 'NEW_MESSAGE', payload: message });
    
    // Logic for AI auto-reply
    if (message.sender === 'buyer') {
      const conv = updated.find(c => c.id === message.conversationId);
      if (conv && conv.handoffMode === 'ai' && conv.sellerPresence === 'offline' && conv.aiEnabled) {
        this.triggerAiReply(conv);
      }
    }
  }

  private async triggerAiReply(conversation: Conversation) {
    // Artificial delay for realism
    await new Promise(r => setTimeout(r, 2000));
    
    const aiMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId: conversation.id,
      sender: 'ai',
      text: "Assalomu alaykum! Bizning sotuvchi hozir oflayn, lekin men sizga yordam bera olaman. Savolingiz bo'lsa, qoldiring, biz imkon qadar tezroq javob beramiz. Eslatib o'tamiz, xavfsizlik uchun to'lovni faqat platforma orqali amalga oshiring.",
      createdAt: new Date().toISOString(),
      delivery: 'sent'
    };

    this.saveMessage(aiMessage);
  }

  async getAiSuggestion(conversationId: string): Promise<string> {
    // Simulate AI suggestion for seller
    await new Promise(r => setTimeout(r, 1000));
    return "Xabaringiz uchun rahmat! Ushbu mahsulot hozirda omborimizda mavjud. Sizga yetkazib berish shartlarini tushuntirib beraymi?";
  }

  updateConversation(convId: string, updates: Partial<Conversation>) {
    const conversations = this.getConversations();
    const updated = conversations.map(c => c.id === convId ? { ...c, ...updates } : c);
    localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify(updated));
    this.channel.postMessage({ type: 'CONVERSATION_UPDATED', payload: { id: convId, ...updates } });
  }

  getOrCreateConversation(sellerId: string, buyerId: string, buyerName?: string): Conversation {
    const conversations = this.getConversations();
    const existing = conversations.find(c => c.sellerId === sellerId && c.buyerId === buyerId);
    
    if (existing) return existing;

    const newConv: Conversation = {
      id: `${sellerId}_${buyerId}`,
      sellerId,
      buyerId,
      buyerDisplayName: buyerName || 'Guest Buyer',
      lastMessageAt: new Date().toISOString(),
      status: 'open',
      handoffMode: 'ai',
      sellerPresence: 'offline',
      aiEnabled: true,
      unreadCount: 0
    };

    localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify([...conversations, newConv]));
    this.channel.postMessage({ type: 'NEW_CONVERSATION', payload: newConv });
    return newConv;
  }
}

export const chatService = new ChatService();
