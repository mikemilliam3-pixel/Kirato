
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type ProductStatus = 'active' | 'draft' | 'out_of_stock';
export type PromoType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface SellerProfile {
  id: string;
  shopName: string;
  description: string;
  logoUrl?: string;
  currency: string;
  isAiChatEnabled: boolean;
  telegramChannelId?: string;
  deepLinkToken: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  stock: number;
  status: ProductStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  address?: string;
}

export interface CustomerProfile {
  id: string;
  tgId: string;
  fullName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isBlocked: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'seller' | 'ai';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Promotion {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minSpend?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface SalesSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
