
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, Trash2, Clock, Info, AlertTriangle, Check } from 'lucide-react';
import { Notification } from '../types';
import PageHeader from '../components/ui/PageHeader';

const Notifications: React.FC = () => {
  const { setUnreadNotifications, t } = useApp();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('kirato-notifications');
    if (stored) {
      setNotifs(JSON.parse(stored));
    } else {
      const dummyNotifs: Notification[] = [
        {
          id: '1',
          title: 'Welcome to Kirato AI',
          message: 'Explore our specialized modules for business and productivity.',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'System Update',
          message: 'The AI Studio module has been upgraded with Gemini 1.5 support.',
          type: 'info',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        }
      ];
      setNotifs(dummyNotifs);
      localStorage.setItem('kirato-notifications', JSON.stringify(dummyNotifs));
      setUnreadNotifications(dummyNotifs.length);
    }
  }, [setUnreadNotifications]);

  const markRead = (id: string) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem('kirato-notifications', JSON.stringify(updated));
    setUnreadNotifications(updated.filter(n => !n.read).length);
  };

  const markAllRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem('kirato-notifications', JSON.stringify(updated));
    setUnreadNotifications(0);
  };

  const clearAll = () => {
    setNotifs([]);
    localStorage.removeItem('kirato-notifications');
    setUnreadNotifications(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'error': return <Info className="text-rose-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title={t('common.notifications')} 
        subtitle="Recent activity"
        rightSlot={
          <div className="flex gap-2">
            <button 
              onClick={markAllRead}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Mark all read
            </button>
            <button 
              onClick={clearAll}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Clear all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        }
      />
      
      <div className="max-w-3xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500 pb-24">
        <div className="space-y-3">
          {notifs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 opacity-40">
              <Bell size={48} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-[3px]">All Caught Up!</p>
            </div>
          ) : (
            notifs.map((n) => (
              <div 
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  n.read ? 'border-gray-50 dark:border-slate-800 opacity-70' : 'border-blue-100 dark:border-blue-900 shadow-sm'
                }`}
              >
                {!n.read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}
                <div className="flex gap-4">
                  <div className="shrink-0 pt-1">{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase pt-1">
                      <Clock size={12} />
                      {new Date(n.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
