
export type TripStatus = 'planned' | 'active' | 'completed' | 'archived';
export type ItineraryType = 'flight' | 'hotel' | 'activity' | 'food' | 'transport' | 'other';
export type BudgetCategory = 'transport' | 'accommodation' | 'food' | 'activities' | 'shopping' | 'other';
export type Priority = 'low' | 'med' | 'high';

export interface TravelTrip {
  id: string;
  name: string;
  dates: string;
  cities: string[];
  status: TripStatus;
  travelers: number;
  currency: string;
  budgetPlanned: number;
  budgetSpent: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  day: number;
  title: string;
  type: ItineraryType;
  time?: string;
  location?: string;
  notes?: string;
  cost?: number;
}

export interface PackingItem {
  id: string;
  tripId: string;
  category: string;
  name: string;
  packed: boolean;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  tripId: string;
  name: string;
  city: string;
  tags: string[];
  priority: Priority;
  notes?: string;
}

export interface TravelSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
