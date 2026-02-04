import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle, CheckCircle2, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { auth } from '../lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useApp } from '../context/AppContext';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const { t } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("User not authenticated");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2. Update Password
      await updatePassword(user, newPassword);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Password change failed", err);
      if (err.code === 'auth/wrong-password') {
        setError("Current password is incorrect");
      } else if (err.code === 'auth/weak-password') {
        setError("New password is too weak");
      } else {
        setError(err.message || "Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white shadow-xl mb-4">
            <Key size={28} />
          </div>
          <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Change Password
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mt-1">
            Update your account security
          </p>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Password Updated!</p>
            <p className="text-xs text-slate-500">Closing window...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-50 dark:bg-slate-800 my-2" />

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                  placeholder="Min 6 characters"
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-1">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-bold text-rose-600 leading-tight">{error}</p>
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
                  Update Password
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;