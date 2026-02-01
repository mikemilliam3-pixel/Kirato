
import { SalesSection } from './types';

export const salesRoutes: SalesSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'products', path: 'products', icon: 'Package', labelKey: 'products' },
  { id: 'orders', path: 'orders', icon: 'ShoppingCart', labelKey: 'orders' },
  { id: 'channel-posting', path: 'channel-posting', icon: 'Send', labelKey: 'channelPosting' },
  { id: 'public-shop', path: 'public-shop', icon: 'Globe', labelKey: 'publicShop' },
  { id: 'customers', path: 'customers', icon: 'Users', labelKey: 'customers' },
  { id: 'chat', path: 'chat', icon: 'MessageSquare', labelKey: 'chat' },
  { id: 'promotions', path: 'promotions', icon: 'Tag', labelKey: 'promotions' },
  { id: 'settings', path: 'settings', icon: 'Settings', labelKey: 'settings' },
];
