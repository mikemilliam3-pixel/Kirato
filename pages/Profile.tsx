
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Smartphone, AtSign, Check, Camera, Info } from 'lucide-react';
import { UserProfile } from '../types';
import PageHeader from '../components/ui/PageHeader';

const Profile: React.FC = () => {
  const { t } = useApp();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    username: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);

  useEffect(() => {
    // 1. Try to get data from Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    // 2. Load from localStorage as fallback or to get stored phone
    const stored = localStorage.getItem('kirato-user-profile');
    const storedProfile = stored ? JSON.parse(stored) : null;

    if (tgUser) {
      const tgProfile: UserProfile = {
        telegramId: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        fullName: `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`,
        username: tgUser.username ? `@${tgUser.username}` : '',
        phone: storedProfile?.phone || '', // Telegram user object usually doesn't have phone by default
        avatarUrl: tgUser.photo_url
      };
      setProfile(tgProfile);
      localStorage.setItem('kirato-user-profile', JSON.stringify(tgProfile));
    } else if (storedProfile) {
      setProfile(storedProfile);
    } else {
      // Complete mock fallback
      const mock: UserProfile = {
        fullName: 'Guest User',
        username: '@guest',
        phone: ''
      };
      setProfile(mock);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('kirato-user-profile', JSON.stringify(profile));
      setIsSaving(false);
      setSuccess(true);
      window.dispatchEvent(new Event('profile-updated'));
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <div className="max-w-3xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500 pb-24">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'JD'
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-lg text-blue-600 hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>
            <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('profile.publicProfile')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('profile.fullName')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({...profile, fullName: e.target.value})}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-slate-950 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('profile.username')}</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-slate-900 border border-transparent rounded-2xl text-slate-500 font-bold text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  {t('profile.phone')} {!profile.phone && `(${t('profile.optional')})`}
                </label>
              </div>
              
              {profile.phone ? (
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled
                    className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-slate-900 border border-transparent rounded-2xl text-slate-500 font-bold text-sm cursor-not-allowed"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowPhoneInfo(!showPhoneInfo)}
                    className="w-full h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Smartphone size={16} /> {t('profile.addPhone')}
                  </button>
                  
                  {showPhoneInfo && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl flex gap-3 animate-in slide-in-from-top-2 duration-300">
                      <Info className="text-blue-500 shrink-0" size={18} />
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                        {t('profile.phoneInfo')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <>
                <Check size={20} /> {t('profile.changesSaved')}
              </>
            ) : (
              t('profile.saveChanges')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;