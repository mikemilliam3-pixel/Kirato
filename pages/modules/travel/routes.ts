
import { TravelSection } from './types';

export const travelRoutes: TravelSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'trips', path: 'trips', icon: 'Map', labelKey: 'trips' },
  { id: 'itinerary', path: 'itinerary', icon: 'CalendarDays', labelKey: 'itinerary' },
  { id: 'budget', path: 'budget', icon: 'Wallet', labelKey: 'budget' },
  { id: 'packing', path: 'packing', icon: 'Backpack', labelKey: 'packing' },
  { id: 'wishlist', path: 'wishlist', icon: 'Heart', labelKey: 'wishlist' },
  { id: 'share', path: 'share', icon: 'Share2', labelKey: 'share' },
];
