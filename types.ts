
export type Language = 'UZ' | 'RU' | 'EN';
export type Theme = 'light' | 'dark';

export interface UserProfile {
  telegramId?: number;
  firstName?: string;
  lastName?: string;
  fullName: string;
  username: string;
  phone: string;
  avatarUrl?: string;
}

export interface UserSettings {
  language: Language;
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    chat: boolean;
  };
  privacy: {
    hideContact: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export type TransactionType = 'grant' | 'spend' | 'refund' | 'adjustment';

export interface CreditTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  reason: string;
  metadata?: {
    module?: string;
    model?: string;
    conversationId?: string;
    planId?: string;
    packId?: string;
  };
  createdAt: string;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  updatedAt: string;
}

export type PlanId = 'free' | 'starter' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  monthlyCredits: number;
  features: string[];
}

export interface UserSubscription {
  planId: PlanId;
  status: SubscriptionStatus;
  startedAt: string;
  renewsAt: string;
  autoRenew: boolean;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface AppState {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  credits: number;
  subscription: UserSubscription;
  grantCredits: (amount: number, reason: string, metadata?: any) => void;
  spendCredits: (amount: number, reason: string, metadata?: any) => Promise<boolean>;
  requireCredits: (amount: number, reason: string, metadata?: any) => Promise<boolean>;
  changePlan: (planId: PlanId) => void;
  updateSubscription: (updates: Partial<UserSubscription>) => void;
}

export interface ModuleConfig {
  id: string;
  iconName: string;
  color: string;
  path: string;
  translationKey: string;
}