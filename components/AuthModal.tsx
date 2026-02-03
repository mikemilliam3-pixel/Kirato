
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, LogIn, UserPlus, AlertCircle, ChevronRight, User, Key, CheckCircle2 } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { authView, closeAuth, login, register, resetPassword, openAuth, t } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear states when switching views
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [authView]);

  if (!authView) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Client-side validation to prevent Firebase auth/missing-email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      if (authView === 'signin') {
        await login(email, password);
      } else if (authView === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Full Name is required');
        }
        await register(email, password, fullName);
      } else if (authView === 'reset') {
        await resetPassword(email);
        setSuccess(t('auth.resetLinkSent'));
      }
    } catch (err: any) {
      setError(err.message || t('auth.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeAuth} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={closeAuth} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white shadow-xl mb-4">
            {authView === 'signin' ? <LogIn size={28} /> : authView === 'signup' ? <UserPlus size={28} /> : <Key size={28} />}
          </div>
          <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {authView === 'signin' ? t('common.signIn') : authView === 'signup' ? t('common.signUp') : t('auth.resetPasswordTitle')}
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mt-1 px-4 leading-relaxed">
            {authView === 'reset' ? t('auth.resetPasswordDesc') : t('auth.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authView === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('profile.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
              />
            </div>
          </div>

          {authView !== 'reset' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                />
              </div>
              {/* Show password toggle + Forgot link */}
              <div className="flex items-center justify-between mt-1 ml-1">
                <div className="flex items-center gap-2">
                  <input
                    id="show-password"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="show-password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer select-none">
                    {t('auth.showPassword')}
                  </label>
                </div>
                {authView === 'signin' && (
                  <button 
                    type="button"
                    onClick={() => openAuth('reset')}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-1">
              <AlertCircle size={14} className="text-rose-500 shrink-0" />
              <p className="text-[10px] font-bold text-rose-600 line-clamp-2">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-1">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <p className="text-[10px] font-bold text-emerald-600 line-clamp-2">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {authView === 'signin' ? t('common.signIn') : authView === 'signup' ? t('common.signUp') : t('auth.sendResetLink')}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => openAuth(authView === 'signup' ? 'signin' : authView === 'reset' ? 'signin' : 'signup')}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
          >
            {authView === 'signin' 
              ? `${t('auth.noAccount')} ${t('common.signUp')}` 
              : `${t('auth.haveAccount')} ${t('common.signIn')}`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
