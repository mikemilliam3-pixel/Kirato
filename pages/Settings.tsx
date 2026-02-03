
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Bell, Eye, Download, LogOut, Lock, Globe, Moon, Sun, Monitor, ChevronRight as ChevronIcon } from 'lucide-react';
import { Language, Theme } from '../types';
import PageHeader from '../components/ui/PageHeader';

// Fix: Moved Section and Toggle components outside of the main Settings component to avoid TypeScript JSX children inference errors.
interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 px-1">
      <Icon className="text-blue-600" size={18} />
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-1 overflow-hidden shadow-sm">
      {children}
    </div>
  </div>
);

interface ToggleProps {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors rounded-2xl">
    <div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
      <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 transition-all ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`} />
    </button>
  </div>
);

const Settings: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      chat: true,
    },
    privacy: {
      hideContact: false,
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem('kirato-user-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSetting = (category: string, key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...(settings as any)[category],
        [key]: value
      }
    };
    setSettings(newSettings);
    localStorage.setItem('kirato-user-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Account Settings" subtitle="Preferences & Privacy" />

      <div className="max-w-3xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500 space-y-12 pb-24">
        <Section title="Security" icon={Lock}>
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors rounded-2xl cursor-pointer">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Change Password</p>
              <p className="text-[10px] text-gray-400 font-medium">Last changed 3 months ago</p>
            </div>
            <ChevronIcon size={18} className="text-slate-400" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors rounded-2xl cursor-pointer text-rose-500">
            <p className="text-sm font-bold">Sign out from all devices</p>
            <LogOut size={18} />
          </div>
        </Section>

        <Section title="Preferences" icon={Globe}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-slate-400" />
                <p className="text-sm font-bold">Language</p>
              </div>
              <div className="flex bg-gray-50 dark:bg-slate-950 p-1 rounded-xl">
                {(['UZ', 'RU', 'EN'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${language === l ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'light' ? <Sun size={18} className="text-slate-400" /> : <Moon size={18} className="text-slate-400" />}
                <p className="text-sm font-bold">Theme</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
              >
                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              </button>
            </div>
          </div>
        </Section>

        <Section title="Notifications" icon={Bell}>
          <Toggle 
            label="Email Notifications" 
            desc="Receive updates and invoices via email" 
            checked={settings.notifications.email} 
            onChange={(v) => updateSetting('notifications', 'email', v)} 
          />
          <Toggle 
            label="Push Notifications" 
            desc="System alerts and activity mentions" 
            checked={settings.notifications.push} 
            onChange={(v) => updateSetting('notifications', 'push', v)} 
          />
          <Toggle 
            label="Chat Messages" 
            desc="Direct messages from support and users" 
            checked={settings.notifications.chat} 
            onChange={(v) => updateSetting('notifications', 'chat', v)} 
          />
        </Section>

        <Section title="Privacy" icon={Eye}>
          <Toggle 
            label="Private Profile" 
            desc="Hide your contact info from public modules" 
            checked={settings.privacy.hideContact} 
            onChange={(v) => updateSetting('privacy', 'hideContact', v)} 
          />
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors rounded-2xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Download size={18} className="text-slate-400" />
              <p className="text-sm font-bold">Export My Data</p>
            </div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-slate-950 px-2 py-1 rounded">Requesting</span>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
