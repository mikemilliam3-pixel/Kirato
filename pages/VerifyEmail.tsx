
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, RefreshCw, Send, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const { t, isLoggedIn, user, resendVerification, refreshUser, logout } = useApp();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // If user is verified or logged out, they shouldn't be here
  if (!isLoggedIn || (user && user.emailVerified)) {
    return <Navigate to="/" replace />;
  }

  const handleRefresh = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await refreshUser();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to refresh status' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage(null);
    try {
      await resendVerification();
      setMessage({ type: 'success', text: t('auth.verifyEmailSent') });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send email' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] p-8 sm:p-12 border border-gray-100 dark:border-slate-800 shadow-2xl">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Mail size={40} />
        </div>

        <h2 className="text-2xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          {t('auth.verifyEmailRequired')}
        </h2>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
          {t('auth.verifyEmailDesc')}
        </p>

        {message && (
          <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-left animate-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <p className="text-xs font-bold uppercase tracking-wide">{message.text}</p>
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            {t('auth.refreshAfterVerify')}
          </button>

          <button 
            onClick={handleResend}
            disabled={resending}
            className="w-full h-14 bg-gray-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-gray-100 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {resending ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            {t('auth.resendVerification')}
          </button>

          <div className="pt-6">
            <button 
              onClick={() => logout()}
              className="text-[10px] font-black text-rose-500 uppercase tracking-[2px] flex items-center justify-center gap-2 mx-auto hover:underline transition-all"
            >
              <LogOut size={14} />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
