import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, Language, Theme, Notification, CreditWallet, CreditTransaction, UserSubscription, PlanId, AppUser } from '../types';
import { translations } from '../i18n/translations';
import CreditLimitModal from '../components/CreditLimitModal';
import { auth } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_WALLET = 'kirato-credit-wallet';
const STORAGE_LEDGER = 'kirato-credit-ledger';
const STORAGE_SUBSCRIPTION = 'kirato-user-subscription';
const WELCOME_BONUS = 50;

export const SUBSCRIPTION_PLANS = {
  free: { id: 'free', name: 'Free', monthlyPrice: 0, monthlyCredits: 50 },
  starter: { id: 'starter', name: 'Starter', monthlyPrice: 19, monthlyCredits: 250 },
  pro: { id: 'pro', name: 'Pro', monthlyPrice: 49, monthlyCredits: 1000 },
  business: { id: 'business', name: 'Business', monthlyPrice: 99, monthlyCredits: 2500 }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('kirato-lang');
      return (stored as Language) || 'EN';
    } catch {
      return 'EN';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('kirato-theme');
      return (stored as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<'signin' | 'signup' | 'reset' | null>(null);
  
  // Credits State
  const [wallet, setWallet] = useState<CreditWallet>(() => {
    const saved = localStorage.getItem(STORAGE_WALLET);
    return saved ? JSON.parse(saved) : {
      userId: 'guest',
      balance: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
      updatedAt: new Date().toISOString()
    };
  });

  // Subscription State
  const [subscription, setSubscriptionState] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(STORAGE_SUBSCRIPTION);
    return saved ? JSON.parse(saved) : {
      planId: 'free',
      status: 'active',
      startedAt: new Date().toISOString(),
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true
    };
  });

  // Not enough credits modal state
  const [limitModal, setLimitModal] = useState<{show: boolean, required: number} | null>(null);

  // Map Firebase User to AppUser
  const user = useMemo<AppUser | null>(() => {
    if (!currentUser) return null;
    return {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      emailVerified: currentUser.emailVerified
    };
  }, [currentUser]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('kirato-session', token);
        window.dispatchEvent(new Event('auth-change'));
        setAuthView(null);
      } else {
        localStorage.removeItem('kirato-session');
        window.dispatchEvent(new Event('auth-change'));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      const stored = localStorage.getItem('kirato-notifications');
      if (stored) {
        const notifs: Notification[] = JSON.parse(stored);
        setUnreadNotifications(notifs.filter(n => !n.read).length);
      }
    };
    checkNotifications();
    window.addEventListener('storage', checkNotifications);
    return () => window.removeEventListener('storage', checkNotifications);
  }, []);

  // Credit Management Helpers
  const writeLedger = (tx: CreditTransaction) => {
    const ledger = JSON.parse(localStorage.getItem(STORAGE_LEDGER) || '[]');
    ledger.unshift(tx);
    localStorage.setItem(STORAGE_LEDGER, JSON.stringify(ledger.slice(0, 100))); // Keep last 100
  };

  const grantCredits = useCallback((amount: number, reason: string, metadata?: any) => {
    setWallet(prev => {
      const newWallet = {
        ...prev,
        balance: prev.balance + amount,
        lifetimeEarned: prev.lifetimeEarned + amount,
        updatedAt: new Date().toISOString()
      };
      
      const tx: CreditTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: prev.userId,
        type: 'grant',
        amount: amount,
        reason,
        metadata,
        createdAt: new Date().toISOString()
      };
      
      writeLedger(tx);
      localStorage.setItem(STORAGE_WALLET, JSON.stringify(newWallet));
      return newWallet;
    });
  }, []);

  const spendCredits = useCallback(async (amount: number, reason: string, metadata?: any): Promise<boolean> => {
    let success = false;
    setWallet(prev => {
      if (prev.balance < amount) {
        success = false;
        return prev;
      }
      
      const newWallet = {
        ...prev,
        balance: prev.balance - amount,
        lifetimeSpent: prev.lifetimeSpent + amount,
        updatedAt: new Date().toISOString()
      };
      
      const tx: CreditTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: prev.userId,
        type: 'spend',
        amount: -amount,
        reason,
        metadata,
        createdAt: new Date().toISOString()
      };
      
      writeLedger(tx);
      localStorage.setItem(STORAGE_WALLET, JSON.stringify(newWallet));
      success = true;
      return newWallet;
    });
    return success;
  }, []);

  // Renewal Refill Checker
  useEffect(() => {
    const checkRenewal = () => {
      const now = new Date();
      const renewalDate = new Date(subscription.renewsAt);
      if (subscription.status === 'active' && now >= renewalDate) {
        const nextRenewal = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const plan = (SUBSCRIPTION_PLANS as any)[subscription.planId];
        
        const newSub = {
          ...subscription,
          renewsAt: nextRenewal
        };
        setSubscriptionState(newSub);
        localStorage.setItem(STORAGE_SUBSCRIPTION, JSON.stringify(newSub));
        
        grantCredits(plan.monthlyCredits, 'subscription_renewal_refill', { planId: subscription.planId });
      }
    };
    checkRenewal();
  }, [subscription, grantCredits]);

  // Initialize Welcome Bonus
  useEffect(() => {
    const hasWallet = localStorage.getItem(STORAGE_WALLET);
    if (!hasWallet) {
      grantCredits(WELCOME_BONUS, 'welcome_bonus');
    }
  }, [grantCredits]);

  useEffect(() => {
    localStorage.setItem('kirato-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kirato-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const register = useCallback(async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    await sendEmailVerification(userCredential.user);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const resendVerification = useCallback(async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setCurrentUser({ ...auth.currentUser });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('kirato-user-profile');
      localStorage.removeItem('kirato-user-settings');
      window.location.hash = '#/';
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const openAuth = useCallback((view: 'signin' | 'signup' | 'reset' = 'signin') => {
    setAuthView(view);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthView(null);
  }, []);

  const requireCredits = useCallback(async (amount: number, reason: string, metadata?: any): Promise<boolean> => {
    const success = await spendCredits(amount, reason, metadata);
    if (!success) {
      setLimitModal({ show: true, required: amount });
    }
    return success;
  }, [spendCredits]);

  const changePlan = useCallback((planId: PlanId) => {
    const now = new Date();
    const plan = (SUBSCRIPTION_PLANS as any)[planId];
    const nextRenewal = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const newSubscription: UserSubscription = {
      ...subscription,
      planId,
      status: 'active',
      startedAt: now.toISOString(),
      renewsAt: nextRenewal
    };

    setSubscriptionState(newSubscription);
    localStorage.setItem(STORAGE_SUBSCRIPTION, JSON.stringify(newSubscription));
    
    // Grant credits for new plan immediately
    grantCredits(plan.monthlyCredits, 'subscription_monthly_credits', { planId });
  }, [subscription, grantCredits]);

  const updateSubscription = useCallback((updates: Partial<UserSubscription>) => {
    setSubscriptionState(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_SUBSCRIPTION, JSON.stringify(next));
      return next;
    });
  }, []);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language] || translations['EN'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        let fallback: any = translations['EN'];
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }
    return typeof current === 'string' ? current : path;
  }, [language]);

  return (
    <AppContext.Provider value={{ 
      language, 
      theme, 
      setLanguage, 
      toggleTheme, 
      t, 
      unreadNotifications,
      setUnreadNotifications,
      isLoggedIn: !!currentUser,
      user,
      login,
      register,
      resetPassword,
      resendVerification,
      refreshUser,
      logout,
      openAuth,
      closeAuth,
      authView,
      credits: wallet.balance,
      subscription,
      grantCredits,
      spendCredits,
      requireCredits,
      changePlan,
      updateSubscription
    }}>
      {isAuthLoading ? (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : children}
      {limitModal?.show && (
        <CreditLimitModal 
          required={limitModal.required} 
          available={wallet.balance} 
          onClose={() => setLimitModal(null)} 
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};